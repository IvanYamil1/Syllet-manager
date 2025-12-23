'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, Badge, Input, Avatar, getStatusBadgeVariant, getStatusLabel } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { ProspectoForm } from '@/components/forms';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Building,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

export default function ProspectosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtapa, setFilterEtapa] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const prospectos = useAppStore((state) => state.prospectos);
  const usuarios = useAppStore((state) => state.usuarios);
  const deleteProspecto = useAppStore((state) => state.deleteProspecto);

  const filteredProspectos = prospectos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEtapa = filterEtapa === 'all' || p.etapa === filterEtapa;
    return matchesSearch && matchesEtapa;
  });

  const getVendedorName = (vendedorId: string) => {
    const vendedor = usuarios.find((u) => u.id === vendedorId);
    return vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'Desconocido';
  };

  return (
    <MainLayout
      title="Prospectos"
      subtitle="Lista completa de oportunidades de venta"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nuevo Prospecto
          </Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar prospectos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterEtapa}
          onChange={(e) => setFilterEtapa(e.target.value)}
          className="select max-w-[180px]"
        >
          <option value="all">Todas las etapas</option>
          <option value="lead">Lead</option>
          <option value="contacto">Contacto</option>
          <option value="cotizacion">Cotización</option>
          <option value="negociacion">Negociación</option>
          <option value="cierre">Cierre</option>
          <option value="perdido">Perdido</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Prospecto</th>
                <th>Contacto</th>
                <th>Servicio</th>
                <th>Valor Estimado</th>
                <th>Probabilidad</th>
                <th>Etapa</th>
                <th>Vendedor</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProspectos.map((prospecto) => (
                <tr key={prospecto.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={prospecto.nombre} size="sm" />
                      <div>
                        <p className="font-medium text-zinc-900">{prospecto.nombre}</p>
                        {prospecto.empresa && (
                          <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <Building size={10} />
                            {prospecto.empresa}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Mail size={12} className="text-zinc-400" />
                        {prospecto.email}
                      </p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Phone size={12} />
                        {prospecto.telefono}
                      </p>
                    </div>
                  </td>
                  <td>
                    <Badge variant="neutral" size="sm">
                      {prospecto.servicioInteres.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="font-medium text-zinc-900">
                    {formatCurrency(prospecto.valorEstimado)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-syllet-500 rounded-full"
                          style={{ width: `${prospecto.probabilidad}%` }}
                        />
                      </div>
                      <span className="text-sm text-zinc-600">{prospecto.probabilidad}%</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant={getStatusBadgeVariant(prospecto.etapa)} size="sm">
                      {getStatusLabel(prospecto.etapa)}
                    </Badge>
                  </td>
                  <td className="text-sm text-zinc-600">
                    {getVendedorName(prospecto.vendedorId)}
                  </td>
                  <td className="text-sm text-zinc-500">
                    {formatRelativeTime(prospecto.fechaUltimaActualizacion)}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                        <Eye size={16} className="text-zinc-400" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                        <Edit size={16} className="text-zinc-400" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-danger-50 rounded-lg transition-colors"
                        onClick={() => deleteProspecto(prospecto.id)}
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
      <ProspectoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
