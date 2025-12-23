'use client';

import React from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Input, Badge, Avatar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Edit,
  Save,
  Camera,
  Key,
  Bell,
  Clock,
} from 'lucide-react';

export default function PerfilPage() {
  const { user } = useAuth();

  const getRolLabel = (rol?: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      vendedor: 'Vendedor',
      operaciones: 'Operaciones',
      soporte: 'Soporte',
      marketing: 'Marketing',
    };
    return rol ? labels[rol] || rol : '';
  };

  const getDepartamentoLabel = (departamento?: string) => {
    const labels: Record<string, string> = {
      direccion: 'Dirección',
      ventas: 'Ventas',
      operaciones: 'Operaciones',
      soporte: 'Soporte',
      marketing: 'Marketing',
      administracion: 'Administración',
    };
    return departamento ? labels[departamento] || departamento : '';
  };

  if (!user) return null;

  return (
    <MainLayout
      title="Mi Perfil"
      subtitle="Gestiona tu información personal"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="text-center py-8">
              <div className="relative inline-block mb-4">
                <Avatar
                  name={`${user.nombre} ${user.apellido}`}
                  size="lg"
                  className="w-24 h-24 text-2xl"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-syllet-600 text-white rounded-full shadow-lg hover:bg-syllet-700 transition-colors">
                  <Camera size={16} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-zinc-900 mb-1">
                {user.nombre} {user.apellido}
              </h2>
              <p className="text-zinc-500 mb-4">{user.email}</p>

              <div className="flex justify-center gap-2 mb-6">
                <Badge variant="primary">
                  <Shield size={12} className="mr-1" />
                  {getRolLabel(user.rol)}
                </Badge>
                <Badge variant="success">Activo</Badge>
              </div>

              <div className="text-left space-y-3 pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-3 text-sm">
                  <Building size={16} className="text-zinc-400" />
                  <span className="text-zinc-600">{getDepartamentoLabel(user.departamento)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-zinc-400" />
                  <span className="text-zinc-600">{user.email}</span>
                </div>
                {user.telefono && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-zinc-400" />
                    <span className="text-zinc-600">{user.telefono}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-zinc-400" />
                  <span className="text-zinc-600">
                    Miembro desde {formatDate(user.fechaCreacion)}
                  </span>
                </div>
                {user.ultimoAcceso && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-zinc-400" />
                    <span className="text-zinc-600">Activo ahora</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader
              title="Información Personal"
              subtitle="Actualiza tus datos de perfil"
              action={
                <Button variant="ghost" size="sm" leftIcon={<Edit size={14} />}>
                  Editar
                </Button>
              }
            />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  defaultValue={user.nombre}
                />
                <Input
                  label="Apellido"
                  defaultValue={user.apellido}
                />
                <Input
                  label="Correo Electrónico"
                  type="email"
                  defaultValue={user.email}
                />
                <Input
                  label="Teléfono"
                  defaultValue={user.telefono || ''}
                />
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 flex justify-end">
                <Button leftIcon={<Save size={16} />}>
                  Guardar Cambios
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader
              title="Seguridad"
              subtitle="Gestiona tu contraseña y seguridad"
            />
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-200">
                    <Key size={20} className="text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">Contraseña</p>
                    <p className="text-sm text-zinc-500">Última actualización hace 30 días</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Cambiar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-200">
                    <Shield size={20} className="text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">Autenticación de dos factores</p>
                    <p className="text-sm text-zinc-500">Añade una capa extra de seguridad</p>
                  </div>
                </div>
                <Badge variant="neutral">Desactivado</Badge>
              </div>
            </CardBody>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader
              title="Notificaciones"
              subtitle="Configura tus preferencias de notificación"
            />
            <CardBody className="space-y-4">
              {[
                { titulo: 'Notificaciones por email', descripcion: 'Recibe actualizaciones en tu correo' },
                { titulo: 'Notificaciones push', descripcion: 'Alertas en tiempo real' },
                { titulo: 'Resumen semanal', descripcion: 'Recibe un resumen cada semana' },
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
            </CardBody>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
