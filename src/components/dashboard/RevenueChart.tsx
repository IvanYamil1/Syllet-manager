'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui';
import type { IngresoMensual } from '@/types';

interface RevenueChartProps {
  data: IngresoMensual[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader
        title="Flujo Financiero"
        subtitle="Ingresos vs Egresos mensuales"
      />
      <CardBody className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNeto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5e63f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#5e63f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 12, fill: '#71717a' }}
              axisLine={{ stroke: '#e4e4e7' }}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: '#71717a' }}
              axisLine={{ stroke: '#e4e4e7' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'ingresos' ? 'Ingresos' : name === 'egresos' ? 'Egresos' : 'Neto'
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e4e4e7',
                borderRadius: '12px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend
              formatter={(value) =>
                value === 'ingresos' ? 'Ingresos' : value === 'egresos' ? 'Egresos' : 'Neto'
              }
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIngresos)"
            />
            <Area
              type="monotone"
              dataKey="egresos"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEgresos)"
            />
            <Area
              type="monotone"
              dataKey="neto"
              stroke="#5e63f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNeto)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
