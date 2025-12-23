'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { Megaphone, DollarSign, Calendar } from 'lucide-react';

interface CampanaFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CampanaForm({ isOpen, onClose }: CampanaFormProps) {
  const addCampana = useAppStore((state) => state.addCampana);
  const usuarios = useAppStore((state) => state.usuarios);
  const marketingUsuarios = usuarios.filter((u) => u.departamento === 'marketing' || u.rol === 'admin');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    plataforma: 'facebook' as 'facebook' | 'google' | 'instagram' | 'linkedin' | 'otro',
    tipo: 'leads' as 'awareness' | 'leads' | 'conversiones' | 'retargeting',
    estado: 'borrador' as 'borrador' | 'activa' | 'pausada' | 'finalizada',
    presupuesto: 10000,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    responsableId: marketingUsuarios[0]?.id || '',
    notas: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addCampana({
        ...formData,
        fechaInicio: new Date(formData.fechaInicio),
        fechaFin: formData.fechaFin ? new Date(formData.fechaFin) : undefined,
      });

      setFormData({
        nombre: '',
        plataforma: 'facebook',
        tipo: 'leads',
        estado: 'borrador',
        presupuesto: 10000,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '',
        responsableId: marketingUsuarios[0]?.id || '',
        notas: '',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const plataformaOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'google', label: 'Google Ads' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'otro', label: 'Otro' },
  ];

  const tipoOptions = [
    { value: 'awareness', label: 'Awareness / Branding' },
    { value: 'leads', label: 'Generación de Leads' },
    { value: 'conversiones', label: 'Conversiones' },
    { value: 'retargeting', label: 'Retargeting' },
  ];

  const estadoOptions = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'activa', label: 'Activa' },
    { value: 'pausada', label: 'Pausada' },
  ];

  const responsableOptions = marketingUsuarios.map((u) => ({
    value: u.id,
    label: `${u.nombre} ${u.apellido}`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Campaña"
      subtitle="Crea una nueva campaña publicitaria"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nombre de la campaña *"
              placeholder="Campaña Navidad 2024"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              leftIcon={<Megaphone size={16} />}
              required
            />
          </div>

          <Select
            label="Plataforma"
            value={formData.plataforma}
            onChange={(e) => setFormData({ ...formData, plataforma: e.target.value as any })}
            options={plataformaOptions}
          />

          <Select
            label="Tipo de campaña"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            options={tipoOptions}
          />

          <Select
            label="Estado inicial"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
            options={estadoOptions}
          />

          <Input
            label="Presupuesto"
            type="number"
            value={formData.presupuesto}
            onChange={(e) => setFormData({ ...formData, presupuesto: Number(e.target.value) })}
            leftIcon={<DollarSign size={16} />}
          />

          <Input
            label="Fecha de inicio *"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
            leftIcon={<Calendar size={16} />}
            required
          />

          <Input
            label="Fecha de fin"
            type="date"
            value={formData.fechaFin}
            onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
            leftIcon={<Calendar size={16} />}
          />

          <Select
            label="Responsable"
            value={formData.responsableId}
            onChange={(e) => setFormData({ ...formData, responsableId: e.target.value })}
            options={responsableOptions}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Notas"
            placeholder="Objetivos, audiencia, creativos..."
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
            Crear Campaña
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
