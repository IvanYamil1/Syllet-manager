'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, Avatar } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { UsuarioForm } from '@/components/forms';
import { formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  UserCheck,
  UserX,
  Key,
} from 'lucide-react';

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const usuarios = useAppStore((state) => state.usuarios);
  const deleteUsuario = useAppStore((state) => state.deleteUsuario);

  const filteredUsers = usuarios.filter((u) => {
    const matchesSearch =
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filterRol === 'all' || u.rol === filterRol;
    const matchesEstado = filterEstado === 'all' ||
      (filterEstado === 'activo' && u.activo) ||
      (filterEstado === 'inactivo' && !u.activo);
    return matchesSearch && matchesRol && matchesEstado;
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

  const getRolBadge = (rol: string): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' => {
    const variants: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
      admin: 'danger',
      vendedor: 'success',
      operaciones: 'primary',
      soporte: 'warning',
      marketing: 'neutral',
    };
    return variants[rol] || 'neutral';
  };

  const getDepartamentoLabel = (departamento: string) => {
    const labels: Record<string, string> = {
      direccion: 'Dirección',
      ventas: 'Ventas',
      operaciones: 'Operaciones',
      soporte: 'Soporte',
      marketing: 'Marketing',
      finanzas: 'Finanzas',
    };
    return labels[departamento] || departamento;
  };

  // Stats
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.activo).length;
  const admins = usuarios.filter(u => u.rol === 'admin').length;

  return (
    <MainLayout
      title="Usuarios"
      subtitle="Gestiona los usuarios del sistema"
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
          Nuevo Usuario
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-zinc-900">{totalUsuarios}</p>
            <p className="text-sm text-zinc-500">Total Usuarios</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-success-600">{usuariosActivos}</p>
            <p className="text-sm text-zinc-500">Activos</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-danger-600">{admins}</p>
            <p className="text-sm text-zinc-500">Administradores</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterRol}
          onChange={(e) => setFilterRol(e.target.value)}
          className="select max-w-[180px]"
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="vendedor">Vendedor</option>
          <option value="operaciones">Operaciones</option>
          <option value="soporte">Soporte</option>
          <option value="marketing">Marketing</option>
        </select>

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="select max-w-[150px]"
        >
          <option value="all">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Contacto</th>
                <th>Departamento</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Miembro desde</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={`${user.nombre} ${user.apellido}`} size="md" />
                      <div>
                        <p className="font-medium text-zinc-900">
                          {user.nombre} {user.apellido}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Mail size={12} className="text-zinc-400" />
                        {user.email}
                      </p>
                      {user.telefono && (
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                          <Phone size={12} />
                          {user.telefono}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="text-zinc-600">
                    {getDepartamentoLabel(user.departamento)}
                  </td>
                  <td>
                    <Badge variant={getRolBadge(user.rol)} size="sm">
                      <Shield size={10} className="mr-1" />
                      {getRolLabel(user.rol)}
                    </Badge>
                  </td>
                  <td>
                    {user.activo ? (
                      <Badge variant="success" size="sm">
                        <UserCheck size={10} className="mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        <UserX size={10} className="mr-1" />
                        Inactivo
                      </Badge>
                    )}
                  </td>
                  <td className="text-sm text-zinc-500">
                    {formatDate(user.fechaCreacion)}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Editar">
                        <Edit size={16} className="text-zinc-400" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Cambiar contraseña">
                        <Key size={16} className="text-zinc-400" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Eliminar"
                        onClick={() => deleteUsuario(user.id)}
                      >
                        <Trash2 size={16} className="text-zinc-400 hover:text-danger-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      <UsuarioForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
