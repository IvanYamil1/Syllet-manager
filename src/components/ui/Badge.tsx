'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  ...props
}: BadgeProps) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    neutral: 'badge-neutral',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn('badge', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}

// Mapeos útiles para estados
export function getStatusBadgeVariant(
  status: string
): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' {
  const statusMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
    // Pipeline
    lead: 'neutral',
    contacto: 'primary',
    cotizacion: 'warning',
    negociacion: 'primary',
    cierre: 'success',
    perdido: 'danger',
    // Proyectos
    pendiente: 'neutral',
    en_desarrollo: 'primary',
    en_revision: 'warning',
    entregado: 'success',
    cancelado: 'danger',
    // Tickets
    abierto: 'danger',
    en_progreso: 'primary',
    pendiente_cliente: 'warning',
    resuelto: 'success',
    cerrado: 'neutral',
    // General
    activo: 'success',
    activa: 'success',
    pausado: 'warning',
    pausada: 'warning',
    finalizada: 'neutral',
    borrador: 'neutral',
  };

  return statusMap[status] || 'neutral';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    // Pipeline
    lead: 'Lead',
    contacto: 'Contacto',
    cotizacion: 'Cotización',
    negociacion: 'Negociación',
    cierre: 'Cierre',
    perdido: 'Perdido',
    // Proyectos
    pendiente: 'Pendiente',
    en_desarrollo: 'En Desarrollo',
    en_revision: 'En Revisión',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
    // Tickets
    abierto: 'Abierto',
    en_progreso: 'En Progreso',
    pendiente_cliente: 'Esperando Cliente',
    resuelto: 'Resuelto',
    cerrado: 'Cerrado',
    // General
    activo: 'Activo',
    activa: 'Activa',
    pausado: 'Pausado',
    pausada: 'Pausada',
    finalizada: 'Finalizada',
    borrador: 'Borrador',
  };

  return labels[status] || status;
}

export function getPriorityBadgeVariant(
  priority: string
): 'primary' | 'success' | 'warning' | 'danger' | 'neutral' {
  const priorityMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
    baja: 'neutral',
    media: 'primary',
    alta: 'warning',
    urgente: 'danger',
  };

  return priorityMap[priority] || 'neutral';
}
