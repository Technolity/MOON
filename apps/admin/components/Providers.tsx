'use client';

import { Provider } from 'react-redux';
import { RouteDebugClientLogger } from '@/components/debug/RouteDebugClientLogger';
import { store } from '@/lib/store';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <RouteDebugClientLogger appName="admin" />
      {children}
    </Provider>
  );
}
