'use client';

import React from 'react';
import { cn, formatCurrency, calcularPorcentajeCambio } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percent';
  icon?: React.ReactNode;
  iconBg?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({
  title,
  value,
  previousValue,
  format = 'number',
  icon,
  iconBg = 'bg-syllet-100',
  trend,
}: StatsCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percent':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('es-MX');
    }
  };

  const percentChange = previousValue && typeof value === 'number'
    ? calcularPorcentajeCambio(value, previousValue)
    : null;

  const determinedTrend = trend || (percentChange !== null
    ? percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral'
    : 'neutral');

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value">{formatValue(value)}</p>
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl', iconBg)}>
            {icon}
          </div>
        )}
      </div>

      {percentChange !== null && (
        <div className={cn(
          'stat-change',
          determinedTrend === 'up' && 'stat-change-up',
          determinedTrend === 'down' && 'stat-change-down',
          determinedTrend === 'neutral' && 'text-zinc-500'
        )}>
          {determinedTrend === 'up' && <TrendingUp size={14} />}
          {determinedTrend === 'down' && <TrendingDown size={14} />}
          {determinedTrend === 'neutral' && <Minus size={14} />}
          <span>
            {Math.abs(percentChange).toFixed(1)}% vs mes anterior
          </span>
        </div>
      )}
    </div>
  );
}
