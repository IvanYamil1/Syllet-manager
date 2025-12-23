'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Badge, Input, getStatusBadgeVariant, getStatusLabel, getPriorityBadgeVariant } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { ProyectoForm } from '@/components/forms';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  FolderKanban,
} from 'lucide-react';

export default function ProyectosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const proyectos = useAppStore((state) => state.proyectos);
  const clientes = useAppStore((state) => state.clientes);

  const filteredProyectos = proyectos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente?.nombre || 'Desconocido';
  };

  const getCompletedTasks = (checklist: typeof proyectos[0]['checklist']) =>
    checklist.filter((item) => item.completado).length;

  const statusCounts = {
    all: proyectos.length,
    pendiente: proyectos.filter((p) => p.estado === 'pendiente').length,
    en_desarrollo: proyectos.filter((p) => p.estado === 'en_desarrollo').length,
    entregado: proyectos.filter((p) => p.estado === 'entregado').length,
  };

  return (
    <MainLayout
      title="Proyectos"
      subtitle="Gestiona los proyectos en desarrollo"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nuevo Proyecto
          </Button>
        </div>
      }
    >
      {/* Status Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'pendiente', label: 'Pendientes' },
          { key: 'en_desarrollo', label: 'En Desarrollo' },
          { key: 'entregado', label: 'Entregados' },
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => setFilterStatus(status.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status.key
              ? 'bg-syllet-600 text-white shadow-lg shadow-syllet-500/25'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'
              }`}
          >
            {status.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${filterStatus === status.key
              ? 'bg-white/20 text-white'
              : 'bg-zinc-100 text-zinc-500'
              }`}>
              {statusCounts[status.key as keyof typeof statusCounts]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Buscar proyectos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-md"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProyectos.map((proyecto) => (
          <Card key={proyecto.id} hover>
            <CardHeader>
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-zinc-900">{proyecto.nombre}</h3>
                    <Badge variant={getStatusBadgeVariant(proyecto.estado)} size="sm">
                      {getStatusLabel(proyecto.estado)}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-500">{getClienteName(proyecto.clienteId)}</p>
                </div>
                <Badge variant={getPriorityBadgeVariant(proyecto.prioridad)} size="sm">
                  {proyecto.prioridad}
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-zinc-600 mb-4">{proyecto.descripcion}</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-500">Progreso</span>
                  <span className="font-medium text-zinc-900">{proyecto.progreso}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-syllet-500 to-syllet-400 rounded-full transition-all duration-500"
                    style={{ width: `${proyecto.progreso}%` }}
                  />
                </div>
              </div>

              {/* Checklist Summary */}
              {proyecto.checklist.length > 0 && (
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1.5 text-success-600">
                    <CheckCircle2 size={14} />
                    {getCompletedTasks(proyecto.checklist)} completadas
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Circle size={14} />
                    {proyecto.checklist.length - getCompletedTasks(proyecto.checklist)} pendientes
                  </span>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(proyecto.fechaEntregaEstimada)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderKanban size={12} />
                    {formatCurrency(proyecto.presupuesto)}
                  </span>
                </div>
                <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                  <MoreHorizontal size={18} className="text-zinc-400" />
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredProyectos.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-1">No hay proyectos</h3>
          <p className="text-zinc-500">No se encontraron proyectos con los filtros aplicados</p>
        </div>
      )}

      {/* Form Modal */}
      <ProyectoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
