'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { CategoriaFinanciera } from '@/types';
import { DollarSign, Calendar, FileText, CreditCard } from 'lucide-react';

interface TransaccionFormProps {
  isOpen: boolean;
  onClose: () => void;
  tipo?: 'ingreso' | 'egreso';
}

export function TransaccionForm({ isOpen, onClose, tipo = 'ingreso' }: TransaccionFormProps) {
  const addTransaccion = useAppStore((state) => state.addTransaccion);
  const clientes = useAppStore((state) => state.clientes);
  const proyectos = useAppStore((state) => state.proyectos);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    tipo: tipo,
    descripcion: '',
    monto: 0,
    categoria: (tipo === 'ingreso' ? 'venta_proyecto' : 'salarios') as CategoriaFinanciera,
    clienteId: '',
    proyectoId: '',
    metodoPago: 'transferencia',
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
    creadoPor: 'user-1', // TODO: Get from auth context
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addTransaccion({
        ...formData,
        fecha: new Date(formData.fecha),
      });

      setFormData({
        tipo: tipo,
        descripcion: '',
        monto: 0,
        categoria: tipo === 'ingreso' ? 'venta_proyecto' : 'salarios',
        clienteId: '',
        proyectoId: '',
        metodoPago: 'transferencia',
        fecha: new Date().toISOString().split('T')[0],
        notas: '',
        creadoPor: 'user-1',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const categoriaIngresoOptions = [
    { value: 'venta_proyecto', label: 'Venta Proyecto' },
    { value: 'servicio_recurrente', label: 'Servicio Recurrente' },
    { value: 'comision', label: 'Comisión' },
    { value: 'otro', label: 'Otro' },
  ];

  const categoriaEgresoOptions = [
    { value: 'salarios', label: 'Salarios' },
    { value: 'oficina', label: 'Oficina' },
    { value: 'publicidad', label: 'Publicidad' },
    { value: 'herramientas', label: 'Herramientas/Software' },
    { value: 'impuestos', label: 'Impuestos' },
    { value: 'otro', label: 'Otro' },
  ];

  const clienteOptions = [
    { value: '', label: 'Sin cliente asociado' },
    ...clientes.map((c) => ({
      value: c.id,
      label: c.empresa ? `${c.nombre} - ${c.empresa}` : c.nombre,
    })),
  ];

  const proyectoOptions = [
    { value: '', label: 'Sin proyecto asociado' },
    ...proyectos.map((p) => ({ value: p.id, label: p.nombre })),
  ];

  const metodoPagoOptions = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia Bancaria' },
    { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'otro', label: 'Otro' },
  ];

  const isIngreso = formData.tipo === 'ingreso';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isIngreso ? 'Nuevo Ingreso' : 'Nuevo Egreso'}
      subtitle={isIngreso ? 'Registra un ingreso de dinero' : 'Registra un gasto o egreso'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Descripción *"
              placeholder={isIngreso ? 'Pago inicial proyecto web' : 'Pago salarios diciembre'}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              leftIcon={<FileText size={16} />}
              required
            />
          </div>

          <Input
            label="Monto *"
            type="number"
            value={formData.monto}
            onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
            leftIcon={<DollarSign size={16} />}
            required
          />

          <Select
            label="Categoría"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaFinanciera })}
            options={isIngreso ? categoriaIngresoOptions : categoriaEgresoOptions}
          />

          {isIngreso && (
            <>
              <Select
                label="Cliente"
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                options={clienteOptions}
              />

              <Select
                label="Proyecto"
                value={formData.proyectoId}
                onChange={(e) => setFormData({ ...formData, proyectoId: e.target.value })}
                options={proyectoOptions}
              />
            </>
          )}

          <Select
            label="Método de pago"
            value={formData.metodoPago}
            onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value as any })}
            options={metodoPagoOptions}
          />

          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            leftIcon={<Calendar size={16} />}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Notas"
            placeholder="Información adicional..."
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
            {isIngreso ? 'Registrar Ingreso' : 'Registrar Egreso'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
