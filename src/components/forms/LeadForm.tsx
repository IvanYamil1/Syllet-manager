'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { LeadSource, ServiceType } from '@/types';
import { User, Building, Mail, Phone, Target } from 'lucide-react';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadForm({ isOpen, onClose }: LeadFormProps) {
  const addLead = useAppStore((state) => state.addLead);
  const campanas = useAppStore((state) => state.campanas);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    origen: 'facebook' as LeadSource,
    campanaId: campanas[0]?.id || '',
    servicioInteres: 'web_profesional' as ServiceType,
    estado: 'nuevo' as const,
    notas: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addLead(formData);

      setFormData({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        origen: 'facebook',
        campanaId: campanas[0]?.id || '',
        servicioInteres: 'web_profesional',
        estado: 'nuevo',
        notas: '',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const origenOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'google', label: 'Google' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'referido', label: 'Referido' },
    { value: 'organico', label: 'Orgánico' },
    { value: 'llamada_fria', label: 'Llamada Fría' },
    { value: 'evento', label: 'Evento' },
    { value: 'otro', label: 'Otro' },
  ];

  const campanaOptions = [
    { value: '', label: 'Sin campaña asociada' },
    ...campanas.map((c) => ({ value: c.id, label: c.nombre })),
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
      title="Nuevo Lead"
      subtitle="Registra un nuevo lead de marketing"
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
            label="Teléfono"
            placeholder="+52 55 1234 5678"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            leftIcon={<Phone size={16} />}
          />

          <Select
            label="Origen"
            value={formData.origen}
            onChange={(e) => setFormData({ ...formData, origen: e.target.value as LeadSource })}
            options={origenOptions}
          />

          <Select
            label="Campaña asociada"
            value={formData.campanaId}
            onChange={(e) => setFormData({ ...formData, campanaId: e.target.value })}
            options={campanaOptions}
          />

          <Select
            label="Servicio de interés"
            value={formData.servicioInteres}
            onChange={(e) => setFormData({ ...formData, servicioInteres: e.target.value as ServiceType })}
            options={servicioOptions}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Notas"
            placeholder="Información adicional sobre el lead..."
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
            Crear Lead
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
