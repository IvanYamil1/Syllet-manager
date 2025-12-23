'use client';

import React from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  StatsCard,
  RevenueChart,
  SalesLeaderboard,
  RecentProjects,
  RecentTickets,
} from '@/components/dashboard';
import { mockMetricas, mockProyectos, mockTickets } from '@/lib/mock-data';
import {
  DollarSign,
  FolderKanban,
  Users,
  TrendingUp,
  Ticket,
  Target,
  Plus,
  Download,
} from 'lucide-react';

export default function DashboardPage() {
  const activeProjects = mockProyectos.filter(
    (p) => p.estado === 'en_desarrollo' || p.estado === 'pendiente'
  );
  const openTickets = mockTickets.filter(
    (t) => t.estado !== 'cerrado' && t.estado !== 'resuelto'
  );

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Bienvenido de vuelta, aquí está el resumen de tu negocio"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Download size={16} />}>
            Exportar
          </Button>
          <Button leftIcon={<Plus size={16} />}>
            Nuevo Proyecto
          </Button>
        </div>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Ingresos del Mes"
          value={mockMetricas.ingresosMes}
          previousValue={mockMetricas.ingresosMesAnterior}
          format="currency"
          icon={<DollarSign size={24} className="text-success-600" />}
          iconBg="bg-success-50"
        />
        <StatsCard
          title="Proyectos Activos"
          value={mockMetricas.proyectosActivos}
          icon={<FolderKanban size={24} className="text-syllet-600" />}
          iconBg="bg-syllet-50"
        />
        <StatsCard
          title="Leads Nuevos"
          value={mockMetricas.leadsNuevos}
          previousValue={18}
          icon={<Users size={24} className="text-warning-600" />}
          iconBg="bg-warning-50"
        />
        <StatsCard
          title="Tasa de Conversión"
          value={mockMetricas.tasaConversion}
          previousValue={10.2}
          format="percent"
          icon={<Target size={24} className="text-primary-600" />}
          iconBg="bg-syllet-50"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart data={mockMetricas.ingresosPorMes} />
        </div>

        {/* Sales Leaderboard */}
        <div>
          <SalesLeaderboard data={mockMetricas.ventasPorVendedor} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={activeProjects} />
        <RecentTickets tickets={openTickets} />
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-8 bg-gradient-to-r from-syllet-600 to-syllet-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              ¿Necesitas ayuda para escalar tu negocio?
            </h3>
            <p className="text-syllet-100 text-sm">
              Accede a reportes detallados, métricas avanzadas y más herramientas
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Ver Reportes
            </Button>
            <Button className="bg-white text-syllet-700 hover:bg-syllet-50">
              Configurar Metas
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
