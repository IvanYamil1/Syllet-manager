'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { TransaccionForm } from '@/components/forms';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Download,
  ArrowDownRight,
  Calendar,
  CreditCard,
} from 'lucide-react';

export default function EgresosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const transacciones = useAppStore((state) => state.transacciones);

  const egresos = transacciones.filter((t) => t.tipo === 'egreso');

  const filteredEgresos = egresos.filter((e) => {
    const matchesSearch = e.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'all' || e.categoria === filterCategoria;
    return matchesSearch && matchesCategoria;
  });

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      salarios: 'Salarios',
      oficina: 'Oficina',
      publicidad: 'Publicidad',
      herramientas: 'Herramientas',
      impuestos: 'Impuestos',
      otro: 'Otro',
    };
    return labels[categoria] || categoria;
  };

  const getCategoriaBadge = (categoria: string): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' => {
    const variants: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
      salarios: 'success',
      publicidad: 'primary',
      herramientas: 'warning',
      oficina: 'neutral',
      impuestos: 'danger',
      otro: 'neutral',
    };
    return variants[categoria] || 'neutral';
  };

  // Stats
  const totalEgresos = egresos.reduce((sum, e) => sum + e.monto, 0);
  const egresoSalarios = egresos.filter(e => e.categoria === 'salarios').reduce((sum, e) => sum + e.monto, 0);
  const egresoOficina = egresos.filter(e => e.categoria === 'oficina').reduce((sum, e) => sum + e.monto, 0);

  return (
    <MainLayout
      title="Egresos"
      subtitle="Control de salidas de dinero"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Download size={16} />}>
            Exportar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Registrar Egreso
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-danger-500 to-danger-600 text-white border-0">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownRight size={24} />
              <span className="text-danger-100">Total Egresos</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalEgresos)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-zinc-500 mb-1">Salarios</p>
            <p className="text-2xl font-bold text-zinc-900">{formatCurrency(egresoSalarios)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-zinc-500 mb-1">Oficina</p>
            <p className="text-2xl font-bold text-zinc-900">{formatCurrency(egresoOficina)}</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar egresos..."
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
          <option value="salarios">Salarios</option>
          <option value="oficina">Oficina</option>
          <option value="publicidad">Publicidad</option>
          <option value="herramientas">Herramientas</option>
          <option value="impuestos">Impuestos</option>
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
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Método de Pago</th>
                <th className="text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {filteredEgresos.map((egreso) => (
                <tr key={egreso.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-danger-50">
                        <ArrowDownRight size={16} className="text-danger-600" />
                      </div>
                      <span className="font-medium text-zinc-900">{egreso.descripcion}</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant={getCategoriaBadge(egreso.categoria)} size="sm">
                      {getCategoriaLabel(egreso.categoria)}
                    </Badge>
                  </td>
                  <td className="text-zinc-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(egreso.fecha)}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-zinc-600">
                      <CreditCard size={14} />
                      {egreso.metodoPago || 'N/A'}
                    </span>
                  </td>
                  <td className="text-right font-semibold text-danger-600">
                    -{formatCurrency(egreso.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      <TransaccionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} tipo="egreso" />
    </MainLayout>
  );
}
