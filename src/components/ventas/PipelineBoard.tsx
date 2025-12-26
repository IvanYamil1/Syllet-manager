'use client';

import React, { useState } from 'react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui';
import type { Prospecto, PipelineStage } from '@/types';
import { Phone, Mail, DollarSign, GripVertical } from 'lucide-react';

interface PipelineBoardProps {
  prospectos: Prospecto[];
  onProspectoClick?: (prospecto: Prospecto) => void;
  onStageChange?: (prospectoId: string, newStage: PipelineStage) => void;
}

const stageConfig: Record<PipelineStage, { label: string; color: string; bgColor: string; dropBg: string }> = {
  contacto: { label: 'Contacto', color: 'text-blue-600', bgColor: 'bg-blue-50', dropBg: 'bg-blue-100' },
  cotizacion: { label: 'Cotización', color: 'text-amber-600', bgColor: 'bg-amber-50', dropBg: 'bg-amber-100' },
  proceso: { label: 'En Proceso', color: 'text-purple-600', bgColor: 'bg-purple-50', dropBg: 'bg-purple-100' },
  entregado: { label: 'Entregado', color: 'text-green-600', bgColor: 'bg-green-50', dropBg: 'bg-green-100' },
};

const stages: PipelineStage[] = ['contacto', 'cotizacion', 'proceso', 'entregado'];

export function PipelineBoard({ prospectos, onProspectoClick, onStageChange }: PipelineBoardProps) {
  const [draggedProspecto, setDraggedProspecto] = useState<Prospecto | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  const getProspectosByStage = (stage: PipelineStage) =>
    prospectos.filter((p) => p.etapa === stage);

  const getTotalByStage = (stage: PipelineStage) =>
    getProspectosByStage(stage).reduce((sum, p) => sum + p.valorEstimado, 0);

  const handleDragStart = (e: React.DragEvent, prospecto: Prospecto) => {
    setDraggedProspecto(prospecto);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', prospecto.id);
    // Add a slight delay to allow the drag image to be created
    setTimeout(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedProspecto(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    setDragOverStage(null);

    if (draggedProspecto && draggedProspecto.etapa !== stage && onStageChange) {
      onStageChange(draggedProspecto.id, stage);
    }
    setDraggedProspecto(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {stages.map((stage) => {
        const stageProspectos = getProspectosByStage(stage);
        const total = getTotalByStage(stage);
        const config = stageConfig[stage];
        const isDragOver = dragOverStage === stage;

        return (
          <div
            key={stage}
            className={`pipeline-stage min-w-[300px] flex-shrink-0 transition-colors duration-200 ${
              isDragOver ? config.dropBg : ''
            }`}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
          >
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

            {/* Drop zone indicator */}
            {isDragOver && draggedProspecto && draggedProspecto.etapa !== stage && (
              <div className="mb-3 p-3 border-2 border-dashed border-syllet-400 rounded-xl bg-syllet-50 text-center">
                <p className="text-sm text-syllet-600 font-medium">Soltar aquí</p>
              </div>
            )}

            {/* Cards */}
            <div className="space-y-3">
              {stageProspectos.map((prospecto) => (
                <div
                  key={prospecto.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, prospecto)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onProspectoClick?.(prospecto)}
                  className={`pipeline-card cursor-grab active:cursor-grabbing ${
                    draggedProspecto?.id === prospecto.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={16} className="text-zinc-300" />
                  </div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-6">
                      <h4 className="font-medium text-zinc-900 mb-0.5">
                        {prospecto.nombre}
                      </h4>
                      {prospecto.empresa && (
                        <p className="text-xs text-zinc-500">{prospecto.empresa}</p>
                      )}
                    </div>
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

              {stageProspectos.length === 0 && !isDragOver && (
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
