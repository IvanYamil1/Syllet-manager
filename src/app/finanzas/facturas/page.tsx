'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, Avatar } from '@/components/ui';
import { mockClientes } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  Send,
  Eye,
  Printer,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

// Mock facturas
const mockFacturas = [
  {
    id: '1',
    numero: 'FAC-2024-0023',
    clienteId: '1',
    total: 45000,
    estado: 'pagada',
    fechaEmision: new Date('2024-11-20'),
    fechaVencimiento: new Date('2024-12-05'),
    fechaPago: new Date('2024-11-28'),
  },
  {
    id: '2',
    numero: 'FAC-2024-0024',
    clienteId: '2',
    total: 42500,
    estado: 'enviada',
    fechaEmision: new Date('2024-12-01'),
    fechaVencimiento: new Date('2024-12-16'),
  },
  {
    id: '3',
    numero: 'FAC-2024-0025',
    clienteId: '3',
    total: 60000,
    estado: 'pagada',
    fechaEmision: new Date('2024-12-10'),
    fechaVencimiento: new Date('2024-12-25'),
    fechaPago: new Date('2024-12-15'),
  },
  {
    id: '4',
    numero: 'FAC-2024-0026',
    clienteId: '4',
    total: 17500,
    estado: 'vencida',
    fechaEmision: new Date('2024-11-14'),
    fechaVencimiento: new Date('2024-11-29'),
  },
  {
    id: '5',
    numero: 'FAC-2024-0027',
    clienteId: '5',
    total: 27500,
    estado: 'borrador',
    fechaEmision: new Date('2024-12-22'),
    fechaVencimiento: new Date('2025-01-06'),
  },
];

export default function FacturasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');

  const filteredFacturas = mockFacturas.filter((f) => {
    const matchesSearch = f.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'all' || f.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const getClienteName = (clienteId: string) => {
    const cliente = mockClientes.find(c => c.id === clienteId);
    return cliente?.nombre || 'Cliente';
  };

  const getEstadoConfig = (estado: string) => {
    const config: Record<string, { variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'; icon: React.ReactNode }> = {
      borrador: { variant: 'neutral', icon: <FileText size={12} /> },
      enviada: { variant: 'primary', icon: <Send size={12} /> },
      pagada: { variant: 'success', icon: <CheckCircle size={12} /> },
      vencida: { variant: 'danger', icon: <AlertCircle size={12} /> },
      cancelada: { variant: 'neutral', icon: <FileText size={12} /> },
    };
    return config[estado] || config.borrador;
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      borrador: 'Borrador',
      enviada: 'Enviada',
      pagada: 'Pagada',
      vencida: 'Vencida',
      cancelada: 'Cancelada',
    };
    return labels[estado] || estado;
  };

  // Stats
  const totalFacturado = mockFacturas.reduce((sum, f) => sum + f.total, 0);
  const facturasPagedas = mockFacturas.filter(f => f.estado === 'pagada');
  const totalCobrado = facturasPagedas.reduce((sum, f) => sum + f.total, 0);
  const pendienteCobro = mockFacturas.filter(f => f.estado === 'enviada' || f.estado === 'vencida').reduce((sum, f) => sum + f.total, 0);
  const facturasVencidas = mockFacturas.filter(f => f.estado === 'vencida').length;

  return (
    <MainLayout
      title="Facturas"
      subtitle="Gestiona la facturación de clientes"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Download size={16} />}>
            Exportar
          </Button>
          <Button leftIcon={<Plus size={16} />}>
            Nueva Factura
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-zinc-900">{formatCurrency(totalFacturado)}</p>
            <p className="text-sm text-zinc-500">Total Facturado</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-success-600">{formatCurrency(totalCobrado)}</p>
            <p className="text-sm text-zinc-500">Cobrado</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-warning-600">{formatCurrency(pendienteCobro)}</p>
            <p className="text-sm text-zinc-500">Pendiente</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-danger-600">{facturasVencidas}</p>
            <p className="text-sm text-zinc-500">Vencidas</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar facturas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="select max-w-[180px]"
        >
          <option value="all">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="enviada">Enviada</option>
          <option value="pagada">Pagada</option>
          <option value="vencida">Vencida</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Emisión</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th className="text-right">Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.map((factura) => {
                const estadoConfig = getEstadoConfig(factura.estado);
                return (
                  <tr key={factura.id}>
                    <td>
                      <span className="font-mono font-medium text-syllet-600">
                        {factura.numero}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={getClienteName(factura.clienteId)} size="sm" />
                        <span className="text-zinc-700">{getClienteName(factura.clienteId)}</span>
                      </div>
                    </td>
                    <td className="text-zinc-600">{formatDate(factura.fechaEmision)}</td>
                    <td className="text-zinc-600">{formatDate(factura.fechaVencimiento)}</td>
                    <td>
                      <Badge variant={estadoConfig.variant} size="sm">
                        <span className="flex items-center gap-1">
                          {estadoConfig.icon}
                          {getEstadoLabel(factura.estado)}
                        </span>
                      </Badge>
                    </td>
                    <td className="text-right font-semibold text-zinc-900">
                      {formatCurrency(factura.total)}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Ver">
                          <Eye size={16} className="text-zinc-400" />
                        </button>
                        <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Descargar">
                          <Download size={16} className="text-zinc-400" />
                        </button>
                        <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Imprimir">
                          <Printer size={16} className="text-zinc-400" />
                        </button>
                        {factura.estado === 'borrador' && (
                          <button className="p-1.5 hover:bg-syllet-50 rounded-lg transition-colors" title="Enviar">
                            <Send size={16} className="text-syllet-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
