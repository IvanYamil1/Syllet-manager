'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { ServiceType, ProjectStatus } from '@/types';
import { FolderKanban, DollarSign, Calendar, Users } from 'lucide-react';

interface ProyectoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProyectoForm({ isOpen, onClose }: ProyectoFormProps) {
  const addProyecto = useAppStore((state) => state.addProyecto);
  const clientes = useAppStore((state) => state.clientes);
  const usuarios = useAppStore((state) => state.usuarios);
  const desarrolladores = usuarios.filter((u) => u.departamento === 'operaciones');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    clienteId: clientes[0]?.id || '',
    tipo: 'web_profesional' as ServiceType,
    descripcion: '',
    estado: 'pendiente' as ProjectStatus,
    desarrolladorId: desarrolladores[0]?.id || '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaEntregaEstimada: '',
    presupuesto: 45000,
    prioridad: 'media' as 'baja' | 'media' | 'alta' | 'urgente',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addProyecto({
        ...formData,
        fechaInicio: new Date(formData.fechaInicio),
        fechaEntregaEstimada: new Date(formData.fechaEntregaEstimada),
        desarrolladores: formData.desarrolladorId ? [formData.desarrolladorId] : [],
      });

      setFormData({
        nombre: '',
        clienteId: clientes[0]?.id || '',
        tipo: 'web_profesional',
        descripcion: '',
        estado: 'pendiente',
        desarrolladorId: desarrolladores[0]?.id || '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaEntregaEstimada: '',
        presupuesto: 45000,
        prioridad: 'media',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const tipoOptions = [
    { value: 'landing_page', label: 'Landing Page' },
    { value: 'web_basica', label: 'Web Básica' },
    { value: 'web_profesional', label: 'Web Profesional' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'aplicacion', label: 'Aplicación' },
    { value: 'sistema_medida', label: 'Sistema a Medida' },
  ];

  const clienteOptions = clientes.map((c) => ({
    value: c.id,
    label: c.empresa ? `${c.nombre} - ${c.empresa}` : c.nombre,
  }));

  const desarrolladorOptions = desarrolladores.map((d) => ({
    value: d.id,
    label: `${d.nombre} ${d.apellido}`,
  }));

  const prioridadOptions = [
    { value: 'baja', label: 'Baja' },
    { value: 'media', label: 'Media' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Proyecto"
      subtitle="Crea un nuevo proyecto de desarrollo"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nombre del proyecto *"
              placeholder="Página Web para Restaurante X"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              leftIcon={<FolderKanban size={16} />}
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
            label="Tipo de proyecto"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as ServiceType })}
            options={tipoOptions}
          />

          <Select
            label="Desarrollador asignado"
            value={formData.desarrolladorId}
            onChange={(e) => setFormData({ ...formData, desarrolladorId: e.target.value })}
            options={desarrolladorOptions}
          />

          <Select
            label="Prioridad"
            value={formData.prioridad}
            onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as any })}
            options={prioridadOptions}
          />

          <Input
            label="Fecha de inicio"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
            leftIcon={<Calendar size={16} />}
          />

          <Input
            label="Fecha de entrega estimada *"
            type="date"
            value={formData.fechaEntregaEstimada}
            onChange={(e) => setFormData({ ...formData, fechaEntregaEstimada: e.target.value })}
            leftIcon={<Calendar size={16} />}
            required
          />

          <Input
            label="Presupuesto"
            type="number"
            value={formData.presupuesto}
            onChange={(e) => setFormData({ ...formData, presupuesto: Number(e.target.value) })}
            leftIcon={<DollarSign size={16} />}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Descripción"
            placeholder="Describe el proyecto, requerimientos principales..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
          />
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear Proyecto
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
