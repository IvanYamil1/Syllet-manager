'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Badge, Input, Avatar } from '@/components/ui';
import { mockUsers, mockClientes, mockProyectos } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';

// Mock comisiones
const mockComisiones = [
  {
    id: '1',
    vendedorId: '2',
    proyectoId: '1',
    clienteId: '1',
    montoVenta: 45000,
    porcentaje: 10,
    montoComision: 4500,
    estado: 'pagada',
    fechaVenta: new Date('2024-11-20'),
    fechaPago: new Date('2024-12-01'),
  },
  {
    id: '2',
    vendedorId: '3',
    proyectoId: '2',
    clienteId: '2',
    montoVenta: 85000,
    porcentaje: 10,
    montoComision: 8500,
    estado: 'aprobada',
    fechaVenta: new Date('2024-12-01'),
  },
  {
    id: '3',
    vendedorId: '2',
    proyectoId: '3',
    clienteId: '3',
    montoVenta: 120000,
    porcentaje: 10,
    montoComision: 12000,
    estado: 'pendiente',
    fechaVenta: new Date('2024-12-10'),
  },
  {
    id: '4',
    vendedorId: '3',
    proyectoId: '4',
    clienteId: '4',
    montoVenta: 35000,
    porcentaje: 10,
    montoComision: 3500,
    estado: 'pagada',
    fechaVenta: new Date('2024-11-01'),
    fechaPago: new Date('2024-11-15'),
  },
];

export default function ComisionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [filterVendedor, setFilterVendedor] = useState<string>('all');

  const vendedores = mockUsers.filter(u => u.rol === 'vendedor');

  const filteredComisiones = mockComisiones.filter((c) => {
    const vendedor = mockUsers.find(u => u.id === c.vendedorId);
    const matchesSearch = vendedor
      ? `${vendedor.nombre} ${vendedor.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesEstado = filterEstado === 'all' || c.estado === filterEstado;
    const matchesVendedor = filterVendedor === 'all' || c.vendedorId === filterVendedor;
    return (matchesSearch || !searchTerm) && matchesEstado && matchesVendedor;
  });

  const getVendedorName = (vendedorId: string) => {
    const vendedor = mockUsers.find(u => u.id === vendedorId);
    return vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'Desconocido';
  };

  const getClienteName = (clienteId: string) => {
    const cliente = mockClientes.find(c => c.id === clienteId);
    return cliente?.nombre || 'Cliente';
  };

  const getProyectoNombre = (proyectoId: string) => {
    const proyecto = mockProyectos.find(p => p.id === proyectoId);
    return proyecto?.nombre || 'Proyecto';
  };

  const getEstadoBadge = (estado: string): 'success' | 'warning' | 'primary' | 'neutral' => {
    const variants: Record<string, 'success' | 'warning' | 'primary' | 'neutral'> = {
      pendiente: 'warning',
      aprobada: 'primary',
      pagada: 'success',
    };
    return variants[estado] || 'neutral';
  };

  // Stats
  const totalComisiones = mockComisiones.reduce((sum, c) => sum + c.montoComision, 0);
  const comisionesPagadas = mockComisiones.filter(c => c.estado === 'pagada').reduce((sum, c) => sum + c.montoComision, 0);
  const comisionesPendientes = mockComisiones.filter(c => c.estado !== 'pagada').reduce((sum, c) => sum + c.montoComision, 0);

  // Comisiones por vendedor
  const comisionesPorVendedor = vendedores.map(v => ({
    ...v,
    totalComisiones: mockComisiones
      .filter(c => c.vendedorId === v.id)
      .reduce((sum, c) => sum + c.montoComision, 0),
    comisionesPagadas: mockComisiones
      .filter(c => c.vendedorId === v.id && c.estado === 'pagada')
      .reduce((sum, c) => sum + c.montoComision, 0),
  }));

  return (
    <MainLayout
      title="Comisiones"
      subtitle="Control de comisiones por vendedor"
      action={
        <Button variant="secondary" leftIcon={<Download size={16} />}>
          Exportar
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-syllet-500 to-syllet-600 text-white border-0">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={24} />
              <span className="text-syllet-100">Total Comisiones</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalComisiones)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1">
              <CheckCircle size={14} className="text-success-500" /> Pagadas
            </p>
            <p className="text-2xl font-bold text-success-600">{formatCurrency(comisionesPagadas)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1">
              <Clock size={14} className="text-warning-500" /> Pendientes
            </p>
            <p className="text-2xl font-bold text-warning-600">{formatCurrency(comisionesPendientes)}</p>
          </CardBody>
        </Card>
      </div>

      {/* Vendedores Summary */}
      <Card className="mb-6">
        <CardHeader title="Resumen por Vendedor" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comisionesPorVendedor.map((vendedor) => (
              <div key={vendedor.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
                <Avatar name={`${vendedor.nombre} ${vendedor.apellido}`} size="lg" />
                <div className="flex-1">
                  <p className="font-semibold text-zinc-900">{vendedor.nombre} {vendedor.apellido}</p>
                  <p className="text-sm text-zinc-500">Comisión: {vendedor.comisionPorcentaje}%</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-900">{formatCurrency(vendedor.totalComisiones)}</p>
                  <p className="text-xs text-success-600">
                    {formatCurrency(vendedor.comisionesPagadas)} pagado
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterVendedor}
          onChange={(e) => setFilterVendedor(e.target.value)}
          className="select max-w-[180px]"
        >
          <option value="all">Todos los vendedores</option>
          {vendedores.map((v) => (
            <option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>
          ))}
        </select>

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="select max-w-[160px]"
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobada">Aprobada</option>
          <option value="pagada">Pagada</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Proyecto</th>
                <th>Cliente</th>
                <th>Venta</th>
                <th>%</th>
                <th>Comisión</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredComisiones.map((comision) => (
                <tr key={comision.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={getVendedorName(comision.vendedorId)} size="sm" />
                      <span className="font-medium text-zinc-900">{getVendedorName(comision.vendedorId)}</span>
                    </div>
                  </td>
                  <td className="text-zinc-600">{getProyectoNombre(comision.proyectoId)}</td>
                  <td className="text-zinc-600">{getClienteName(comision.clienteId)}</td>
                  <td className="text-zinc-900">{formatCurrency(comision.montoVenta)}</td>
                  <td className="text-zinc-600">{comision.porcentaje}%</td>
                  <td className="font-semibold text-syllet-600">{formatCurrency(comision.montoComision)}</td>
                  <td>
                    <Badge variant={getEstadoBadge(comision.estado)} size="sm">
                      {comision.estado}
                    </Badge>
                  </td>
                  <td className="text-zinc-500">{formatDate(comision.fechaVenta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
