import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { AdminSession } from './adminAuth';

interface RequireAdminProps {
  session: AdminSession | null;
  children: ReactNode;
}

export function RequireAdmin({ session, children }: RequireAdminProps) {
  const location = useLocation();

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
