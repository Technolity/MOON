import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAdminToken } from '../../admin/adminAuth';

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
  category?: string | null;
  theme?: string | null;
}

export interface BackendCartItem {
  itemId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
  };
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
}

export interface CreatedOrder {
  id: string;
  order_number: string;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface AdminDashboard {
  totalOrders: number;
  revenue: number;
  totalCustomers: number;
  lowStockCount: number;
}

export interface OrderMetrics {
  total: number;
  byStatus: Record<string, number>;
}

export interface RevenueMetrics {
  totalRevenue: number;
  averageOrderValue: number;
  orderCount: number;
}

export interface CustomerMetrics {
  newCustomers: number;
}

export interface ProductMetric {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  quantity: number;
  reserved: number;
  updated_at: string;
  products: {
    id: string;
    name: string;
    slug: string;
    category?: string | null;
    is_active: boolean;
  } | null;
}

const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/+$/, '');

const unwrap = <T>(response: ApiEnvelope<T>) => response.data;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getAdminToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Cart', 'Inventory', 'Analytics', 'Products', 'AdminSession'],
  endpoints: (builder) => ({
    getProducts: builder.query<BackendProduct[], void>({
      query: () => '/products',
      transformResponse: unwrap,
      providesTags: ['Products']
    }),

    getCart: builder.query<BackendCartItem[], { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: '/cart',
        params: { sessionId },
        headers: { 'x-session-id': sessionId }
      }),
      transformResponse: unwrap,
      providesTags: ['Cart']
    }),

    addCartItem: builder.mutation<BackendCartItem[], { sessionId: string; productId: string; quantity?: number }>({
      query: ({ sessionId, productId, quantity = 1 }) => ({
        url: '/cart/add',
        method: 'POST',
        headers: { 'x-session-id': sessionId },
        body: { productId, quantity }
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Cart']
    }),

    updateCartItem: builder.mutation<BackendCartItem[], { sessionId: string; itemId: string; quantity: number }>({
      query: ({ sessionId, itemId, quantity }) => ({
        url: `/cart/update/${itemId}`,
        method: 'PUT',
        headers: { 'x-session-id': sessionId },
        body: { quantity }
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Cart']
    }),

    removeCartItem: builder.mutation<BackendCartItem[], { sessionId: string; itemId: string }>({
      query: ({ sessionId, itemId }) => ({
        url: `/cart/remove/${itemId}`,
        method: 'DELETE',
        headers: { 'x-session-id': sessionId }
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Cart']
    }),

    clearCart: builder.mutation<BackendCartItem[], { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: '/cart/clear',
        method: 'POST',
        headers: { 'x-session-id': sessionId }
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Cart']
    }),

    calculateShipping: builder.mutation<BackendShippingQuote, { state: string; postalCode: string; orderSubtotal?: number }>({
      query: (body) => ({
        url: '/shipping/calculate',
        method: 'POST',
        body
      }),
      transformResponse: unwrap
    }),

    createOrder: builder.mutation<CreatedOrder, CreateOrderPayload>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body
      }),
      transformResponse: unwrap
    }),

    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminSession']
    }),

    getMe: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/me',
      transformResponse: unwrap,
      providesTags: ['AdminSession']
    }),

    getInventory: builder.query<InventoryItem[], void>({
      query: () => '/inventory',
      transformResponse: unwrap,
      providesTags: ['Inventory']
    }),

    updateInventory: builder.mutation<InventoryItem, { id: string; quantity?: number; reserved?: number; sku?: string }>({
      query: ({ id, ...patch }) => ({
        url: `/inventory/${id}`,
        method: 'PUT',
        body: patch
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Inventory']
    }),

    getAdminDashboard: builder.query<AdminDashboard, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params
          ? {
              url: '/admin/analytics/dashboard',
              params
            }
          : '/admin/analytics/dashboard',
      transformResponse: unwrap,
      providesTags: ['Analytics']
    }),

    getAdminOrderMetrics: builder.query<OrderMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params
          ? {
              url: '/admin/analytics/orders',
              params
            }
          : '/admin/analytics/orders',
      transformResponse: unwrap,
      providesTags: ['Analytics']
    }),

    getAdminRevenueMetrics: builder.query<RevenueMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params
          ? {
              url: '/admin/analytics/revenue',
              params
            }
          : '/admin/analytics/revenue',
      transformResponse: unwrap,
      providesTags: ['Analytics']
    }),

    getAdminCustomerMetrics: builder.query<CustomerMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params
          ? {
              url: '/admin/analytics/customers',
              params
            }
          : '/admin/analytics/customers',
      transformResponse: unwrap,
      providesTags: ['Analytics']
    }),

    getAdminProductMetrics: builder.query<ProductMetric[], { dateFrom?: string; dateTo?: string; limit?: number } | undefined>({
      query: (params) =>
        params
          ? {
              url: '/admin/analytics/products',
              params
            }
          : '/admin/analytics/products',
      transformResponse: unwrap,
      providesTags: ['Analytics']
    })
  })
});

export const {
  useAddCartItemMutation,
  useCalculateShippingMutation,
  useClearCartMutation,
  useCreateOrderMutation,
  useGetAdminCustomerMetricsQuery,
  useGetAdminDashboardQuery,
  useGetAdminOrderMetricsQuery,
  useGetAdminProductMetricsQuery,
  useGetAdminRevenueMetricsQuery,
  useGetCartQuery,
  useGetInventoryQuery,
  useGetMeQuery,
  useGetProductsQuery,
  useLoginMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useUpdateInventoryMutation
} = api;
