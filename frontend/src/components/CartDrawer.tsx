import { useEffect } from 'react';
import type { CartItem } from '../types';
import '../styles/CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const FREE_SHIP_THRESHOLD = 999;
const SHIP_FEE = 75;

export function CartDrawer({
  isOpen,
  items,
  subtotal,
  onClose,
  onRemoveItem,
  onContinueShopping,
  onCheckout,
}: CartDrawerProps) {
  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIP_FEE;
  const total = subtotal + shipping;
  const progressPct = Math.min((subtotal / FREE_SHIP_THRESHOLD) * 100, 100);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`cart-drawer-overlay ${isOpen ? 'cart-drawer-overlay--open' : 'cart-drawer-overlay--closed'}`}
      {...(!isOpen ? { 'aria-hidden': 'true' as const } : {})}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="cart-drawer-scrim"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="cart-drawer-panel"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <header className="cart-drawer-header">
          <div>
            <div className="cart-drawer-subtitle">
              Your Cart · {items.length} item{items.length !== 1 ? 's' : ''}
            </div>
            <div className="cart-drawer-title">The Basket</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="cart-drawer-close-btn"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="cart-shipping-bar">
            {shipping === 0 ? (
              <div className="cart-shipping-unlocked">
                ✓ Free shipping unlocked across India
              </div>
            ) : (
              <>
                <div className="cart-shipping-remaining">
                  Add ₹{(FREE_SHIP_THRESHOLD - subtotal).toLocaleString('en-IN')} for free shipping
                </div>
                <div className="cart-progress-track">
                  <div
                    className="cart-progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Body */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-title">Empty — for now.</div>
              <p className="cart-empty-desc">
                Add a jar from the shop and it'll live here.
              </p>
              <button
                type="button"
                onClick={onContinueShopping}
                className="cart-continue-btn"
              >Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <article key={item.id} className="cart-item">
                  {item.image && (
                    <div className="cart-item-image">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="cart-item-img"
                      />
                    </div>
                  )}
                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.title}</div>
                    <div className="cart-item-pricing">
                      <div className="cart-item-price-detail">
                        ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                      </div>
                      <div className="cart-item-line-total">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="cart-item-remove"
                    >Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal</span>
              <span className="cart-summary-value">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row cart-summary-row--shipping">
              <span className="cart-summary-label">Shipping</span>
              <span className="cart-summary-value cart-summary-value--shipping">
                {shipping === 0 ? 'Free' : `₹${shipping}`}
              </span>
            </div>
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="cart-checkout-btn"
            >Checkout →</button>
            <button
              type="button"
              onClick={onContinueShopping}
              className="cart-continue-btn cart-continue-btn--footer"
            >Continue Shopping</button>
            <p className="cart-footer-note">
              Secure payment · UPI / Cards / NetBanking
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}
