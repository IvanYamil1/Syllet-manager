'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Badge } from '@/components/ui';
import { mockMetricas } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react';

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState('mes');

  const pieData = [
    { name: 'Web Profesional', value: 45, color: '#5e63f1' },
    { name: 'E-commerce', value: 30, color: '#10b981' },
    { name: 'Landing Page', value: 15, color: '#f59e0b' },
    { name: 'Sistemas', value: 10, color: '#8b5cf6' },
  ];

  const egresosData = [
    { categoria: 'Publicidad', monto: 25000 },
    { categoria: 'Salarios', monto: 85000 },
    { categoria: 'Herramientas', monto: 8500 },
    { categoria: 'Oficina', monto: 5000 },
    { categoria: 'Otros', monto: 3500 },
  ];

  const kpis = [
    {
      titulo: 'Margen de Ganancia',
      valor: '62%',
      cambio: '+5.2%',
      tendencia: 'up',
      descripcion: 'vs. mes anterior',
    },
    {
      titulo: 'Ticket Promedio',
      valor: formatCurrency(57000),
      cambio: '+12%',
      tendencia: 'up',
      descripcion: 'Por proyecto',
    },
    {
      titulo: 'Costo por Lead',
      valor: formatCurrency(98),
      cambio: '-8%',
      tendencia: 'down',
      descripcion: 'CPL promedio',
    },
    {
      titulo: 'ROI Marketing',
      valor: '285%',
      cambio: '+15%',
      tendencia: 'up',
      descripcion: 'Retorno inversión',
    },
  ];

  return (
    <MainLayout
      title="Reportes"
      subtitle="Análisis financiero y métricas del negocio"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Calendar size={16} />}>
            Diciembre 2024
          </Button>
          <Button variant="secondary" leftIcon={<Download size={16} />}>
            Exportar PDF
          </Button>
        </div>
      }
    >
      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {['semana', 'mes', 'trimestre', 'año'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${periodo === p
              ? 'bg-syllet-600 text-white shadow-lg shadow-syllet-500/25'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <Card key={kpi.titulo}>
            <CardBody>
              <p className="text-sm text-zinc-500 mb-1">{kpi.titulo}</p>
              <p className="text-2xl font-bold text-zinc-900 mb-2">{kpi.valor}</p>
              <div className="flex items-center gap-1">
                {kpi.tendencia === 'up' ? (
                  <TrendingUp size={14} className="text-success-500" />
                ) : (
                  <TrendingDown size={14} className="text-success-500" />
                )}
                <span className={`text-xs font-medium ${kpi.tendencia === 'up' ? 'text-success-600' : 'text-success-600'
                  }`}>
                  {kpi.cambio}
                </span>
                <span className="text-xs text-zinc-400">{kpi.descripcion}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader
            title="Ingresos vs Egresos"
            subtitle="Comparativa mensual"
            action={<BarChart3 size={20} className="text-zinc-400" />}
          />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMetricas.ingresosPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#71717a' }} />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e4e4e7',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[4, 4, 0, 0]} />
                <Bar dataKey="egresos" fill="#ef4444" name="Egresos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Net Profit Chart */}
        <Card>
          <CardHeader
            title="Ganancia Neta"
            subtitle="Evolución mensual"
            action={<TrendingUp size={20} className="text-zinc-400" />}
          />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMetricas.ingresosPorMes}>
                <defs>
                  <linearGradient id="colorNeto2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5e63f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5e63f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#71717a' }} />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Neto']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e4e4e7',
                    borderRadius: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="neto"
                  stroke="#5e63f1"
                  strokeWidth={2}
                  fill="url(#colorNeto2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Service */}
        <Card>
          <CardHeader
            title="Ingresos por Servicio"
            subtitle="Distribución porcentual"
            action={<PieChartIcon size={20} className="text-zinc-400" />}
          />
          <CardBody className="h-80 flex items-center justify-center">
            <div className="flex items-center gap-8">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <CardHeader
            title="Egresos por Categoría"
            subtitle="Desglose de gastos"
            action={<DollarSign size={20} className="text-zinc-400" />}
          />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={egresosData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <YAxis
                  type="category"
                  dataKey="categoria"
                  tick={{ fontSize: 12, fill: '#71717a' }}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Monto']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e4e4e7',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="monto" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader title="Reportes Disponibles" subtitle="Descarga reportes detallados" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { titulo: 'Reporte Mensual', descripcion: 'Resumen financiero del mes', tipo: 'PDF' },
              { titulo: 'Estado de Resultados', descripcion: 'P&L del período', tipo: 'Excel' },
              { titulo: 'Flujo de Efectivo', descripcion: 'Movimientos de caja', tipo: 'Excel' },
              { titulo: 'Comisiones Detalladas', descripcion: 'Por vendedor y proyecto', tipo: 'PDF' },
              { titulo: 'Proyectos Facturados', descripcion: 'Historial de facturación', tipo: 'Excel' },
              { titulo: 'ROI Campañas', descripcion: 'Rendimiento de marketing', tipo: 'PDF' },
            ].map((reporte) => (
              <div key={reporte.titulo} className="flex items-center gap-4 p-4 border border-zinc-100 rounded-xl hover:border-zinc-200 transition-colors">
                <div className="p-3 rounded-xl bg-zinc-100">
                  <FileText size={20} className="text-zinc-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">{reporte.titulo}</p>
                  <p className="text-xs text-zinc-500">{reporte.descripcion}</p>
                </div>
                <Badge variant="neutral" size="sm">{reporte.tipo}</Badge>
                <Button variant="ghost" size="sm" leftIcon={<Download size={14} />}>
                  Descargar
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </MainLayout>
  );
}
