import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAdminDashboardQuery, useGetAdminOrderMetricsQuery, useGetAdminProductMetricsQuery, useGetAdminRevenueMetricsQuery } from '../../store/services/api';

type Timeframe = 'daily' | 'weekly' | 'monthly';

function shiftDate(daysBack: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toISOString();
}

function currency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);
}

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === 'delivered' || normalized === 'confirmed') return 'bg-emerald-50 text-emerald-700';
  if (normalized === 'shipped' || normalized === 'packed') return 'bg-blue-50 text-blue-700';
  if (normalized === 'cancelled') return 'bg-red-50 text-red-700';
  return 'bg-amber-50 text-amber-700';
}

export function DashboardOverviewPage() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');

  const queryParams = useMemo(() => {
    if (timeframe === 'daily') return { dateFrom: shiftDate(1) };
    if (timeframe === 'weekly') return { dateFrom: shiftDate(7) };
    return { dateFrom: shiftDate(30) };
  }, [timeframe]);

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch
  } = useGetAdminDashboardQuery(queryParams);

  const { data: revenueMetrics } = useGetAdminRevenueMetricsQuery(queryParams);
  const { data: orderMetrics } = useGetAdminOrderMetricsQuery(queryParams);
  const { data: productMetrics } = useGetAdminProductMetricsQuery({ ...queryParams, limit: 4 });

  const statusRows = useMemo(
    () =>
      Object.entries(orderMetrics?.byStatus ?? {}).sort((a, b) => b[1] - a[1]),
    [orderMetrics?.byStatus]
  );

  const metrics = [
    {
      label: 'Total Revenue',
      value: currency(revenueMetrics?.totalRevenue ?? dashboard?.revenue ?? 0),
      icon: 'payments'
    },
    {
      label: 'Orders',
      value: String(dashboard?.totalOrders ?? orderMetrics?.total ?? 0),
      icon: 'shopping_bag'
    },
    {
      label: 'Average Order Value',
      value: currency(revenueMetrics?.averageOrderValue ?? 0),
      icon: 'analytics'
    },
    {
      label: 'Low Stock SKUs',
      value: String(dashboard?.lowStockCount ?? 0),
      icon: 'inventory_2'
    }
  ];

  return (
    <section className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto w-full" data-module="dashboard-overview">
      {isDashboardError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex flex-wrap items-center justify-between gap-3">
          <span>Could not load dashboard analytics from backend.</span>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric) => (
          <article key={metric.label} className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_10px_30px_-15px_rgba(26,28,30,0.25)] border border-slate-200/60">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#454e90]/10 rounded-lg text-[#454e90]">
                <span className="material-symbols-outlined">{metric.icon}</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">{timeframe}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{metric.label}</p>
            <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] mt-1 text-slate-900">
              {isDashboardLoading ? 'Loading...' : metric.value}
            </h3>
          </article>
        ))}
      </div>

      <section className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-[0_10px_30px_-15px_rgba(26,28,30,0.25)] border border-slate-200/60">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">Sales & Revenue</h2>
            <p className="text-slate-500 text-sm mt-1">Live backend metrics for selected timeframe.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-lg ${timeframe === 'daily' ? 'bg-[#454e90] text-white' : 'bg-slate-100 text-slate-900'}`}
              type="button"
              onClick={() => setTimeframe('daily')}
            >
              Daily
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-lg ${timeframe === 'weekly' ? 'bg-[#454e90] text-white' : 'bg-slate-100 text-slate-900'}`}
              type="button"
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-lg ${timeframe === 'monthly' ? 'bg-[#454e90] text-white' : 'bg-slate-100 text-slate-900'}`}
              type="button"
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Order Status Distribution</h3>
            <div className="space-y-3">
              {statusRows.length === 0 ? (
                <p className="text-sm text-slate-500">No order status data yet.</p>
              ) : (
                statusRows.map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(status)}`}>
                      {status}
                    </span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Top Product Performance</h3>
            <div className="space-y-3">
              {(productMetrics ?? []).slice(0, 4).map((product) => (
                <div key={product.productId} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-700 truncate">{product.productName}</span>
                  <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">{product.unitsSold} units</span>
                </div>
              ))}
              {!productMetrics?.length ? <p className="text-sm text-slate-500">No product metrics yet.</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-[0_10px_30px_-15px_rgba(26,28,30,0.25)] border border-slate-200/60 overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex justify-between items-center bg-white">
          <h2 className="text-lg sm:text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">Top Products</h2>
          <button className="text-[#454e90] font-semibold text-sm hover:underline" type="button" onClick={() => navigate('/admin/inventory')}>
            View inventory
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 text-slate-500 text-xs uppercase tracking-widest border-y border-slate-100">
                <th className="px-4 sm:px-6 lg:px-8 py-4 font-semibold whitespace-nowrap">Product</th>
                <th className="px-4 sm:px-6 lg:px-8 py-4 font-semibold whitespace-nowrap">Units Sold</th>
                <th className="px-4 sm:px-6 lg:px-8 py-4 font-semibold whitespace-nowrap">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(productMetrics ?? []).map((product) => (
                <tr key={product.productId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 font-medium text-slate-900 whitespace-nowrap">{product.productName}</td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-slate-700 whitespace-nowrap">{product.unitsSold}</td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 font-semibold text-slate-900 whitespace-nowrap">{currency(product.revenue)}</td>
                </tr>
              ))}
              {!productMetrics?.length ? (
                <tr>
                  <td className="px-4 sm:px-6 lg:px-8 py-5 text-slate-500" colSpan={3}>No product sales data available for this timeframe.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
