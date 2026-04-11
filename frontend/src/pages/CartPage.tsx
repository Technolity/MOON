import type { CartItem } from '../types';

interface CartPageProps {
  items: CartItem[];
  subtotal: number;
  onRemoveItem: (id: string) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

export function CartPage({ items, subtotal, onRemoveItem, onContinueShopping, onCheckout }: CartPageProps) {
  return (
    <main id="main-content" className="cart-page section-padding route-page" data-module="cart-page">
      <div className="route-head reveal">
        <p className="label">Cart</p>
        <h1 className="section-heading">Your Shopping Cart</h1>
      </div>

      <div className="cart-page-shell reveal">
        <div className="cart-content">
          <div className="cart-header">
            <h2 id="cart-title">Cart Items</h2>
            <button className="route-ghost-btn" type="button" onClick={onContinueShopping}>Continue Shopping</button>
          </div>

          <div className="cart-items" id="cart-items">
            {items.length === 0 ? (
              <p className="empty-msg">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <h4>{item.title}</h4>
                    <small>₹{item.price} x {item.quantity}</small>
                  </div>
                  <button className="remove-item" type="button" aria-label={`Remove ${item.title}`} onClick={() => onRemoveItem(item.id)}>
                    x
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="total-row">
              <span>Total</span>
              <span id="cart-total">₹{subtotal}</span>
            </div>
            <button className="checkout-btn" type="button" onClick={onCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </main>
  );
}
