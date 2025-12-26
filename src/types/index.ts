// ═══════════════════════════════════════════════════════════════════════════
// SYLLET MANAGER - MODELO DE DATOS COMPLETO
// Sistema de gestión empresarial para agencia digital
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// USUARIOS Y AUTENTICACIÓN
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'vendedor' | 'operaciones' | 'soporte' | 'marketing';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  avatar?: string;
  rol: UserRole;
  departamento: Department;
  telefono?: string;
  activo: boolean;
  fechaCreacion: Date;
  ultimoAcceso?: Date;
  metaMensual?: number; // Para vendedores
  comisionPorcentaje?: number; // Para vendedores
}

export type Department =
  | 'direccion'
  | 'ventas'
  | 'marketing'
  | 'operaciones'
  | 'soporte'
  | 'administracion';

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTES
// ─────────────────────────────────────────────────────────────────────────────

export interface Cliente {
  id: string;
  nombre: string;
  empresa?: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  pais: string;
  notas?: string;
  vendedorAsignado?: string; // User ID
  origenLead: LeadSource;
  fechaCreacion: Date;
  fechaUltimoContacto?: Date;
  valorTotal: number; // Total de compras
  proyectosActivos: number;
}

export type LeadSource =
  | 'facebook'
  | 'google'
  | 'instagram'
  | 'referido'
  | 'organico'
  | 'linkedin'
  | 'llamada_fria'
  | 'evento'
  | 'otro';

// ─────────────────────────────────────────────────────────────────────────────
// VENTAS Y PIPELINE
// ─────────────────────────────────────────────────────────────────────────────

export type PipelineStage =
  | 'contacto'
  | 'cotizacion'
  | 'proceso'
  | 'entregado';

export interface Prospecto {
  id: string;
  clienteId?: string;
  nombre: string;
  empresa?: string;
  email: string;
  telefono: string;
  direccion?: string;
  etapa: PipelineStage;
  valorEstimado: number;
  probabilidad: number; // 0-100
  vendedorId: string;
  servicioInteres: ServiceType;
  notas?: string;
  fechaCreacion: Date;
  fechaUltimaActualizacion: Date;
  fechaCierreEstimada?: Date;
  motivoPerdida?: string;
  seguimientos: Seguimiento[];
}

export interface Seguimiento {
  id: string;
  fecha: Date;
  tipo: 'llamada' | 'email' | 'reunion' | 'whatsapp' | 'otro';
  descripcion: string;
  resultado?: string;
  proximoSeguimiento?: Date;
  usuarioId: string;
}

export interface Cotizacion {
  id: string;
  prospectoId: string;
  clienteId?: string;
  numero: string; // COT-2024-001
  items: CotizacionItem[];
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  estado: 'borrador' | 'enviada' | 'aceptada' | 'rechazada' | 'expirada';
  validezDias: number;
  fechaCreacion: Date;
  fechaEnvio?: Date;
  fechaRespuesta?: Date;
  notas?: string;
  terminosCondiciones?: string;
}

