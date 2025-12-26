'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Input } from '@/components/ui';
import { PipelineBoard } from '@/components/ventas/PipelineBoard';
import { ProspectoForm } from '@/components/forms';
import { ProspectoDetailModal } from '@/components/ventas/ProspectoDetailModal';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Plus, Filter, Search, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import type { Prospecto, PipelineStage } from '@/types';

export default function PipelinePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProspecto, setSelectedProspecto] = useState<Prospecto | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const prospectos = useAppStore((state) => state.prospectos);
  const updateProspecto = useAppStore((state) => state.updateProspecto);

  const filteredProspectos = prospectos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular métricas
  const totalValor = prospectos.reduce((sum, p) => sum + p.valorEstimado, 0);
  const valorPonderado = prospectos.reduce(
    (sum, p) => sum + (p.valorEstimado * p.probabilidad) / 100,
    0
  );
  const promedioConversion = prospectos.length > 0
    ? prospectos.reduce((sum, p) => sum + p.probabilidad, 0) / prospectos.length
    : 0;

  const handleProspectoClick = (prospecto: Prospecto) => {
    setSelectedProspecto(prospecto);
    setIsDetailOpen(true);
  };

  const handleStageChange = (prospectoId: string, newStage: PipelineStage) => {
    updateProspecto(prospectoId, {
      etapa: newStage,
      fechaUltimaActualizacion: new Date()
    });
  };

  return (
    <MainLayout
      title="Pipeline de Ventas"
      subtitle="Gestiona tus oportunidades de venta"
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
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-syllet-50">
              <Users size={24} className="text-syllet-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total Prospectos</p>
              <p className="text-2xl font-bold text-zinc-900">{prospectos.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success-50">
              <DollarSign size={24} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Valor Total</p>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(totalValor)}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning-50">
              <TrendingUp size={24} className="text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Valor Ponderado</p>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(valorPonderado)}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50">
              <Target size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Prob. Promedio</p>
              <p className="text-2xl font-bold text-zinc-900">{promedioConversion.toFixed(0)}%</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Buscar por nombre o empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-md"
        />
      </div>

      {/* Pipeline Board */}
      <PipelineBoard
        prospectos={filteredProspectos}
        onProspectoClick={handleProspectoClick}
        onStageChange={handleStageChange}
      />

      {/* Form Modal */}
      <ProspectoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {/* Detail Modal */}
      <ProspectoDetailModal
        prospecto={selectedProspecto}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProspecto(null);
        }}
      />
    </MainLayout>
  );
}
