import { supabase } from '../supabase';
import type { Ticket, TicketRespuesta } from '@/types';

function mapTicketFromDB(row: any, respuestas: TicketRespuesta[] = []): Ticket {
  return {
    id: row.id,
    numero: row.numero,
    clienteId: row.cliente_id,
    proyectoId: row.proyecto_id,
    asunto: row.asunto,
    descripcion: row.descripcion,
    tipo: row.tipo,
    prioridad: row.prioridad,
    estado: row.estado,
    asignadoA: row.asignado_a,
    fechaCreacion: new Date(row.fecha_creacion),
    fechaActualizacion: new Date(row.fecha_actualizacion),
    fechaResolucion: row.fecha_resolucion ? new Date(row.fecha_resolucion) : undefined,
    respuestas,
    tiempoRespuesta: row.tiempo_respuesta,
  };
}

function mapRespuestaFromDB(row: any): TicketRespuesta {
  return {
    id: row.id,
    mensaje: row.mensaje,
    usuarioId: row.usuario_id,
    esCliente: row.es_cliente,
    fechaCreacion: new Date(row.fecha_creacion),
    archivosAdjuntos: row.archivos_adjuntos,
  };
}

function mapTicketToDB(ticket: Partial<Ticket>): any {
  const mapped: any = {};
  if (ticket.numero !== undefined) mapped.numero = ticket.numero;
  if (ticket.clienteId !== undefined) mapped.cliente_id = ticket.clienteId;
  if (ticket.proyectoId !== undefined) mapped.proyecto_id = ticket.proyectoId;
  if (ticket.asunto !== undefined) mapped.asunto = ticket.asunto;
  if (ticket.descripcion !== undefined) mapped.descripcion = ticket.descripcion;
  if (ticket.tipo !== undefined) mapped.tipo = ticket.tipo;
  if (ticket.prioridad !== undefined) mapped.prioridad = ticket.prioridad;
  if (ticket.estado !== undefined) mapped.estado = ticket.estado;
  if (ticket.asignadoA !== undefined) mapped.asignado_a = ticket.asignadoA;
  if (ticket.fechaResolucion !== undefined) mapped.fecha_resolucion = ticket.fechaResolucion;
  if (ticket.tiempoRespuesta !== undefined) mapped.tiempo_respuesta = ticket.tiempoRespuesta;
  return mapped;
}

export const ticketsService = {
  async getAll(): Promise<Ticket[]> {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    const ticketIds = (tickets || []).map(t => t.id);

    let respuestasMap = new Map<string, TicketRespuesta[]>();

    if (ticketIds.length > 0) {
      const { data: respuestas } = await supabase
        .from('ticket_respuestas')
        .select('*')
        .in('ticket_id', ticketIds)
        .order('fecha_creacion');

      if (respuestas) {
        respuestas.forEach(r => {
          const list = respuestasMap.get(r.ticket_id) || [];
          list.push(mapRespuestaFromDB(r));
          respuestasMap.set(r.ticket_id, list);
        });
      }
    }

    return (tickets || []).map(t =>
      mapTicketFromDB(t, respuestasMap.get(t.id) || [])
    );
  },

  async getById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    const { data: respuestas } = await supabase
      .from('ticket_respuestas')
      .select('*')
      .eq('ticket_id', id)
      .order('fecha_creacion');

    return data ? mapTicketFromDB(
      data,
      (respuestas || []).map(mapRespuestaFromDB)
    ) : null;
  },

  async create(ticket: Omit<Ticket, 'id' | 'numero' | 'fechaCreacion' | 'fechaActualizacion' | 'respuestas'>): Promise<Ticket> {
    // Generar número de ticket
    const { count } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true });

    const numero = `TKT-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`;

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        ...mapTicketToDB(ticket),
        numero,
      })
      .select()
      .single();

    if (error) throw error;
    return mapTicketFromDB(data, []);
  },

  async update(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update(mapTicketToDB(ticket))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const { data: respuestas } = await supabase
      .from('ticket_respuestas')
      .select('*')
      .eq('ticket_id', id)
      .order('fecha_creacion');

    return mapTicketFromDB(data, (respuestas || []).map(mapRespuestaFromDB));
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async addRespuesta(ticketId: string, respuesta: Omit<TicketRespuesta, 'id' | 'fechaCreacion'>): Promise<TicketRespuesta> {
    const { data, error } = await supabase
      .from('ticket_respuestas')
      .insert({
        ticket_id: ticketId,
        mensaje: respuesta.mensaje,
        usuario_id: respuesta.usuarioId,
        es_cliente: respuesta.esCliente,
        archivos_adjuntos: respuesta.archivosAdjuntos,
      })
      .select()
      .single();

    if (error) throw error;
    return mapRespuestaFromDB(data);
  },
};
