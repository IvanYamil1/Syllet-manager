'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Badge, getStatusBadgeVariant, getStatusLabel, getPriorityBadgeVariant } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import type { Ticket } from '@/types';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface RecentTicketsProps {
  tickets: Ticket[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return <AlertCircle size={14} className="text-danger-500" />;
      case 'alta':
        return <AlertCircle size={14} className="text-warning-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader
        title="Tickets Recientes"
        subtitle="Solicitudes de soporte"
        action={
          <Link
            href="/soporte/tickets"
            className="text-sm text-syllet-600 hover:text-syllet-700 flex items-center gap-1"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        }
      />
      <CardBody className="divide-y divide-zinc-100">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getPriorityIcon(ticket.prioridad)}
                  <span className="text-xs text-zinc-400 font-mono">
                    {ticket.numero}
                  </span>
                </div>
                <h4 className="font-medium text-zinc-900 truncate mb-1">
                  {ticket.asunto}
                </h4>
                <p className="text-xs text-zinc-500">
                  {formatRelativeTime(ticket.fechaCreacion)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={getStatusBadgeVariant(ticket.estado)} size="sm">
                  {getStatusLabel(ticket.estado)}
                </Badge>
                <Badge variant={getPriorityBadgeVariant(ticket.prioridad)} size="sm">
                  {ticket.prioridad}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
