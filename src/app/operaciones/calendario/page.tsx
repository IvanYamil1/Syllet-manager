'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Badge, Avatar } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
} from 'lucide-react';

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener datos del store
  const proyectos = useAppStore((state) => state.proyectos);
  const clientes = useAppStore((state) => state.clientes);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    // Previous month days
    for (let i = 0; i < startingDay; i++) {
      const prevDate = new Date(year, month, -startingDay + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  // Get events (project deadlines)
  const getEventsForDate = (date: Date) => {
    return proyectos.filter(p => {
      const deadline = new Date(p.fechaEntregaEstimada);
      return deadline.toDateString() === date.toDateString();
    });
  };

  // Upcoming deadlines
  const upcomingDeadlines = proyectos
    .filter(p => new Date(p.fechaEntregaEstimada) >= today && p.estado !== 'entregado')
    .sort((a, b) => new Date(a.fechaEntregaEstimada).getTime() - new Date(b.fechaEntregaEstimada).getTime())
    .slice(0, 5);

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || 'Cliente';
  };

  return (
    <MainLayout
      title="Calendario"
      subtitle="Vista de entregas y fechas límite"
      action={
        <Button leftIcon={<Plus size={16} />}>
          Nuevo Evento
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-semibold text-zinc-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} className="text-zinc-600" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm font-medium text-syllet-600 hover:bg-syllet-50 rounded-lg transition-colors"
                  >
                    Hoy
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} className="text-zinc-600" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-zinc-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const events = getEventsForDate(day.date);
                  const isToday = day.date.toDateString() === today.toDateString();

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[80px] p-2 rounded-lg border transition-colors cursor-pointer
                        ${day.isCurrentMonth ? 'bg-white border-zinc-100' : 'bg-zinc-50/50 border-transparent'}
                        ${isToday ? 'ring-2 ring-syllet-500 border-syllet-500' : ''}
                        hover:border-zinc-200
                      `}
                    >
                      <span className={`
                        text-sm font-medium
                        ${day.isCurrentMonth ? 'text-zinc-900' : 'text-zinc-400'}
                        ${isToday ? 'text-syllet-600' : ''}
                      `}>
                        {day.date.getDate()}
                      </span>

                      {events.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-syllet-100 text-syllet-700 truncate"
                            >
                              {event.nombre}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-[10px] text-zinc-500">
                              +{events.length - 2} más
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader
              title="Próximas Entregas"
              subtitle="Fechas límite cercanas"
            />
            <CardBody className="divide-y divide-zinc-100">
              {upcomingDeadlines.map((proyecto) => {
                const deadline = new Date(proyecto.fechaEntregaEstimada);
                const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={proyecto.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-lg
                        ${daysRemaining <= 3 ? 'bg-danger-50' : daysRemaining <= 7 ? 'bg-warning-50' : 'bg-zinc-100'}
                      `}>
                        <CalendarIcon size={16} className={
                          daysRemaining <= 3 ? 'text-danger-500' : daysRemaining <= 7 ? 'text-warning-500' : 'text-zinc-500'
                        } />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900 text-sm truncate">
                          {proyecto.nombre}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {getClienteName(proyecto.clienteId)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`
                            text-xs font-medium
                            ${daysRemaining <= 3 ? 'text-danger-600' : daysRemaining <= 7 ? 'text-warning-600' : 'text-zinc-600'}
                          `}>
                            {daysRemaining === 0 ? 'Hoy' : daysRemaining === 1 ? 'Mañana' : `${daysRemaining} días`}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {formatDate(proyecto.fechaEntregaEstimada)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {upcomingDeadlines.length === 0 && (
                <div className="text-center py-4 text-zinc-500 text-sm">
                  No hay entregas próximas
                </div>
              )}
            </CardBody>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader title="Leyenda" />
            <CardBody className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-syllet-500" />
                <span className="text-sm text-zinc-600">Entrega de proyecto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-warning-500" />
                <span className="text-sm text-zinc-600">Fecha límite próxima</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-danger-500" />
                <span className="text-sm text-zinc-600">Urgente (3 días o menos)</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
