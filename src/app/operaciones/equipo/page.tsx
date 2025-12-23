'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, Avatar } from '@/components/ui';
import { mockUsers, mockProyectos } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  FolderKanban,
  Clock,
  CheckCircle,
  UserCircle,
} from 'lucide-react';

export default function EquipoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('all');

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartamento = filterDepartamento === 'all' || u.departamento === filterDepartamento;
    return matchesSearch && matchesDepartamento;
  });

  const getRolLabel = (rol: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      vendedor: 'Vendedor',
      operaciones: 'Operaciones',
      soporte: 'Soporte',
      marketing: 'Marketing',
    };
    return labels[rol] || rol;
  };

  const getDepartamentoLabel = (departamento: string) => {
    const labels: Record<string, string> = {
      direccion: 'Dirección',
      ventas: 'Ventas',
      operaciones: 'Operaciones',
      soporte: 'Soporte',
      marketing: 'Marketing',
      administracion: 'Administración',
    };
    return labels[departamento] || departamento;
  };

  const getRolBadgeVariant = (rol: string): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' => {
    const variants: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
      admin: 'danger',
      vendedor: 'success',
      operaciones: 'primary',
      soporte: 'warning',
      marketing: 'neutral',
    };
    return variants[rol] || 'neutral';
  };

  // Get projects assigned to user
  const getProjectsForUser = (userId: string) => {
    return mockProyectos.filter(p =>
      p.desarrolladorId === userId || p.desarrolladores.includes(userId)
    );
  };

  // Stats by department
  const usersByDepartment = {
    direccion: mockUsers.filter(u => u.departamento === 'direccion').length,
    ventas: mockUsers.filter(u => u.departamento === 'ventas').length,
    operaciones: mockUsers.filter(u => u.departamento === 'operaciones').length,
    soporte: mockUsers.filter(u => u.departamento === 'soporte').length,
    marketing: mockUsers.filter(u => u.departamento === 'marketing').length,
  };

  return (
    <MainLayout
      title="Equipo"
      subtitle="Gestiona el equipo de trabajo"
      action={
        <Button leftIcon={<Plus size={16} />}>
          Nuevo Miembro
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(usersByDepartment).map(([dept, count]) => (
          <Card key={dept}>
            <CardBody className="text-center py-4">
              <p className="text-2xl font-bold text-zinc-900">{count}</p>
              <p className="text-xs text-zinc-500 capitalize">{getDepartamentoLabel(dept)}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar miembros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterDepartamento}
          onChange={(e) => setFilterDepartamento(e.target.value)}
          className="select max-w-[180px]"
        >
          <option value="all">Todos los departamentos</option>
          <option value="direccion">Dirección</option>
          <option value="ventas">Ventas</option>
          <option value="operaciones">Operaciones</option>
          <option value="soporte">Soporte</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const projects = getProjectsForUser(user.id);
          const activeProjects = projects.filter(p => p.estado === 'en_desarrollo').length;

          return (
            <Card key={user.id} hover>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar name={`${user.nombre} ${user.apellido}`} size="lg" />
                    <div>
                      <h3 className="font-semibold text-zinc-900">
                        {user.nombre} {user.apellido}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {getDepartamentoLabel(user.departamento)}
                      </p>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                    <MoreHorizontal size={18} className="text-zinc-400" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <a
                    href={`mailto:${user.email}`}
                    className="flex items-center gap-2 text-sm text-zinc-600 hover:text-syllet-600 transition-colors"
                  >
                    <Mail size={14} />
                    {user.email}
                  </a>
                  {user.telefono && (
                    <a
                      href={`tel:${user.telefono}`}
                      className="flex items-center gap-2 text-sm text-zinc-600 hover:text-syllet-600 transition-colors"
                    >
                      <Phone size={14} />
                      {user.telefono}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={getRolBadgeVariant(user.rol)} size="sm">
                    {getRolLabel(user.rol)}
                  </Badge>
                  {user.activo ? (
                    <Badge variant="success" size="sm">Activo</Badge>
                  ) : (
                    <Badge variant="danger" size="sm">Inactivo</Badge>
                  )}
                </div>

                {/* Workload */}
                {user.departamento === 'operaciones' && (
                  <div className="pt-4 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <FolderKanban size={14} />
                        Proyectos Activos
                      </span>
                      <span className="font-medium text-zinc-900">{activeProjects}</span>
                    </div>
                    {projects.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {projects.slice(0, 2).map((p) => (
                          <div key={p.id} className="text-xs text-zinc-500 flex items-center justify-between">
                            <span className="truncate">{p.nombre}</span>
                            <span className="text-zinc-400">{p.progreso}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sales stats for vendedores */}
                {user.departamento === 'ventas' && user.metaMensual && (
                  <div className="pt-4 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-zinc-500">Meta Mensual</span>
                      <span className="font-medium text-zinc-900">
                        ${user.metaMensual.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Comisión</span>
                      <span className="font-medium text-zinc-900">
                        {user.comisionPorcentaje}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Last access */}
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                  <span>Miembro desde {formatDate(user.fechaCreacion)}</span>
                  {user.ultimoAcceso && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Activo hoy
                    </span>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
}
