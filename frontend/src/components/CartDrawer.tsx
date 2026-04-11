import { useEffect } from 'react';
import type { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  subtotal,
  onClose,
  onRemoveItem,
  onContinueShopping,
  onCheckout
}: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[120] transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close cart sidebar"
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-[430px] border-l border-outline-variant/20 bg-surface shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-5">
            <div>
              <h2 className="font-headline text-xl text-on-background">Your Cart</h2>
              <p className="mt-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
                {items.length} item{items.length === 1 ? '' : 's'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-background"
              aria-label="Close cart"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {items.length === 0 ? (
              <div className="rounded-none border border-outline-variant/20 bg-surface-container-low p-5">
                <p className="text-sm text-on-surface-variant">Your cart is empty.</p>
                <button
                  type="button"
                  onClick={onContinueShopping}
                  className="mt-4 border border-outline-variant/30 px-4 py-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-background transition-colors hover:border-secondary hover:text-secondary"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-start justify-between gap-4 border border-outline-variant/20 bg-surface-container-low p-4"
                  >
                    <div>
                      <h3 className="font-headline text-sm uppercase tracking-[0.08em] text-on-background">{item.title}</h3>
                      <p className="mt-2 text-sm text-on-surface-variant">
                        ₹{item.price} x {item.quantity}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-background"
                      aria-label={`Remove ${item.title}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <footer className="border-t border-outline-variant/20 bg-surface-container-low px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-label text-xs uppercase tracking-[0.12em] text-on-surface-variant">Subtotal</span>
              <span className="font-headline text-xl text-secondary">₹{subtotal}</span>
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={onCheckout}
                className="bg-secondary px-5 py-3 font-headline text-xs font-semibold uppercase tracking-[0.18em] text-on-secondary-fixed transition hover:brightness-110"
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                onClick={onContinueShopping}
                className="border border-outline-variant/30 bg-transparent px-5 py-3 font-headline text-xs font-semibold uppercase tracking-[0.18em] text-on-background transition-colors hover:bg-surface-container-high"
              >
                Continue Shopping
              </button>
            </div>
          </footer>
        </div>
      </aside>
    </div>
  );
}

