'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { PaqueteForm } from '@/components/forms';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  Search,
  Edit,
  Star,
  Check,
  Clock,
  Package,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function PaquetesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const paquetes = useAppStore((state) => state.paquetes);

  const filteredPaquetes = paquetes.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      landing_page: 'Landing Page',
      web_basica: 'Web Básica',
      web_profesional: 'Web Profesional',
      ecommerce: 'E-commerce',
      aplicacion: 'Aplicación',
      sistema_medida: 'Sistema a Medida',
    };
    return labels[tipo] || tipo;
  };

  return (
    <MainLayout
      title="Paquetes y Servicios"
      subtitle="Configura los paquetes disponibles para venta"
      action={
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
          Nuevo Paquete
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Buscar paquetes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-md"
        />
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaquetes.map((paquete) => (
          <Card key={paquete.id} hover className={paquete.popular ? 'ring-2 ring-syllet-500' : ''}>
            <CardBody>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  {paquete.popular && (
                    <Badge variant="primary" size="sm" className="mb-2">
                      <Star size={10} className="mr-1" /> Popular
                    </Badge>
                  )}
                  <h3 className="font-semibold text-lg text-zinc-900">{paquete.nombre}</h3>
                  <p className="text-sm text-zinc-500">{getTipoLabel(paquete.tipo)}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                    <Edit size={16} className="text-zinc-400" />
                  </button>
                  {paquete.activo ? (
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Desactivar">
                      <Eye size={16} className="text-success-500" />
                    </button>
                  ) : (
                    <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors" title="Activar">
                      <EyeOff size={16} className="text-zinc-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-zinc-900">
                    {formatCurrency(paquete.precio)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-600 mb-4">{paquete.descripcion}</p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {paquete.caracteristicas.slice(0, 5).map((caracteristica, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-success-500 flex-shrink-0" />
                    <span className="text-zinc-600">{caracteristica}</span>
                  </div>
                ))}
                {paquete.caracteristicas.length > 5 && (
                  <p className="text-xs text-zinc-400 pl-6">
                    +{paquete.caracteristicas.length - 5} características más
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <span className="flex items-center gap-1 text-sm text-zinc-500">
                  <Clock size={14} />
                  {paquete.tiempoEntregaDias} días
                </span>
                <Badge variant={paquete.activo ? 'success' : 'neutral'} size="sm">
                  {paquete.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredPaquetes.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-1">No hay paquetes</h3>
          <p className="text-zinc-500">No se encontraron paquetes con los criterios de búsqueda</p>
        </div>
      )}

      {/* Form Modal */}
      <PaqueteForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
