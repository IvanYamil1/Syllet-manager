'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { ServiceType } from '@/types';
import { Package, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface PaqueteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaqueteForm({ isOpen, onClose }: PaqueteFormProps) {
  const addPaquete = useAppStore((state) => state.addPaquete);
  const [isLoading, setIsLoading] = useState(false);
  const [caracteristica, setCaracteristica] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'web_profesional' as ServiceType,
    descripcion: '',
    precio: 0,
    tiempoEntregaDias: 30,
    caracteristicas: [] as string[],
    activo: true,
    popular: false,
  });

  const handleAddCaracteristica = () => {
    if (caracteristica.trim()) {
      setFormData({
        ...formData,
        caracteristicas: [...formData.caracteristicas, caracteristica.trim()],
      });
      setCaracteristica('');
    }
  };

  const handleRemoveCaracteristica = (index: number) => {
    setFormData({
      ...formData,
      caracteristicas: formData.caracteristicas.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addPaquete(formData);

      setFormData({
        nombre: '',
        tipo: 'web_profesional',
        descripcion: '',
        precio: 0,
        tiempoEntregaDias: 30,
        caracteristicas: [],
        activo: true,
        popular: false,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Paquete"
      subtitle="Crea un nuevo paquete de servicios"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nombre del paquete *"
              placeholder="Web Profesional Premium"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              leftIcon={<Package size={16} />}
              required
            />
          </div>

          <Select
            label="Tipo de servicio"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as ServiceType })}
            options={tipoOptions}
          />

          <Input
            label="Precio"
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
            leftIcon={<DollarSign size={16} />}
          />

          <Input
            label="Tiempo de entrega (días)"
            type="number"
            value={formData.tiempoEntregaDias}
            onChange={(e) => setFormData({ ...formData, tiempoEntregaDias: Number(e.target.value) })}
            leftIcon={<Clock size={16} />}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 text-syllet-600 rounded focus:ring-syllet-500"
            />
            <label htmlFor="activo" className="text-sm text-zinc-700">
              Paquete activo (visible para cotizaciones)
            </label>
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            label="Descripción"
            placeholder="Describe el paquete y qué incluye..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={2}
          />
        </div>

        <div className="mt-4">
          <label className="input-label">Características incluidas</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Ej: Diseño responsivo"
              value={caracteristica}
              onChange={(e) => setCaracteristica(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCaracteristica())}
            />
            <Button type="button" variant="secondary" onClick={handleAddCaracteristica}>
              Agregar
            </Button>
          </div>

          {formData.caracteristicas.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.caracteristicas.map((car, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-zinc-50 px-3 py-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">{car}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCaracteristica(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear Paquete
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
