'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, CardHeader, Badge, Input } from '@/components/ui';
import {
  Plus,
  Search,
  Book,
  FileText,
  Video,
  HelpCircle,
  ChevronRight,
  Eye,
  ThumbsUp,
  FolderOpen,
  Tag,
} from 'lucide-react';

// Mock KB articles
const mockArticulos = [
  {
    id: '1',
    titulo: 'Cómo actualizar el contenido de tu página web',
    categoria: 'tutoriales',
    descripcion: 'Guía paso a paso para modificar textos e imágenes en tu sitio',
    vistas: 234,
    likes: 45,
    tipo: 'articulo',
  },
  {
    id: '2',
    titulo: 'Configuración de correos corporativos',
    categoria: 'email',
    descripcion: 'Aprende a configurar tu correo en Gmail, Outlook y dispositivos móviles',
    vistas: 189,
    likes: 32,
    tipo: 'articulo',
  },
  {
    id: '3',
    titulo: 'Tutorial: Panel de administración WordPress',
    categoria: 'tutoriales',
    descripcion: 'Video completo sobre cómo usar el panel de WordPress',
    vistas: 567,
    likes: 89,
    tipo: 'video',
  },
  {
    id: '4',
    titulo: 'Preguntas frecuentes sobre hosting',
    categoria: 'hosting',
    descripcion: 'Respuestas a las dudas más comunes sobre tu servicio de hosting',
    vistas: 412,
    likes: 67,
    tipo: 'faq',
  },
  {
    id: '5',
    titulo: 'Guía de SEO básico para tu negocio',
    categoria: 'marketing',
    descripcion: 'Conceptos básicos para mejorar el posicionamiento de tu sitio',
    vistas: 298,
    likes: 54,
    tipo: 'articulo',
  },
  {
    id: '6',
    titulo: 'Cómo agregar productos en tu tienda online',
    categoria: 'ecommerce',
    descripcion: 'Paso a paso para gestionar el catálogo de tu e-commerce',
    vistas: 178,
    likes: 28,
    tipo: 'video',
  },
];

const categorias = [
  { id: 'tutoriales', nombre: 'Tutoriales', icono: <Book size={18} />, count: 2 },
  { id: 'hosting', nombre: 'Hosting', icono: <FolderOpen size={18} />, count: 1 },
  { id: 'email', nombre: 'Correo Electrónico', icono: <FileText size={18} />, count: 1 },
  { id: 'ecommerce', nombre: 'E-commerce', icono: <Tag size={18} />, count: 1 },
  { id: 'marketing', nombre: 'Marketing Digital', icono: <HelpCircle size={18} />, count: 1 },
];

export default function KBPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);

  const filteredArticulos = mockArticulos.filter((a) => {
    const matchesSearch =
      a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !selectedCategoria || a.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, React.ReactNode> = {
      articulo: <FileText size={16} className="text-blue-500" />,
      video: <Video size={16} className="text-red-500" />,
      faq: <HelpCircle size={16} className="text-purple-500" />,
    };
    return icons[tipo] || icons.articulo;
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      articulo: 'Artículo',
      video: 'Video',
      faq: 'FAQ',
    };
    return labels[tipo] || tipo;
  };

  return (
    <MainLayout
      title="Base de Conocimiento"
      subtitle="Recursos y documentación para clientes"
      action={
        <Button leftIcon={<Plus size={16} />}>
          Nuevo Artículo
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <Input
            placeholder="Buscar en la base de conocimiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
            className="text-lg py-4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader title="Categorías" />
            <CardBody className="p-2">
              <button
                onClick={() => setSelectedCategoria(null)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${!selectedCategoria ? 'bg-syllet-50 text-syllet-700' : 'hover:bg-zinc-50'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen size={18} />
                  Todas
                </span>
                <span className="text-sm text-zinc-500">{mockArticulos.length}</span>
              </button>

              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoria(cat.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${selectedCategoria === cat.id ? 'bg-syllet-50 text-syllet-700' : 'hover:bg-zinc-50'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {cat.icono}
                    {cat.nombre}
                  </span>
                  <span className="text-sm text-zinc-500">{cat.count}</span>
                </button>
              ))}
            </CardBody>
          </Card>

          {/* Popular Articles */}
          <Card className="mt-6">
            <CardHeader title="Más Populares" />
            <CardBody className="space-y-3">
              {mockArticulos
                .sort((a, b) => b.vistas - a.vistas)
                .slice(0, 3)
                .map((art) => (
                  <div key={art.id} className="flex items-start gap-2">
                    <span className="text-lg font-bold text-zinc-300">
                      {mockArticulos.indexOf(art) + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 line-clamp-2 hover:text-syllet-600 cursor-pointer">
                        {art.titulo}
                      </p>
                      <p className="text-xs text-zinc-500">{art.vistas} vistas</p>
                    </div>
                  </div>
                ))}
            </CardBody>
          </Card>
        </div>

        {/* Articles List */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-zinc-500">
              {filteredArticulos.length} artículo{filteredArticulos.length !== 1 ? 's' : ''} encontrado{filteredArticulos.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4">
            {filteredArticulos.map((articulo) => (
              <Card key={articulo.id} hover className="cursor-pointer">
                <CardBody>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-zinc-100">
                      {getTipoIcon(articulo.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="neutral" size="sm">
                          {getTipoLabel(articulo.tipo)}
                        </Badge>
                        <Badge variant="primary" size="sm">
                          {categorias.find(c => c.id === articulo.categoria)?.nombre}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-zinc-900 mb-1 hover:text-syllet-600">
                        {articulo.titulo}
                      </h3>
                      <p className="text-sm text-zinc-600 mb-3">
                        {articulo.descripcion}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {articulo.vistas} vistas
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={12} />
                          {articulo.likes} útil
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-zinc-300" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {filteredArticulos.length === 0 && (
            <div className="text-center py-12">
              <Book size={48} className="mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 mb-1">No hay artículos</h3>
              <p className="text-zinc-500">No se encontraron artículos con los criterios de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
