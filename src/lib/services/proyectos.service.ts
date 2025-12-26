import { supabase } from '../supabase';
import type { Proyecto, ChecklistItem, ArchivoProyecto, AccesoCliente } from '@/types';

function mapProyectoFromDB(row: any, extras: { checklist?: ChecklistItem[], archivos?: ArchivoProyecto[], accesos?: AccesoCliente[], desarrolladores?: string[] } = {}): Proyecto {
  return {
    id: row.id,
    nombre: row.nombre,
    clienteId: row.cliente_id,
    cotizacionId: row.cotizacion_id,
    tipo: row.tipo,
    descripcion: row.descripcion,
    estado: row.estado,
    progreso: row.progreso,
    desarrolladorId: row.desarrollador_id,
    desarrolladores: extras.desarrolladores || [],
    fechaInicio: new Date(row.fecha_inicio),
    fechaEntregaEstimada: new Date(row.fecha_entrega_estimada),
    fechaEntregaReal: row.fecha_entrega_real ? new Date(row.fecha_entrega_real) : undefined,
    presupuesto: Number(row.presupuesto),
    checklist: extras.checklist || [],
    archivos: extras.archivos || [],
    accesos: extras.accesos || [],
    notas: row.notas,
    prioridad: row.prioridad,
  };
}

function mapChecklistFromDB(row: any): ChecklistItem {
  return {
    id: row.id,
    tarea: row.tarea,
    completado: row.completado,
    fechaCompletado: row.fecha_completado ? new Date(row.fecha_completado) : undefined,
    asignadoA: row.asignado_a,
    orden: row.orden,
  };
}

function mapProyectoToDB(proyecto: Partial<Proyecto>): any {
  const mapped: any = {};
  if (proyecto.nombre !== undefined) mapped.nombre = proyecto.nombre;
  if (proyecto.clienteId !== undefined) mapped.cliente_id = proyecto.clienteId;
  if (proyecto.cotizacionId !== undefined) mapped.cotizacion_id = proyecto.cotizacionId;
  if (proyecto.tipo !== undefined) mapped.tipo = proyecto.tipo;
  if (proyecto.descripcion !== undefined) mapped.descripcion = proyecto.descripcion;
  if (proyecto.estado !== undefined) mapped.estado = proyecto.estado;
  if (proyecto.progreso !== undefined) mapped.progreso = proyecto.progreso;
  if (proyecto.desarrolladorId !== undefined) mapped.desarrollador_id = proyecto.desarrolladorId;
  if (proyecto.fechaInicio !== undefined) mapped.fecha_inicio = proyecto.fechaInicio;
  if (proyecto.fechaEntregaEstimada !== undefined) mapped.fecha_entrega_estimada = proyecto.fechaEntregaEstimada;
  if (proyecto.fechaEntregaReal !== undefined) mapped.fecha_entrega_real = proyecto.fechaEntregaReal;
  if (proyecto.presupuesto !== undefined) mapped.presupuesto = proyecto.presupuesto;
  if (proyecto.notas !== undefined) mapped.notas = proyecto.notas;
  if (proyecto.prioridad !== undefined) mapped.prioridad = proyecto.prioridad;
  return mapped;
}

