'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import type { UserRole, Department } from '@/types';
import { User, Mail, Phone, Briefcase, Shield } from 'lucide-react';

interface UsuarioFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsuarioForm({ isOpen, onClose }: UsuarioFormProps) {
  const addUsuario = useAppStore((state) => state.addUsuario);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: 'operaciones' as UserRole,
    departamento: 'operaciones' as Department,
    avatar: '',
    activo: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addUsuario(formData);

      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rol: 'operaciones',
        departamento: 'operaciones',
        avatar: '',
        activo: true,
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const rolOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'soporte', label: 'Soporte' },
    { value: 'marketing', label: 'Marketing' },
  ];

  const departamentoOptions = [
    { value: 'direccion', label: 'Dirección' },
    { value: 'ventas', label: 'Ventas' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'soporte', label: 'Soporte' },
    { value: 'finanzas', label: 'Finanzas' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Usuario"
      subtitle="Agrega un nuevo miembro al equipo"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            placeholder="Juan"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            leftIcon={<User size={16} />}
            required
          />

          <Input
            label="Apellido *"
            placeholder="Pérez"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            leftIcon={<User size={16} />}
            required
          />

          <Input
            label="Correo electrónico *"
            type="email"
            placeholder="juan@syllet.com"
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
            label="Rol"
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value as UserRole })}
            options={rolOptions}
          />

          <Select
            label="Departamento"
            value={formData.departamento}
            onChange={(e) => setFormData({ ...formData, departamento: e.target.value as Department })}
            options={departamentoOptions}
          />

          <Input
            label="URL de avatar"
            placeholder="https://..."
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
              Usuario activo
            </label>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <Shield size={16} className="text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Nota sobre contraseñas</p>
              <p className="text-xs text-amber-700">
                Se enviará un correo al usuario con instrucciones para establecer su contraseña.
              </p>
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear Usuario
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
