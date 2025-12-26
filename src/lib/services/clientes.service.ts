import { supabase } from '../supabase';
import type { Cliente } from '@/types';

function mapClienteFromDB(row: any): Cliente {
  return {
    id: row.id,
    nombre: row.nombre,
    empresa: row.empresa,
    email: row.email,
    telefono: row.telefono,
    direccion: row.direccion,
    ciudad: row.ciudad,
    pais: row.pais,
    notas: row.notas,
    vendedorAsignado: row.vendedor_asignado,
    origenLead: row.origen_lead,
    fechaCreacion: new Date(row.fecha_creacion),
    fechaUltimoContacto: row.fecha_ultimo_contacto ? new Date(row.fecha_ultimo_contacto) : undefined,
    valorTotal: Number(row.valor_total),
    proyectosActivos: row.proyectos_activos,
  };
}

function mapClienteToDB(cliente: Partial<Cliente>): any {
  const mapped: any = {};
  if (cliente.nombre !== undefined) mapped.nombre = cliente.nombre;
  if (cliente.empresa !== undefined) mapped.empresa = cliente.empresa;
  if (cliente.email !== undefined) mapped.email = cliente.email;
  if (cliente.telefono !== undefined) mapped.telefono = cliente.telefono;
  if (cliente.direccion !== undefined) mapped.direccion = cliente.direccion;
  if (cliente.ciudad !== undefined) mapped.ciudad = cliente.ciudad;
  if (cliente.pais !== undefined) mapped.pais = cliente.pais;
  if (cliente.notas !== undefined) mapped.notas = cliente.notas;
  if (cliente.vendedorAsignado !== undefined) mapped.vendedor_asignado = cliente.vendedorAsignado;
  if (cliente.origenLead !== undefined) mapped.origen_lead = cliente.origenLead;
  if (cliente.fechaUltimoContacto !== undefined) mapped.fecha_ultimo_contacto = cliente.fechaUltimoContacto;
  if (cliente.valorTotal !== undefined) mapped.valor_total = cliente.valorTotal;
  if (cliente.proyectosActivos !== undefined) mapped.proyectos_activos = cliente.proyectosActivos;
  return mapped;
}

export const clientesService = {
  async getAll(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapClienteFromDB);
  },

  async getById(id: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? mapClienteFromDB(data) : null;
  },

  async create(cliente: Omit<Cliente, 'id' | 'fechaCreacion'>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .insert(mapClienteToDB(cliente))
      .select()
      .single();

    if (error) throw error;
    return mapClienteFromDB(data);
  },

  async update(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .update(mapClienteToDB(cliente))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapClienteFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
