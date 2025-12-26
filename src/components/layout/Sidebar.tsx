'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Megaphone,
  FolderKanban,
  HeadphonesIcon,
  Wallet,
  Settings,
  Package,
  UserCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '@/components/ui';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  children?: { label: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Ventas',
    href: '/ventas',
    icon: <TrendingUp size={20} />,
    roles: ['admin', 'vendedor'],
    children: [
      { label: 'Pipeline', href: '/ventas/pipeline' },
      { label: 'Prospectos', href: '/ventas/prospectos' },
      { label: 'Clientes', href: '/ventas/clientes' },
      { label: 'Cotizaciones', href: '/ventas/cotizaciones' },
    ],
  },
  {
    label: 'Marketing',
    href: '/marketing',
    icon: <Megaphone size={20} />,
    roles: ['admin', 'marketing'],
    children: [
      { label: 'Campañas', href: '/marketing/campanas' },
      { label: 'Leads', href: '/marketing/leads' },
      { label: 'Contenido', href: '/marketing/contenido' },
    ],
  },
  {
    label: 'Operaciones',
    href: '/operaciones',
    icon: <FolderKanban size={20} />,
    roles: ['admin', 'operaciones'],
    children: [
      { label: 'Proyectos', href: '/operaciones/proyectos' },
      { label: 'Calendario', href: '/operaciones/calendario' },
      { label: 'Equipo', href: '/operaciones/equipo' },
    ],
  },
  {
    label: 'Soporte',
    href: '/soporte',
    icon: <HeadphonesIcon size={20} />,
    roles: ['admin', 'soporte'],
    children: [
      { label: 'Tickets', href: '/soporte/tickets' },
      { label: 'Servicios', href: '/soporte/servicios' },
      { label: 'Base de Conocimiento', href: '/soporte/kb' },
    ],
  },
  {
    label: 'Finanzas',
    href: '/finanzas',
    icon: <Wallet size={20} />,
    roles: ['admin'],
    children: [
      { label: 'Ingresos', href: '/finanzas/ingresos' },
      { label: 'Egresos', href: '/finanzas/egresos' },
      { label: 'Facturas', href: '/finanzas/facturas' },
      { label: 'Comisiones', href: '/finanzas/comisiones' },
      { label: 'Reportes', href: '/finanzas/reportes' },
    ],
  },
  {
    label: 'Paquetes',
    href: '/paquetes',
    icon: <Package size={20} />,
    roles: ['admin'],
  },
  {
    label: 'Usuarios',
    href: '/usuarios',
    icon: <Users size={20} />,
    roles: ['admin'],
  },
  {
    label: 'Configuración',
    href: '/configuracion',
    icon: <Settings size={20} />,
    roles: ['admin'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // Determinar qué categoría padre está activa basándose en el pathname actual
  const getActiveParentCategory = React.useCallback(() => {
    const parentItem = navigation.find(item =>
      item.children && pathname.startsWith(item.href)
    );
    return parentItem?.label || null;
  }, [pathname]);

  // Efecto para auto-expandir la categoría activa cuando cambia el pathname
  React.useEffect(() => {
    const activeCategory = getActiveParentCategory();
    if (activeCategory && !expandedItems.includes(activeCategory)) {
      setExpandedItems(prev => [...prev, activeCategory]);
    }
  }, [pathname, getActiveParentCategory]);

  const toggleExpand = (label: string) => {
    const clickedItem = navigation.find(item => item.label === label);
    const activeCategory = getActiveParentCategory();

    // Si el item clickeado tiene hijos
    if (clickedItem?.children) {
      setExpandedItems(prev => {
        // Si ya está expandido, lo contraemos (pero solo si no estamos en una de sus páginas hijas)
        if (prev.includes(label)) {
          // No cerrar si estamos navegando dentro de esta categoría
          if (activeCategory === label) {
            return prev;
          }
          return prev.filter(item => item !== label);
        }

        // Si estamos expandiendo una nueva categoría
        // Cerrar otras categorías que no son la activa
        const newExpanded = prev.filter(item => item === activeCategory);
        return [...newExpanded, label];
      });
    }
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return hasPermission(item.roles as any);
  });

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-syllet-500 to-syllet-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-xl text-zinc-900">Syllet</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={cn(
                      'nav-item w-full justify-between',
                      isActive(item.href) && 'nav-item-active'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        'transition-transform duration-200',
                        expandedItems.includes(item.label) && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedItems.includes(item.label) && (
                    <ul className="mt-1 ml-8 space-y-1 animate-slide-in">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              'block py-2 px-3 text-sm rounded-lg transition-colors',
                              pathname === child.href
                                ? 'text-syllet-700 bg-syllet-50 font-medium'
                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'nav-item',
                    isActive(item.href) && 'nav-item-active'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-zinc-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={`${user?.nombre} ${user?.apellido}`} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-zinc-500 truncate capitalize">{user?.rol}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/perfil"
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
          >
            <UserCircle size={14} />
            Perfil
          </Link>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs text-zinc-600 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}