export interface CotizacionItem {
  id: string;
  descripcion: string;
  servicioTipo: ServiceType;
  paquete?: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIOS Y PAQUETES
// ─────────────────────────────────────────────────────────────────────────────

export type ServiceType =
  | 'landing_page'
  | 'web_basica'
  | 'web_profesional'
  | 'ecommerce'
  | 'aplicacion'
  | 'sistema_medida'
  | 'mantenimiento'
  | 'hosting'
  | 'seo'
  | 'marketing_digital';

export interface Paquete {
  id: string;
  nombre: string;
  tipo: ServiceType;
  descripcion: string;
  precio: number;
  precioAnterior?: number; // Para mostrar descuento
  caracteristicas: string[];
  tiempoEntregaDias: number;
  popular: boolean;
  activo: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROYECTOS Y OPERACIONES
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | 'pendiente'
  | 'en_desarrollo'
  | 'en_revision'
  | 'entregado'
  | 'cancelado';

export interface Proyecto {
  id: string;
  nombre: string;
  clienteId: string;
  cotizacionId?: string;
  tipo: ServiceType;
  descripcion: string;
  estado: ProjectStatus;
  progreso: number; // 0-100
  desarrolladorId?: string;
  desarrolladores: string[]; // User IDs
  fechaInicio: Date;
  fechaEntregaEstimada: Date;
  fechaEntregaReal?: Date;
  presupuesto: number;
  checklist: ChecklistItem[];
  archivos: ArchivoProyecto[];
  accesos: AccesoCliente[];
  notas?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
}

export interface ChecklistItem {
  id: string;
  tarea: string;
  completado: boolean;
  fechaCompletado?: Date;
  asignadoA?: string; // User ID
  orden: number;
}

export interface ArchivoProyecto {
  id: string;
  nombre: string;
  url: string;
  tipo: string;
  tamaño: number;
  subidoPor: string;
  fechaSubida: Date;
  categoria: 'diseño' | 'documento' | 'imagen' | 'codigo' | 'otro';
}

export interface AccesoCliente {
  id: string;
  plataforma: string; // hosting, dominio, email, etc.
  url?: string;
  usuario: string;
  password: string;
  notas?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKETING
// ─────────────────────────────────────────────────────────────────────────────

export interface Campana {
  id: string;
  nombre: string;
  plataforma: 'facebook' | 'google' | 'instagram' | 'linkedin' | 'otro';
  tipo: 'awareness' | 'leads' | 'conversiones' | 'retargeting';
  estado: 'borrador' | 'activa' | 'pausada' | 'finalizada';
  presupuesto: number;
  gastoActual: number;
  fechaInicio: Date;
  fechaFin?: Date;
  leads: number;
  conversiones: number;
  cpl: number; // Costo por lead
  roi: number;
  notas?: string;
  responsableId: string;
}

export interface ContenidoMarketing {
  id: string;
  titulo: string;
  tipo: 'post' | 'video' | 'articulo' | 'caso_exito' | 'material_ventas';
  descripcion?: string;
  url?: string;
  estado: 'borrador' | 'publicado' | 'archivado';
  plataforma?: string;
  fechaPublicacion?: Date;
  creadorId: string;
  vistas?: number;
}

export type LeadEstado = 'nuevo' | 'contactado' | 'calificado' | 'descartado';

export interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  origen: LeadSource;
  campanaId?: string;
  servicioInteres: ServiceType;
  estado: LeadEstado;
  notas?: string;
  fechaCreacion: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOPORTE
// ─────────────────────────────────────────────────────────────────────────────

export type TicketPriority = 'baja' | 'media' | 'alta' | 'urgente';
export type TicketStatus = 'abierto' | 'en_progreso' | 'pendiente_cliente' | 'resuelto' | 'cerrado';

export interface Ticket {
  id: string;
  numero: string; // TKT-2024-001
  clienteId: string;
  proyectoId?: string;
  asunto: string;
  descripcion: string;
  tipo: 'bug' | 'mejora' | 'consulta' | 'cambio' | 'otro';
  prioridad: TicketPriority;
  estado: TicketStatus;
  asignadoA?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  fechaResolucion?: Date;
  respuestas: TicketRespuesta[];
  tiempoRespuesta?: number; // minutos
}

export interface TicketRespuesta {
  id: string;
  mensaje: string;
  usuarioId: string;
  esCliente: boolean;
  fechaCreacion: Date;
  archivosAdjuntos?: string[];
}

export interface ServicioRecurrente {
  id: string;
  clienteId: string;
  tipo: 'mantenimiento' | 'hosting' | 'soporte' | 'seo' | 'otro';
  nombre: string;
  descripcion?: string;
  precioMensual: number;
  fechaInicio: Date;
  fechaRenovacion: Date;
  estado: 'activo' | 'pausado' | 'cancelado' | 'vencido';
  autoRenovar: boolean;
  historialPagos: PagoServicio[];
}

export interface PagoServicio {
  id: string;
  fecha: Date;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'vencido';
  metodoPago?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FINANZAS
// ─────────────────────────────────────────────────────────────────────────────

export type TransactionType = 'ingreso' | 'egreso';

export interface Transaccion {
  id: string;
  tipo: TransactionType;
  categoria: CategoriaFinanciera;
  descripcion: string;
  monto: number;
  fecha: Date;
  clienteId?: string;
  proyectoId?: string;
  metodoPago?: string;
  comprobante?: string;
  notas?: string;
  creadoPor: string;
}

export type CategoriaFinanciera =
  | 'venta_proyecto'
  | 'servicio_recurrente'
  | 'comision'
  | 'publicidad'
  | 'herramientas'
  | 'salarios'
  | 'oficina'
  | 'impuestos'
  | 'otro';

export interface Factura {
  id: string;
  numero: string; // FAC-2024-001
  clienteId: string;
  proyectoId?: string;
  cotizacionId?: string;
  items: FacturaItem[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'borrador' | 'enviada' | 'pagada' | 'vencida' | 'cancelada';
  fechaEmision: Date;
  fechaVencimiento: Date;
  fechaPago?: Date;
  metodoPago?: string;
  notas?: string;
}

export interface FacturaItem {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface Comision {
  id: string;
  vendedorId: string;
  proyectoId: string;
  clienteId: string;
  montoVenta: number;
  porcentaje: number;
  montoComision: number;
  estado: 'pendiente' | 'aprobada' | 'pagada';
  fechaVenta: Date;
  fechaPago?: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// MÉTRICAS Y REPORTES
// ─────────────────────────────────────────────────────────────────────────────

export interface MetricasDashboard {
  ingresosMes: number;
  ingresosMesAnterior: number;
  proyectosActivos: number;
  ticketsAbiertos: number;
  leadsNuevos: number;
  tasaConversion: number;
  ventasPorVendedor: VentasVendedor[];
  ingresosPorMes: IngresoMensual[];
  proyectosPorEstado: ProyectosPorEstado[];
}

export interface VentasVendedor {
  vendedorId: string;
  vendedorNombre: string;
  ventas: number;
  meta: number;
  comisiones: number;
}

export interface IngresoMensual {
  mes: string;
  ingresos: number;
  egresos: number;
  neto: number;
}

export interface ProyectosPorEstado {
  estado: ProjectStatus;
  cantidad: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────────────────────

export interface ConfiguracionEmpresa {
  id: string;
  nombreEmpresa: string;
  logo?: string;
  email: string;
  telefono: string;
  direccion: string;
  moneda: string;
  ivaPorcentaje: number;
  comisionBasePorcentaje: number;
  terminosCondiciones?: string;
}

export interface MetaMensual {
  id: string;
  mes: number; // 1-12
  año: number;
  metaVentas: number;
  metaProyectos: number;
  metaLeads: number;
}
