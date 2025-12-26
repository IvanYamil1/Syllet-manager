import { supabase } from '../supabase';
import type { Lead } from '@/types';

function mapLeadFromDB(row: any): Lead {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono,
    empresa: row.empresa,
    origen: row.origen,
    campanaId: row.campana_id,
    servicioInteres: row.servicio_interes,
    estado: row.estado,
    notas: row.notas,
    fechaCreacion: new Date(row.fecha_creacion),
  };
}

function mapLeadToDB(lead: Partial<Lead>): any {
  const mapped: any = {};
  if (lead.nombre !== undefined) mapped.nombre = lead.nombre;
  if (lead.email !== undefined) mapped.email = lead.email;
  if (lead.telefono !== undefined) mapped.telefono = lead.telefono;
  if (lead.empresa !== undefined) mapped.empresa = lead.empresa;
  if (lead.origen !== undefined) mapped.origen = lead.origen;
  if (lead.campanaId !== undefined) mapped.campana_id = lead.campanaId;
  if (lead.servicioInteres !== undefined) mapped.servicio_interes = lead.servicioInteres;
  if (lead.estado !== undefined) mapped.estado = lead.estado;
  if (lead.notas !== undefined) mapped.notas = lead.notas;
  return mapped;
}

export const leadsService = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapLeadFromDB);
  },

  async getById(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? mapLeadFromDB(data) : null;
  },

  async create(lead: Omit<Lead, 'id' | 'fechaCreacion'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert(mapLeadToDB(lead))
      .select()
      .single();

    if (error) throw error;
    return mapLeadFromDB(data);
  },

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update(mapLeadToDB(lead))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapLeadFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
