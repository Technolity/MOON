'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type RouteDebugClientLoggerProps = {
  appName: 'admin' | 'storefront';
};

export function RouteDebugClientLogger({ appName }: RouteDebugClientLoggerProps) {
  const pathname = usePathname();
  const lastLoggedHref = useRef<string | null>(null);

  useEffect(() => {
    const href = window.location.href;

    if (lastLoggedHref.current === href) {
      return;
    }

    lastLoggedHref.current = href;

    const payload = {
      appName,
      event: 'client-route-change',
      href,
      pathname,
      referrer: document.referrer || null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    fetch('/api/debug/route-log', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      cache: 'no-store'
    }).catch((error) => {
      console.error(`[${appName}] route debug log failed`, error);
    });
  }, [appName, pathname]);

  return null;
}
