import { supabase } from '../supabase';
import type { ContenidoMarketing } from '@/types';

function mapContenidoFromDB(row: any): ContenidoMarketing {
  return {
    id: row.id,
    titulo: row.titulo,
    tipo: row.tipo,
    descripcion: row.descripcion,
    url: row.url,
    estado: row.estado,
    plataforma: row.plataforma,
    fechaPublicacion: row.fecha_publicacion ? new Date(row.fecha_publicacion) : undefined,
    creadorId: row.creador_id,
    vistas: row.vistas,
  };
}

function mapContenidoToDB(contenido: Partial<ContenidoMarketing>): any {
  const mapped: any = {};
  if (contenido.titulo !== undefined) mapped.titulo = contenido.titulo;
  if (contenido.tipo !== undefined) mapped.tipo = contenido.tipo;
  if (contenido.descripcion !== undefined) mapped.descripcion = contenido.descripcion;
  if (contenido.url !== undefined) mapped.url = contenido.url;
  if (contenido.estado !== undefined) mapped.estado = contenido.estado;
  if (contenido.plataforma !== undefined) mapped.plataforma = contenido.plataforma;
  if (contenido.fechaPublicacion !== undefined) mapped.fecha_publicacion = contenido.fechaPublicacion;
  if (contenido.creadorId !== undefined) mapped.creador_id = contenido.creadorId;
  if (contenido.vistas !== undefined) mapped.vistas = contenido.vistas;
  return mapped;
}

export const contenidosService = {
  async getAll(): Promise<ContenidoMarketing[]> {
    const { data, error } = await supabase
      .from('contenidos')
      .select('*')
      .order('fecha_publicacion', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapContenidoFromDB);
  },

  async getById(id: string): Promise<ContenidoMarketing | null> {
    const { data, error } = await supabase
      .from('contenidos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? mapContenidoFromDB(data) : null;
  },

  async create(contenido: Omit<ContenidoMarketing, 'id'>): Promise<ContenidoMarketing> {
    const { data, error } = await supabase
      .from('contenidos')
      .insert(mapContenidoToDB(contenido))
      .select()
      .single();

    if (error) throw error;
    return mapContenidoFromDB(data);
  },

  async update(id: string, contenido: Partial<ContenidoMarketing>): Promise<ContenidoMarketing> {
    const { data, error } = await supabase
      .from('contenidos')
      .update(mapContenidoToDB(contenido))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapContenidoFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contenidos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
