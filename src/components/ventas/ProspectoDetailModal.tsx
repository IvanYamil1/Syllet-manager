'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea, Badge } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Prospecto, PipelineStage, ServiceType } from '@/types';
import {
  User,
  Building,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  TrendingUp,
  MessageSquare,
  Edit3,
  Trash2,
  UserCheck,
  X,
  MapPin,
  Wrench,
} from 'lucide-react';

interface ProspectoDetailModalProps {
  prospecto: Prospecto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProspectoDetailModal({ prospecto, isOpen, onClose }: ProspectoDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateProspecto = useAppStore((state) => state.updateProspecto);
  const deleteProspecto = useAppStore((state) => state.deleteProspecto);
  const convertProspectoToCliente = useAppStore((state) => state.convertProspectoToCliente);
  const usuarios = useAppStore((state) => state.usuarios);
  const vendedores = usuarios.filter((u) => u.rol === 'vendedor' || u.rol === 'admin');

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    direccion: '',
    etapa: 'contacto' as PipelineStage,
    valorEstimado: 0,
    probabilidad: 0,
    servicioInteres: 'web_profesional' as ServiceType,
    notas: '',
    vendedorId: '',
  });

  useEffect(() => {
    if (prospecto) {
      setFormData({
        nombre: prospecto.nombre,
        empresa: prospecto.empresa || '',
        email: prospecto.email,
        telefono: prospecto.telefono,
        direccion: prospecto.direccion || '',
        etapa: prospecto.etapa,
        valorEstimado: prospecto.valorEstimado,
        probabilidad: prospecto.probabilidad,
        servicioInteres: prospecto.servicioInteres,
        notas: prospecto.notas || '',
        vendedorId: prospecto.vendedorId,
      });
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [prospecto]);

  if (!prospecto) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      updateProspecto(prospecto.id, {
        ...formData,
        fechaUltimaActualizacion: new Date(),
      });
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    deleteProspecto(prospecto.id);
    onClose();
  };

  const handleConvertToClient = () => {
    convertProspectoToCliente(prospecto.id);
    onClose();
  };

  const getVendedorName = (vendedorId: string) => {
    const vendedor = usuarios.find((u) => u.id === vendedorId);
    return vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'Sin asignar';
  };

  const etapaOptions = [
    { value: 'contacto', label: 'Contacto' },
    { value: 'cotizacion', label: 'Cotización' },
    { value: 'proceso', label: 'En Proceso' },
    { value: 'entregado', label: 'Entregado' },
  ];

  const servicioOptions = [
    { value: 'landing_page', label: 'Landing Page' },
    { value: 'web_basica', label: 'Web Básica' },
    { value: 'web_profesional', label: 'Web Profesional' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'aplicacion', label: 'Aplicación' },
    { value: 'sistema_medida', label: 'Sistema a Medida' },
  ];

  const vendedorOptions = vendedores.map((v) => ({
    value: v.id,
    label: `${v.nombre} ${v.apellido}`,
  }));

  const getEtapaBadgeVariant = (etapa: PipelineStage) => {
    const variants: Record<PipelineStage, 'neutral' | 'primary' | 'warning' | 'success' | 'danger'> = {
      contacto: 'primary',
      cotizacion: 'warning',
      proceso: 'primary',
      entregado: 'success',
    };
    return variants[etapa];
  };

  const handleSendToMantenimiento = () => {
    // TODO: Implementar lógica para enviar a mantenimiento
    // Por ahora convertimos a cliente y navegamos a mantenimiento
    convertProspectoToCliente(prospecto.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Prospecto' : prospecto.nombre}
      subtitle={isEditing ? 'Modifica la información del prospecto' : prospecto.empresa || 'Sin empresa'}
      size="lg"
    >
      {!isEditing ? (
        // Vista de detalle
        <div className="space-y-6">
          {/* Header con badge de etapa */}
          <div className="flex items-center justify-between">
            <Badge variant={getEtapaBadgeVariant(prospecto.etapa)} size="md">
              {etapaOptions.find((e) => e.value === prospecto.etapa)?.label}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-zinc-900">
                {formatCurrency(prospecto.valorEstimado)}
              </span>
              <span className="text-sm text-zinc-500">({prospecto.probabilidad}% prob.)</span>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-500">Email</p>
                <p className="text-sm font-medium text-zinc-900">{prospecto.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-500">Teléfono</p>
                <p className="text-sm font-medium text-zinc-900">{prospecto.telefono}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User size={18} className="text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-500">Vendedor</p>
                <p className="text-sm font-medium text-zinc-900">{getVendedorName(prospecto.vendedorId)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp size={18} className="text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-500">Servicio de interés</p>
                <p className="text-sm font-medium text-zinc-900">
                  {servicioOptions.find((s) => s.value === prospecto.servicioInteres)?.label}
                </p>
              </div>
            </div>
            {prospecto.direccion && (
              <div className="flex items-center gap-3 col-span-2">
                <MapPin size={18} className="text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-500">Dirección</p>
                  <p className="text-sm font-medium text-zinc-900">{prospecto.direccion}</p>
                </div>
              </div>
            )}
          </div>

          {/* Fechas */}
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Creado: {formatDate(prospecto.fechaCreacion)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Actualizado: {formatDate(prospecto.fechaUltimaActualizacion)}</span>
            </div>
          </div>

          {/* Notas */}
          {prospecto.notas && (
            <div className="p-4 bg-zinc-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700">Notas</span>
              </div>
              <p className="text-sm text-zinc-600">{prospecto.notas}</p>
            </div>
          )}

          {/* Seguimientos */}
          {prospecto.seguimientos && prospecto.seguimientos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-700 mb-3">Historial de seguimientos</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {prospecto.seguimientos.map((seg, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="neutral" size="sm">{seg.tipo}</Badge>
                      <span className="text-xs text-zinc-400">{formatDate(seg.fecha)}</span>
                    </div>
                    <p className="text-zinc-600">{seg.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmación de eliminación */}
          {showDeleteConfirm && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl">
              <p className="text-sm text-danger-700 mb-3">
                ¿Estás seguro de que deseas eliminar este prospecto? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="danger" onClick={handleDelete}>
                  Sí, eliminar
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <ModalFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                {!showDeleteConfirm && (
                  <Button
                    variant="danger"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {prospecto.etapa === 'entregado' && (
                  <Button
                    variant="primary"
                    leftIcon={<Wrench size={16} />}
                    onClick={handleSendToMantenimiento}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Enviar a Mantenimiento
                  </Button>
                )}
                {prospecto.etapa !== 'entregado' && (
                  <Button
                    variant="secondary"
                    leftIcon={<UserCheck size={16} />}
                    onClick={handleConvertToClient}
                  >
                    Convertir a Cliente
                  </Button>
                )}
                <Button leftIcon={<Edit3 size={16} />} onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              </div>
            </div>
          </ModalFooter>
        </div>
      ) : (
        // Vista de edición
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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

            <div className="md:col-span-2">
              <Input
                label="Dirección"
                placeholder="Calle, número, colonia, ciudad"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                leftIcon={<MapPin size={16} />}
              />
            </div>

            <Select
              label="Etapa"
              value={formData.etapa}
              onChange={(e) => setFormData({ ...formData, etapa: e.target.value as PipelineStage })}
              options={etapaOptions}
            />

            <Select
              label="Vendedor asignado"
              value={formData.vendedorId}
              onChange={(e) => setFormData({ ...formData, vendedorId: e.target.value })}
              options={vendedorOptions}
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

            <div className="md:col-span-2">
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
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
