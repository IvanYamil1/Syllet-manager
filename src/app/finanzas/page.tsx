'use client';

import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Badge, Input } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Plus,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CreditCard,
} from 'lucide-react';

export default function FinanzasPage() {
  const [periodo, setPeriodo] = useState('mes');

  // Obtener datos del store
  const transacciones = useAppStore((state) => state.transacciones);

  const ingresos = transacciones.filter((t) => t.tipo === 'ingreso');
  const egresos = transacciones.filter((t) => t.tipo === 'egreso');

  const totalIngresos = ingresos.reduce((sum, t) => sum + t.monto, 0);
  const totalEgresos = egresos.reduce((sum, t) => sum + t.monto, 0);
  const balance = totalIngresos - totalEgresos;

  // Calcular ingresos por mes dinámicamente
  const ingresosPorMes = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthName = month.toLocaleDateString('es-MX', { month: 'short' });

      const ingresosM = transacciones
        .filter(t => {
          const fecha = new Date(t.fecha);
          return t.tipo === 'ingreso' &&
            fecha.getMonth() === month.getMonth() &&
            fecha.getFullYear() === month.getFullYear();
        })
        .reduce((sum, t) => sum + t.monto, 0);

      const egresosM = transacciones
        .filter(t => {
          const fecha = new Date(t.fecha);
          return t.tipo === 'egreso' &&
            fecha.getMonth() === month.getMonth() &&
            fecha.getFullYear() === month.getFullYear();
        })
        .reduce((sum, t) => sum + t.monto, 0);

      data.push({
        mes: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        ingresos: ingresosM,
        egresos: egresosM,
        neto: ingresosM - egresosM,
      });
    }
    return data;
  }, [transacciones]);

  // Calcular distribución de ingresos por categoría
  const pieData = useMemo(() => {
    const byCategory: Record<string, number> = {};
    ingresos.forEach(t => {
      const cat = t.categoria || 'otros';
      byCategory[cat] = (byCategory[cat] || 0) + t.monto;
    });
    const colors = ['#5e63f1', '#10b981', '#f59e0b', '#8b5cf6'];
    return Object.entries(byCategory).map(([name, value], idx) => ({
      name: name.replace('_', ' '),
      value,
      color: colors[idx % colors.length],
    }));
  }, [ingresos]);

  // Calcular distribución de egresos por categoría
  const egresosData = useMemo(() => {
    const byCategory: Record<string, number> = {};
    egresos.forEach(t => {
      const cat = t.categoria || 'otros';
      byCategory[cat] = (byCategory[cat] || 0) + t.monto;
    });
    const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#6b7280'];
    return Object.entries(byCategory).map(([name, value], idx) => ({
      name: name.replace('_', ' '),
      value,
      color: colors[idx % colors.length],
    }));
  }, [egresos]);

  return (
    <MainLayout
      title="Finanzas"
      subtitle="Control financiero y reportes"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Download size={16} />}>
            Exportar
          </Button>
          <Button leftIcon={<Plus size={16} />}>
            Nueva Transacción
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

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white border-0">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/20">
                <ArrowUpRight size={24} />
              </div>
              <Badge className="bg-white/20 text-white border-0">
                +16.3%
              </Badge>
            </div>
            <p className="text-success-100 text-sm mb-1">Ingresos</p>
            <p className="text-3xl font-bold">{formatCurrency(totalIngresos)}</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-danger-500 to-danger-600 text-white border-0">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/20">
                <ArrowDownRight size={24} />
              </div>
              <Badge className="bg-white/20 text-white border-0">
                -8.2%
              </Badge>
            </div>
            <p className="text-danger-100 text-sm mb-1">Egresos</p>
            <p className="text-3xl font-bold">{formatCurrency(totalEgresos)}</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-syllet-500 to-syllet-600 text-white border-0">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/20">
                <DollarSign size={24} />
              </div>
              <Badge className="bg-white/20 text-white border-0">
                Balance
              </Badge>
            </div>
            <p className="text-syllet-100 text-sm mb-1">Ganancia Neta</p>
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader title="Flujo de Efectivo" subtitle="Últimos 6 meses" />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ingresosPorMes}>
                <defs>
                  <linearGradient id="colorNeto" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value: number) => [formatCurrency(value), '']}
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
                  fill="url(#colorNeto)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Income Distribution */}
        <Card>
          <CardHeader title="Distribución de Ingresos" subtitle="Por categoría" />
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
                      <p className="text-xs text-zinc-500">{formatCurrency(item.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader
          title="Transacciones Recientes"
          subtitle="Últimos movimientos"
          action={
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Método</th>
                <th className="text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map((transaccion) => (
                <tr key={transaccion.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${transaccion.tipo === 'ingreso'
                        ? 'bg-success-50 text-success-600'
                        : 'bg-danger-50 text-danger-600'
                        }`}>
                        {transaccion.tipo === 'ingreso' ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownRight size={16} />
                        )}
                      </div>
                      <span className="font-medium text-zinc-900">
                        {transaccion.descripcion}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Badge variant="neutral" size="sm">
                      {transaccion.categoria.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="text-zinc-600">
                    {formatDate(transaccion.fecha)}
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-zinc-600">
                      <CreditCard size={14} />
                      {transaccion.metodoPago || 'N/A'}
                    </span>
                  </td>
                  <td className={`text-right font-semibold ${transaccion.tipo === 'ingreso' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                    {transaccion.tipo === 'ingreso' ? '+' : '-'}
                    {formatCurrency(transaccion.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
