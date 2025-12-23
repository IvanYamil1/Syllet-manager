'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Input, Badge } from '@/components/ui';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Percent,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  Upload,
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('empresa');

  const tabs = [
    { id: 'empresa', label: 'Empresa', icon: <Building size={18} /> },
    { id: 'facturacion', label: 'Facturación', icon: <DollarSign size={18} /> },
    { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={18} /> },
    { id: 'seguridad', label: 'Seguridad', icon: <Shield size={18} /> },
    { id: 'apariencia', label: 'Apariencia', icon: <Palette size={18} /> },
    { id: 'datos', label: 'Datos', icon: <Database size={18} /> },
  ];

  return (
    <MainLayout
      title="Configuración"
      subtitle="Configura las opciones del sistema"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardBody className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'bg-syllet-50 text-syllet-700'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'empresa' && (
            <Card>
              <CardHeader title="Información de la Empresa" subtitle="Datos generales de Syllet" />
              <CardBody className="space-y-6">
                {/* Logo */}
                <div>
                  <label className="input-label">Logo de la Empresa</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-syllet-500 to-syllet-700 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">S</span>
                    </div>
                    <Button variant="secondary" leftIcon={<Upload size={16} />}>
                      Cambiar Logo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre de la Empresa"
                    defaultValue="Syllet"
                    leftIcon={<Building size={16} />}
                  />
                  <Input
                    label="Sitio Web"
                    defaultValue="www.syllet.com"
                    leftIcon={<Globe size={16} />}
                  />
                  <Input
                    label="Correo de Contacto"
                    defaultValue="contacto@syllet.com"
                    leftIcon={<Mail size={16} />}
                  />
                  <Input
                    label="Teléfono"
                    defaultValue="+52 55 1234 5678"
                    leftIcon={<Phone size={16} />}
                  />
                </div>

                <div>
                  <Input
                    label="Dirección"
                    defaultValue="Av. Reforma 123, Col. Centro, CDMX"
                    leftIcon={<MapPin size={16} />}
                  />
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <Button leftIcon={<Save size={16} />}>
                    Guardar Cambios
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'facturacion' && (
            <Card>
              <CardHeader title="Configuración de Facturación" subtitle="Impuestos y comisiones" />
              <CardBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Moneda"
                    defaultValue="MXN"
                    leftIcon={<DollarSign size={16} />}
                  />
                  <Input
                    label="IVA (%)"
                    type="number"
                    defaultValue="16"
                    leftIcon={<Percent size={16} />}
                  />
                  <Input
                    label="Comisión Base Vendedores (%)"
                    type="number"
                    defaultValue="10"
                    leftIcon={<Percent size={16} />}
                  />
                  <Input
                    label="Días de Vigencia Cotización"
                    type="number"
                    defaultValue="15"
                  />
                </div>

                <div>
                  <label className="input-label">Términos y Condiciones</label>
                  <textarea
                    className="input min-h-[120px]"
                    defaultValue="Los precios mostrados no incluyen IVA. El tiempo de entrega comienza a partir del anticipo del 50%. Incluye 2 rondas de revisiones."
                  />
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <Button leftIcon={<Save size={16} />}>
                    Guardar Cambios
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notificaciones' && (
            <Card>
              <CardHeader title="Notificaciones" subtitle="Configura las alertas del sistema" />
              <CardBody className="space-y-4">
                {[
                  { titulo: 'Nuevos leads', descripcion: 'Recibir notificación cuando llegue un nuevo lead' },
                  { titulo: 'Proyectos por vencer', descripcion: 'Alertas de fechas límite próximas' },
                  { titulo: 'Tickets urgentes', descripcion: 'Notificaciones de tickets de alta prioridad' },
                  { titulo: 'Pagos recibidos', descripcion: 'Confirmación de pagos de clientes' },
                  { titulo: 'Renovaciones de servicios', descripcion: 'Servicios recurrentes próximos a renovar' },
                ].map((item) => (
                  <div key={item.titulo} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                    <div>
                      <p className="font-medium text-zinc-900">{item.titulo}</p>
                      <p className="text-sm text-zinc-500">{item.descripcion}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-syllet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-syllet-600"></div>
                    </label>
                  </div>
                ))}

                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <Button leftIcon={<Save size={16} />}>
                    Guardar Cambios
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'seguridad' && (
            <Card>
              <CardHeader title="Seguridad" subtitle="Opciones de seguridad del sistema" />
              <CardBody className="space-y-6">
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-zinc-900">Autenticación de dos factores</p>
                    <Badge variant="neutral">Desactivado</Badge>
                  </div>
                  <p className="text-sm text-zinc-500 mb-3">
                    Agrega una capa extra de seguridad a tu cuenta
                  </p>
                  <Button variant="secondary" size="sm">
                    Configurar 2FA
                  </Button>
                </div>

                <div className="p-4 bg-zinc-50 rounded-xl">
                  <p className="font-medium text-zinc-900 mb-2">Sesiones activas</p>
                  <p className="text-sm text-zinc-500 mb-3">
                    Administra los dispositivos donde has iniciado sesión
                  </p>
                  <Button variant="secondary" size="sm">
                    Ver sesiones
                  </Button>
                </div>

                <div className="p-4 bg-zinc-50 rounded-xl">
                  <p className="font-medium text-zinc-900 mb-2">Cambiar contraseña</p>
                  <p className="text-sm text-zinc-500 mb-3">
                    Actualiza tu contraseña regularmente para mayor seguridad
                  </p>
                  <Button variant="secondary" size="sm">
                    Cambiar contraseña
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'apariencia' && (
            <Card>
              <CardHeader title="Apariencia" subtitle="Personaliza la interfaz" />
              <CardBody className="space-y-6">
                <div>
                  <label className="input-label">Tema</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {['Claro', 'Oscuro', 'Sistema'].map((tema) => (
                      <button
                        key={tema}
                        className={`p-4 border rounded-xl text-center transition-all ${tema === 'Claro'
                          ? 'border-syllet-500 bg-syllet-50 text-syllet-700'
                          : 'border-zinc-200 hover:border-zinc-300'
                          }`}
                      >
                        {tema}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Color principal</label>
                  <div className="flex gap-3 mt-2">
                    {['#5e63f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${color === '#5e63f1' ? 'border-zinc-900 scale-110' : 'border-transparent'
                          }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <Button leftIcon={<Save size={16} />}>
                    Guardar Cambios
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'datos' && (
            <Card>
              <CardHeader title="Gestión de Datos" subtitle="Exporta y respalda tu información" />
              <CardBody className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium text-zinc-900">Exportar datos</p>
                    <p className="text-sm text-zinc-500">Descarga toda tu información en formato Excel</p>
                  </div>
                  <Button variant="secondary">Exportar</Button>
                </div>

                <div className="p-4 bg-zinc-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium text-zinc-900">Respaldo automático</p>
                    <p className="text-sm text-zinc-500">Último respaldo: hace 2 horas</p>
                  </div>
                  <Badge variant="success">Activo</Badge>
                </div>

                <div className="p-4 bg-danger-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-medium text-danger-700">Eliminar cuenta</p>
                    <p className="text-sm text-danger-600">Esta acción es irreversible</p>
                  </div>
                  <Button variant="danger">Eliminar</Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
