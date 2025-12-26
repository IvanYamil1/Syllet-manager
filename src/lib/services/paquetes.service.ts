import { supabase } from '../supabase';
import type { Paquete } from '@/types';

function mapPaqueteFromDB(row: any): Paquete {
  return {
    id: row.id,
    nombre: row.nombre,
    tipo: row.tipo,
    descripcion: row.descripcion,
    precio: Number(row.precio),
    precioAnterior: row.precio_anterior ? Number(row.precio_anterior) : undefined,
    caracteristicas: row.caracteristicas || [],
    tiempoEntregaDias: row.tiempo_entrega_dias,
    popular: row.popular,
    activo: row.activo,
  };
}

function mapPaqueteToDB(paquete: Partial<Paquete>): any {
  const mapped: any = {};
  if (paquete.nombre !== undefined) mapped.nombre = paquete.nombre;
  if (paquete.tipo !== undefined) mapped.tipo = paquete.tipo;
  if (paquete.descripcion !== undefined) mapped.descripcion = paquete.descripcion;
  if (paquete.precio !== undefined) mapped.precio = paquete.precio;
  if (paquete.precioAnterior !== undefined) mapped.precio_anterior = paquete.precioAnterior;
  if (paquete.caracteristicas !== undefined) mapped.caracteristicas = paquete.caracteristicas;
  if (paquete.tiempoEntregaDias !== undefined) mapped.tiempo_entrega_dias = paquete.tiempoEntregaDias;
  if (paquete.popular !== undefined) mapped.popular = paquete.popular;
  if (paquete.activo !== undefined) mapped.activo = paquete.activo;
  return mapped;
}

export const paquetesService = {
  async getAll(): Promise<Paquete[]> {
    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .order('precio');

    if (error) throw error;
    return (data || []).map(mapPaqueteFromDB);
  },

  async getActivos(): Promise<Paquete[]> {
    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('activo', true)
      .order('precio');

    if (error) throw error;
    return (data || []).map(mapPaqueteFromDB);
  },

  async getById(id: string): Promise<Paquete | null> {
    const { data, error } = await supabase
      .from('paquetes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? mapPaqueteFromDB(data) : null;
  },

  async create(paquete: Omit<Paquete, 'id'>): Promise<Paquete> {
    const { data, error } = await supabase
      .from('paquetes')
      .insert(mapPaqueteToDB(paquete))
      .select()
      .single();

    if (error) throw error;
    return mapPaqueteFromDB(data);
  },

  async update(id: string, paquete: Partial<Paquete>): Promise<Paquete> {
    const { data, error } = await supabase
      .from('paquetes')
      .update(mapPaqueteToDB(paquete))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapPaqueteFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('paquetes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
