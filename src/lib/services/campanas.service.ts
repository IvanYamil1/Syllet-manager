import { supabase } from '../supabase';
import type { Campana } from '@/types';

function mapCampanaFromDB(row: any): Campana {
  return {
    id: row.id,
    nombre: row.nombre,
    plataforma: row.plataforma,
    tipo: row.tipo,
    estado: row.estado,
    presupuesto: Number(row.presupuesto),
    gastoActual: Number(row.gasto_actual),
    fechaInicio: new Date(row.fecha_inicio),
    fechaFin: row.fecha_fin ? new Date(row.fecha_fin) : undefined,
    leads: row.leads,
    conversiones: row.conversiones,
    cpl: Number(row.cpl),
    roi: Number(row.roi),
    notas: row.notas,
    responsableId: row.responsable_id,
  };
}

function mapCampanaToDB(campana: Partial<Campana>): any {
  const mapped: any = {};
  if (campana.nombre !== undefined) mapped.nombre = campana.nombre;
  if (campana.plataforma !== undefined) mapped.plataforma = campana.plataforma;
  if (campana.tipo !== undefined) mapped.tipo = campana.tipo;
  if (campana.estado !== undefined) mapped.estado = campana.estado;
  if (campana.presupuesto !== undefined) mapped.presupuesto = campana.presupuesto;
  if (campana.gastoActual !== undefined) mapped.gasto_actual = campana.gastoActual;
  if (campana.fechaInicio !== undefined) mapped.fecha_inicio = campana.fechaInicio;
  if (campana.fechaFin !== undefined) mapped.fecha_fin = campana.fechaFin;
  if (campana.leads !== undefined) mapped.leads = campana.leads;
  if (campana.conversiones !== undefined) mapped.conversiones = campana.conversiones;
  if (campana.cpl !== undefined) mapped.cpl = campana.cpl;
  if (campana.roi !== undefined) mapped.roi = campana.roi;
  if (campana.notas !== undefined) mapped.notas = campana.notas;
  if (campana.responsableId !== undefined) mapped.responsable_id = campana.responsableId;
  return mapped;
}

export const campanasService = {
  async getAll(): Promise<Campana[]> {
    const { data, error } = await supabase
      .from('campanas')
      .select('*')
      .order('fecha_inicio', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapCampanaFromDB);
  },

  async getById(id: string): Promise<Campana | null> {
    const { data, error } = await supabase
      .from('campanas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? mapCampanaFromDB(data) : null;
  },

  async create(campana: Omit<Campana, 'id' | 'leads' | 'conversiones' | 'cpl' | 'roi' | 'gastoActual'>): Promise<Campana> {
    const { data, error } = await supabase
      .from('campanas')
      .insert({
        ...mapCampanaToDB(campana),
        leads: 0,
        conversiones: 0,
        cpl: 0,
        roi: 0,
        gasto_actual: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return mapCampanaFromDB(data);
  },

  async update(id: string, campana: Partial<Campana>): Promise<Campana> {
    const { data, error } = await supabase
      .from('campanas')
      .update(mapCampanaToDB(campana))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapCampanaFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('campanas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
