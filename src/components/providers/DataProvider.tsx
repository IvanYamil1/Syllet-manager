'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

interface DataProviderProps {
  children: React.ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const initialize = useAppStore((state) => state.initialize);
  const isLoading = useAppStore((state) => state.isLoading);
  const isInitialized = useAppStore((state) => state.isInitialized);
  const error = useAppStore((state) => state.error);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-syllet-500 to-syllet-700 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <p className="text-zinc-600 animate-pulse">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-danger-100 flex items-center justify-center">
            <span className="text-danger-600 font-bold text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Error de conexión</h2>
          <p className="text-zinc-600 mb-4">No se pudo conectar con la base de datos. Por favor, verifica tu conexión.</p>
          <p className="text-sm text-zinc-400 bg-zinc-100 p-2 rounded-lg font-mono">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-syllet-600 text-white rounded-lg hover:bg-syllet-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
