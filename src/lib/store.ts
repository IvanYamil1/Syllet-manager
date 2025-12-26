import { create } from 'zustand';
import type {
  Cliente,
  Prospecto,
  Proyecto,
  Ticket,
  Campana,
  Transaccion,
  Paquete,
  User,
  ServicioRecurrente,
  ContenidoMarketing,
  Cotizacion,
  Lead,
} from '@/types';
import {
  usuariosService,
  clientesService,
  prospectosService,
  proyectosService,
  ticketsService,
  campanasService,
  transaccionesService,
  paquetesService,
  serviciosRecurrentesService,
  contenidosService,
  cotizacionesService,
  leadsService,
} from './services';

// ═══════════════════════════════════════════════════════════════════════════
// STORE PRINCIPAL DE SYLLET MANAGER - CON SUPABASE
// ═══════════════════════════════════════════════════════════════════════════

interface AppState {
  // Estado de carga
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Datos
  clientes: Cliente[];
  prospectos: Prospecto[];
  proyectos: Proyecto[];
  tickets: Ticket[];
  campanas: Campana[];
  transacciones: Transaccion[];
  paquetes: Paquete[];
  usuarios: User[];
  serviciosRecurrentes: ServicioRecurrente[];
  contenidos: ContenidoMarketing[];
  cotizaciones: Cotizacion[];
  leads: Lead[];

