'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { LeadSource } from '@/types';
import { User, Building, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClienteForm({ isOpen, onClose }: ClienteFormProps) {
  const addCliente = useAppStore((state) => state.addCliente);
  const usuarios = useAppStore((state) => state.usuarios);
  const vendedores = usuarios.filter((u) => u.rol === 'vendedor');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'México',
    vendedorAsignado: vendedores[0]?.id || '',
    origenLead: 'organico' as LeadSource,
    notas: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addCliente(formData);

      setFormData({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        pais: 'México',
        vendedorAsignado: vendedores[0]?.id || '',
        origenLead: 'organico',
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

  const vendedorOptions = vendedores.map((v) => ({
    value: v.id,
    label: `${v.nombre} ${v.apellido}`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Cliente"
      subtitle="Registra un nuevo cliente"
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

          <Input
            label="Ciudad"
            placeholder="Ciudad de México"
            value={formData.ciudad}
            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
            leftIcon={<MapPin size={16} />}
          />

          <Input
            label="País"
            placeholder="México"
            value={formData.pais}
            onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
            leftIcon={<Globe size={16} />}
          />

          <Select
            label="Vendedor asignado"
            value={formData.vendedorAsignado}
            onChange={(e) => setFormData({ ...formData, vendedorAsignado: e.target.value })}
            options={vendedorOptions}
          />

          <Select
            label="Origen"
            value={formData.origenLead}
            onChange={(e) => setFormData({ ...formData, origenLead: e.target.value as LeadSource })}
            options={origenOptions}
          />
        </div>

        <div className="mt-4">
          <Input
            label="Dirección"
            placeholder="Calle, número, colonia..."
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Notas"
            placeholder="Información adicional sobre el cliente..."
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
            Crear Cliente
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
