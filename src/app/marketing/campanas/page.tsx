'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Badge, Input, getStatusBadgeVariant, getStatusLabel } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { CampanaForm } from '@/components/forms';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Pause,
  Play,
  ExternalLink,
} from 'lucide-react';

export default function CampanasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const campanas = useAppStore((state) => state.campanas);

  const filteredCampanas = campanas.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlatformIcon = (plataforma: string) => {
    const icons: Record<string, string> = {
      facebook: '📘',
      google: '🔍',
      instagram: '📸',
      linkedin: '💼',
    };
    return icons[plataforma] || '📣';
  };

  const getPlatformColor = (plataforma: string) => {
    const colors: Record<string, string> = {
      facebook: 'bg-blue-100 text-blue-700',
      google: 'bg-green-100 text-green-700',
      instagram: 'bg-pink-100 text-pink-700',
      linkedin: 'bg-sky-100 text-sky-700',
    };
    return colors[plataforma] || 'bg-zinc-100 text-zinc-700';
  };

  // Calculate totals
  const totalPresupuesto = campanas.reduce((sum, c) => sum + c.presupuesto, 0);
  const totalGasto = campanas.reduce((sum, c) => sum + c.gastoActual, 0);
  const totalLeads = campanas.reduce((sum, c) => sum + c.leads, 0);
  const totalConversiones = campanas.reduce((sum, c) => sum + c.conversiones, 0);

  return (
    <MainLayout
      title="Campañas de Marketing"
      subtitle="Gestiona tus campañas publicitarias"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nueva Campaña
          </Button>
        </div>
      }
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-syllet-50">
              <DollarSign size={24} className="text-syllet-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Presupuesto Total</p>
              <p className="text-xl font-bold text-zinc-900">{formatCurrency(totalPresupuesto)}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning-50">
              <BarChart3 size={24} className="text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Gasto Actual</p>
              <p className="text-xl font-bold text-zinc-900">{formatCurrency(totalGasto)}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success-50">
              <Users size={24} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Leads Generados</p>
              <p className="text-xl font-bold text-zinc-900">{totalLeads}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50">
              <Target size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Conversiones</p>
              <p className="text-xl font-bold text-zinc-900">{totalConversiones}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Buscar campañas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-md"
        />
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampanas.map((campana) => {
          const gastoPorcentaje = (campana.gastoActual / campana.presupuesto) * 100;

          return (
            <Card key={campana.id} hover>
              <CardHeader>
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-lg text-lg ${getPlatformColor(campana.plataforma)}`}>
                      {getPlatformIcon(campana.plataforma)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-zinc-900">{campana.nombre}</h3>
                      <p className="text-xs text-zinc-500 capitalize">{campana.plataforma} • {campana.tipo}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(campana.estado)} size="sm">
                    {getStatusLabel(campana.estado)}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-zinc-500">Presupuesto</span>
                    <span className="font-medium text-zinc-900">
                      {formatCurrency(campana.gastoActual)} / {formatCurrency(campana.presupuesto)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${gastoPorcentaje > 90 ? 'bg-danger-500' :
                        gastoPorcentaje > 70 ? 'bg-warning-500' : 'bg-success-500'
                        }`}
                      style={{ width: `${Math.min(gastoPorcentaje, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-zinc-900">{campana.leads}</p>
                    <p className="text-xs text-zinc-500">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-zinc-900">{campana.conversiones}</p>
                    <p className="text-xs text-zinc-500">Conversiones</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-zinc-900">{formatCurrency(campana.cpl)}</p>
                    <p className="text-xs text-zinc-500">CPL</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-100">
                  <span>
                    Inicio: {formatDate(campana.fechaInicio)}
                  </span>
                  {campana.fechaFin && (
                    <span>
                      Fin: {formatDate(campana.fechaFin)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {campana.estado === 'activa' ? (
                    <Button variant="secondary" size="sm" className="flex-1" leftIcon={<Pause size={14} />}>
                      Pausar
                    </Button>
                  ) : campana.estado === 'pausada' ? (
                    <Button variant="success" size="sm" className="flex-1" leftIcon={<Play size={14} />}>
                      Reanudar
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="sm" leftIcon={<ExternalLink size={14} />}>
                    Ver
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Form Modal */}
      <CampanaForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
