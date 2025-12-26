import { supabase } from '../supabase';
import type { User } from '@/types';

// Convertir de snake_case (DB) a camelCase (App)
function mapUsuarioFromDB(row: any): User {
  return {
    id: row.id,
    email: row.email,
    nombre: row.nombre,
    apellido: row.apellido,
    avatar: row.avatar,
    rol: row.rol,
    departamento: row.departamento,
    telefono: row.telefono,
    activo: row.activo,
    fechaCreacion: new Date(row.fecha_creacion),
    ultimoAcceso: row.ultimo_acceso ? new Date(row.ultimo_acceso) : undefined,
    metaMensual: row.meta_mensual,
    comisionPorcentaje: row.comision_porcentaje,
  };
}

// Convertir de camelCase (App) a snake_case (DB)
function mapUsuarioToDB(user: Partial<User>): any {
  const mapped: any = {};
  if (user.email !== undefined) mapped.email = user.email;
  if (user.nombre !== undefined) mapped.nombre = user.nombre;
  if (user.apellido !== undefined) mapped.apellido = user.apellido;
  if (user.avatar !== undefined) mapped.avatar = user.avatar;
  if (user.rol !== undefined) mapped.rol = user.rol;
  if (user.departamento !== undefined) mapped.departamento = user.departamento;
  if (user.telefono !== undefined) mapped.telefono = user.telefono;
  if (user.activo !== undefined) mapped.activo = user.activo;
  if (user.metaMensual !== undefined) mapped.meta_mensual = user.metaMensual;
  if (user.comisionPorcentaje !== undefined) mapped.comision_porcentaje = user.comisionPorcentaje;
  return mapped;
}

export const usuariosService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return (data || []).map(mapUsuarioFromDB);
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? mapUsuarioFromDB(data) : null;
  },

  async create(user: Omit<User, 'id' | 'fechaCreacion'>): Promise<User> {
    const { data, error } = await supabase
      .from('usuarios')
      .insert(mapUsuarioToDB(user))
      .select()
      .single();

    if (error) throw error;
    return mapUsuarioFromDB(data);
  },

  async update(id: string, user: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('usuarios')
      .update(mapUsuarioToDB(user))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapUsuarioFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getByRole(rol: User['rol']): Promise<User[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', rol)
      .eq('activo', true);

    if (error) throw error;
    return (data || []).map(mapUsuarioFromDB);
  },
};
