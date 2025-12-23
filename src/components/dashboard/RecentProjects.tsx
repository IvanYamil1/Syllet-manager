'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Badge, Avatar, getStatusBadgeVariant, getStatusLabel } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Proyecto } from '@/types';
import { ArrowRight, Calendar, DollarSign } from 'lucide-react';

interface RecentProjectsProps {
  projects: Proyecto[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader
        title="Proyectos Activos"
        subtitle="Estado actual de producción"
        action={
          <Link
            href="/operaciones/proyectos"
            className="text-sm text-syllet-600 hover:text-syllet-700 flex items-center gap-1"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        }
      />
      <CardBody className="divide-y divide-zinc-100">
        {projects.map((project) => (
          <div key={project.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-zinc-900 truncate">
                    {project.nombre}
                  </h4>
                  <Badge variant={getStatusBadgeVariant(project.estado)} size="sm">
                    {getStatusLabel(project.estado)}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500 truncate mb-2">
                  {project.descripcion}
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(project.fechaEntregaEstimada)}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={12} />
                    {formatCurrency(project.presupuesto)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <span className="text-sm font-semibold text-zinc-900">
                    {project.progreso}%
                  </span>
                </div>
                <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-syllet-500 to-syllet-400 rounded-full transition-all duration-500"
                    style={{ width: `${project.progreso}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
