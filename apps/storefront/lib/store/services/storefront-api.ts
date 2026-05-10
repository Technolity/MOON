import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  images?: Array<{ url: string; alt: string; order: number; blurDataUrl: string | null }>;
  category?: string | null;
  theme?: string | null;
  in_stock?: boolean | null;
  inStock?: boolean;
  stockCount?: number | null;
  inventory?: { quantity: number; reserved: number; sku: string } | null;
}

export interface BackendCartItem {
  itemId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface BackendShippingQuote {
  zone: string;
  cost: number;
  eta: string;
}

export interface CreateOrderPayload {
  customerEmail: string;
  customerPhone: string;
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  paymentMethod?: 'upi' | 'card' | 'netbanking' | 'wallet';
  notes?: string;
  discountCode?: string;
}

export interface CreatedOrder {
  id: string;
  order_number: string;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface RazorpayOrderPayload { orderId: string }
export interface RazorpayOrderResult {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerPhone: string;
}
export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
export interface VerifyPaymentResult { verified: boolean }

export interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderShippingAddress {
  full_name: string;
  line_1: string;
  line_2?: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  customer_email: string;
  shipping_address: OrderShippingAddress;
  items: OrderItem[];
}

export interface QuickRazorpayOrderPayload { amount: number; currency?: string; receipt: string; notes?: Record<string, string> }
export interface QuickRazorpayOrderResult { razorpayOrderId: string; amount: number; currency: string; keyId: string }
export interface QuickVerifyPayload { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
export interface ValidateDiscountPayload { code: string; subtotal: number; shippingCost?: number }
export interface ValidatedDiscount {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  discountAmount: number;
  subtotal: number;
  discountedSubtotal: number;
  shippingCost: number;
  freeShipping: boolean;
  totalAfterDiscount: number;
  message: string;
}

const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/+$/, '');

const unwrap = <T>(response: ApiEnvelope<T>) => response.data;

export const storefrontApi = createApi({
  reducerPath: 'storefrontApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Cart', 'Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<BackendProduct[], void>({
      query: () => '/products',
      transformResponse: unwrap,
      providesTags: ['Products'],
    }),

    getCart: builder.query<BackendCartItem[], { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: '/cart',
        params: { sessionId },
        headers: { 'x-session-id': sessionId },
      }),
      transformResponse: unwrap,
      providesTags: ['Cart'],
    }),

    addCartItem: builder.mutation<BackendCartItem[], { sessionId: string; productId: string; quantity?: number }>({
      query: ({ sessionId, productId, quantity = 1 }) => ({
        url: '/cart/add',
        method: 'POST',
        headers: { 'x-session-id': sessionId },
        body: { productId, quantity },
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Cart'],
    }),

    updateCartItem: builder.mutation<BackendCartItem[], { sessionId: string; itemId: string; quantity: number }>({
      query: ({ sessionId, itemId, quantity }) => ({
        url: `/cart/update/${itemId}`,
        method: 'PUT',
        headers: { 'x-session-id': sessionId },
        body: { quantity },
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Cart'],
    }),

    removeCartItem: builder.mutation<BackendCartItem[], { sessionId: string; itemId: string }>({
      query: ({ sessionId, itemId }) => ({
        url: `/cart/remove/${itemId}`,
        method: 'DELETE',
        headers: { 'x-session-id': sessionId },
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Cart'],
    }),

    clearCart: builder.mutation<BackendCartItem[], { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: '/cart/clear',
        method: 'POST',
        headers: { 'x-session-id': sessionId },
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Cart'],
    }),

    calculateShipping: builder.mutation<BackendShippingQuote, { state: string; postalCode: string; orderSubtotal?: number }>({
      query: (body) => ({
        url: '/shipping/calculate',
        method: 'POST',
        body,
      }),
      transformResponse: unwrap,
    }),

    validateDiscount: builder.mutation<ValidatedDiscount, ValidateDiscountPayload>({
      query: (body) => ({
        url: '/discounts/validate',
        method: 'POST',
        body,
      }),
      transformResponse: unwrap,
    }),

    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: unwrap,
    }),

    createOrder: builder.mutation<CreatedOrder, CreateOrderPayload>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      transformResponse: unwrap,
    }),

    createRazorpayOrder: builder.mutation<RazorpayOrderResult, RazorpayOrderPayload>({
      query: (body) => ({ url: '/payments/razorpay', method: 'POST', body }),
      transformResponse: unwrap,
    }),

    verifyPayment: builder.mutation<VerifyPaymentResult, VerifyPaymentPayload>({
      query: (body) => ({ url: '/payments/verify', method: 'POST', body }),
      transformResponse: unwrap,
    }),

    createQuickRazorpayOrder: builder.mutation<QuickRazorpayOrderResult, QuickRazorpayOrderPayload>({
      query: (body) => ({ url: '/payments/quick-order', method: 'POST', body }),
      transformResponse: unwrap,
    }),

    quickVerifyPayment: builder.mutation<VerifyPaymentResult, QuickVerifyPayload>({
      query: (body) => ({ url: '/payments/quick-verify', method: 'POST', body }),
      transformResponse: unwrap,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetOrderQuery,
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useCalculateShippingMutation,
  useValidateDiscountMutation,
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useCreateQuickRazorpayOrderMutation,
  useQuickVerifyPaymentMutation,
} = storefrontApi;
