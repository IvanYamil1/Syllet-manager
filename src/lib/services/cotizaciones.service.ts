import { supabase } from '../supabase';
import type { Cotizacion, CotizacionItem } from '@/types';

function mapCotizacionFromDB(row: any, items: CotizacionItem[] = []): Cotizacion {
  return {
    id: row.id,
    prospectoId: row.prospecto_id,
    clienteId: row.cliente_id,
    numero: row.numero,
    items,
    subtotal: Number(row.subtotal),
    descuento: Number(row.descuento),
    iva: Number(row.iva),
    total: Number(row.total),
    estado: row.estado,
    validezDias: row.validez_dias,
    fechaCreacion: new Date(row.fecha_creacion),
    fechaEnvio: row.fecha_envio ? new Date(row.fecha_envio) : undefined,
    fechaRespuesta: row.fecha_respuesta ? new Date(row.fecha_respuesta) : undefined,
    notas: row.notas,
    terminosCondiciones: row.terminos_condiciones,
  };
}

function mapItemFromDB(row: any): CotizacionItem {
  return {
    id: row.id,
    descripcion: row.descripcion,
    servicioTipo: row.servicio_tipo,
    paquete: row.paquete,
    cantidad: row.cantidad,
    precioUnitario: Number(row.precio_unitario),
    total: Number(row.total),
  };
}

function mapCotizacionToDB(cotizacion: Partial<Cotizacion>): any {
  const mapped: any = {};
  if (cotizacion.prospectoId !== undefined) mapped.prospecto_id = cotizacion.prospectoId;
  if (cotizacion.clienteId !== undefined) mapped.cliente_id = cotizacion.clienteId;
  if (cotizacion.numero !== undefined) mapped.numero = cotizacion.numero;
  if (cotizacion.subtotal !== undefined) mapped.subtotal = cotizacion.subtotal;
  if (cotizacion.descuento !== undefined) mapped.descuento = cotizacion.descuento;
  if (cotizacion.iva !== undefined) mapped.iva = cotizacion.iva;
  if (cotizacion.total !== undefined) mapped.total = cotizacion.total;
  if (cotizacion.estado !== undefined) mapped.estado = cotizacion.estado;
  if (cotizacion.validezDias !== undefined) mapped.validez_dias = cotizacion.validezDias;
  if (cotizacion.fechaEnvio !== undefined) mapped.fecha_envio = cotizacion.fechaEnvio;
  if (cotizacion.fechaRespuesta !== undefined) mapped.fecha_respuesta = cotizacion.fechaRespuesta;
  if (cotizacion.notas !== undefined) mapped.notas = cotizacion.notas;
  if (cotizacion.terminosCondiciones !== undefined) mapped.terminos_condiciones = cotizacion.terminosCondiciones;
  return mapped;
}

export const cotizacionesService = {
  async getAll(): Promise<Cotizacion[]> {
    const { data: cotizaciones, error } = await supabase
      .from('cotizaciones')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    const cotizacionIds = (cotizaciones || []).map(c => c.id);

    let itemsMap = new Map<string, CotizacionItem[]>();

    if (cotizacionIds.length > 0) {
      const { data: items } = await supabase
        .from('cotizacion_items')
        .select('*')
        .in('cotizacion_id', cotizacionIds);

      if (items) {
        items.forEach(item => {
          const list = itemsMap.get(item.cotizacion_id) || [];
          list.push(mapItemFromDB(item));
          itemsMap.set(item.cotizacion_id, list);
        });
      }
    }

    return (cotizaciones || []).map(c =>
      mapCotizacionFromDB(c, itemsMap.get(c.id) || [])
    );
  },

  async getById(id: string): Promise<Cotizacion | null> {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    const { data: items } = await supabase
      .from('cotizacion_items')
      .select('*')
      .eq('cotizacion_id', id);

    return data ? mapCotizacionFromDB(
      data,
      (items || []).map(mapItemFromDB)
    ) : null;
  },

  async create(cotizacion: Omit<Cotizacion, 'id' | 'numero' | 'fechaCreacion'>): Promise<Cotizacion> {
    // Generar número de cotización
    const { count } = await supabase
      .from('cotizaciones')
      .select('*', { count: 'exact', head: true });

    const numero = `COT-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`;

    const { data, error } = await supabase
      .from('cotizaciones')
      .insert({
        ...mapCotizacionToDB(cotizacion),
        numero,
      })
      .select()
      .single();

    if (error) throw error;

    // Insertar items
    if (cotizacion.items && cotizacion.items.length > 0) {
      await supabase.from('cotizacion_items').insert(
        cotizacion.items.map(item => ({
          cotizacion_id: data.id,
          descripcion: item.descripcion,
          servicio_tipo: item.servicioTipo,
          paquete: item.paquete,
          cantidad: item.cantidad,
          precio_unitario: item.precioUnitario,
          total: item.total,
        }))
      );
    }

    return mapCotizacionFromDB(data, cotizacion.items || []);
  },

  async update(id: string, cotizacion: Partial<Cotizacion>): Promise<Cotizacion> {
    const { data, error } = await supabase
      .from('cotizaciones')
      .update(mapCotizacionToDB(cotizacion))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Actualizar items si se proporcionan
    if (cotizacion.items !== undefined) {
      await supabase.from('cotizacion_items').delete().eq('cotizacion_id', id);
      if (cotizacion.items.length > 0) {
        await supabase.from('cotizacion_items').insert(
          cotizacion.items.map(item => ({
            cotizacion_id: id,
            descripcion: item.descripcion,
            servicio_tipo: item.servicioTipo,
            paquete: item.paquete,
            cantidad: item.cantidad,
            precio_unitario: item.precioUnitario,
            total: item.total,
          }))
        );
      }
    }

    return await this.getById(id) as Cotizacion;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cotizaciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