export const proyectosService = {
  async getAll(): Promise<Proyecto[]> {
    const { data: proyectos, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('fecha_inicio', { ascending: false });

    if (error) throw error;

    const proyectoIds = (proyectos || []).map(p => p.id);

    // Obtener datos relacionados
    let checklistMap = new Map<string, ChecklistItem[]>();
    let desarrolladoresMap = new Map<string, string[]>();

    if (proyectoIds.length > 0) {
      // Checklist items
      const { data: checklists } = await supabase
        .from('checklist_items')
        .select('*')
        .in('proyecto_id', proyectoIds)
        .order('orden');

      if (checklists) {
        checklists.forEach(item => {
          const list = checklistMap.get(item.proyecto_id) || [];
          list.push(mapChecklistFromDB(item));
          checklistMap.set(item.proyecto_id, list);
        });
      }

      // Desarrolladores
      const { data: devs } = await supabase
        .from('proyecto_desarrolladores')
        .select('*')
        .in('proyecto_id', proyectoIds);

      if (devs) {
        devs.forEach(dev => {
          const list = desarrolladoresMap.get(dev.proyecto_id) || [];
          list.push(dev.usuario_id);
          desarrolladoresMap.set(dev.proyecto_id, list);
        });
      }
    }

    return (proyectos || []).map(p =>
      mapProyectoFromDB(p, {
        checklist: checklistMap.get(p.id) || [],
        desarrolladores: desarrolladoresMap.get(p.id) || [],
      })
    );
  },

  async getById(id: string): Promise<Proyecto | null> {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Obtener datos relacionados
    const [checklistRes, archivosRes, accesosRes, devsRes] = await Promise.all([
      supabase.from('checklist_items').select('*').eq('proyecto_id', id).order('orden'),
      supabase.from('archivos_proyecto').select('*').eq('proyecto_id', id),
      supabase.from('accesos_cliente').select('*').eq('proyecto_id', id),
      supabase.from('proyecto_desarrolladores').select('usuario_id').eq('proyecto_id', id),
    ]);

    return data ? mapProyectoFromDB(data, {
      checklist: (checklistRes.data || []).map(mapChecklistFromDB),
      archivos: (archivosRes.data || []).map(a => ({
        id: a.id,
        nombre: a.nombre,
        url: a.url,
        tipo: a.tipo,
        tamaño: a.tamaño,
        subidoPor: a.subido_por,
        fechaSubida: new Date(a.fecha_subida),
        categoria: a.categoria,
      })),
      accesos: (accesosRes.data || []).map(a => ({
        id: a.id,
        plataforma: a.plataforma,
        url: a.url,
        usuario: a.usuario,
        password: a.password,
        notas: a.notas,
      })),
      desarrolladores: (devsRes.data || []).map(d => d.usuario_id),
    }) : null;
  },

  async create(proyecto: Omit<Proyecto, 'id' | 'progreso' | 'checklist' | 'archivos' | 'accesos'>): Promise<Proyecto> {
    const { data, error } = await supabase
      .from('proyectos')
      .insert({
        ...mapProyectoToDB(proyecto),
        progreso: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Agregar desarrolladores si hay
    if (proyecto.desarrolladores && proyecto.desarrolladores.length > 0) {
      await supabase.from('proyecto_desarrolladores').insert(
        proyecto.desarrolladores.map(userId => ({
          proyecto_id: data.id,
          usuario_id: userId,
        }))
      );
    }

    return mapProyectoFromDB(data, { desarrolladores: proyecto.desarrolladores || [] });
  },

  async update(id: string, proyecto: Partial<Proyecto>): Promise<Proyecto> {
    const { data, error } = await supabase
      .from('proyectos')
      .update(mapProyectoToDB(proyecto))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Actualizar desarrolladores si se proporcionan
    if (proyecto.desarrolladores !== undefined) {
      await supabase.from('proyecto_desarrolladores').delete().eq('proyecto_id', id);
      if (proyecto.desarrolladores.length > 0) {
        await supabase.from('proyecto_desarrolladores').insert(
          proyecto.desarrolladores.map(userId => ({
            proyecto_id: id,
            usuario_id: userId,
          }))
        );
      }
    }

    return await this.getById(id) as Proyecto;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('proyectos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateChecklist(proyectoId: string, checklist: ChecklistItem[]): Promise<void> {
    // Eliminar existentes
    await supabase.from('checklist_items').delete().eq('proyecto_id', proyectoId);

    // Insertar nuevos
    if (checklist.length > 0) {
      await supabase.from('checklist_items').insert(
        checklist.map((item, index) => ({
          proyecto_id: proyectoId,
          tarea: item.tarea,
          completado: item.completado,
          fecha_completado: item.fechaCompletado,
          asignado_a: item.asignadoA,
          orden: index,
        }))
      );
    }
  },
};
