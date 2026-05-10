'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  ADMIN_SESSION_EXPIRED_EVENT,
  loadAdminSession,
  clearAdminSession,
  createAdminSession,
  saveAdminSession
} from './adminAuth';
import { useLoginMutation } from '@/lib/store/services/admin-api';
import type { AdminSession } from './adminAuth';
import type { ReactNode } from 'react';

interface AdminContextValue {
  session: AdminSession | null;
  hydrated: boolean;
  isLoggingIn: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdminContext() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdminContext must be used inside AdminProvider');
  return ctx;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loginMutation, { isLoading }] = useLoginMutation();

  useEffect(() => {
    setSession(loadAdminSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => setSession(null);
    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleExpiredSession);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleExpiredSession);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password }).unwrap();
      const newSession = createAdminSession(result);
      saveAdminSession(newSession);
      setSession(newSession);
      return { ok: true };
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? 'Login failed.';
      return { ok: false, message: msg };
    }
  };

  const logout = () => {
    fetch('/api/backend/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    clearAdminSession();
    setSession(null);
  };

  return (
    <AdminContext.Provider value={{ session, hydrated, isLoggingIn: isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
