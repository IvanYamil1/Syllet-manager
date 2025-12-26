import { supabase } from '../supabase';
import type { Prospecto, Seguimiento } from '@/types';

function mapProspectoFromDB(row: any, seguimientos: Seguimiento[] = []): Prospecto {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    nombre: row.nombre,
    empresa: row.empresa,
    email: row.email,
    telefono: row.telefono,
    direccion: row.direccion,
    etapa: row.etapa,
    valorEstimado: Number(row.valor_estimado),
    probabilidad: row.probabilidad,
    vendedorId: row.vendedor_id,
    servicioInteres: row.servicio_interes,
    notas: row.notas,
    fechaCreacion: new Date(row.fecha_creacion),
    fechaUltimaActualizacion: new Date(row.fecha_ultima_actualizacion),
    fechaCierreEstimada: row.fecha_cierre_estimada ? new Date(row.fecha_cierre_estimada) : undefined,
    motivoPerdida: row.motivo_perdida,
    seguimientos,
  };
}

function mapSeguimientoFromDB(row: any): Seguimiento {
  return {
    id: row.id,
    fecha: new Date(row.fecha),
    tipo: row.tipo,
    descripcion: row.descripcion,
    resultado: row.resultado,
    proximoSeguimiento: row.proximo_seguimiento ? new Date(row.proximo_seguimiento) : undefined,
    usuarioId: row.usuario_id,
  };
}

function mapProspectoToDB(prospecto: Partial<Prospecto>): any {
  const mapped: any = {};
  if (prospecto.clienteId !== undefined) mapped.cliente_id = prospecto.clienteId;
  if (prospecto.nombre !== undefined) mapped.nombre = prospecto.nombre;
  if (prospecto.empresa !== undefined) mapped.empresa = prospecto.empresa;
  if (prospecto.email !== undefined) mapped.email = prospecto.email;
  if (prospecto.telefono !== undefined) mapped.telefono = prospecto.telefono;
  if (prospecto.direccion !== undefined) mapped.direccion = prospecto.direccion;
  if (prospecto.etapa !== undefined) mapped.etapa = prospecto.etapa;
  if (prospecto.valorEstimado !== undefined) mapped.valor_estimado = prospecto.valorEstimado;
  if (prospecto.probabilidad !== undefined) mapped.probabilidad = prospecto.probabilidad;
  if (prospecto.vendedorId !== undefined) mapped.vendedor_id = prospecto.vendedorId;
  if (prospecto.servicioInteres !== undefined) mapped.servicio_interes = prospecto.servicioInteres;
  if (prospecto.notas !== undefined) mapped.notas = prospecto.notas;
  if (prospecto.fechaCierreEstimada !== undefined) mapped.fecha_cierre_estimada = prospecto.fechaCierreEstimada;
  if (prospecto.motivoPerdida !== undefined) mapped.motivo_perdida = prospecto.motivoPerdida;
  return mapped;
}

export const prospectosService = {
  async getAll(): Promise<Prospecto[]> {
    const { data: prospectos, error } = await supabase
      .from('prospectos')
      .select('*')
      .order('fecha_ultima_actualizacion', { ascending: false });

    if (error) throw error;

    // Obtener seguimientos para todos los prospectos
    const prospectoIds = (prospectos || []).map(p => p.id);

    let seguimientosMap: Map<string, Seguimiento[]> = new Map();

    if (prospectoIds.length > 0) {
      const { data: seguimientos } = await supabase
        .from('seguimientos')
        .select('*')
        .in('prospecto_id', prospectoIds)
        .order('fecha', { ascending: false });

      if (seguimientos) {
        seguimientos.forEach(seg => {
          const list = seguimientosMap.get(seg.prospecto_id) || [];
          list.push(mapSeguimientoFromDB(seg));
          seguimientosMap.set(seg.prospecto_id, list);
        });
      }
    }

    return (prospectos || []).map(p =>
      mapProspectoFromDB(p, seguimientosMap.get(p.id) || [])
    );
  },

  async getById(id: string): Promise<Prospecto | null> {
    const { data, error } = await supabase
      .from('prospectos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Obtener seguimientos
    const { data: seguimientos } = await supabase
      .from('seguimientos')
      .select('*')
      .eq('prospecto_id', id)
      .order('fecha', { ascending: false });

    return data ? mapProspectoFromDB(
      data,
      (seguimientos || []).map(mapSeguimientoFromDB)
    ) : null;
  },

  async create(prospecto: Omit<Prospecto, 'id' | 'fechaCreacion' | 'fechaUltimaActualizacion' | 'seguimientos'>): Promise<Prospecto> {
    const { data, error } = await supabase
      .from('prospectos')
      .insert(mapProspectoToDB(prospecto))
      .select()
      .single();

    if (error) throw error;
    return mapProspectoFromDB(data, []);
  },

  async update(id: string, prospecto: Partial<Prospecto>): Promise<Prospecto> {
    const { data, error } = await supabase
      .from('prospectos')
      .update(mapProspectoToDB(prospecto))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Obtener seguimientos actualizados
    const { data: seguimientos } = await supabase
      .from('seguimientos')
      .select('*')
      .eq('prospecto_id', id)
      .order('fecha', { ascending: false });

    return mapProspectoFromDB(data, (seguimientos || []).map(mapSeguimientoFromDB));
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('prospectos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async addSeguimiento(prospectoId: string, seguimiento: Omit<Seguimiento, 'id'>): Promise<Seguimiento> {
    const { data, error } = await supabase
      .from('seguimientos')
      .insert({
        prospecto_id: prospectoId,
        fecha: seguimiento.fecha,
        tipo: seguimiento.tipo,
        descripcion: seguimiento.descripcion,
        resultado: seguimiento.resultado,
        proximo_seguimiento: seguimiento.proximoSeguimiento,
        usuario_id: seguimiento.usuarioId,
      })
      .select()
      .single();

    if (error) throw error;
    return mapSeguimientoFromDB(data);
  },
};
