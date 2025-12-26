'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '@/types';
import { useAppStore } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const usuarios = useAppStore((state) => state.usuarios);
  const isInitialized = useAppStore((state) => state.isInitialized);

  // Establecer usuario admin por defecto cuando se carguen los usuarios
  useEffect(() => {
    if (isInitialized && usuarios.length > 0 && !user) {
      const adminUser = usuarios.find(u => u.rol === 'admin');
      setUser(adminUser || usuarios[0]);
    }
  }, [isInitialized, usuarios, user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulación de login - en producción conectar con backend real
    const foundUser = usuarios.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      return true;
    }
    return false;
  }, [usuarios]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const hasPermission = useCallback((roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.rol === 'admin') return true; // Admin tiene acceso total
    return roles.includes(user.rol);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
