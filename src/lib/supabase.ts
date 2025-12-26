import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper para manejar errores de Supabase
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado';
}
