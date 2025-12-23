'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter, Button, Input, Select, Textarea } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { FileText, Calendar, Link } from 'lucide-react';

interface ContenidoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContenidoForm({ isOpen, onClose }: ContenidoFormProps) {
  const addContenido = useAppStore((state) => state.addContenido);
  const usuarios = useAppStore((state) => state.usuarios);
  const marketingUsuarios = usuarios.filter((u) => u.departamento === 'marketing' || u.rol === 'admin');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'post' as 'post' | 'video' | 'articulo' | 'caso_exito' | 'material_ventas',
    estado: 'borrador' as 'borrador' | 'publicado' | 'archivado',
    plataforma: '',
    creadorId: marketingUsuarios[0]?.id || 'user-1',
    fechaPublicacion: '',
    url: '',
    descripcion: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addContenido({
        titulo: formData.titulo,
        tipo: formData.tipo,
        estado: formData.estado,
        plataforma: formData.plataforma || undefined,
        creadorId: formData.creadorId,
        fechaPublicacion: formData.fechaPublicacion ? new Date(formData.fechaPublicacion) : undefined,
        url: formData.url || undefined,
        descripcion: formData.descripcion || undefined,
      });

      setFormData({
        titulo: '',
        tipo: 'post',
        estado: 'borrador',
        plataforma: '',
        creadorId: marketingUsuarios[0]?.id || 'user-1',
        fechaPublicacion: '',
        url: '',
        descripcion: '',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const tipoOptions = [
    { value: 'post', label: 'Post' },
    { value: 'video', label: 'Video' },
    { value: 'articulo', label: 'Artículo' },
    { value: 'caso_exito', label: 'Caso de Éxito' },
    { value: 'material_ventas', label: 'Material de Ventas' },
  ];

  const estadoOptions = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'publicado', label: 'Publicado' },
    { value: 'archivado', label: 'Archivado' },
  ];

  const plataformaOptions = [
    { value: '', label: 'Sin plataforma' },
    { value: 'Blog', label: 'Blog' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'Interno', label: 'Interno' },
  ];

  const creadorOptions = marketingUsuarios.map((u) => ({
    value: u.id,
    label: `${u.nombre} ${u.apellido}`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Contenido"
      subtitle="Crea un nuevo contenido de marketing"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Título *"
              placeholder="10 Razones para tener una página web profesional"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              leftIcon={<FileText size={16} />}
              required
            />
          </div>

          <Select
            label="Tipo de contenido"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            options={tipoOptions}
          />

          <Select
            label="Estado"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
            options={estadoOptions}
          />

          <Select
            label="Plataforma"
            value={formData.plataforma}
            onChange={(e) => setFormData({ ...formData, plataforma: e.target.value })}
            options={plataformaOptions}
          />

          <Select
            label="Creador"
            value={formData.creadorId}
            onChange={(e) => setFormData({ ...formData, creadorId: e.target.value })}
            options={creadorOptions}
          />

          <Input
            label="Fecha de publicación"
            type="date"
            value={formData.fechaPublicacion}
            onChange={(e) => setFormData({ ...formData, fechaPublicacion: e.target.value })}
            leftIcon={<Calendar size={16} />}
          />

          <Input
            label="URL (si ya está publicado)"
            placeholder="https://syllet.com/blog/mi-articulo"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            leftIcon={<Link size={16} />}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Descripción"
            placeholder="Resumen del contenido, palabras clave, notas..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
          />
        </div>

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Crear Contenido
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
