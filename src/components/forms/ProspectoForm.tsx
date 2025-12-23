'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { PipelineStage, ServiceType } from '@/types';
import { User, Building, Mail, Phone, DollarSign, Target } from 'lucide-react';

interface ProspectoFormProps {
  isOpen: boolean;
  onClose: () => void;
  vendedorId?: string;
}

export function ProspectoForm({ isOpen, onClose, vendedorId = '2' }: ProspectoFormProps) {
  const addProspecto = useAppStore((state) => state.addProspecto);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    etapa: 'lead' as PipelineStage,
    valorEstimado: 25000,
    probabilidad: 20,
    servicioInteres: 'web_profesional' as ServiceType,
    notas: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addProspecto({
        ...formData,
        vendedorId,
      });

      // Reset form
      setFormData({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        etapa: 'lead',
        valorEstimado: 25000,
        probabilidad: 20,
        servicioInteres: 'web_profesional',
        notas: '',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const etapaOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'contacto', label: 'Contacto' },
    { value: 'cotizacion', label: 'Cotización' },
    { value: 'negociacion', label: 'Negociación' },
  ];

  const servicioOptions = [
    { value: 'landing_page', label: 'Landing Page' },
    { value: 'web_basica', label: 'Web Básica' },
    { value: 'web_profesional', label: 'Web Profesional' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'aplicacion', label: 'Aplicación' },
    { value: 'sistema_medida', label: 'Sistema a Medida' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Prospecto"
      subtitle="Agrega una nueva oportunidad de venta"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre completo *"
            placeholder="Juan Pérez"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            leftIcon={<User size={16} />}
            required
          />

          <Input
            label="Empresa"
            placeholder="Mi Empresa S.A."
            value={formData.empresa}
            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
            leftIcon={<Building size={16} />}
          />

          <Input
            label="Correo electrónico *"
            type="email"
            placeholder="juan@empresa.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            leftIcon={<Mail size={16} />}
            required
          />

          <Input
            label="Teléfono *"
            placeholder="+52 55 1234 5678"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            leftIcon={<Phone size={16} />}
            required
          />

          <Select
            label="Etapa"
            value={formData.etapa}
            onChange={(e) => setFormData({ ...formData, etapa: e.target.value as PipelineStage })}
            options={etapaOptions}
          />

          <Select
            label="Servicio de interés"
            value={formData.servicioInteres}
            onChange={(e) => setFormData({ ...formData, servicioInteres: e.target.value as ServiceType })}
            options={servicioOptions}
          />

          <Input
            label="Valor estimado"
            type="number"
            placeholder="25000"
            value={formData.valorEstimado}
            onChange={(e) => setFormData({ ...formData, valorEstimado: Number(e.target.value) })}
            leftIcon={<DollarSign size={16} />}
          />

          <div>
            <label className="input-label">Probabilidad de cierre: {formData.probabilidad}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.probabilidad}
              onChange={(e) => setFormData({ ...formData, probabilidad: Number(e.target.value) })}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-syllet-600"
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            label="Notas"
            placeholder="Información adicional sobre el prospecto..."
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            rows={3}
          />
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear Prospecto
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
