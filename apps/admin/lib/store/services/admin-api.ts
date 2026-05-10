import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { expireAdminSession, loadAdminSession } from '@/lib/admin/adminAuth';

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
  images?: Array<{ url: string; alt: string; order: number; blurDataUrl: string | null; isFallback?: boolean }>;
  category?: string | null;
  theme?: string | null;
  is_active?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  updated_at?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
  };
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

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  discount_price?: number | null;
  category?: string;
  theme?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
  blurDataUrl: string | null;
}

/* ─── Orders ───────────────────────────────────────────────────────── */
export interface AdminOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface AdminOrderPayment {
  status: string;
  method: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  amount?: number;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  customer_email: string;
  customer_phone: string;
  tracking_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  order_items: AdminOrderItem[];
  payments: AdminOrderPayment[];
}

export interface AdminOrderDetail extends AdminOrder {
  shipping_address?: {
    full_name: string; phone: string;
    line_1: string; line_2?: string | null;
    city: string; state: string; postal_code: string; country: string;
  } | null;
  billing_address?: {
    full_name: string; phone: string;
    line_1: string; line_2?: string | null;
    city: string; state: string; postal_code: string; country: string;
  } | null;
}

/* ─── Customers ────────────────────────────────────────────────────── */
export interface AdminCustomer {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role: string;
  created_at: string;
  orderCount: number;
  totalSpent: number;
}

export interface AdminCustomerDetail extends AdminCustomer {
  updated_at: string;
  orders: Array<{
    id: string;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    order_items: Array<{ product_name: string; quantity: number }>;
  }>;
}

/* ─── Categories ───────────────────────────────────────────────────── */
export interface AdminCategory {
  name: string;
  productCount: number;
  activeCount: number;
  themes: string[];
}

/* ─── Detailed Analytics ───────────────────────────────────────────── */
export interface BuyerProductSummary {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalSpent: number;
}

export interface BuyerSummary {
  email: string;
  name: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  totalOrders: number;
  totalSpent: number;
  productsBought: BuyerProductSummary[];
  firstOrderDate: string;
  lastOrderDate: string;
  orderStatuses: Record<string, number>;
}

export interface BuyersSummaryResponse {
  buyers: BuyerSummary[];
  total: number;
}

export interface BuyerDetailResponse {
  email: string;
  totalOrders: number;
  totalSpent: number;
  productsSummary: Array<BuyerProductSummary & { orderCount: number }>;
  orders: AdminOrderDetail[];
}

export interface ProductBuyersResponse {
  productId: string;
  productName: string;
  totalBuyers: number;
  buyers: Array<{
    email: string;
    name: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    totalQuantity: number;
    totalSpent: number;
    orderCount: number;
    lastPurchaseDate: string;
  }>;
}

export interface TimelineBucket {
  period: string;
  revenue: number;
  orders: number;
}

export interface TimelineResponse {
  granularity: 'day' | 'week' | 'month';
  timeline: TimelineBucket[];
}

export interface GeoStateEntry {
  state: string;
  orders: number;
  revenue: number;
}

export interface GeoCityEntry {
  city: string;
  state: string;
  orders: number;
  revenue: number;
}

export interface GeoResponse {
  byState: GeoStateEntry[];
  byCity: GeoCityEntry[];
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minimum_subtotal: number;
  max_discount: number | null;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  free_shipping: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscountWritePayload {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minimumSubtotal?: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
  freeShipping?: boolean;
}

export interface ShippingZone {
  id: string;
  zone_name: string;
  states: string[];
  cost: number;
  estimated_days: number;
  is_active: boolean;
}

export interface UpdateShippingZonePayload {
  cost?: number;
  estimatedDays?: number;
}

const baseUrl = '/api/backend';

const unwrap = <T>(response: ApiEnvelope<T>) => response.data;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
});

const adminBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const url = typeof args === 'string' ? args : args.url;
  const isLoginRequest = url === '/auth/login';
  if (!isLoginRequest && !loadAdminSession()) {
    return {
      error: {
        status: 401,
        data: { success: false, message: 'Admin session required.' },
      },
    };
  }

  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    expireAdminSession();
  }
  return result;
};

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: adminBaseQuery,
  tagTypes: ['Inventory', 'Analytics', 'AdminSession', 'AdminProducts', 'AdminOrders', 'AdminCustomers', 'AdminCategories', 'AdminDiscounts', 'DetailedAnalytics', 'ShippingZones'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminSession'],
    }),

    getMe: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/me',
      transformResponse: unwrap,
      providesTags: ['AdminSession'],
    }),

    getInventory: builder.query<InventoryItem[], void>({
      query: () => '/inventory',
      transformResponse: unwrap,
      providesTags: ['Inventory'],
    }),

    updateInventory: builder.mutation<InventoryItem, { id: string; quantity?: number; reserved?: number; sku?: string }>({
      query: ({ id, ...patch }) => ({
        url: `/inventory/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['Inventory'],
    }),

    getAdminDashboard: builder.query<AdminDashboard, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/dashboard', params } : '/admin/analytics/dashboard',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminOrderMetrics: builder.query<OrderMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/orders', params } : '/admin/analytics/orders',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminRevenueMetrics: builder.query<RevenueMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/revenue', params } : '/admin/analytics/revenue',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminCustomerMetrics: builder.query<CustomerMetrics, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/customers', params } : '/admin/analytics/customers',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminProductMetrics: builder.query<ProductMetric[], { dateFrom?: string; dateTo?: string; limit?: number } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/products', params } : '/admin/analytics/products',
      transformResponse: unwrap,
      providesTags: ['Analytics'],
    }),

    getAdminProducts: builder.query<BackendProduct[], void>({
      query: () => '/admin/products',
      transformResponse: unwrap,
      providesTags: ['AdminProducts'],
    }),

    createAdminProduct: builder.mutation<BackendProduct, Omit<UpdateProductPayload, 'is_active'> & { name: string; price: number; is_active?: boolean }>({
      query: (body) => ({
        url: '/admin/products',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { product: BackendProduct }) => response.product,
      invalidatesTags: ['AdminProducts'],
    }),

    updateAdminProduct: builder.mutation<BackendProduct, { id: string; patch: UpdateProductPayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminProducts'],
    }),

    uploadProductImages: builder.mutation<{ images: ProductImage[] }, { productId: string; formData: FormData }>({
      query: ({ productId, formData }) => ({
        url: `/admin/products/${productId}/upload`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: unwrap,
    }),

    updateProductImagesArray: builder.mutation<BackendProduct, { id: string; images: ProductImage[] }>({
      query: ({ id, images }) => ({
        url: `/admin/products/${id}/images`,
        method: 'PUT',
        body: { images },
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminProducts'],
    }),

    /* ─── Admin Orders ────────────────────────────────────────────── */
    getAdminOrders: builder.query<AdminOrder[], { status?: string } | void>({
      query: (params) =>
        params && params.status ? { url: '/admin/orders', params: { status: params.status } } : '/admin/orders',
      transformResponse: unwrap,
      providesTags: ['AdminOrders'],
    }),

    getAdminOrderById: builder.query<AdminOrderDetail, string>({
      query: (id) => `/admin/orders/${id}`,
      transformResponse: unwrap,
      providesTags: ['AdminOrders'],
    }),

    updateAdminOrderStatus: builder.mutation<
      { id: string; order_number: string; status: string; tracking_number?: string; notes?: string; updated_at: string },
      { id: string; status: string; trackingNumber?: string; notes?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        body,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminOrders'],
    }),

    /* ─── Admin Customers ─────────────────────────────────────────── */
    getAdminCustomers: builder.query<AdminCustomer[], void>({
      query: () => '/admin/customers',
      transformResponse: unwrap,
      providesTags: ['AdminCustomers'],
    }),

    getAdminCustomerById: builder.query<AdminCustomerDetail, string>({
      query: (id) => `/admin/customers/${id}`,
      transformResponse: unwrap,
      providesTags: ['AdminCustomers'],
    }),

    /* ─── Admin Categories ────────────────────────────────────────── */
    getAdminCategories: builder.query<AdminCategory[], void>({
      query: () => '/admin/categories',
      transformResponse: unwrap,
      providesTags: ['AdminCategories'],
    }),

    /* ─── Admin Discounts ─────────────────────────────────────────── */
    getAdminDiscounts: builder.query<DiscountCode[], void>({
      query: () => '/admin/discounts',
      transformResponse: unwrap,
      providesTags: ['AdminDiscounts'],
    }),

    createAdminDiscount: builder.mutation<DiscountCode, DiscountWritePayload>({
      query: (body) => ({
        url: '/admin/discounts',
        method: 'POST',
        body,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminDiscounts'],
    }),

    updateAdminDiscount: builder.mutation<DiscountCode, { id: string; patch: Partial<DiscountWritePayload> }>({
      query: ({ id, patch }) => ({
        url: `/admin/discounts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['AdminDiscounts'],
    }),

    deleteAdminDiscount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/discounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminDiscounts'],
    }),

    /* ─── Detailed Analytics ──────────────────────────────────────── */
    getBuyersSummary: builder.query<BuyersSummaryResponse, { dateFrom?: string; dateTo?: string; limit?: number; offset?: number } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/buyers', params } : '/admin/analytics/buyers',
      transformResponse: unwrap,
      providesTags: ['DetailedAnalytics'],
    }),

    getBuyerDetail: builder.query<BuyerDetailResponse, string>({
      query: (email) => `/admin/analytics/buyers/${encodeURIComponent(email)}`,
      transformResponse: unwrap,
      providesTags: ['DetailedAnalytics'],
    }),

    getProductBuyers: builder.query<ProductBuyersResponse, { productId: string; dateFrom?: string; dateTo?: string }>({
      query: ({ productId, ...params }) => ({
        url: `/admin/analytics/products/${productId}/buyers`,
        params,
      }),
      transformResponse: unwrap,
      providesTags: ['DetailedAnalytics'],
    }),

    getAnalyticsTimeline: builder.query<TimelineResponse, { dateFrom?: string; dateTo?: string; granularity?: 'day' | 'week' | 'month' } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/timeline', params } : '/admin/analytics/timeline',
      transformResponse: unwrap,
      providesTags: ['DetailedAnalytics'],
    }),

    getGeoBreakdown: builder.query<GeoResponse, { dateFrom?: string; dateTo?: string } | undefined>({
      query: (params) =>
        params ? { url: '/admin/analytics/geo', params } : '/admin/analytics/geo',
      transformResponse: unwrap,
      providesTags: ['DetailedAnalytics'],
    }),

    getShippingZones: builder.query<ShippingZone[], void>({
      query: () => '/admin/shipping/zones',
      transformResponse: unwrap,
      providesTags: ['ShippingZones' as never],
    }),

    updateShippingZone: builder.mutation<ShippingZone, { id: string; patch: UpdateShippingZonePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/shipping/zones/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: unwrap,
      invalidatesTags: ['ShippingZones' as never],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useGetAdminDashboardQuery,
  useGetAdminOrderMetricsQuery,
  useGetAdminRevenueMetricsQuery,
  useGetAdminCustomerMetricsQuery,
  useGetAdminProductMetricsQuery,
  useGetAdminProductsQuery,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useUploadProductImagesMutation,
  useUpdateProductImagesArrayMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
  useGetAdminCustomersQuery,
  useGetAdminCustomerByIdQuery,
  useGetAdminCategoriesQuery,
  useGetAdminDiscountsQuery,
  useCreateAdminDiscountMutation,
  useUpdateAdminDiscountMutation,
  useDeleteAdminDiscountMutation,
  useGetBuyersSummaryQuery,
  useGetBuyerDetailQuery,
  useGetProductBuyersQuery,
  useGetAnalyticsTimelineQuery,
  useGetGeoBreakdownQuery,
  useGetShippingZonesQuery,
  useUpdateShippingZoneMutation,
} = adminApi;
