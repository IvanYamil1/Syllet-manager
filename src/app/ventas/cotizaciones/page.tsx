'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, Avatar } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { CotizacionForm } from '@/components/forms';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Send,
  Download,
  Eye,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function CotizacionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const cotizaciones = useAppStore((state) => state.cotizaciones);
  const prospectos = useAppStore((state) => state.prospectos);

  const filteredCotizaciones = cotizaciones.filter((c) => {
    const prospecto = prospectos.find((p) => p.id === c.prospectoId);
    const matchesSearch =
      c.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospecto?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospecto?.empresa?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'all' || c.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const getProspectoInfo = (prospectoId: string) => {
    const prospecto = prospectos.find((p) => p.id === prospectoId);
    return prospecto || { nombre: 'Desconocido', empresa: '' };
  };

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, { variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'; icon: React.ReactNode }> = {
      borrador: { variant: 'neutral', icon: <FileText size={12} /> },
      enviada: { variant: 'primary', icon: <Send size={12} /> },
      aceptada: { variant: 'success', icon: <CheckCircle size={12} /> },
      rechazada: { variant: 'danger', icon: <XCircle size={12} /> },
      expirada: { variant: 'warning', icon: <Clock size={12} /> },
    };
    return config[estado] || config.borrador;
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      borrador: 'Borrador',
      enviada: 'Enviada',
      aceptada: 'Aceptada',
      rechazada: 'Rechazada',
      expirada: 'Expirada',
    };
    return labels[estado] || estado;
  };

  const getServicioLabel = (servicio: string) => {
    const labels: Record<string, string> = {
      landing_page: 'Landing Page',
      web_basica: 'Web Básica',
      web_profesional: 'Web Profesional',
      ecommerce: 'E-commerce',
      aplicacion: 'Aplicación',
      sistema_medida: 'Sistema a Medida',
    };
    return labels[servicio] || servicio;
  };

  // Stats
  const totalCotizaciones = cotizaciones.length;
  const cotizacionesAceptadas = cotizaciones.filter(c => c.estado === 'aceptada').length;
  const valorTotal = cotizaciones.filter(c => c.estado === 'aceptada').reduce((sum, c) => sum + c.total, 0);
  const tasaConversion = totalCotizaciones > 0 ? (cotizacionesAceptadas / totalCotizaciones * 100).toFixed(0) : '0';

  return (
    <MainLayout
      title="Cotizaciones"
      subtitle="Gestiona tus propuestas comerciales"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nueva Cotización
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-zinc-900">{totalCotizaciones}</p>
            <p className="text-sm text-zinc-500">Total</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-success-600">{cotizacionesAceptadas}</p>
            <p className="text-sm text-zinc-500">Aceptadas</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-syllet-600">{tasaConversion}%</p>
            <p className="text-sm text-zinc-500">Tasa Conversión</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-zinc-900">{formatCurrency(valorTotal)}</p>
            <p className="text-sm text-zinc-500">Valor Cerrado</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar cotizaciones..."
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
          <option value="aceptada">Aceptada</option>
          <option value="rechazada">Rechazada</option>
          <option value="expirada">Expirada</option>
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
                <th>Servicio</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCotizaciones.map((cotizacion) => {
                const estadoConfig = getEstadoBadge(cotizacion.estado);
                const prospecto = getProspectoInfo(cotizacion.prospectoId);
                return (
                  <tr key={cotizacion.id}>
                    <td>
                      <span className="font-mono text-sm font-medium text-syllet-600">
                        {cotizacion.numero}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={prospecto.nombre} size="sm" />
                        <div>
                          <p className="font-medium text-zinc-900">{prospecto.nombre}</p>
                          <p className="text-xs text-zinc-500">{prospecto.empresa}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-zinc-600">
                      {cotizacion.items.length > 0 ? getServicioLabel(cotizacion.items[0].servicioTipo) : '-'}
                    </td>
                    <td className="font-semibold text-zinc-900">
                      {formatCurrency(cotizacion.total)}
                    </td>
                    <td>
                      <Badge variant={estadoConfig.variant} size="sm">
                        <span className="flex items-center gap-1">
                          {estadoConfig.icon}
                          {getEstadoLabel(cotizacion.estado)}
                        </span>
                      </Badge>
                    </td>
                    <td className="text-sm text-zinc-600">
                      {formatDate(cotizacion.fechaCreacion)}
                    </td>
                    <td className="text-sm text-zinc-600">
                      {cotizacion.validezDias} días
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Ver">
                          <Eye size={16} className="text-zinc-400" />
                        </button>
                        <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Descargar PDF">
                          <Download size={16} className="text-zinc-400" />
                        </button>
                        <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Duplicar">
                          <Copy size={16} className="text-zinc-400" />
                        </button>
                        {cotizacion.estado === 'borrador' && (
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

      {/* Form Modal */}
      <CotizacionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
