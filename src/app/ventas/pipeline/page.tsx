'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input } from '@/components/ui';
import { PipelineBoard } from '@/components/ventas/PipelineBoard';
import { mockProspectos } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Plus, Filter, Search, TrendingUp, Users, DollarSign, Target } from 'lucide-react';

export default function PipelinePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProspectos = mockProspectos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular métricas
  const totalValor = mockProspectos.reduce((sum, p) => sum + p.valorEstimado, 0);
  const valorPonderado = mockProspectos.reduce(
    (sum, p) => sum + (p.valorEstimado * p.probabilidad) / 100,
    0
  );
  const promedioConversion = mockProspectos.reduce((sum, p) => sum + p.probabilidad, 0) / mockProspectos.length;

  return (
    <MainLayout
      title="Pipeline de Ventas"
      subtitle="Gestiona tus oportunidades de venta"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />}>
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
              <p className="text-2xl font-bold text-zinc-900">{mockProspectos.length}</p>
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
        onProspectoClick={(prospecto) => {
          console.log('Prospecto clicked:', prospecto);
        }}
      />
    </MainLayout>
  );
}
