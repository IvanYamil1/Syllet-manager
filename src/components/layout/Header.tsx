'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, MessageSquare, HelpCircle } from 'lucide-react';
import { Input, Avatar, Button } from '@/components/ui';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:block w-72">
          <Input
            placeholder="Buscar..."
            leftIcon={<Search size={18} />}
            className="py-2 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {action}

          {/* Notifications */}
          <button className="relative p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          {/* Messages */}
          <button className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
            <MessageSquare size={20} />
          </button>

          {/* Help */}
          <button className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-zinc-200" />

        {/* User Quick Info */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-zinc-50 py-1.5 px-2 rounded-lg transition-colors">
          <Avatar name={`${user?.nombre} ${user?.apellido}`} size="sm" />
          <span className="hidden lg:block text-sm font-medium text-zinc-700">
            {user?.nombre}
          </span>
        </div>
      </div>
    </header>
  );
}
