'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Card, CardBody, Badge, Input, Avatar } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { LeadForm } from '@/components/forms';
import { formatRelativeTime } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Users,
  Facebook,
  Chrome,
  Instagram,
  Linkedin,
  Globe,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrigen, setFilterOrigen] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const leads = useAppStore((state) => state.leads);
  const campanas = useAppStore((state) => state.campanas);

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.empresa?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrigen = filterOrigen === 'all' || l.origen === filterOrigen;
    const matchesEstado = filterEstado === 'all' || l.estado === filterEstado;
    return matchesSearch && matchesOrigen && matchesEstado;
  });

  const getCampanaName = (campanaId?: string) => {
    if (!campanaId) return null;
    const campana = campanas.find((c) => c.id === campanaId);
    return campana?.nombre || null;
  };

  const getOrigenIcon = (origen: string) => {
    const icons: Record<string, React.ReactNode> = {
      facebook: <Facebook size={14} className="text-blue-600" />,
      google: <Chrome size={14} className="text-green-600" />,
      instagram: <Instagram size={14} className="text-pink-600" />,
      linkedin: <Linkedin size={14} className="text-sky-600" />,
      organico: <Globe size={14} className="text-zinc-600" />,
      referido: <Users size={14} className="text-purple-600" />,
    };
    return icons[origen] || icons.organico;
  };

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
      nuevo: 'primary',
      contactado: 'warning',
      calificado: 'success',
      descartado: 'danger',
    };
    return config[estado] || 'neutral';
  };

  const getServicioLabel = (servicio: string) => {
    const labels: Record<string, string> = {
      landing_page: 'Landing Page',
      web_basica: 'Web Básica',
      web_profesional: 'Web Profesional',
      ecommerce: 'E-commerce',
      aplicacion: 'Aplicación',
      sistema_medida: 'Sistema a Medida',
    };
    return labels[servicio] || servicio;
  };

  // Stats by origen
  const leadsPorOrigen = {
    facebook: leads.filter(l => l.origen === 'facebook').length,
    google: leads.filter(l => l.origen === 'google').length,
    instagram: leads.filter(l => l.origen === 'instagram').length,
    organico: leads.filter(l => l.origen === 'organico').length,
    referido: leads.filter(l => l.origen === 'referido').length,
  };

  return (
    <MainLayout
      title="Leads"
      subtitle="Gestiona los leads generados por marketing"
      action={
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Filter size={16} />}>
            Filtrar
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsFormOpen(true)}>
            Nuevo Lead
          </Button>
        </div>
      }
    >
      {/* Stats by Source */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(leadsPorOrigen).map(([origen, count]) => (
          <Card key={origen}>
            <CardBody className="flex items-center gap-3 py-4">
              <div className="p-2 rounded-lg bg-zinc-100">
                {getOrigenIcon(origen)}
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-900">{count}</p>
                <p className="text-xs text-zinc-500 capitalize">{origen}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-xs"
        />

        <select
          value={filterOrigen}
          onChange={(e) => setFilterOrigen(e.target.value)}
          className="select max-w-[160px]"
        >
          <option value="all">Todos los orígenes</option>
          <option value="facebook">Facebook</option>
          <option value="google">Google</option>
          <option value="instagram">Instagram</option>
          <option value="organico">Orgánico</option>
          <option value="referido">Referido</option>
        </select>

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="select max-w-[160px]"
        >
          <option value="all">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="contactado">Contactado</option>
          <option value="calificado">Calificado</option>
          <option value="descartado">Descartado</option>
        </select>
      </div>

      {/* Leads Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Contacto</th>
                <th>Origen</th>
                <th>Campaña</th>
                <th>Interés</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={lead.nombre} size="sm" />
                      <div>
                        <p className="font-medium text-zinc-900">{lead.nombre}</p>
                        <p className="text-xs text-zinc-500">{lead.empresa}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Mail size={12} className="text-zinc-400" />
                        {lead.email}
                      </p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Phone size={12} />
                        {lead.telefono}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-2">
                      {getOrigenIcon(lead.origen)}
                      <span className="text-sm capitalize">{lead.origen}</span>
                    </span>
                  </td>
                  <td className="text-sm text-zinc-600">
                    {getCampanaName(lead.campanaId) || '-'}
                  </td>
                  <td>
                    <Badge variant="neutral" size="sm">
                      {getServicioLabel(lead.servicioInteres)}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={getEstadoBadge(lead.estado)} size="sm">
                      {lead.estado}
                    </Badge>
                  </td>
                  <td className="text-sm text-zinc-500">
                    {formatRelativeTime(lead.fechaCreacion)}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                        Convertir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      <LeadForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
}
