'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, Avatar } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { ClienteForm } from '@/components/forms';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const clientes = useAppStore((state) => state.clientes);
  const usuarios = useAppStore((state) => state.usuarios);

  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVendedorName = (vendedorId?: string) => {
    if (!vendedorId) return 'Sin asignar';
    const vendedor = usuarios.find((u) => u.id === vendedorId);
    return vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'Desconocido';
  };

  const getOrigenBadgeVariant = (origen: string) => {
    const map: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
      facebook: 'primary',
      google: 'success',
      instagram: 'warning',
      referido: 'success',
      organico: 'neutral',
    };
    return map[origen] || 'neutral';
  };

  return (
    <MainLayout
      title="Clientes"
      subtitle="Gestiona tu cartera de clientes"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nuevo Cliente
          </Button>
        </div>
      }
    >
      {/* Search and View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-md"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-syllet-100 text-syllet-700' : 'text-zinc-500 hover:bg-zinc-100'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-syllet-100 text-syllet-700' : 'text-zinc-500 hover:bg-zinc-100'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id} hover>
              <CardBody>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={cliente.nombre} size="lg" />
                    <div>
                      <h3 className="font-semibold text-zinc-900">{cliente.nombre}</h3>
                      {cliente.empresa && (
                        <p className="text-sm text-zinc-500 flex items-center gap-1">
                          <Building size={12} />
                          {cliente.empresa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <a
                    href={`mailto:${cliente.email}`}
                    className="flex items-center gap-2 text-sm text-zinc-600 hover:text-syllet-600 transition-colors"
                  >
                    <Mail size={14} />
                    {cliente.email}
                  </a>
                  <a
                    href={`tel:${cliente.telefono}`}
                    className="flex items-center gap-2 text-sm text-zinc-600 hover:text-syllet-600 transition-colors"
                  >
                    <Phone size={14} />
                    {cliente.telefono}
                  </a>
                  {cliente.ciudad && (
                    <p className="flex items-center gap-2 text-sm text-zinc-500">
                      <MapPin size={14} />
                      {cliente.ciudad}, {cliente.pais}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between py-3 border-t border-zinc-100">
                  <div>
                    <p className="text-xs text-zinc-500">Valor Total</p>
                    <p className="font-semibold text-zinc-900">
                      {formatCurrency(cliente.valorTotal)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Proyectos</p>
                    <p className="font-semibold text-zinc-900">{cliente.proyectosActivos}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                  <Badge variant={getOrigenBadgeVariant(cliente.origenLead)} size="sm">
                    {cliente.origenLead}
                  </Badge>
                  <span className="text-xs text-zinc-400">
                    {getVendedorName(cliente.vendedorAsignado)}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Ubicación</th>
                  <th>Vendedor</th>
                  <th>Valor Total</th>
                  <th>Origen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={cliente.nombre} size="sm" />
                        <div>
                          <p className="font-medium text-zinc-900">{cliente.nombre}</p>
                          {cliente.empresa && (
                            <p className="text-xs text-zinc-500">{cliente.empresa}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <p className="text-sm">{cliente.email}</p>
                        <p className="text-xs text-zinc-500">{cliente.telefono}</p>
                      </div>
                    </td>
                    <td className="text-sm text-zinc-600">
                      {cliente.ciudad}, {cliente.pais}
                    </td>
                    <td className="text-sm">
                      {getVendedorName(cliente.vendedorAsignado)}
                    </td>
                    <td className="font-medium">
                      {formatCurrency(cliente.valorTotal)}
                    </td>
                    <td>
                      <Badge variant={getOrigenBadgeVariant(cliente.origenLead)} size="sm">
                        {cliente.origenLead}
                      </Badge>
                    </td>
                    <td>
                      <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                        <ExternalLink size={16} className="text-zinc-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Form Modal */}
      <ClienteForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
