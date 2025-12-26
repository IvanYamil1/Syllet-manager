// Tipos generados para Supabase Database
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          apellido: string
          avatar: string | null
          rol: 'admin' | 'vendedor' | 'operaciones' | 'soporte' | 'marketing'
          departamento: 'direccion' | 'ventas' | 'marketing' | 'operaciones' | 'soporte' | 'administracion'
          telefono: string | null
          activo: boolean
          fecha_creacion: string
          ultimo_acceso: string | null
          meta_mensual: number | null
          comision_porcentaje: number | null
        }
        Insert: Omit<Database['public']['Tables']['usuarios']['Row'], 'id' | 'fecha_creacion'>
        Update: Partial<Database['public']['Tables']['usuarios']['Insert']>
      }
      clientes: {
        Row: {
          id: string
          nombre: string
          empresa: string | null
          email: string
          telefono: string
          direccion: string | null
          ciudad: string | null
          pais: string
          notas: string | null
          vendedor_asignado: string | null
          origen_lead: 'facebook' | 'google' | 'instagram' | 'referido' | 'organico' | 'linkedin' | 'llamada_fria' | 'evento' | 'otro'
          fecha_creacion: string
          fecha_ultimo_contacto: string | null
          valor_total: number
          proyectos_activos: number
        }
        Insert: Omit<Database['public']['Tables']['clientes']['Row'], 'id' | 'fecha_creacion'>
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>
      }
      prospectos: {
        Row: {
          id: string
          cliente_id: string | null
          nombre: string
          empresa: string | null
          email: string
          telefono: string
          direccion: string | null
          etapa: 'contacto' | 'cotizacion' | 'proceso' | 'entregado'
          valor_estimado: number
          probabilidad: number
          vendedor_id: string
          servicio_interes: 'landing_page' | 'web_basica' | 'web_profesional' | 'ecommerce' | 'aplicacion' | 'sistema_medida' | 'mantenimiento' | 'hosting' | 'seo' | 'marketing_digital'
          notas: string | null
          fecha_creacion: string
          fecha_ultima_actualizacion: string
          fecha_cierre_estimada: string | null
          motivo_perdida: string | null
        }
        Insert: Omit<Database['public']['Tables']['prospectos']['Row'], 'id' | 'fecha_creacion' | 'fecha_ultima_actualizacion'>
        Update: Partial<Database['public']['Tables']['prospectos']['Insert']>
      }
      seguimientos: {
        Row: {
          id: string
          prospecto_id: string
          fecha: string
          tipo: 'llamada' | 'email' | 'reunion' | 'whatsapp' | 'otro'
          descripcion: string
          resultado: string | null
          proximo_seguimiento: string | null
          usuario_id: string
        }
        Insert: Omit<Database['public']['Tables']['seguimientos']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['seguimientos']['Insert']>
      }
      cotizaciones: {
        Row: {
          id: string
          prospecto_id: string
          cliente_id: string | null
          numero: string
          subtotal: number
          descuento: number
          iva: number
          total: number
          estado: 'borrador' | 'enviada' | 'aceptada' | 'rechazada' | 'expirada'
          validez_dias: number
          fecha_creacion: string
          fecha_envio: string | null
          fecha_respuesta: string | null
          notas: string | null
          terminos_condiciones: string | null
        }
        Insert: Omit<Database['public']['Tables']['cotizaciones']['Row'], 'id' | 'fecha_creacion'>
        Update: Partial<Database['public']['Tables']['cotizaciones']['Insert']>
      }
      cotizacion_items: {
        Row: {
          id: string
          cotizacion_id: string
          descripcion: string
          servicio_tipo: 'landing_page' | 'web_basica' | 'web_profesional' | 'ecommerce' | 'aplicacion' | 'sistema_medida' | 'mantenimiento' | 'hosting' | 'seo' | 'marketing_digital'
          paquete: string | null
          cantidad: number
          precio_unitario: number
          total: number
        }
        Insert: Omit<Database['public']['Tables']['cotizacion_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['cotizacion_items']['Insert']>
      }
      paquetes: {
        Row: {
          id: string
          nombre: string
          tipo: 'landing_page' | 'web_basica' | 'web_profesional' | 'ecommerce' | 'aplicacion' | 'sistema_medida' | 'mantenimiento' | 'hosting' | 'seo' | 'marketing_digital'
          descripcion: string
          precio: number
          precio_anterior: number | null
          caracteristicas: string[]
          tiempo_entrega_dias: number
          popular: boolean
          activo: boolean
        }
        Insert: Omit<Database['public']['Tables']['paquetes']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['paquetes']['Insert']>
      }
      proyectos: {
        Row: {
          id: string
          nombre: string
          cliente_id: string
          cotizacion_id: string | null
          tipo: 'landing_page' | 'web_basica' | 'web_profesional' | 'ecommerce' | 'aplicacion' | 'sistema_medida' | 'mantenimiento' | 'hosting' | 'seo' | 'marketing_digital'
          descripcion: string
          estado: 'pendiente' | 'en_desarrollo' | 'en_revision' | 'entregado' | 'cancelado'
          progreso: number
          desarrollador_id: string | null
          fecha_inicio: string
          fecha_entrega_estimada: string
          fecha_entrega_real: string | null
          presupuesto: number
          notas: string | null
          prioridad: 'baja' | 'media' | 'alta' | 'urgente'
        }
        Insert: Omit<Database['public']['Tables']['proyectos']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['proyectos']['Insert']>
      }
      proyecto_desarrolladores: {
        Row: {
          id: string
          proyecto_id: string
          usuario_id: string
        }
        Insert: Omit<Database['public']['Tables']['proyecto_desarrolladores']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['proyecto_desarrolladores']['Insert']>
      }
      checklist_items: {
        Row: {
          id: string
          proyecto_id: string
          tarea: string
          completado: boolean
          fecha_completado: string | null
          asignado_a: string | null
          orden: number
        }
        Insert: Omit<Database['public']['Tables']['checklist_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['checklist_items']['Insert']>
      }
      archivos_proyecto: {
        Row: {
          id: string
          proyecto_id: string
          nombre: string
          url: string
          tipo: string
          tamaño: number
          subido_por: string
          fecha_subida: string
          categoria: 'diseño' | 'documento' | 'imagen' | 'codigo' | 'otro'
        }
        Insert: Omit<Database['public']['Tables']['archivos_proyecto']['Row'], 'id' | 'fecha_subida'>
        Update: Partial<Database['public']['Tables']['archivos_proyecto']['Insert']>
      }
      accesos_cliente: {
        Row: {
          id: string
          proyecto_id: string
          plataforma: string
          url: string | null
          usuario: string
          password: string
          notas: string | null
        }
        Insert: Omit<Database['public']['Tables']['accesos_cliente']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['accesos_cliente']['Insert']>
      }
      campanas: {
        Row: {
          id: string
          nombre: string
          plataforma: 'facebook' | 'google' | 'instagram' | 'linkedin' | 'otro'
          tipo: 'awareness' | 'leads' | 'conversiones' | 'retargeting'
          estado: 'borrador' | 'activa' | 'pausada' | 'finalizada'
          presupuesto: number
          gasto_actual: number
          fecha_inicio: string
          fecha_fin: string | null
          leads: number
          conversiones: number
          cpl: number
          roi: number
          notas: string | null
          responsable_id: string
        }
        Insert: Omit<Database['public']['Tables']['campanas']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['campanas']['Insert']>
      }
      contenidos: {
        Row: {
          id: string
          titulo: string
          tipo: 'post' | 'video' | 'articulo' | 'caso_exito' | 'material_ventas'
          descripcion: string | null
          url: string | null
          estado: 'borrador' | 'publicado' | 'archivado'
          plataforma: string | null
          fecha_publicacion: string | null
          creador_id: string
          vistas: number | null
        }
        Insert: Omit<Database['public']['Tables']['contenidos']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['contenidos']['Insert']>
      }
      leads: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string
          empresa: string | null
          origen: 'facebook' | 'google' | 'instagram' | 'referido' | 'organico' | 'linkedin' | 'llamada_fria' | 'evento' | 'otro'
          campana_id: string | null
          servicio_interes: 'landing_page' | 'web_basica' | 'web_profesional' | 'ecommerce' | 'aplicacion' | 'sistema_medida' | 'mantenimiento' | 'hosting' | 'seo' | 'marketing_digital'
          estado: 'nuevo' | 'contactado' | 'calificado' | 'descartado'
          notas: string | null
          fecha_creacion: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'fecha_creacion'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      tickets: {
        Row: {
          id: string
          numero: string
          cliente_id: string
          proyecto_id: string | null
          asunto: string
          descripcion: string
          tipo: 'bug' | 'mejora' | 'consulta' | 'cambio' | 'otro'
          prioridad: 'baja' | 'media' | 'alta' | 'urgente'
          estado: 'abierto' | 'en_progreso' | 'pendiente_cliente' | 'resuelto' | 'cerrado'
          asignado_a: string | null
          fecha_creacion: string
          fecha_actualizacion: string
          fecha_resolucion: string | null
          tiempo_respuesta: number | null
        }
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'id' | 'fecha_creacion' | 'fecha_actualizacion'>
        Update: Partial<Database['public']['Tables']['tickets']['Insert']>
      }
      ticket_respuestas: {
        Row: {
          id: string
          ticket_id: string
          mensaje: string
          usuario_id: string
          es_cliente: boolean
          fecha_creacion: string
          archivos_adjuntos: string[] | null
        }
        Insert: Omit<Database['public']['Tables']['ticket_respuestas']['Row'], 'id' | 'fecha_creacion'>
        Update: Partial<Database['public']['Tables']['ticket_respuestas']['Insert']>
      }
      servicios_recurrentes: {
        Row: {
          id: string
          cliente_id: string
          tipo: 'mantenimiento' | 'hosting' | 'soporte' | 'seo' | 'otro'
          nombre: string
          descripcion: string | null
          precio_mensual: number
          fecha_inicio: string
          fecha_renovacion: string
          estado: 'activo' | 'pausado' | 'cancelado' | 'vencido'
          auto_renovar: boolean
        }
        Insert: Omit<Database['public']['Tables']['servicios_recurrentes']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['servicios_recurrentes']['Insert']>
      }
      pagos_servicio: {
        Row: {
          id: string
          servicio_id: string
          fecha: string
          monto: number
          estado: 'pendiente' | 'pagado' | 'vencido'
          metodo_pago: string | null
        }
        Insert: Omit<Database['public']['Tables']['pagos_servicio']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['pagos_servicio']['Insert']>
      }
      transacciones: {
        Row: {
          id: string
          tipo: 'ingreso' | 'egreso'
          categoria: 'venta_proyecto' | 'servicio_recurrente' | 'comision' | 'publicidad' | 'herramientas' | 'salarios' | 'oficina' | 'impuestos' | 'otro'
          descripcion: string
          monto: number
          fecha: string
          cliente_id: string | null
          proyecto_id: string | null
          metodo_pago: string | null
          comprobante: string | null
          notas: string | null
          creado_por: string
        }
        Insert: Omit<Database['public']['Tables']['transacciones']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['transacciones']['Insert']>
      }
      facturas: {
        Row: {
          id: string
          numero: string
          cliente_id: string
          proyecto_id: string | null
          cotizacion_id: string | null
          subtotal: number
          iva: number
          total: number
          estado: 'borrador' | 'enviada' | 'pagada' | 'vencida' | 'cancelada'
          fecha_emision: string
          fecha_vencimiento: string
          fecha_pago: string | null
          metodo_pago: string | null
          notas: string | null
        }
        Insert: Omit<Database['public']['Tables']['facturas']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['facturas']['Insert']>
      }
      factura_items: {
        Row: {
          id: string
          factura_id: string
          descripcion: string
          cantidad: number
          precio_unitario: number
          total: number
        }
        Insert: Omit<Database['public']['Tables']['factura_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['factura_items']['Insert']>
      }
      comisiones: {
        Row: {
          id: string
          vendedor_id: string
          proyecto_id: string
          cliente_id: string
          monto_venta: number
          porcentaje: number
          monto_comision: number
          estado: 'pendiente' | 'aprobada' | 'pagada'
          fecha_venta: string
          fecha_pago: string | null
        }
        Insert: Omit<Database['public']['Tables']['comisiones']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['comisiones']['Insert']>
      }
      configuracion_empresa: {
        Row: {
          id: string
          nombre_empresa: string
          logo: string | null
          email: string
          telefono: string
          direccion: string
          moneda: string
          iva_porcentaje: number
          comision_base_porcentaje: number
          terminos_condiciones: string | null
        }
        Insert: Omit<Database['public']['Tables']['configuracion_empresa']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['configuracion_empresa']['Insert']>
      }
      metas_mensuales: {
        Row: {
          id: string
          mes: number
          año: number
          meta_ventas: number
          meta_proyectos: number
          meta_leads: number
        }
        Insert: Omit<Database['public']['Tables']['metas_mensuales']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['metas_mensuales']['Insert']>
      }
    }
  }
}
