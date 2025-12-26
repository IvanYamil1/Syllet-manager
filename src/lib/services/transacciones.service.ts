import { supabase } from '../supabase';
import type { Transaccion } from '@/types';

function mapTransaccionFromDB(row: any): Transaccion {
  return {
    id: row.id,
    tipo: row.tipo,
    categoria: row.categoria,
    descripcion: row.descripcion,
    monto: Number(row.monto),
    fecha: new Date(row.fecha),
    clienteId: row.cliente_id,
    proyectoId: row.proyecto_id,
    metodoPago: row.metodo_pago,
    comprobante: row.comprobante,
    notas: row.notas,
    creadoPor: row.creado_por,
  };
}

function mapTransaccionToDB(transaccion: Partial<Transaccion>): any {
  const mapped: any = {};
  if (transaccion.tipo !== undefined) mapped.tipo = transaccion.tipo;
  if (transaccion.categoria !== undefined) mapped.categoria = transaccion.categoria;
  if (transaccion.descripcion !== undefined) mapped.descripcion = transaccion.descripcion;
  if (transaccion.monto !== undefined) mapped.monto = transaccion.monto;
  if (transaccion.fecha !== undefined) mapped.fecha = transaccion.fecha;
  if (transaccion.clienteId !== undefined) mapped.cliente_id = transaccion.clienteId;
  if (transaccion.proyectoId !== undefined) mapped.proyecto_id = transaccion.proyectoId;
  if (transaccion.metodoPago !== undefined) mapped.metodo_pago = transaccion.metodoPago;
  if (transaccion.comprobante !== undefined) mapped.comprobante = transaccion.comprobante;
  if (transaccion.notas !== undefined) mapped.notas = transaccion.notas;
  if (transaccion.creadoPor !== undefined) mapped.creado_por = transaccion.creadoPor;
  return mapped;
}

export const transaccionesService = {
  async getAll(): Promise<Transaccion[]> {
    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTransaccionFromDB);
  },

  async getById(id: string): Promise<Transaccion | null> {
    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? mapTransaccionFromDB(data) : null;
  },

  async create(transaccion: Omit<Transaccion, 'id'>): Promise<Transaccion> {
    const { data, error } = await supabase
      .from('transacciones')
      .insert(mapTransaccionToDB(transaccion))
      .select()
      .single();

    if (error) throw error;
    return mapTransaccionFromDB(data);
  },

  async update(id: string, transaccion: Partial<Transaccion>): Promise<Transaccion> {
    const { data, error } = await supabase
      .from('transacciones')
      .update(mapTransaccionToDB(transaccion))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapTransaccionFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transacciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Transaccion[]> {
    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .gte('fecha', startDate.toISOString())
      .lte('fecha', endDate.toISOString())
      .order('fecha', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTransaccionFromDB);
  },
};
