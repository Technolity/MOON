'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppShell } from '@/components/AppContext';
import { CheckoutPage } from '@/components/pages/CheckoutPage';
import { useAppDispatch } from '@/lib/store/hooks';
import { useClearCartMutation } from '@/lib/store/services/storefront-api';
import { getGuestCartSessionId } from '@/lib/store/services/cartSession';
import { clearCart } from '@/lib/store/slices/cartSlice';

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartItems, cartSubtotal, openShopSection } = useAppShell();
  const [clearCartMutation] = useClearCartMutation();
  const guestSessionId = useMemo(() => getGuestCartSessionId(), []);

  // Guard against the empty-cart flash on page refresh.
  // AppShell restores localStorage in a useEffect that runs after this component's
  // own effects (React runs child effects before parent effects). We wait 350ms so
  // the Redux store has time to be populated before we decide the cart is empty.
  const [ready, setReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If cart already has items (navigated from cart page), show immediately.
    if (cartItems.length > 0) { setReady(true); return; }
    timerRef.current = setTimeout(() => setReady(true), 350);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once items arrive (from localStorage restore), cancel the timer and show.
  useEffect(() => {
    if (cartItems.length > 0 && !ready) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setReady(true);
    }
  }, [cartItems.length, ready]);

  if (!ready) {
    return (
      <main id="main-content" className="checkout-page section-padding route-page">
        <div className="checkout-page-shell">
          <div className="checkout-content" style={{ padding: '3rem', textAlign: 'center', color: '#5f5447' }}>
            Loading your cart…
          </div>
        </div>
      </main>
    );
  }

  return (
    <CheckoutPage
      items={cartItems}
      subtotal={cartSubtotal}
      onBackToCart={openShopSection}
      onOrderPlaced={async () => {
        try {
          await clearCartMutation({ sessionId: guestSessionId }).unwrap();
        } catch {
          // ignore backend failure
        }
        dispatch(clearCart());
        router.push('/');
      }}
    />
  );
}