  // Inicialización
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Acciones - Clientes
  addCliente: (cliente: Omit<Cliente, 'id' | 'fechaCreacion' | 'valorTotal' | 'proyectosActivos'>) => Promise<void>;
  updateCliente: (id: string, data: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;

  // Acciones - Prospectos
  addProspecto: (prospecto: Omit<Prospecto, 'id' | 'fechaCreacion' | 'fechaUltimaActualizacion' | 'seguimientos'>) => Promise<void>;
  updateProspecto: (id: string, data: Partial<Prospecto>) => Promise<void>;
  deleteProspecto: (id: string) => Promise<void>;
  convertProspectoToCliente: (prospectoId: string) => Promise<void>;

  // Acciones - Proyectos
  addProyecto: (proyecto: Omit<Proyecto, 'id' | 'progreso' | 'checklist' | 'archivos' | 'accesos'>) => Promise<void>;
  updateProyecto: (id: string, data: Partial<Proyecto>) => Promise<void>;
  deleteProyecto: (id: string) => Promise<void>;

  // Acciones - Tickets
  addTicket: (ticket: Omit<Ticket, 'id' | 'numero' | 'fechaCreacion' | 'fechaActualizacion' | 'respuestas'>) => Promise<void>;
  updateTicket: (id: string, data: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;

  // Acciones - Campañas
  addCampana: (campana: Omit<Campana, 'id' | 'leads' | 'conversiones' | 'cpl' | 'roi' | 'gastoActual'>) => Promise<void>;
  updateCampana: (id: string, data: Partial<Campana>) => Promise<void>;
  deleteCampana: (id: string) => Promise<void>;

  // Acciones - Transacciones
  addTransaccion: (transaccion: Omit<Transaccion, 'id'>) => Promise<void>;
  deleteTransaccion: (id: string) => Promise<void>;

  // Acciones - Paquetes
  addPaquete: (paquete: Omit<Paquete, 'id'>) => Promise<void>;
  updatePaquete: (id: string, data: Partial<Paquete>) => Promise<void>;
  deletePaquete: (id: string) => Promise<void>;

  // Acciones - Usuarios
  addUsuario: (usuario: Omit<User, 'id' | 'fechaCreacion'>) => Promise<void>;
  updateUsuario: (id: string, data: Partial<User>) => Promise<void>;
  deleteUsuario: (id: string) => Promise<void>;

  // Acciones - Servicios Recurrentes
  addServicioRecurrente: (servicio: Omit<ServicioRecurrente, 'id' | 'historialPagos'>) => Promise<void>;
  updateServicioRecurrente: (id: string, data: Partial<ServicioRecurrente>) => Promise<void>;
  deleteServicioRecurrente: (id: string) => Promise<void>;

  // Acciones - Contenido
  addContenido: (contenido: Omit<ContenidoMarketing, 'id'>) => Promise<void>;
  updateContenido: (id: string, data: Partial<ContenidoMarketing>) => Promise<void>;
  deleteContenido: (id: string) => Promise<void>;

  // Acciones - Cotizaciones
  addCotizacion: (cotizacion: Omit<Cotizacion, 'id' | 'numero' | 'fechaCreacion'>) => Promise<void>;
  updateCotizacion: (id: string, data: Partial<Cotizacion>) => Promise<void>;
  deleteCotizacion: (id: string) => Promise<void>;

  // Acciones - Leads
  addLead: (lead: Omit<Lead, 'id' | 'fechaCreacion'>) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>()((set, get) => ({
  // Estado inicial
  isLoading: false,
  isInitialized: false,
  error: null,
  clientes: [],
  prospectos: [],
  proyectos: [],
  tickets: [],
  campanas: [],
  transacciones: [],
  paquetes: [],
  usuarios: [],
  serviciosRecurrentes: [],
  contenidos: [],
  cotizaciones: [],
  leads: [],

  // ─────────────────────────────────────────────────────────────────────
  // INICIALIZACIÓN - Cargar todos los datos desde Supabase
  // ─────────────────────────────────────────────────────────────────────
  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    try {
      const [
        usuarios,
        clientes,
        prospectos,
        proyectos,
        tickets,
        campanas,
        transacciones,
        paquetes,
        serviciosRecurrentes,
        contenidos,
        cotizaciones,
        leads,
      ] = await Promise.all([
        usuariosService.getAll(),
        clientesService.getAll(),
        prospectosService.getAll(),
        proyectosService.getAll(),
        ticketsService.getAll(),
        campanasService.getAll(),
        transaccionesService.getAll(),
        paquetesService.getAll(),
        serviciosRecurrentesService.getAll(),
        contenidosService.getAll(),
        cotizacionesService.getAll(),
        leadsService.getAll(),
      ]);

      set({
        usuarios,
        clientes,
        prospectos,
        proyectos,
        tickets,
        campanas,
        transacciones,
        paquetes,
        serviciosRecurrentes,
        contenidos,
        cotizaciones,
        leads,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error: any) {
      console.error('Error initializing store:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  refreshData: async () => {
    set({ isInitialized: false });
    await get().initialize();
  },

  // ─────────────────────────────────────────────────────────────────────
  // CLIENTES
  // ─────────────────────────────────────────────────────────────────────
  addCliente: async (clienteData) => {
    try {
      const newCliente = await clientesService.create({
        ...clienteData,
        valorTotal: 0,
        proyectosActivos: 0,
      });
      set((state) => ({ clientes: [...state.clientes, newCliente] }));
    } catch (error: any) {
      console.error('Error adding cliente:', error);
      throw error;
    }
  },

  updateCliente: async (id, data) => {
    try {
      const updated = await clientesService.update(id, data);
      set((state) => ({
        clientes: state.clientes.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (error: any) {
      console.error('Error updating cliente:', error);
      throw error;
    }
  },

  deleteCliente: async (id) => {
    try {
      await clientesService.delete(id);
      set((state) => ({
        clientes: state.clientes.filter((c) => c.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting cliente:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // PROSPECTOS
  // ─────────────────────────────────────────────────────────────────────
  addProspecto: async (prospectoData) => {
    try {
      const newProspecto = await prospectosService.create(prospectoData);
      set((state) => ({ prospectos: [...state.prospectos, newProspecto] }));
    } catch (error: any) {
      console.error('Error adding prospecto:', error);
      throw error;
    }
  },

  updateProspecto: async (id, data) => {
    try {
      const updated = await prospectosService.update(id, data);
      set((state) => ({
        prospectos: state.prospectos.map((p) => (p.id === id ? updated : p)),
      }));
    } catch (error: any) {
      console.error('Error updating prospecto:', error);
      throw error;
    }
  },

  deleteProspecto: async (id) => {
    try {
      await prospectosService.delete(id);
      set((state) => ({
        prospectos: state.prospectos.filter((p) => p.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting prospecto:', error);
      throw error;
    }
  },

  convertProspectoToCliente: async (prospectoId) => {
    const prospecto = get().prospectos.find((p) => p.id === prospectoId);
    if (!prospecto) return;

    try {
      // Crear cliente
      const newCliente = await clientesService.create({
        nombre: prospecto.nombre,
        empresa: prospecto.empresa,
        email: prospecto.email,
        telefono: prospecto.telefono,
        pais: 'México',
        origenLead: 'referido',
        vendedorAsignado: prospecto.vendedorId,
        fechaUltimoContacto: new Date(),
        valorTotal: prospecto.valorEstimado,
        proyectosActivos: 0,
      });

      // Actualizar prospecto
      await prospectosService.update(prospectoId, {
        etapa: 'entregado',
        clienteId: newCliente.id,
      });

      set((state) => ({
        clientes: [...state.clientes, newCliente],
        prospectos: state.prospectos.map((p) =>
          p.id === prospectoId ? { ...p, etapa: 'entregado' as const, clienteId: newCliente.id } : p
        ),
      }));
    } catch (error: any) {
      console.error('Error converting prospecto to cliente:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // PROYECTOS
  // ─────────────────────────────────────────────────────────────────────
  addProyecto: async (proyectoData) => {
    try {
      const newProyecto = await proyectosService.create(proyectoData);
      set((state) => ({ proyectos: [...state.proyectos, newProyecto] }));
    } catch (error: any) {
      console.error('Error adding proyecto:', error);
      throw error;
    }
  },

  updateProyecto: async (id, data) => {
    try {
      const updated = await proyectosService.update(id, data);
      set((state) => ({
        proyectos: state.proyectos.map((p) => (p.id === id ? updated : p)),
      }));
    } catch (error: any) {
      console.error('Error updating proyecto:', error);
      throw error;
    }
  },

  deleteProyecto: async (id) => {
    try {
      await proyectosService.delete(id);
      set((state) => ({
        proyectos: state.proyectos.filter((p) => p.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting proyecto:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // TICKETS
  // ─────────────────────────────────────────────────────────────────────
  addTicket: async (ticketData) => {
    try {
      const newTicket = await ticketsService.create(ticketData);
      set((state) => ({ tickets: [...state.tickets, newTicket] }));
    } catch (error: any) {
      console.error('Error adding ticket:', error);
      throw error;
    }
  },

  updateTicket: async (id, data) => {
    try {
      const updated = await ticketsService.update(id, data);
      set((state) => ({
        tickets: state.tickets.map((t) => (t.id === id ? updated : t)),
      }));
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  deleteTicket: async (id) => {
    try {
      await ticketsService.delete(id);
      set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // CAMPAÑAS
  // ─────────────────────────────────────────────────────────────────────
  addCampana: async (campanaData) => {
    try {
      const newCampana = await campanasService.create(campanaData);
      set((state) => ({ campanas: [...state.campanas, newCampana] }));
    } catch (error: any) {
      console.error('Error adding campana:', error);
      throw error;
    }
  },

  updateCampana: async (id, data) => {
    try {
      const updated = await campanasService.update(id, data);
      set((state) => ({
        campanas: state.campanas.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (error: any) {
      console.error('Error updating campana:', error);
      throw error;
    }
  },

  deleteCampana: async (id) => {
    try {
      await campanasService.delete(id);
      set((state) => ({
        campanas: state.campanas.filter((c) => c.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting campana:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // TRANSACCIONES
  // ─────────────────────────────────────────────────────────────────────
  addTransaccion: async (transaccionData) => {
    try {
      const newTransaccion = await transaccionesService.create(transaccionData);
      set((state) => ({ transacciones: [...state.transacciones, newTransaccion] }));
    } catch (error: any) {
      console.error('Error adding transaccion:', error);
      throw error;
    }
  },

  deleteTransaccion: async (id) => {
    try {
      await transaccionesService.delete(id);
      set((state) => ({
        transacciones: state.transacciones.filter((t) => t.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting transaccion:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // PAQUETES
  // ─────────────────────────────────────────────────────────────────────
  addPaquete: async (paqueteData) => {
    try {
      const newPaquete = await paquetesService.create(paqueteData);
      set((state) => ({ paquetes: [...state.paquetes, newPaquete] }));
    } catch (error: any) {
      console.error('Error adding paquete:', error);
      throw error;
    }
  },

  updatePaquete: async (id, data) => {
    try {
      const updated = await paquetesService.update(id, data);
      set((state) => ({
        paquetes: state.paquetes.map((p) => (p.id === id ? updated : p)),
      }));
    } catch (error: any) {
      console.error('Error updating paquete:', error);
      throw error;
    }
  },

  deletePaquete: async (id) => {
    try {
      await paquetesService.delete(id);
      set((state) => ({
        paquetes: state.paquetes.filter((p) => p.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting paquete:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // USUARIOS
  // ─────────────────────────────────────────────────────────────────────
  addUsuario: async (usuarioData) => {
    try {
      const newUsuario = await usuariosService.create(usuarioData);
      set((state) => ({ usuarios: [...state.usuarios, newUsuario] }));
    } catch (error: any) {
      console.error('Error adding usuario:', error);
      throw error;
    }
  },

  updateUsuario: async (id, data) => {
    try {
      const updated = await usuariosService.update(id, data);
      set((state) => ({
        usuarios: state.usuarios.map((u) => (u.id === id ? updated : u)),
      }));
    } catch (error: any) {
      console.error('Error updating usuario:', error);
      throw error;
    }
  },

  deleteUsuario: async (id) => {
    try {
      await usuariosService.delete(id);
      set((state) => ({
        usuarios: state.usuarios.filter((u) => u.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting usuario:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // SERVICIOS RECURRENTES
  // ─────────────────────────────────────────────────────────────────────
  addServicioRecurrente: async (servicioData) => {
    try {
      const newServicio = await serviciosRecurrentesService.create(servicioData);
      set((state) => ({ serviciosRecurrentes: [...state.serviciosRecurrentes, newServicio] }));
    } catch (error: any) {
      console.error('Error adding servicio recurrente:', error);
      throw error;
    }
  },

  updateServicioRecurrente: async (id, data) => {
    try {
      const updated = await serviciosRecurrentesService.update(id, data);
      set((state) => ({
        serviciosRecurrentes: state.serviciosRecurrentes.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (error: any) {
      console.error('Error updating servicio recurrente:', error);
      throw error;
    }
  },

  deleteServicioRecurrente: async (id) => {
    try {
      await serviciosRecurrentesService.delete(id);
      set((state) => ({
        serviciosRecurrentes: state.serviciosRecurrentes.filter((s) => s.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting servicio recurrente:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // CONTENIDO
  // ─────────────────────────────────────────────────────────────────────
  addContenido: async (contenidoData) => {
    try {
      const newContenido = await contenidosService.create(contenidoData);
      set((state) => ({ contenidos: [...state.contenidos, newContenido] }));
    } catch (error: any) {
      console.error('Error adding contenido:', error);
      throw error;
    }
  },

  updateContenido: async (id, data) => {
    try {
      const updated = await contenidosService.update(id, data);
      set((state) => ({
        contenidos: state.contenidos.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (error: any) {
      console.error('Error updating contenido:', error);
      throw error;
    }
  },

  deleteContenido: async (id) => {
    try {
      await contenidosService.delete(id);
      set((state) => ({
        contenidos: state.contenidos.filter((c) => c.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting contenido:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // COTIZACIONES
  // ─────────────────────────────────────────────────────────────────────
  addCotizacion: async (cotizacionData) => {
    try {
      const newCotizacion = await cotizacionesService.create(cotizacionData);
      set((state) => ({ cotizaciones: [...state.cotizaciones, newCotizacion] }));
    } catch (error: any) {
      console.error('Error adding cotizacion:', error);
      throw error;
    }
  },

  updateCotizacion: async (id, data) => {
    try {
      const updated = await cotizacionesService.update(id, data);
      set((state) => ({
        cotizaciones: state.cotizaciones.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (error: any) {
      console.error('Error updating cotizacion:', error);
      throw error;
    }
  },

  deleteCotizacion: async (id) => {
    try {
      await cotizacionesService.delete(id);
      set((state) => ({
        cotizaciones: state.cotizaciones.filter((c) => c.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting cotizacion:', error);
      throw error;
    }
  },

  // ─────────────────────────────────────────────────────────────────────
  // LEADS
  // ─────────────────────────────────────────────────────────────────────
  addLead: async (leadData) => {
    try {
      const newLead = await leadsService.create(leadData);
      set((state) => ({ leads: [...state.leads, newLead] }));
    } catch (error: any) {
      console.error('Error adding lead:', error);
      throw error;
    }
  },

  updateLead: async (id, data) => {
    try {
      const updated = await leadsService.update(id, data);
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? updated : l)),
      }));
    } catch (error: any) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  deleteLead: async (id) => {
    try {
      await leadsService.delete(id);
      set((state) => ({
        leads: state.leads.filter((l) => l.id !== id),
      }));
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },
}));
