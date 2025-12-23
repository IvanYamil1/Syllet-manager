'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { TicketPriority, TicketStatus } from '@/types';
import { Ticket, AlertCircle } from 'lucide-react';

interface TicketFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TicketForm({ isOpen, onClose }: TicketFormProps) {
  const addTicket = useAppStore((state) => state.addTicket);
  const clientes = useAppStore((state) => state.clientes);
  const proyectos = useAppStore((state) => state.proyectos);
  const usuarios = useAppStore((state) => state.usuarios);
  const soporteUsuarios = usuarios.filter((u) => u.departamento === 'soporte');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    clienteId: clientes[0]?.id || '',
    proyectoId: '',
    asunto: '',
    descripcion: '',
    tipo: 'consulta' as 'bug' | 'mejora' | 'consulta' | 'cambio' | 'otro',
    prioridad: 'media' as TicketPriority,
    estado: 'abierto' as TicketStatus,
    asignadoA: soporteUsuarios[0]?.id || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addTicket(formData);

      setFormData({
        clienteId: clientes[0]?.id || '',
        proyectoId: '',
        asunto: '',
        descripcion: '',
        tipo: 'consulta',
        prioridad: 'media',
        estado: 'abierto',
        asignadoA: soporteUsuarios[0]?.id || '',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const clienteOptions = clientes.map((c) => ({
    value: c.id,
    label: c.empresa ? `${c.nombre} - ${c.empresa}` : c.nombre,
  }));

  const proyectoOptions = [
    { value: '', label: 'Sin proyecto asociado' },
    ...proyectos.map((p) => ({ value: p.id, label: p.nombre })),
  ];

  const tipoOptions = [
    { value: 'bug', label: 'Bug / Error' },
    { value: 'mejora', label: 'Mejora' },
    { value: 'consulta', label: 'Consulta' },
    { value: 'cambio', label: 'Solicitud de Cambio' },
    { value: 'otro', label: 'Otro' },
  ];

  const prioridadOptions = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' },
  ];

  const asignadoOptions = soporteUsuarios.map((u) => ({
    value: u.id,
    label: `${u.nombre} ${u.apellido}`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Ticket"
      subtitle="Registra una solicitud de soporte"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Asunto *"
              placeholder="Describe brevemente el problema o solicitud"
              value={formData.asunto}
              onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
              leftIcon={<Ticket size={16} />}
              required
            />
          </div>

          <Select
            label="Cliente *"
            value={formData.clienteId}
            onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
            options={clienteOptions}
          />

          <Select
            label="Proyecto relacionado"
            value={formData.proyectoId}
            onChange={(e) => setFormData({ ...formData, proyectoId: e.target.value })}
            options={proyectoOptions}
          />

          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            options={tipoOptions}
          />

          <Select
            label="Prioridad"
            value={formData.prioridad}
            onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as TicketPriority })}
            options={prioridadOptions}
          />

          <Select
            label="Asignar a"
            value={formData.asignadoA}
            onChange={(e) => setFormData({ ...formData, asignadoA: e.target.value })}
            options={asignadoOptions}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Descripción *"
            placeholder="Describe detalladamente el problema o solicitud..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={4}
            required
          />
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear Ticket
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
