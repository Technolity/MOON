import { FormEvent, useEffect, useMemo, useState } from 'react';
import { shippingStateOptions } from '../data/products';
import { useCalculateShippingMutation, useCreateOrderMutation } from '../store/services/api';
import type { CartItem } from '../types';

interface CheckoutPageProps {
  items: CartItem[];
  subtotal: number;
  onBackToCart: () => void;
  onOrderPlaced: (meta: {
    orderNumber: string;
    paymentMethod: string;
    total: number;
    shippingZone: string;
    shippingCost: number;
  }) => Promise<void> | void;
}

const defaultShipping = { zone: 'Pending', cost: 0, eta: '-' };

function mapPaymentMethod(method: string) {
  if (method === 'Cards') return 'card';
  if (method === 'Net Banking') return 'netbanking';
  if (method === 'Wallet') return 'wallet';
  return 'upi';
}

export function CheckoutPage({ items, subtotal, onBackToCart, onOrderPlaced }: CheckoutPageProps) {
  const [selectedState, setSelectedState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [shipping, setShipping] = useState(defaultShipping);
  const [shippingError, setShippingError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [calculateShipping, { isLoading: isShippingLoading }] = useCalculateShippingMutation();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  useEffect(() => {
    setShipping(defaultShipping);
    setShippingError('');

    if (!selectedState || postalCode.trim().length < 4 || items.length === 0) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        const quote = await calculateShipping({
          state: selectedState,
          postalCode: postalCode.trim(),
          orderSubtotal: subtotal
        }).unwrap();

        setShipping({
          zone: quote.zone,
          cost: quote.cost,
          eta: quote.eta
        });
        setShippingError('');
      } catch {
        setShipping({ zone: 'Default', cost: 80, eta: '3-6 days' });
        setShippingError('Could not fetch live shipping quote. Using fallback estimate.');
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [calculateShipping, items.length, postalCode, selectedState, subtotal]);

  const total = useMemo(() => subtotal + (items.length ? shipping.cost : 0), [subtotal, shipping.cost, items.length]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');

    if (items.length === 0) {
      window.alert('Your cart is empty.');
      return;
    }

    const formData = new FormData(event.currentTarget);

    const fullName = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const city = String(formData.get('city') ?? '').trim();
    const state = String(formData.get('state') ?? '').trim();
    const pincode = String(formData.get('pincode') ?? '').trim();
    const address = String(formData.get('address') ?? '').trim();
    const line2 = String(formData.get('address2') ?? '').trim();

    try {
      const order = await createOrder({
        customerEmail: email,
        customerPhone: phone,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName,
          phone,
          line1: address,
          line2: line2 || undefined,
          city,
          state,
          postalCode: pincode,
          country: 'India'
        },
        paymentMethod: mapPaymentMethod(paymentMethod),
        notes: String(formData.get('notes') ?? '').trim() || undefined
      }).unwrap();

      window.alert(`Order created successfully. Order Number: ${order.order_number}`);

      await onOrderPlaced({
        orderNumber: order.order_number,
        paymentMethod,
        total: order.total,
        shippingZone: shipping.zone,
        shippingCost: shipping.cost
      });
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'data' in error
          ? ((error as { data?: { message?: string } }).data?.message ?? 'Checkout failed. Please check your details and try again.')
          : 'Checkout failed. Please check your details and try again.';

      setSubmitError(message);
    }
  };

  return (
    <main id="main-content" className="checkout-page section-padding route-page" data-module="checkout-page">
      <div className="route-head reveal">
        <p className="label">Checkout</p>
        <h1 className="section-heading">Shipping & Payment</h1>
      </div>

      <div className="checkout-page-shell reveal">
        <div className="checkout-content">
          <div className="checkout-header">
            <h2 id="checkout-title">Complete Your Order</h2>
            <button className="route-ghost-btn" type="button" onClick={onBackToCart}>Back to Cart</button>
          </div>

          <div className="checkout-grid">
            <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
              <div className="checkout-field">
                <label htmlFor="checkout-name">Full Name</label>
                <input id="checkout-name" className="checkout-input" name="name" type="text" required />
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-email">Email</label>
                <input id="checkout-email" className="checkout-input" name="email" type="email" required />
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-phone">Phone</label>
                <input id="checkout-phone" className="checkout-input" name="phone" type="tel" required />
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-city">City</label>
                <input id="checkout-city" className="checkout-input" name="city" type="text" required />
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-state">State</label>
                <select
                  id="checkout-state"
                  className="checkout-select"
                  name="state"
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                  required
                >
                  {shippingStateOptions.map((stateName) => (
                    <option key={stateName || 'placeholder'} value={stateName}>
                      {stateName || 'Select state'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-pincode">Pincode</label>
                <input
                  id="checkout-pincode"
                  className="checkout-input"
                  name="pincode"
                  type="text"
                  maxLength={6}
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  required
                />
              </div>

              <div className="checkout-field full-width">
                <label htmlFor="checkout-address">Address Line 1</label>
                <textarea id="checkout-address" className="checkout-input checkout-textarea" name="address" rows={3} required />
              </div>

              <div className="checkout-field full-width">
                <label htmlFor="checkout-address2">Address Line 2 (Optional)</label>
                <input id="checkout-address2" className="checkout-input" name="address2" type="text" />
              </div>

              <div className="checkout-field full-width">
                <label htmlFor="checkout-notes">Notes (Optional)</label>
                <textarea id="checkout-notes" className="checkout-input checkout-textarea" name="notes" rows={2} />
              </div>

              <fieldset className="payment-options">
                <legend>Payment Method</legend>
                {['UPI', 'Cards', 'Net Banking', 'Wallet'].map((method) => (
                  <label className="payment-chip" key={method}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </fieldset>
            </form>

            <aside className="checkout-summary" aria-label="Order summary">
              <h3>Order Summary</h3>

              <div id="checkout-items" className="summary-list">
                {items.length === 0 ? (
                  <p className="empty-msg">No items selected.</p>
                ) : (
                  items.map((item) => (
                    <p key={item.id}>
                      <span>{item.title} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </p>
                  ))
                )}
              </div>

              <div className="summary-item">
                <span>Subtotal</span>
                <span id="checkout-subtotal">₹{subtotal}</span>
              </div>
              <div className="summary-item">
                <span>Shipping (<span id="checkout-zone">{shipping.zone}</span>)</span>
                <span id="checkout-shipping">₹{items.length ? shipping.cost : 0}</span>
              </div>
              <div className="summary-item">
                <span>ETA</span>
                <span>{shipping.eta}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span id="checkout-total">₹{total}</span>
              </div>

              {shippingError ? <p className="text-xs text-amber-600 mt-2">{shippingError}</p> : null}
              {submitError ? <p className="text-xs text-red-600 mt-2">{submitError}</p> : null}

              <button id="pay-now-btn" className="pay-now-btn" type="submit" form="checkout-form" disabled={items.length === 0 || isPlacingOrder}>
                {isPlacingOrder ? 'Placing Order...' : isShippingLoading ? 'Calculating Shipping...' : 'Continue to Razorpay'}
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
