'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, Avatar } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { TransaccionForm } from '@/components/forms';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  Calendar,
  CreditCard,
} from 'lucide-react';

export default function IngresosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const transacciones = useAppStore((state) => state.transacciones);
  const clientes = useAppStore((state) => state.clientes);

  const ingresos = transacciones.filter((t) => t.tipo === 'ingreso');

  const filteredIngresos = ingresos.filter((i) => {
    const matchesSearch = i.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'all' || i.categoria === filterCategoria;
    return matchesSearch && matchesCategoria;
  });

  const getClienteName = (clienteId?: string) => {
    if (!clienteId) return null;
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre;
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      venta_proyecto: 'Venta Proyecto',
      servicio_recurrente: 'Servicio Recurrente',
      comision: 'Comisión',
      otro: 'Otro',
    };
    return labels[categoria] || categoria;
  };

  // Stats
  const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
  const ingresoProyectos = ingresos.filter(i => i.categoria === 'venta_proyecto').reduce((sum, i) => sum + i.monto, 0);
  const ingresoRecurrente = ingresos.filter(i => i.categoria === 'servicio_recurrente').reduce((sum, i) => sum + i.monto, 0);

  return (
    <MainLayout
      title="Ingresos"
      subtitle="Control de entradas de dinero"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Download size={16} />}>
            Exportar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Registrar Ingreso
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white border-0">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpRight size={24} />
              <span className="text-success-100">Total Ingresos</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalIngresos)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-zinc-500 mb-1">Proyectos</p>
            <p className="text-2xl font-bold text-zinc-900">{formatCurrency(ingresoProyectos)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-zinc-500 mb-1">Recurrentes</p>
            <p className="text-2xl font-bold text-zinc-900">{formatCurrency(ingresoRecurrente)}</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar ingresos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="select max-w-[200px]"
        >
          <option value="all">Todas las categorías</option>
          <option value="venta_proyecto">Venta Proyecto</option>
          <option value="servicio_recurrente">Servicio Recurrente</option>
          <option value="comision">Comisión</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cliente</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Método de Pago</th>
                <th className="text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngresos.map((ingreso) => (
                <tr key={ingreso.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success-50">
                        <ArrowUpRight size={16} className="text-success-600" />
                      </div>
                      <span className="font-medium text-zinc-900">{ingreso.descripcion}</span>
                    </div>
                  </td>
                  <td>
                    {ingreso.clienteId ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={getClienteName(ingreso.clienteId) || ''} size="sm" />
                        <span className="text-zinc-600">{getClienteName(ingreso.clienteId)}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-400">-</span>
                    )}
                  </td>
                  <td>
                    <Badge variant="success" size="sm">
                      {getCategoriaLabel(ingreso.categoria)}
                    </Badge>
                  </td>
                  <td className="text-zinc-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(ingreso.fecha)}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-zinc-600">
                      <CreditCard size={14} />
                      {ingreso.metodoPago || 'N/A'}
                    </span>
                  </td>
                  <td className="text-right font-semibold text-success-600">
                    +{formatCurrency(ingreso.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      <TransaccionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} tipo="ingreso" />
    </MainLayout>
  );
}
