'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminProvider, useAdminContext } from '@/lib/admin/AdminContext';
import { AdminLayout } from '@/lib/admin/AdminLayout';
import type { ReactNode } from 'react';

function AdminGuard({ children }: { children: ReactNode }) {
  const { session, hydrated, logout } = useAdminContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!session && pathname !== '/login') {
      router.replace('/login');
    }
    if (session && pathname === '/login') {
      router.replace('/dashboard-overview');
    }
  }, [hydrated, session, pathname, router]);

  if (!hydrated) return null;

  if (!session) {
    return pathname === '/login' ? <>{children}</> : null;
  }

  if (pathname === '/login') return null;

  return (
    <AdminLayout session={session} onLogout={logout}>
      {children}
    </AdminLayout>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminProvider>
  );
}
