'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { Server, DollarSign, Calendar } from 'lucide-react';

interface ServicioRecurrenteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServicioRecurrenteForm({ isOpen, onClose }: ServicioRecurrenteFormProps) {
  const addServicioRecurrente = useAppStore((state) => state.addServicioRecurrente);
  const clientes = useAppStore((state) => state.clientes);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    clienteId: clientes[0]?.id || '',
    tipo: 'hosting' as 'hosting' | 'mantenimiento' | 'soporte' | 'seo' | 'otro',
    nombre: '',
    descripcion: '',
    precioMensual: 500,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaRenovacion: '',
    estado: 'activo' as 'activo' | 'pausado' | 'cancelado' | 'vencido',
    autoRenovar: true,
    notas: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addServicioRecurrente({
        ...formData,
        fechaInicio: new Date(formData.fechaInicio),
        fechaRenovacion: new Date(formData.fechaRenovacion),
      });

      setFormData({
        clienteId: clientes[0]?.id || '',
        tipo: 'hosting',
        nombre: '',
        descripcion: '',
        precioMensual: 500,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaRenovacion: '',
        estado: 'activo',
        autoRenovar: true,
        notas: '',
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

  const tipoOptions = [
    { value: 'hosting', label: 'Hosting' },
    { value: 'mantenimiento', label: 'Mantenimiento Web' },
    { value: 'soporte', label: 'Soporte Técnico' },
    { value: 'seo', label: 'SEO' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'otro', label: 'Otro' },
  ];

  const estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'pausado', label: 'Pausado' },
    { value: 'por_renovar', label: 'Por Renovar' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Servicio Recurrente"
      subtitle="Registra un servicio con cobro periódico"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nombre del servicio *"
              placeholder="Hosting Premium - Plan Empresarial"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              leftIcon={<Server size={16} />}
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
            label="Tipo de servicio"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            options={tipoOptions}
          />

          <Input
            label="Precio mensual"
            type="number"
            value={formData.precioMensual}
            onChange={(e) => setFormData({ ...formData, precioMensual: Number(e.target.value) })}
            leftIcon={<DollarSign size={16} />}
          />

          <Select
            label="Estado"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
            options={estadoOptions}
          />

          <Input
            label="Fecha de inicio"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
            leftIcon={<Calendar size={16} />}
          />

          <Input
            label="Fecha de renovación *"
            type="date"
            value={formData.fechaRenovacion}
            onChange={(e) => setFormData({ ...formData, fechaRenovacion: e.target.value })}
            leftIcon={<Calendar size={16} />}
            required
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Descripción"
            placeholder="Detalles del servicio, recursos incluidos..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={2}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Notas internas"
            placeholder="Información adicional..."
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            rows={2}
          />
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear Servicio
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
