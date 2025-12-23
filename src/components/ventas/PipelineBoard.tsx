'use client';

import React from 'react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Badge, Avatar } from '@/components/ui';
import type { Prospecto, PipelineStage } from '@/types';
import { Phone, Mail, Calendar, MoreHorizontal, DollarSign } from 'lucide-react';

interface PipelineBoardProps {
  prospectos: Prospecto[];
  onProspectoClick?: (prospecto: Prospecto) => void;
}

const stageConfig: Record<PipelineStage, { label: string; color: string; bgColor: string }> = {
  lead: { label: 'Lead', color: 'text-zinc-600', bgColor: 'bg-zinc-100' },
  contacto: { label: 'Contacto', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  cotizacion: { label: 'Cotización', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  negociacion: { label: 'Negociación', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  cierre: { label: 'Cierre', color: 'text-green-600', bgColor: 'bg-green-50' },
  perdido: { label: 'Perdido', color: 'text-red-600', bgColor: 'bg-red-50' },
};

const stages: PipelineStage[] = ['lead', 'contacto', 'cotizacion', 'negociacion', 'cierre'];

export function PipelineBoard({ prospectos, onProspectoClick }: PipelineBoardProps) {
  const getProspectosByStage = (stage: PipelineStage) =>
    prospectos.filter((p) => p.etapa === stage);

  const getTotalByStage = (stage: PipelineStage) =>
    getProspectosByStage(stage).reduce((sum, p) => sum + p.valorEstimado, 0);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {stages.map((stage) => {
        const stageProspectos = getProspectosByStage(stage);
        const total = getTotalByStage(stage);
        const config = stageConfig[stage];

        return (
          <div key={stage} className="pipeline-stage min-w-[300px] flex-shrink-0">
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${config.color}`}>
                  {config.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                  {stageProspectos.length}
                </span>
              </div>
              <span className="text-sm font-medium text-zinc-500">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {stageProspectos.map((prospecto) => (
                <div
                  key={prospecto.id}
                  onClick={() => onProspectoClick?.(prospecto)}
                  className="pipeline-card"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-zinc-900 mb-0.5">
                        {prospecto.nombre}
                      </h4>
                      {prospecto.empresa && (
                        <p className="text-xs text-zinc-500">{prospecto.empresa}</p>
                      )}
                    </div>
                    <button className="p-1 hover:bg-zinc-100 rounded-lg transition-colors">
                      <MoreHorizontal size={16} className="text-zinc-400" />
                    </button>
                  </div>

                  {/* Value */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-sm font-semibold text-zinc-900">
                      <DollarSign size={14} className="text-success-500" />
                      {formatCurrency(prospecto.valorEstimado)}
                    </div>
                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-syllet-400 to-syllet-600 rounded-full"
                        style={{ width: `${prospecto.probabilidad}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{prospecto.probabilidad}%</span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Phone size={12} />
                      {prospecto.telefono.slice(-4)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      {prospecto.email.split('@')[0]}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <Badge variant="neutral" size="sm">
                      {prospecto.servicioInteres.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-zinc-400">
                      {formatRelativeTime(prospecto.fechaUltimaActualizacion)}
                    </span>
                  </div>
                </div>
              ))}

              {stageProspectos.length === 0 && (
                <div className="text-center py-8 text-zinc-400 text-sm">
                  Sin prospectos
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
