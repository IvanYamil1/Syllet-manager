import { supabase } from '../supabase';
import type { ServicioRecurrente, PagoServicio } from '@/types';

function mapServicioFromDB(row: any, pagos: PagoServicio[] = []): ServicioRecurrente {
  return {
    id: row.id,
    clienteId: row.cliente_id,
    tipo: row.tipo,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precioMensual: Number(row.precio_mensual),
    fechaInicio: new Date(row.fecha_inicio),
    fechaRenovacion: new Date(row.fecha_renovacion),
    estado: row.estado,
    autoRenovar: row.auto_renovar,
    historialPagos: pagos,
  };
}

function mapPagoFromDB(row: any): PagoServicio {
  return {
    id: row.id,
    fecha: new Date(row.fecha),
    monto: Number(row.monto),
    estado: row.estado,
    metodoPago: row.metodo_pago,
  };
}

function mapServicioToDB(servicio: Partial<ServicioRecurrente>): any {
  const mapped: any = {};
  if (servicio.clienteId !== undefined) mapped.cliente_id = servicio.clienteId;
  if (servicio.tipo !== undefined) mapped.tipo = servicio.tipo;
  if (servicio.nombre !== undefined) mapped.nombre = servicio.nombre;
  if (servicio.descripcion !== undefined) mapped.descripcion = servicio.descripcion;
  if (servicio.precioMensual !== undefined) mapped.precio_mensual = servicio.precioMensual;
  if (servicio.fechaInicio !== undefined) mapped.fecha_inicio = servicio.fechaInicio;
  if (servicio.fechaRenovacion !== undefined) mapped.fecha_renovacion = servicio.fechaRenovacion;
  if (servicio.estado !== undefined) mapped.estado = servicio.estado;
  if (servicio.autoRenovar !== undefined) mapped.auto_renovar = servicio.autoRenovar;
  return mapped;
}

export const serviciosRecurrentesService = {
  async getAll(): Promise<ServicioRecurrente[]> {
    const { data: servicios, error } = await supabase
      .from('servicios_recurrentes')
      .select('*')
      .order('fecha_renovacion');

    if (error) throw error;

    const servicioIds = (servicios || []).map(s => s.id);

    let pagosMap = new Map<string, PagoServicio[]>();

    if (servicioIds.length > 0) {
      const { data: pagos } = await supabase
        .from('pagos_servicio')
        .select('*')
        .in('servicio_id', servicioIds)
        .order('fecha', { ascending: false });

      if (pagos) {
        pagos.forEach(pago => {
          const list = pagosMap.get(pago.servicio_id) || [];
          list.push(mapPagoFromDB(pago));
          pagosMap.set(pago.servicio_id, list);
        });
      }
    }

    return (servicios || []).map(s =>
      mapServicioFromDB(s, pagosMap.get(s.id) || [])
    );
  },

  async getById(id: string): Promise<ServicioRecurrente | null> {
    const { data, error } = await supabase
      .from('servicios_recurrentes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    const { data: pagos } = await supabase
      .from('pagos_servicio')
      .select('*')
      .eq('servicio_id', id)
      .order('fecha', { ascending: false });

    return data ? mapServicioFromDB(
      data,
      (pagos || []).map(mapPagoFromDB)
    ) : null;
  },

  async create(servicio: Omit<ServicioRecurrente, 'id' | 'historialPagos'>): Promise<ServicioRecurrente> {
    const { data, error } = await supabase
      .from('servicios_recurrentes')
      .insert(mapServicioToDB(servicio))
      .select()
      .single();

    if (error) throw error;
    return mapServicioFromDB(data, []);
  },

  async update(id: string, servicio: Partial<ServicioRecurrente>): Promise<ServicioRecurrente> {
    const { data, error } = await supabase
      .from('servicios_recurrentes')
      .update(mapServicioToDB(servicio))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return await this.getById(id) as ServicioRecurrente;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('servicios_recurrentes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async addPago(servicioId: string, pago: Omit<PagoServicio, 'id'>): Promise<PagoServicio> {
    const { data, error } = await supabase
      .from('pagos_servicio')
      .insert({
        servicio_id: servicioId,
        fecha: pago.fecha,
        monto: pago.monto,
        estado: pago.estado,
        metodo_pago: pago.metodoPago,
      })
      .select()
      .single();

    if (error) throw error;
    return mapPagoFromDB(data);
  },
};
