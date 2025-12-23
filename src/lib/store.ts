import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  mockClientes,
  mockProspectos,
  mockProyectos,
  mockTickets,
  mockCampanas,
  mockTransacciones,
  mockPaquetes,
  mockUsers,
} from './mock-data';
import { generateId } from './utils';

// ═══════════════════════════════════════════════════════════════════════════
// STORE PRINCIPAL DE SYLLET MANAGER
// ═══════════════════════════════════════════════════════════════════════════

interface AppState {
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

  // Acciones - Clientes
  addCliente: (cliente: Omit<Cliente, 'id' | 'fechaCreacion' | 'valorTotal' | 'proyectosActivos'>) => void;
  updateCliente: (id: string, data: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;

  // Acciones - Prospectos
  addProspecto: (prospecto: Omit<Prospecto, 'id' | 'fechaCreacion' | 'fechaUltimaActualizacion' | 'seguimientos'>) => void;
  updateProspecto: (id: string, data: Partial<Prospecto>) => void;
  deleteProspecto: (id: string) => void;
  convertProspectoToCliente: (prospectoId: string) => void;

  // Acciones - Proyectos
  addProyecto: (proyecto: Omit<Proyecto, 'id' | 'progreso' | 'checklist' | 'archivos' | 'accesos'>) => void;
  updateProyecto: (id: string, data: Partial<Proyecto>) => void;
  deleteProyecto: (id: string) => void;

  // Acciones - Tickets
  addTicket: (ticket: Omit<Ticket, 'id' | 'numero' | 'fechaCreacion' | 'fechaActualizacion' | 'respuestas'>) => void;
  updateTicket: (id: string, data: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;

  // Acciones - Campañas
  addCampana: (campana: Omit<Campana, 'id' | 'leads' | 'conversiones' | 'cpl' | 'roi' | 'gastoActual'>) => void;
  updateCampana: (id: string, data: Partial<Campana>) => void;
  deleteCampana: (id: string) => void;

  // Acciones - Transacciones
  addTransaccion: (transaccion: Omit<Transaccion, 'id'>) => void;
  deleteTransaccion: (id: string) => void;

  // Acciones - Paquetes
  addPaquete: (paquete: Omit<Paquete, 'id'>) => void;
  updatePaquete: (id: string, data: Partial<Paquete>) => void;
  deletePaquete: (id: string) => void;

  // Acciones - Usuarios
  addUsuario: (usuario: Omit<User, 'id' | 'fechaCreacion'>) => void;
  updateUsuario: (id: string, data: Partial<User>) => void;
  deleteUsuario: (id: string) => void;

  // Acciones - Servicios Recurrentes
  addServicioRecurrente: (servicio: Omit<ServicioRecurrente, 'id' | 'historialPagos'>) => void;
  updateServicioRecurrente: (id: string, data: Partial<ServicioRecurrente>) => void;
  deleteServicioRecurrente: (id: string) => void;

  // Acciones - Contenido
  addContenido: (contenido: Omit<ContenidoMarketing, 'id'>) => void;
  updateContenido: (id: string, data: Partial<ContenidoMarketing>) => void;
  deleteContenido: (id: string) => void;

  // Acciones - Cotizaciones
  addCotizacion: (cotizacion: Omit<Cotizacion, 'id' | 'numero' | 'fechaCreacion'>) => void;
  updateCotizacion: (id: string, data: Partial<Cotizacion>) => void;
  deleteCotizacion: (id: string) => void;

  // Acciones - Leads
  addLead: (lead: Omit<Lead, 'id' | 'fechaCreacion'>) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
}

// Contador para números de documentos
let ticketCounter = 50;
let cotizacionCounter = 30;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Datos iniciales
      clientes: mockClientes,
      prospectos: mockProspectos,
      proyectos: mockProyectos,
      tickets: mockTickets,
      campanas: mockCampanas,
      transacciones: mockTransacciones,
      paquetes: mockPaquetes,
      usuarios: mockUsers,
      serviciosRecurrentes: [],
      contenidos: [],
      cotizaciones: [],
      leads: [],

      // ─────────────────────────────────────────────────────────────────────
      // CLIENTES
      // ─────────────────────────────────────────────────────────────────────
      addCliente: (clienteData) => {
        const newCliente: Cliente = {
          ...clienteData,
          id: generateId(),
          fechaCreacion: new Date(),
          valorTotal: 0,
          proyectosActivos: 0,
        };
        set((state) => ({ clientes: [...state.clientes, newCliente] }));
      },

      updateCliente: (id, data) => {
        set((state) => ({
          clientes: state.clientes.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCliente: (id) => {
        set((state) => ({
          clientes: state.clientes.filter((c) => c.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // PROSPECTOS
      // ─────────────────────────────────────────────────────────────────────
      addProspecto: (prospectoData) => {
        const newProspecto: Prospecto = {
          ...prospectoData,
          id: generateId(),
          fechaCreacion: new Date(),
          fechaUltimaActualizacion: new Date(),
          seguimientos: [],
        };
        set((state) => ({ prospectos: [...state.prospectos, newProspecto] }));
      },

      updateProspecto: (id, data) => {
        set((state) => ({
          prospectos: state.prospectos.map((p) =>
            p.id === id ? { ...p, ...data, fechaUltimaActualizacion: new Date() } : p
          ),
        }));
      },

      deleteProspecto: (id) => {
        set((state) => ({
          prospectos: state.prospectos.filter((p) => p.id !== id),
        }));
      },

      convertProspectoToCliente: (prospectoId) => {
        const prospecto = get().prospectos.find((p) => p.id === prospectoId);
        if (prospecto) {
          const newCliente: Cliente = {
            id: generateId(),
            nombre: prospecto.nombre,
            empresa: prospecto.empresa,
            email: prospecto.email,
            telefono: prospecto.telefono,
            pais: 'México',
            origenLead: 'referido',
            vendedorAsignado: prospecto.vendedorId,
            fechaCreacion: new Date(),
            fechaUltimoContacto: new Date(),
            valorTotal: prospecto.valorEstimado,
            proyectosActivos: 0,
          };
          set((state) => ({
            clientes: [...state.clientes, newCliente],
            prospectos: state.prospectos.map((p) =>
              p.id === prospectoId ? { ...p, etapa: 'cierre' as const, clienteId: newCliente.id } : p
            ),
          }));
        }
      },

      // ─────────────────────────────────────────────────────────────────────
      // PROYECTOS
      // ─────────────────────────────────────────────────────────────────────
      addProyecto: (proyectoData) => {
        const newProyecto: Proyecto = {
          ...proyectoData,
          id: generateId(),
          progreso: 0,
          checklist: [],
          archivos: [],
          accesos: [],
        };
        set((state) => ({ proyectos: [...state.proyectos, newProyecto] }));
      },

      updateProyecto: (id, data) => {
        set((state) => ({
          proyectos: state.proyectos.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }));
      },

      deleteProyecto: (id) => {
        set((state) => ({
          proyectos: state.proyectos.filter((p) => p.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // TICKETS
      // ─────────────────────────────────────────────────────────────────────
      addTicket: (ticketData) => {
        ticketCounter++;
        const newTicket: Ticket = {
          ...ticketData,
          id: generateId(),
          numero: `TKT-2024-${ticketCounter.toString().padStart(4, '0')}`,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
          respuestas: [],
        };
        set((state) => ({ tickets: [...state.tickets, newTicket] }));
      },

      updateTicket: (id, data) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, ...data, fechaActualizacion: new Date() } : t
          ),
        }));
      },

      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // CAMPAÑAS
      // ─────────────────────────────────────────────────────────────────────
      addCampana: (campanaData) => {
        const newCampana: Campana = {
          ...campanaData,
          id: generateId(),
          leads: 0,
          conversiones: 0,
          cpl: 0,
          roi: 0,
          gastoActual: 0,
        };
        set((state) => ({ campanas: [...state.campanas, newCampana] }));
      },

      updateCampana: (id, data) => {
        set((state) => ({
          campanas: state.campanas.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCampana: (id) => {
        set((state) => ({
          campanas: state.campanas.filter((c) => c.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // TRANSACCIONES
      // ─────────────────────────────────────────────────────────────────────
      addTransaccion: (transaccionData) => {
        const newTransaccion: Transaccion = {
          ...transaccionData,
          id: generateId(),
        };
        set((state) => ({ transacciones: [...state.transacciones, newTransaccion] }));
      },

      deleteTransaccion: (id) => {
        set((state) => ({
          transacciones: state.transacciones.filter((t) => t.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // PAQUETES
      // ─────────────────────────────────────────────────────────────────────
      addPaquete: (paqueteData) => {
        const newPaquete: Paquete = {
          ...paqueteData,
          id: generateId(),
        };
        set((state) => ({ paquetes: [...state.paquetes, newPaquete] }));
      },

      updatePaquete: (id, data) => {
        set((state) => ({
          paquetes: state.paquetes.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }));
      },

      deletePaquete: (id) => {
        set((state) => ({
          paquetes: state.paquetes.filter((p) => p.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // USUARIOS
      // ─────────────────────────────────────────────────────────────────────
      addUsuario: (usuarioData) => {
        const newUsuario: User = {
          ...usuarioData,
          id: generateId(),
          fechaCreacion: new Date(),
        };
        set((state) => ({ usuarios: [...state.usuarios, newUsuario] }));
      },

      updateUsuario: (id, data) => {
        set((state) => ({
          usuarios: state.usuarios.map((u) =>
            u.id === id ? { ...u, ...data } : u
          ),
        }));
      },

      deleteUsuario: (id) => {
        set((state) => ({
          usuarios: state.usuarios.filter((u) => u.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // SERVICIOS RECURRENTES
      // ─────────────────────────────────────────────────────────────────────
      addServicioRecurrente: (servicioData) => {
        const newServicio: ServicioRecurrente = {
          ...servicioData,
          id: generateId(),
          historialPagos: [],
        };
        set((state) => ({ serviciosRecurrentes: [...state.serviciosRecurrentes, newServicio] }));
      },

      updateServicioRecurrente: (id, data) => {
        set((state) => ({
          serviciosRecurrentes: state.serviciosRecurrentes.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        }));
      },

      deleteServicioRecurrente: (id) => {
        set((state) => ({
          serviciosRecurrentes: state.serviciosRecurrentes.filter((s) => s.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // CONTENIDO
      // ─────────────────────────────────────────────────────────────────────
      addContenido: (contenidoData) => {
        const newContenido: ContenidoMarketing = {
          ...contenidoData,
          id: generateId(),
        };
        set((state) => ({ contenidos: [...state.contenidos, newContenido] }));
      },

      updateContenido: (id, data) => {
        set((state) => ({
          contenidos: state.contenidos.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteContenido: (id) => {
        set((state) => ({
          contenidos: state.contenidos.filter((c) => c.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // COTIZACIONES
      // ─────────────────────────────────────────────────────────────────────
      addCotizacion: (cotizacionData) => {
        cotizacionCounter++;
        const newCotizacion: Cotizacion = {
          ...cotizacionData,
          id: generateId(),
          numero: `COT-2024-${cotizacionCounter.toString().padStart(4, '0')}`,
          fechaCreacion: new Date(),
        };
        set((state) => ({ cotizaciones: [...state.cotizaciones, newCotizacion] }));
      },

      updateCotizacion: (id, data) => {
        set((state) => ({
          cotizaciones: state.cotizaciones.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCotizacion: (id) => {
        set((state) => ({
          cotizaciones: state.cotizaciones.filter((c) => c.id !== id),
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // LEADS
      // ─────────────────────────────────────────────────────────────────────
      addLead: (leadData) => {
        const newLead: Lead = {
          ...leadData,
          id: generateId(),
          fechaCreacion: new Date(),
        };
        set((state) => ({ leads: [...state.leads, newLead] }));
      },

      updateLead: (id, data) => {
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, ...data } : l
          ),
        }));
      },

      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        }));
      },
    }),
    {
      name: 'syllet-store',
      partialize: (state) => ({
        clientes: state.clientes,
        prospectos: state.prospectos,
        proyectos: state.proyectos,
        tickets: state.tickets,
        campanas: state.campanas,
        transacciones: state.transacciones,
        paquetes: state.paquetes,
        serviciosRecurrentes: state.serviciosRecurrentes,
        contenidos: state.contenidos,
        cotizaciones: state.cotizaciones,
        leads: state.leads,
      }),
    }
  )
);
