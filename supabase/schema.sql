-- ═══════════════════════════════════════════════════════════════════════════
-- SYLLET MANAGER - ESQUEMA DE BASE DE DATOS SUPABASE
-- Sistema de gestión empresarial para agencia digital
-- ═══════════════════════════════════════════════════════════════════════════

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- TIPOS ENUM
-- ─────────────────────────────────────────────────────────────────────────────

-- Roles de usuario
CREATE TYPE user_role AS ENUM ('admin', 'vendedor', 'operaciones', 'soporte', 'marketing');

-- Departamentos
CREATE TYPE department AS ENUM ('direccion', 'ventas', 'marketing', 'operaciones', 'soporte', 'administracion');

-- Origen de leads
CREATE TYPE lead_source AS ENUM ('facebook', 'google', 'instagram', 'referido', 'organico', 'linkedin', 'llamada_fria', 'evento', 'otro');

-- Etapas del pipeline
CREATE TYPE pipeline_stage AS ENUM ('contacto', 'cotizacion', 'proceso', 'entregado');

-- Tipos de servicio
CREATE TYPE service_type AS ENUM ('landing_page', 'web_basica', 'web_profesional', 'ecommerce', 'aplicacion', 'sistema_medida', 'mantenimiento', 'hosting', 'seo', 'marketing_digital');

-- Estado de proyecto
CREATE TYPE project_status AS ENUM ('pendiente', 'en_desarrollo', 'en_revision', 'entregado', 'cancelado');

-- Prioridad
CREATE TYPE priority_level AS ENUM ('baja', 'media', 'alta', 'urgente');

-- Estado de cotización
CREATE TYPE cotizacion_status AS ENUM ('borrador', 'enviada', 'aceptada', 'rechazada', 'expirada');

-- Tipo de seguimiento
CREATE TYPE seguimiento_type AS ENUM ('llamada', 'email', 'reunion', 'whatsapp', 'otro');

-- Plataforma de campaña
CREATE TYPE campana_platform AS ENUM ('facebook', 'google', 'instagram', 'linkedin', 'otro');

-- Tipo de campaña
CREATE TYPE campana_type AS ENUM ('awareness', 'leads', 'conversiones', 'retargeting');

-- Estado de campaña
CREATE TYPE campana_status AS ENUM ('borrador', 'activa', 'pausada', 'finalizada');

-- Tipo de contenido
CREATE TYPE content_type AS ENUM ('post', 'video', 'articulo', 'caso_exito', 'material_ventas');

-- Estado de contenido
CREATE TYPE content_status AS ENUM ('borrador', 'publicado', 'archivado');

-- Estado de lead
CREATE TYPE lead_status AS ENUM ('nuevo', 'contactado', 'calificado', 'descartado');

-- Tipo de ticket
CREATE TYPE ticket_type AS ENUM ('bug', 'mejora', 'consulta', 'cambio', 'otro');

-- Estado de ticket
CREATE TYPE ticket_status AS ENUM ('abierto', 'en_progreso', 'pendiente_cliente', 'resuelto', 'cerrado');

-- Tipo de servicio recurrente
CREATE TYPE servicio_recurrente_type AS ENUM ('mantenimiento', 'hosting', 'soporte', 'seo', 'otro');

-- Estado de servicio recurrente
CREATE TYPE servicio_recurrente_status AS ENUM ('activo', 'pausado', 'cancelado', 'vencido');

-- Estado de pago
CREATE TYPE payment_status AS ENUM ('pendiente', 'pagado', 'vencido');

-- Tipo de transacción
CREATE TYPE transaction_type AS ENUM ('ingreso', 'egreso');

-- Categoría financiera
CREATE TYPE financial_category AS ENUM ('venta_proyecto', 'servicio_recurrente', 'comision', 'publicidad', 'herramientas', 'salarios', 'oficina', 'impuestos', 'otro');

-- Estado de factura
CREATE TYPE invoice_status AS ENUM ('borrador', 'enviada', 'pagada', 'vencida', 'cancelada');

