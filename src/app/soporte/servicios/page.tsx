'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, Avatar } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { ServicioRecurrenteForm } from '@/components/forms';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Server,
  Wrench,
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
} from 'lucide-react';

export default function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const serviciosRecurrentes = useAppStore((state) => state.serviciosRecurrentes);
  const clientes = useAppStore((state) => state.clientes);

  const filteredServicios = serviciosRecurrentes.filter((s) => {
    const matchesSearch = s.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'all' || s.tipo === filterTipo;
    const matchesEstado = filterEstado === 'all' || s.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || 'Cliente';
  };

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, React.ReactNode> = {
      hosting: <Server size={18} className="text-blue-500" />,
      mantenimiento: <Wrench size={18} className="text-orange-500" />,
      soporte: <AlertCircle size={18} className="text-purple-500" />,
      seo: <RefreshCw size={18} className="text-green-500" />,
    };
    return icons[tipo] || icons.hosting;
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      hosting: 'Hosting',
      mantenimiento: 'Mantenimiento',
      soporte: 'Soporte Técnico',
      seo: 'SEO',
      social_media: 'Social Media',
      otro: 'Otro',
    };
    return labels[tipo] || tipo;
  };

  const getEstadoBadge = (estado: string): 'success' | 'warning' | 'danger' | 'neutral' => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
      activo: 'success',
      pausado: 'warning',
      por_renovar: 'warning',
      cancelado: 'neutral',
    };
    return variants[estado] || 'neutral';
  };

  const getDaysUntilRenewal = (date: Date) => {
    const today = new Date();
    const diff = date.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Stats
  const serviciosActivos = serviciosRecurrentes.filter(s => s.estado === 'activo').length;
  const ingresoMensual = serviciosRecurrentes
    .filter(s => s.estado === 'activo')
    .reduce((sum, s) => sum + s.precioMensual, 0);
  const proximasRenovaciones = serviciosRecurrentes
    .filter(s => getDaysUntilRenewal(s.fechaRenovacion) <= 30 && getDaysUntilRenewal(s.fechaRenovacion) > 0)
    .length;
  const vencidos = serviciosRecurrentes.filter(s => getDaysUntilRenewal(s.fechaRenovacion) <= 0).length;

  return (
    <MainLayout
      title="Servicios Recurrentes"
      subtitle="Gestiona hosting, mantenimiento y suscripciones"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nuevo Servicio
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-success-600">{serviciosActivos}</p>
            <p className="text-sm text-zinc-500">Activos</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-zinc-900">{formatCurrency(ingresoMensual)}</p>
            <p className="text-sm text-zinc-500">Ingreso Mensual</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-warning-600">{proximasRenovaciones}</p>
            <p className="text-sm text-zinc-500">Por Renovar</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-danger-600">{vencidos}</p>
            <p className="text-sm text-zinc-500">Vencidos</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="select max-w-[160px]"
        >
          <option value="all">Todos los tipos</option>
          <option value="hosting">Hosting</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="soporte">Soporte</option>
          <option value="seo">SEO</option>
          <option value="social_media">Social Media</option>
        </select>

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="select max-w-[160px]"
        >
          <option value="all">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pausado">Pausado</option>
          <option value="por_renovar">Por Renovar</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Services Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Precio Mensual</th>
                <th>Renovación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredServicios.map((servicio) => {
                const daysUntil = getDaysUntilRenewal(servicio.fechaRenovacion);
                const isUrgent = daysUntil <= 7 && daysUntil > 0;

                return (
                  <tr key={servicio.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-100">
                          {getTipoIcon(servicio.tipo)}
                        </div>
                        <span className="font-medium text-zinc-900">{servicio.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={getClienteName(servicio.clienteId)} size="sm" />
                        <span className="text-zinc-600">{getClienteName(servicio.clienteId)}</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant="neutral" size="sm">
                        {getTipoLabel(servicio.tipo)}
                      </Badge>
                    </td>
                    <td className="font-semibold text-zinc-900">
                      {formatCurrency(servicio.precioMensual)}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className={isUrgent ? 'text-warning-500' : 'text-zinc-400'} />
                        <span className={isUrgent ? 'text-warning-600 font-medium' : 'text-zinc-600'}>
                          {formatDate(servicio.fechaRenovacion)}
                        </span>
                        {isUrgent && (
                          <Badge variant="warning" size="sm">
                            {daysUntil} días
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge variant={getEstadoBadge(servicio.estado)} size="sm">
                        {servicio.estado}
                      </Badge>
                    </td>
                    <td>
                      <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                        <MoreHorizontal size={18} className="text-zinc-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      <ServicioRecurrenteForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
