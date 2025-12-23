'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { ContenidoForm } from '@/components/forms';
import { formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Video,
  Image,
  Award,
  Briefcase,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MoreHorizontal,
} from 'lucide-react';

export default function ContenidoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const contenidos = useAppStore((state) => state.contenidos);
  const deleteContenido = useAppStore((state) => state.deleteContenido);

  const filteredContenido = contenidos.filter((c) => {
    const matchesSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'all' || c.tipo === filterTipo;
    const matchesEstado = filterEstado === 'all' || c.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, React.ReactNode> = {
      post: <FileText size={20} className="text-blue-500" />,
      video: <Video size={20} className="text-red-500" />,
      articulo: <FileText size={20} className="text-green-500" />,
      caso_exito: <Award size={20} className="text-yellow-500" />,
      material_ventas: <Briefcase size={20} className="text-purple-500" />,
    };
    return icons[tipo] || icons.post;
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      post: 'Post',
      video: 'Video',
      articulo: 'Artículo',
      caso_exito: 'Caso de Éxito',
      material_ventas: 'Material de Ventas',
    };
    return labels[tipo] || tipo;
  };

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
      borrador: 'neutral',
      publicado: 'success',
      archivado: 'warning',
    };
    return config[estado] || 'neutral';
  };

  // Stats
  const totalContenido = contenidos.length;
  const publicados = contenidos.filter(c => c.estado === 'publicado').length;
  const borradores = contenidos.filter(c => c.estado === 'borrador').length;
  const totalVistas = contenidos.reduce((sum, c) => sum + (c.vistas || 0), 0);

  return (
    <MainLayout
      title="Contenido"
      subtitle="Gestiona el contenido de marketing"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nuevo Contenido
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-zinc-900">{totalContenido}</p>
            <p className="text-sm text-zinc-500">Total</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-success-600">{publicados}</p>
            <p className="text-sm text-zinc-500">Publicados</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-warning-600">{borradores}</p>
            <p className="text-sm text-zinc-500">Borradores</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-3xl font-bold text-syllet-600">{totalVistas.toLocaleString()}</p>
            <p className="text-sm text-zinc-500">Vistas Totales</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar contenido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="select max-w-[180px]"
        >
          <option value="all">Todos los tipos</option>
          <option value="post">Post</option>
          <option value="video">Video</option>
          <option value="articulo">Artículo</option>
          <option value="caso_exito">Caso de Éxito</option>
          <option value="material_ventas">Material de Ventas</option>
        </select>

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="select max-w-[160px]"
        >
          <option value="all">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
          <option value="archivado">Archivado</option>
        </select>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContenido.map((contenido) => (
          <Card key={contenido.id} hover>
            <CardBody>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-zinc-100">
                  {getTipoIcon(contenido.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getEstadoBadge(contenido.estado)} size="sm">
                      {contenido.estado}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {getTipoLabel(contenido.tipo)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-zinc-900 line-clamp-2">
                    {contenido.titulo}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                {contenido.descripcion}
              </p>

              <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                <span>{contenido.plataforma}</span>
                {contenido.fechaPublicacion && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(contenido.fechaPublicacion)}
                  </span>
                )}
              </div>

              {contenido.estado === 'publicado' && (
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <span className="flex items-center gap-1 text-sm text-zinc-600">
                    <Eye size={14} />
                    {(contenido.vistas || 0).toLocaleString()} vistas
                  </span>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                      <ExternalLink size={16} className="text-zinc-400" />
                    </button>
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                      <Edit size={16} className="text-zinc-400" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-danger-50 rounded-lg transition-colors"
                      onClick={() => deleteContenido(contenido.id)}
                    >
                      <Trash2 size={16} className="text-zinc-400 hover:text-danger-500" />
                    </button>
                  </div>
                </div>
              )}

              {contenido.estado === 'borrador' && (
                <div className="flex gap-2 pt-4 border-t border-zinc-100">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button size="sm" className="flex-1">
                    Publicar
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredContenido.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-1">No hay contenido</h3>
          <p className="text-zinc-500">No se encontró contenido con los criterios de búsqueda</p>
        </div>
      )}

      {/* Form Modal */}
      <ContenidoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
