'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, getStatusBadgeVariant, getStatusLabel, getPriorityBadgeVariant } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { TicketForm } from '@/components/forms';
import { formatRelativeTime } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  MessageSquare,
  Clock,
  User,
  Ticket,
} from 'lucide-react';

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const tickets = useAppStore((state) => state.tickets);
  const clientes = useAppStore((state) => state.clientes);
  const usuarios = useAppStore((state) => state.usuarios);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.estado === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.prioridad === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente?.nombre || 'Desconocido';
  };

  const getAsignadoName = (userId?: string) => {
    if (!userId) return 'Sin asignar';
    const user = usuarios.find((u) => u.id === userId);
    return user ? `${user.nombre} ${user.apellido}` : 'Desconocido';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return <AlertCircle size={16} className="text-danger-500" />;
      case 'alta':
        return <AlertCircle size={16} className="text-warning-500" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      bug: 'bg-red-100 text-red-700',
      mejora: 'bg-blue-100 text-blue-700',
      consulta: 'bg-green-100 text-green-700',
      cambio: 'bg-purple-100 text-purple-700',
      otro: 'bg-zinc-100 text-zinc-700',
    };
    return colors[tipo] || colors.otro;
  };

  return (
    <MainLayout
      title="Tickets de Soporte"
      subtitle="Gestiona las solicitudes de clientes"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nuevo Ticket
          </Button>
        </div>
      }
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-danger-600">
              {tickets.filter((t) => t.estado === 'abierto').length}
            </p>
            <p className="text-sm text-zinc-500">Abiertos</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-syllet-600">
              {tickets.filter((t) => t.estado === 'en_progreso').length}
            </p>
            <p className="text-sm text-zinc-500">En Progreso</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-warning-600">
              {tickets.filter((t) => t.estado === 'pendiente_cliente').length}
            </p>
            <p className="text-sm text-zinc-500">Esperando Cliente</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-success-600">
              {tickets.filter((t) => t.estado === 'resuelto' || t.estado === 'cerrado').length}
            </p>
            <p className="text-sm text-zinc-500">Resueltos</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select max-w-[180px]"
        >
          <option value="all">Todos los estados</option>
          <option value="abierto">Abierto</option>
          <option value="en_progreso">En Progreso</option>
          <option value="pendiente_cliente">Esperando Cliente</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="select max-w-[180px]"
        >
          <option value="all">Todas las prioridades</option>
          <option value="urgente">Urgente</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} hover className="cursor-pointer">
            <CardBody>
              <div className="flex items-start gap-4">
                {/* Priority Icon */}
                <div className="pt-1">
                  {getPriorityIcon(ticket.prioridad) || (
                    <Ticket size={16} className="text-zinc-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-zinc-400">
                          {ticket.numero}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeBadge(ticket.tipo)}`}>
                          {ticket.tipo}
                        </span>
                      </div>
                      <h3 className="font-medium text-zinc-900">{ticket.asunto}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(ticket.estado)} size="sm">
                        {getStatusLabel(ticket.estado)}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(ticket.prioridad)} size="sm">
                        {ticket.prioridad}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-600 mb-3 line-clamp-2">
                    {ticket.descripcion}
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {getClienteName(ticket.clienteId)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatRelativeTime(ticket.fechaCreacion)}
                      </span>
                      {ticket.respuestas.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} />
                          {ticket.respuestas.length} respuesta{ticket.respuestas.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <span>
                      Asignado a: <strong>{getAsignadoName(ticket.asignadoA)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <Ticket size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-1">No hay tickets</h3>
          <p className="text-zinc-500">No se encontraron tickets con los filtros aplicados</p>
        </div>
      )}

      {/* Form Modal */}
      <TicketForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
