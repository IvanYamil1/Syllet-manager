'use client';

import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  StatsCard,
  RevenueChart,
  SalesLeaderboard,
  RecentProjects,
  RecentTickets,
} from '@/components/dashboard';
import { ProyectoForm } from '@/components/forms';
import { useAppStore } from '@/lib/store';
import {
  DollarSign,
  FolderKanban,
  Users,
  TrendingUp,
  Target,
  Plus,
  Download,
} from 'lucide-react';

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Obtener datos del store
  const proyectos = useAppStore((state) => state.proyectos);
  const tickets = useAppStore((state) => state.tickets);
  const transacciones = useAppStore((state) => state.transacciones);
  const leads = useAppStore((state) => state.leads);
  const prospectos = useAppStore((state) => state.prospectos);
  const usuarios = useAppStore((state) => state.usuarios);

  // Calcular métricas dinámicamente
  const metricas = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Ingresos del mes actual
    const ingresosMes = transacciones
      .filter(t => {
        const fecha = new Date(t.fecha);
        return t.tipo === 'ingreso' &&
          fecha.getMonth() === currentMonth &&
          fecha.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.monto, 0);

    // Ingresos del mes anterior
    const ingresosMesAnterior = transacciones
      .filter(t => {
        const fecha = new Date(t.fecha);
        return t.tipo === 'ingreso' &&
          fecha.getMonth() === lastMonth &&
          fecha.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + t.monto, 0);

    // Proyectos activos
    const proyectosActivos = proyectos.filter(
      p => p.estado === 'en_desarrollo' || p.estado === 'pendiente'
    ).length;

    // Leads nuevos del mes
    const leadsNuevos = leads.filter(l => {
      const fecha = new Date(l.fechaCreacion);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    }).length;

    // Tasa de conversión (prospectos entregados / total prospectos * 100)
    const prospectosConvertidos = prospectos.filter(p => p.etapa === 'entregado').length;
    const tasaConversion = prospectos.length > 0
      ? (prospectosConvertidos / prospectos.length) * 100
      : 0;

    // Ingresos por mes (últimos 6 meses)
    const ingresosPorMes = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthName = month.toLocaleDateString('es-MX', { month: 'short' });

      const ingresos = transacciones
        .filter(t => {
          const fecha = new Date(t.fecha);
          return t.tipo === 'ingreso' &&
            fecha.getMonth() === month.getMonth() &&
            fecha.getFullYear() === month.getFullYear();
        })
        .reduce((sum, t) => sum + t.monto, 0);

      const egresos = transacciones
        .filter(t => {
          const fecha = new Date(t.fecha);
          return t.tipo === 'egreso' &&
            fecha.getMonth() === month.getMonth() &&
            fecha.getFullYear() === month.getFullYear();
        })
        .reduce((sum, t) => sum + t.monto, 0);

      ingresosPorMes.push({
        mes: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        ingresos,
        egresos,
        neto: ingresos - egresos,
      });
    }

    // Ventas por vendedor
    const vendedores = usuarios.filter(u => u.rol === 'vendedor' || u.rol === 'admin');
    const ventasPorVendedor = vendedores.map(v => {
      const ventasVendedor = prospectos
        .filter(p => p.vendedorId === v.id && p.etapa === 'entregado')
        .reduce((sum, p) => sum + p.valorEstimado, 0);

      return {
        vendedorId: v.id,
        vendedorNombre: `${v.nombre} ${v.apellido}`,
        ventas: ventasVendedor,
        meta: v.metaMensual || 100000,
        comisiones: ventasVendedor * ((v.comisionPorcentaje || 10) / 100),
      };
    }).sort((a, b) => b.ventas - a.ventas);

    return {
      ingresosMes,
      ingresosMesAnterior,
      proyectosActivos,
      leadsNuevos,
      tasaConversion,
      ingresosPorMes,
      ventasPorVendedor,
    };
  }, [transacciones, proyectos, leads, prospectos, usuarios]);

  const activeProjects = proyectos.filter(
    (p) => p.estado === 'en_desarrollo' || p.estado === 'pendiente'
  );
  const openTickets = tickets.filter(
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
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nuevo Proyecto
          </Button>
        </div>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Ingresos del Mes"
          value={metricas.ingresosMes}
          previousValue={metricas.ingresosMesAnterior}
          format="currency"
          icon={<DollarSign size={24} className="text-success-600" />}
          iconBg="bg-success-50"
        />
        <StatsCard
          title="Proyectos Activos"
          value={metricas.proyectosActivos}
          icon={<FolderKanban size={24} className="text-syllet-600" />}
          iconBg="bg-syllet-50"
        />
        <StatsCard
          title="Leads Nuevos"
          value={metricas.leadsNuevos}
          previousValue={0}
          icon={<Users size={24} className="text-warning-600" />}
          iconBg="bg-warning-50"
        />
        <StatsCard
          title="Tasa de Conversión"
          value={metricas.tasaConversion}
          previousValue={0}
          format="percent"
          icon={<Target size={24} className="text-primary-600" />}
          iconBg="bg-syllet-50"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart data={metricas.ingresosPorMes} />
        </div>

        {/* Sales Leaderboard */}
        <div>
          <SalesLeaderboard data={metricas.ventasPorVendedor} />
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

      {/* Form Modal */}
      <ProyectoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
