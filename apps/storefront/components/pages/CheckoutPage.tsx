'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { shippingStateOptions } from '@/lib/data/product-statics';
import {
  useCalculateShippingMutation,
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useValidateDiscountMutation,
} from '@/lib/store/services/storefront-api';
import type { ValidatedDiscount } from '@/lib/store/services/storefront-api';
import type { CartItem } from '@/lib/types';

declare const Razorpay: new (options: object) => { open(): void };

interface CheckoutPageProps {
  items: CartItem[];
  subtotal: number;
  onBackToCart: () => void;
  onOrderPlaced: (meta: {
    orderId: string;
    orderNumber: string;
    paymentMethod: string;
    total: number;
    shippingZone: string;
    shippingCost: number;
  }) => Promise<void> | void;
}

const defaultShipping = { zone: 'Pending', cost: 0, eta: '-' };

function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay SDK failed to load. Please check your connection.'));
    document.body.appendChild(script);
  });
}

export function CheckoutPage({ items, subtotal, onBackToCart, onOrderPlaced }: CheckoutPageProps) {
  const [selectedState, setSelectedState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [shipping, setShipping] = useState(defaultShipping);
  const [shippingError, setShippingError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<ValidatedDiscount | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [calculateShipping, { isLoading: isShippingLoading }] = useCalculateShippingMutation();
  const [createOrder] = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [validateDiscount, { isLoading: isApplyingDiscount }] = useValidateDiscountMutation();

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

  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const discountedSubtotal = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [discountAmount, subtotal]
  );
  const effectiveShippingCost = useMemo(() => {
    if (!items.length) return 0;
    if (appliedDiscount?.freeShipping) return 0;
    return shipping.cost;
  }, [appliedDiscount, items.length, shipping.cost]);

  const total = useMemo(
    () => discountedSubtotal + effectiveShippingCost,
    [discountedSubtotal, effectiveShippingCost]
  );

  useEffect(() => {
    setAppliedDiscount(null);
    setDiscountError('');
  }, [items.length, subtotal]);

  const handleApplyDiscount = async () => {
    const code = discountCode.trim();
    setDiscountError('');
    setAppliedDiscount(null);

    if (!code) {
      setDiscountError('Enter a discount code.');
      return;
    }

    try {
      const discount = await validateDiscount({
        code,
        subtotal,
        shippingCost: items.length ? shipping.cost : 0,
      }).unwrap();
      setAppliedDiscount(discount);
      setDiscountCode(discount.code);
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'data' in error
          ? ((error as { data?: { message?: string } }).data?.message ?? 'Discount code could not be applied.')
          : 'Discount code could not be applied.';
      setDiscountError(message);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');

    if (items.length === 0 || isProcessing) return;

    const formData = new FormData(event.currentTarget);

    const fullName = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const city = String(formData.get('city') ?? '').trim();
    const state = String(formData.get('state') ?? '').trim();
    const pincode = String(formData.get('pincode') ?? '').trim();
    const address = String(formData.get('address') ?? '').trim();
    const line2 = String(formData.get('address2') ?? '').trim();

    setIsProcessing(true);
    try {
      // Step 1: Create a DB order record
      const paymentMethodMap: Record<string, 'upi' | 'card' | 'netbanking' | 'wallet'> = {
        UPI: 'upi',
        Cards: 'card',
        'Net Banking': 'netbanking',
        Wallet: 'wallet',
      };
      const createdOrder = await createOrder({
        customerEmail: email,
        customerPhone: phone,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        shippingAddress: {
          fullName: fullName,
          phone,
          line1: address,
          line2: line2 || undefined,
          city,
          state,
          postalCode: pincode,
          country: 'IN',
        },
        paymentMethod: paymentMethodMap[paymentMethod] ?? 'upi',
        notes: String(formData.get('notes') ?? '').trim() || undefined,
        discountCode: appliedDiscount?.code || undefined,
      }).unwrap();

      const orderId = createdOrder.id;
      const orderNumber = createdOrder.order_number;

      // Step 2: Create a Razorpay order linked to the DB order
      const rzpOrder = await createRazorpayOrder({ orderId }).unwrap();

      if (rzpOrder.keyId === 'dev_key') {
        // Dev payment mode — no real Razorpay modal, simulate success immediately
        await verifyPayment({
          orderId,
          razorpayOrderId: rzpOrder.razorpayOrderId,
          razorpayPaymentId: `dev_pay_${Date.now()}`,
          razorpaySignature: 'dev_sig',
        }).unwrap();
        await onOrderPlaced({
          orderId,
          orderNumber,
          paymentMethod,
          total,
          shippingZone: shipping.zone,
          shippingCost: shipping.cost,
        });
      } else {
        await loadRazorpay();

        await new Promise<void>((resolve, reject) => {
          const rzp = new Razorpay({
            key: rzpOrder.keyId,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            order_id: rzpOrder.razorpayOrderId,
            name: 'MOON',
            description: items.map((i) => `${i.title} x${i.quantity}`).join(', '),
            prefill: { name: fullName, email, contact: phone },
            notes: { city, state, pincode, address },
            handler: async (response: {
              razorpay_payment_id: string;
              razorpay_order_id: string;
              razorpay_signature: string;
            }) => {
              try {
                // Step 4: Verify payment using proper route
                await verifyPayment({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }).unwrap();
                await onOrderPlaced({
                  orderId,
                  orderNumber,
                  paymentMethod,
                  total,
                  shippingZone: shipping.zone,
                  shippingCost: shipping.cost,
                });
                resolve();
              } catch {
                reject(new Error('Payment verification failed. Please contact support with your payment ID.'));
              }
            },
            modal: {
              ondismiss: () => reject(new Error('Payment was cancelled. You can try again.')),
            },
          });
          rzp.open();
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error && 'data' in error
            ? ((error as { data?: { message?: string } }).data?.message ?? 'Checkout failed. Please check your details and try again.')
            : 'Checkout failed. Please check your details and try again.';

      setSubmitError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main id="main-content" className="checkout-page section-padding route-page" data-module="checkout-page">
        <div className="checkout-page-shell">
          <div className="checkout-content">
            <div className="checkout-header">
              <h2 id="checkout-title">Your cart is empty</h2>
              <button className="route-ghost-btn" type="button" onClick={onBackToCart}>← Back to Shop</button>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#5f5447' }}>
              <p style={{ marginBottom: '1rem' }}>Add some products before checking out.</p>
              <button className="pay-now-btn" type="button" onClick={onBackToCart} style={{ maxWidth: 240, margin: '0 auto' }}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="checkout-page section-padding route-page" data-module="checkout-page">
      <div className="route-head">
        <p className="label">Checkout</p>
        <h1 className="section-heading">Shipping & Payment</h1>
      </div>

      <div className="checkout-page-shell">
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
                <span id="checkout-shipping">{appliedDiscount?.freeShipping ? 'Free' : `₹${items.length ? shipping.cost : 0}`}</span>
              </div>
              <div className="summary-item">
                <span>ETA</span>
                <span>{shipping.eta}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0' }}>
                <label htmlFor="discount-code" style={{ fontSize: 12, color: '#5f5447', fontWeight: 600 }}>Discount code</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                  <input
                    id="discount-code"
                    className="checkout-input"
                    value={discountCode}
                    onChange={(event) => {
                      setDiscountCode(event.target.value.toUpperCase());
                      setAppliedDiscount(null);
                      setDiscountError('');
                    }}
                    placeholder="PAYTEST"
                    style={{ minWidth: 0 }}
                  />
                  <button
                    type="button"
                    className="route-ghost-btn"
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount || items.length === 0}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isApplyingDiscount ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {appliedDiscount ? (
                  <p className="text-xs text-green-700 mt-1">{appliedDiscount.code} applied: -₹{appliedDiscount.discountAmount.toLocaleString('en-IN')}</p>
                ) : null}
                {discountError ? <p className="text-xs text-red-600 mt-1">{discountError}</p> : null}
              </div>
              {appliedDiscount ? (
                <div className="summary-item">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-₹{appliedDiscount.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              ) : null}
              <div className="summary-total">
                <span>Total</span>
                <span id="checkout-total">₹{total}</span>
              </div>

              {shippingError ? <p className="text-xs text-amber-600 mt-2">{shippingError}</p> : null}
              {submitError ? <p className="text-xs text-red-600 mt-2">{submitError}</p> : null}

              <button id="pay-now-btn" className="pay-now-btn" type="submit" form="checkout-form" disabled={isProcessing}>
                {isProcessing ? 'Opening Payment...' : isShippingLoading ? 'Calculating Shipping...' : `Pay ₹${total.toLocaleString('en-IN')} →`}
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