-- Estado de comisión
CREATE TYPE comision_status AS ENUM ('pendiente', 'aprobada', 'pagada');

-- Categoría de archivo
CREATE TYPE file_category AS ENUM ('diseño', 'documento', 'imagen', 'codigo', 'otro');

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: USUARIOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    avatar TEXT,
    rol user_role NOT NULL DEFAULT 'vendedor',
    departamento department NOT NULL DEFAULT 'ventas',
    telefono VARCHAR(20),
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    meta_mensual DECIMAL(12, 2),
    comision_porcentaje DECIMAL(5, 2)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: CLIENTES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    empresa VARCHAR(200),
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100) NOT NULL DEFAULT 'México',
    notas TEXT,
    vendedor_asignado UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    origen_lead lead_source NOT NULL DEFAULT 'otro',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_ultimo_contacto TIMESTAMP WITH TIME ZONE,
    valor_total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    proyectos_activos INTEGER NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: PROSPECTOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE prospectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    nombre VARCHAR(200) NOT NULL,
    empresa VARCHAR(200),
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT,
    etapa pipeline_stage NOT NULL DEFAULT 'contacto',
    valor_estimado DECIMAL(12, 2) NOT NULL DEFAULT 0,
    probabilidad INTEGER NOT NULL DEFAULT 20 CHECK (probabilidad >= 0 AND probabilidad <= 100),
    vendedor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    servicio_interes service_type NOT NULL DEFAULT 'web_profesional',
    notas TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_cierre_estimada DATE,
    motivo_perdida TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: SEGUIMIENTOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE seguimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospecto_id UUID NOT NULL REFERENCES prospectos(id) ON DELETE CASCADE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tipo seguimiento_type NOT NULL,
    descripcion TEXT NOT NULL,
    resultado TEXT,
    proximo_seguimiento TIMESTAMP WITH TIME ZONE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: COTIZACIONES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE cotizaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospecto_id UUID NOT NULL REFERENCES prospectos(id) ON DELETE RESTRICT,
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    numero VARCHAR(20) UNIQUE NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    descuento DECIMAL(12, 2) NOT NULL DEFAULT 0,
    iva DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    estado cotizacion_status NOT NULL DEFAULT 'borrador',
    validez_dias INTEGER NOT NULL DEFAULT 30,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_envio TIMESTAMP WITH TIME ZONE,
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    notas TEXT,
    terminos_condiciones TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: COTIZACION ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE cotizacion_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cotizacion_id UUID NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    servicio_tipo service_type NOT NULL,
    paquete VARCHAR(100),
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: PAQUETES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE paquetes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    tipo service_type NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(12, 2) NOT NULL,
    precio_anterior DECIMAL(12, 2),
    caracteristicas TEXT[] NOT NULL DEFAULT '{}',
    tiempo_entrega_dias INTEGER NOT NULL DEFAULT 30,
    popular BOOLEAN NOT NULL DEFAULT false,
    activo BOOLEAN NOT NULL DEFAULT true
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: PROYECTOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE proyectos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE SET NULL,
    tipo service_type NOT NULL,
    descripcion TEXT NOT NULL,
    estado project_status NOT NULL DEFAULT 'pendiente',
    progreso INTEGER NOT NULL DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
    desarrollador_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_inicio DATE NOT NULL,
    fecha_entrega_estimada DATE NOT NULL,
    fecha_entrega_real DATE,
    presupuesto DECIMAL(12, 2) NOT NULL DEFAULT 0,
    notas TEXT,
    prioridad priority_level NOT NULL DEFAULT 'media'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: PROYECTO DESARROLLADORES (relación muchos a muchos)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE proyecto_desarrolladores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(proyecto_id, usuario_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: CHECKLIST ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    tarea TEXT NOT NULL,
    completado BOOLEAN NOT NULL DEFAULT false,
    fecha_completado TIMESTAMP WITH TIME ZONE,
    asignado_a UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    orden INTEGER NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: ARCHIVOS PROYECTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE archivos_proyecto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    tamaño BIGINT NOT NULL,
    subido_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    categoria file_category NOT NULL DEFAULT 'otro'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: ACCESOS CLIENTE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE accesos_cliente (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    plataforma VARCHAR(100) NOT NULL,
    url TEXT,
    usuario VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    notas TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: CAMPAÑAS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE campanas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    plataforma campana_platform NOT NULL,
    tipo campana_type NOT NULL,
    estado campana_status NOT NULL DEFAULT 'borrador',
    presupuesto DECIMAL(12, 2) NOT NULL DEFAULT 0,
    gasto_actual DECIMAL(12, 2) NOT NULL DEFAULT 0,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    leads INTEGER NOT NULL DEFAULT 0,
    conversiones INTEGER NOT NULL DEFAULT 0,
    cpl DECIMAL(12, 2) NOT NULL DEFAULT 0,
    roi DECIMAL(8, 2) NOT NULL DEFAULT 0,
    notas TEXT,
    responsable_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: CONTENIDOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE contenidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(300) NOT NULL,
    tipo content_type NOT NULL,
    descripcion TEXT,
    url TEXT,
    estado content_status NOT NULL DEFAULT 'borrador',
    plataforma VARCHAR(100),
    fecha_publicacion TIMESTAMP WITH TIME ZONE,
    creador_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    vistas INTEGER DEFAULT 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: LEADS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    empresa VARCHAR(200),
    origen lead_source NOT NULL,
    campana_id UUID REFERENCES campanas(id) ON DELETE SET NULL,
    servicio_interes service_type NOT NULL,
    estado lead_status NOT NULL DEFAULT 'nuevo',
    notas TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: TICKETS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero VARCHAR(20) UNIQUE NOT NULL,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,
    asunto VARCHAR(300) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo ticket_type NOT NULL,
    prioridad priority_level NOT NULL DEFAULT 'media',
    estado ticket_status NOT NULL DEFAULT 'abierto',
    asignado_a UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    tiempo_respuesta INTEGER
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: TICKET RESPUESTAS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE ticket_respuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    es_cliente BOOLEAN NOT NULL DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archivos_adjuntos TEXT[]
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: SERVICIOS RECURRENTES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE servicios_recurrentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    tipo servicio_recurrente_type NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_mensual DECIMAL(12, 2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_renovacion DATE NOT NULL,
    estado servicio_recurrente_status NOT NULL DEFAULT 'activo',
    auto_renovar BOOLEAN NOT NULL DEFAULT true
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: PAGOS SERVICIO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE pagos_servicio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    servicio_id UUID NOT NULL REFERENCES servicios_recurrentes(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    estado payment_status NOT NULL DEFAULT 'pendiente',
    metodo_pago VARCHAR(100)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: TRANSACCIONES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE transacciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo transaction_type NOT NULL,
    categoria financial_category NOT NULL,
    descripcion TEXT NOT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    fecha DATE NOT NULL,
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,
    metodo_pago VARCHAR(100),
    comprobante TEXT,
    notas TEXT,
    creado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: FACTURAS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero VARCHAR(20) UNIQUE NOT NULL,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,
    cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE SET NULL,
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    iva DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    estado invoice_status NOT NULL DEFAULT 'borrador',
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_pago DATE,
    metodo_pago VARCHAR(100),
    notas TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: FACTURA ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE factura_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factura_id UUID NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: COMISIONES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE comisiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendedor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE RESTRICT,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    monto_venta DECIMAL(12, 2) NOT NULL,
    porcentaje DECIMAL(5, 2) NOT NULL,
    monto_comision DECIMAL(12, 2) NOT NULL,
    estado comision_status NOT NULL DEFAULT 'pendiente',
    fecha_venta DATE NOT NULL,
    fecha_pago DATE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: CONFIGURACIÓN EMPRESA
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE configuracion_empresa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_empresa VARCHAR(200) NOT NULL,
    logo TEXT,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    moneda VARCHAR(10) NOT NULL DEFAULT 'MXN',
    iva_porcentaje DECIMAL(5, 2) NOT NULL DEFAULT 16.00,
    comision_base_porcentaje DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
    terminos_condiciones TEXT
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: METAS MENSUALES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE metas_mensuales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    año INTEGER NOT NULL,
    meta_ventas DECIMAL(12, 2) NOT NULL DEFAULT 0,
    meta_proyectos INTEGER NOT NULL DEFAULT 0,
    meta_leads INTEGER NOT NULL DEFAULT 0,
    UNIQUE(mes, año)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ÍNDICES PARA OPTIMIZACIÓN
-- ═══════════════════════════════════════════════════════════════════════════

-- Usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- Clientes
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_vendedor ON clientes(vendedor_asignado);
CREATE INDEX idx_clientes_fecha_creacion ON clientes(fecha_creacion);

-- Prospectos
CREATE INDEX idx_prospectos_etapa ON prospectos(etapa);
CREATE INDEX idx_prospectos_vendedor ON prospectos(vendedor_id);
CREATE INDEX idx_prospectos_fecha ON prospectos(fecha_creacion);

-- Proyectos
CREATE INDEX idx_proyectos_cliente ON proyectos(cliente_id);
CREATE INDEX idx_proyectos_estado ON proyectos(estado);
CREATE INDEX idx_proyectos_desarrollador ON proyectos(desarrollador_id);

-- Tickets
CREATE INDEX idx_tickets_cliente ON tickets(cliente_id);
CREATE INDEX idx_tickets_estado ON tickets(estado);
CREATE INDEX idx_tickets_asignado ON tickets(asignado_a);

-- Transacciones
CREATE INDEX idx_transacciones_tipo ON transacciones(tipo);
CREATE INDEX idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX idx_transacciones_cliente ON transacciones(cliente_id);

-- Leads
CREATE INDEX idx_leads_estado ON leads(estado);
CREATE INDEX idx_leads_campana ON leads(campana_id);
CREATE INDEX idx_leads_fecha ON leads(fecha_creacion);

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ═══════════════════════════════════════════════════════════════════════════

-- Función para actualizar fecha_ultima_actualizacion en prospectos
CREATE OR REPLACE FUNCTION update_prospecto_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_ultima_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_prospecto_timestamp
    BEFORE UPDATE ON prospectos
    FOR EACH ROW
    EXECUTE FUNCTION update_prospecto_timestamp();

-- Función para actualizar fecha_actualizacion en tickets
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ticket_timestamp
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_timestamp();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) - Políticas básicas
-- ═══════════════════════════════════════════════════════════════════════════

-- Habilitar RLS en todas las tablas principales
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;

-- Política de acceso público para usuarios autenticados (puedes ajustar según necesidades)
CREATE POLICY "Usuarios autenticados pueden ver todo" ON usuarios
    FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden ver clientes" ON clientes
    FOR ALL USING (true);

CREATE POLICY "Usuarios autenticados pueden ver prospectos" ON prospectos
    FOR ALL USING (true);

CREATE POLICY "Usuarios autenticados pueden ver proyectos" ON proyectos
    FOR ALL USING (true);

CREATE POLICY "Usuarios autenticados pueden ver tickets" ON tickets
    FOR ALL USING (true);

CREATE POLICY "Usuarios autenticados pueden ver transacciones" ON transacciones
    FOR ALL USING (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- DATOS INICIALES (Usuario admin)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO usuarios (email, nombre, apellido, rol, departamento, activo)
VALUES ('admin@syllet.com', 'Admin', 'Sistema', 'admin', 'direccion', true);

INSERT INTO configuracion_empresa (nombre_empresa, email, telefono, direccion, moneda, iva_porcentaje, comision_base_porcentaje)
VALUES ('Syllet', 'contacto@syllet.com', '+52 55 1234 5678', 'Ciudad de México, México', 'MXN', 16.00, 10.00);
