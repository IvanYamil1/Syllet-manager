'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { ServiceType } from '@/types';
import { FileText, DollarSign, Calendar, Percent, Plus, Trash2 } from 'lucide-react';

interface CotizacionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormItem {
  descripcion: string;
  servicioTipo: ServiceType;
  cantidad: number;
  precioUnitario: number;
}

export function CotizacionForm({ isOpen, onClose }: CotizacionFormProps) {
  const addCotizacion = useAppStore((state) => state.addCotizacion);
  const prospectos = useAppStore((state) => state.prospectos);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    prospectoId: prospectos[0]?.id || '',
    items: [{ descripcion: '', servicioTipo: 'web_profesional' as ServiceType, cantidad: 1, precioUnitario: 0 }] as FormItem[],
    descuento: 0,
    iva: 16,
    validezDias: 30,
    estado: 'borrador' as const,
    notas: '',
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { descripcion: '', servicioTipo: 'web_profesional', cantidad: 1, precioUnitario: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: keyof FormItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0);
  const descuentoMonto = subtotal * (formData.descuento / 100);
  const baseIva = subtotal - descuentoMonto;
  const ivaMonto = baseIva * (formData.iva / 100);
  const total = baseIva + ivaMonto;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cotizacionItems = formData.items.map((item, index) => ({
        id: `item-${index}`,
        descripcion: item.descripcion,
        servicioTipo: item.servicioTipo,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        total: item.cantidad * item.precioUnitario,
      }));

      addCotizacion({
        prospectoId: formData.prospectoId,
        items: cotizacionItems,
        subtotal,
        descuento: descuentoMonto,
        iva: ivaMonto,
        total,
        estado: formData.estado,
        validezDias: formData.validezDias,
        notas: formData.notas || undefined,
      });

      setFormData({
        prospectoId: prospectos[0]?.id || '',
        items: [{ descripcion: '', servicioTipo: 'web_profesional', cantidad: 1, precioUnitario: 0 }],
        descuento: 0,
        iva: 16,
        validezDias: 30,
        estado: 'borrador',
        notas: '',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const prospectoOptions = prospectos.map((p) => ({
    value: p.id,
    label: p.empresa ? `${p.nombre} - ${p.empresa}` : p.nombre,
  }));

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
      title="Nueva Cotización"
      subtitle="Genera una propuesta comercial"
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            label="Prospecto *"
            value={formData.prospectoId}
            onChange={(e) => setFormData({ ...formData, prospectoId: e.target.value })}
            options={prospectoOptions}
          />

          <Input
            label="Validez (días)"
            type="number"
            value={formData.validezDias}
            onChange={(e) => setFormData({ ...formData, validezDias: Number(e.target.value) })}
            leftIcon={<Calendar size={16} />}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="input-label">Servicios / Productos</label>
            <Button type="button" variant="ghost" size="sm" leftIcon={<Plus size={14} />} onClick={handleAddItem}>
              Agregar
            </Button>
          </div>

          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <Input
                    placeholder="Descripción"
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Select
                    value={item.servicioTipo}
                    onChange={(e) => handleItemChange(index, 'servicioTipo', e.target.value)}
                    options={servicioOptions}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Cant."
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, 'cantidad', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Precio"
                    value={item.precioUnitario}
                    onChange={(e) => handleItemChange(index, 'precioUnitario', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-1">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-zinc-400 hover:text-danger-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Descuento (%)"
            type="number"
            min="0"
            max="100"
            value={formData.descuento}
            onChange={(e) => setFormData({ ...formData, descuento: Number(e.target.value) })}
            leftIcon={<Percent size={16} />}
          />

          <Input
            label="IVA (%)"
            type="number"
            value={formData.iva}
            onChange={(e) => setFormData({ ...formData, iva: Number(e.target.value) })}
            leftIcon={<Percent size={16} />}
          />

          <div className="bg-syllet-50 rounded-lg p-4">
            <p className="text-sm text-zinc-600">Total</p>
            <p className="text-2xl font-bold text-syllet-600">
              ${total.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <Textarea
            label="Notas"
            placeholder="Condiciones especiales, entregables adicionales..."
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
            Crear Cotización
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
