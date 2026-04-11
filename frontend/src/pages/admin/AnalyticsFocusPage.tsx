import { useMemo } from 'react';
import {
  useGetAdminCustomerMetricsQuery,
  useGetAdminOrderMetricsQuery,
  useGetAdminProductMetricsQuery,
  useGetAdminRevenueMetricsQuery
} from '../../store/services/api';

function deltaClass(tone: 'green' | 'slate') {
  if (tone === 'green') return 'text-green-600 bg-green-50';
  return 'text-slate-600 bg-slate-50';
}

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === 'delivered' || normalized === 'confirmed') return 'bg-green-100 text-green-700';
  if (normalized === 'shipped' || normalized === 'packed') return 'bg-blue-100 text-blue-700';
  if (normalized === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-yellow-100 text-yellow-700';
}

function toCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);
}

function toPercentage(value: number) {
  return `${value.toFixed(2)}%`;
}

export function AnalyticsFocusPage() {
  const {
    data: revenue,
    isLoading: revenueLoading,
    isError: revenueError,
    refetch: refetchRevenue
  } = useGetAdminRevenueMetricsQuery(undefined);

  const { data: customers, refetch: refetchCustomers } = useGetAdminCustomerMetricsQuery(undefined);
  const { data: orders, refetch: refetchOrders } = useGetAdminOrderMetricsQuery(undefined);
  const { data: products, refetch: refetchProducts } = useGetAdminProductMetricsQuery({ limit: 8 });

  const totalOrderCount = orders?.total ?? 0;
  const conversionRate = totalOrderCount && (customers?.newCustomers ?? 0)
    ? (totalOrderCount / Math.max(customers?.newCustomers ?? 1, 1)) * 100
    : 0;

  const metrics = [
    {
      label: 'Total Revenue',
      value: toCurrency(revenue?.totalRevenue ?? 0),
      delta: `${revenue?.orderCount ?? 0} orders`,
      tone: 'green' as const,
      icon: 'payments',
      note: 'Confirmed + delivered order revenue'
    },
    {
      label: 'New Customers',
      value: String(customers?.newCustomers ?? 0),
      delta: 'from selected period',
      tone: 'slate' as const,
      icon: 'person_add',
      note: 'Customer accounts created'
    },
    {
      label: 'Avg. Order Value',
      value: toCurrency(revenue?.averageOrderValue ?? 0),
      delta: `${revenue?.orderCount ?? 0} paid orders`,
      tone: 'slate' as const,
      icon: 'shopping_bag',
      note: 'Revenue divided by paid order count'
    },
    {
      label: 'Customer-Order Ratio',
      value: toPercentage(conversionRate),
      delta: 'orders/new customers',
      tone: 'green' as const,
      icon: 'ads_click',
      note: 'Directional funnel indicator'
    }
  ];

  const productTotalUnits = useMemo(
    () => (products ?? []).reduce((sum, product) => sum + product.unitsSold, 0),
    [products]
  );

  const productRows = useMemo(
    () => (products ?? []).map((product) => ({
      ...product,
      split: productTotalUnits ? Math.round((product.unitsSold / productTotalUnits) * 100) : 0
    })),
    [productTotalUnits, products]
  );

  const orderStatusRows = useMemo(
    () => Object.entries(orders?.byStatus ?? {}).sort((a, b) => b[1] - a[1]),
    [orders?.byStatus]
  );

  const onRefresh = () => {
    refetchRevenue();
    refetchCustomers();
    refetchOrders();
    refetchProducts();
  };

  const onExport = () => {
    const header = ['metric', 'value'];
    const rows = metrics.map((metric) => [metric.label, metric.value].join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'moon-analytics-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 lg:space-y-8" data-module="analytics-focus-layout">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] text-slate-900">Sales Performance</h3>
          <p className="text-slate-500 mt-1">Live analytics endpoints powering revenue, customer, and product trends.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="px-5 py-2.5 bg-slate-200 text-slate-900 font-semibold text-sm rounded-xl" type="button" onClick={onExport}>
            Export Report
          </button>
          <button
            className="px-5 py-2.5 bg-gradient-to-br from-[#454e90] to-[#5e67aa] text-white font-semibold text-sm rounded-xl shadow-lg"
            type="button"
            onClick={onRefresh}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {revenueError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load analytics from backend.
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric) => (
          <article key={metric.label} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-[0_10px_30px_-15px_rgba(26,28,30,0.25)]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#454e90]/10 rounded-lg text-[#454e90]"><span className="material-symbols-outlined">{metric.icon}</span></div>
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${deltaClass(metric.tone)}`}>{metric.delta}</span>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{metric.label}</p>
            <h4 className="text-2xl font-['Plus_Jakarta_Sans'] font-bold mt-1 text-slate-900">{revenueLoading ? 'Loading...' : metric.value}</h4>
            <p className="text-[11px] text-slate-400 mt-2 italic">{metric.note}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <article className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 lg:p-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h5 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">Product Revenue Comparison</h5>
              <p className="text-sm text-slate-500">Top products ranked by revenue</p>
            </div>
            <div className="text-xs text-slate-500">Top {productRows.length} products</div>
          </div>

          <div className="h-[250px] sm:h-[320px] lg:h-[350px] flex items-end justify-between px-1 sm:px-2 gap-2 sm:gap-4">
            {(productRows.length ? productRows : [{ productId: 'none', productName: 'No Data', revenue: 0, unitsSold: 0, split: 0 }]).map((entry) => {
              const maxRevenue = Math.max(...(productRows.map((row) => row.revenue) || [1]));
              const height = maxRevenue ? Math.max((entry.revenue / maxRevenue) * 100, entry.revenue > 0 ? 8 : 0) : 0;

              return (
                <div key={entry.productId} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div className="w-full relative h-[80%] flex items-end justify-center">
                    <div className="w-4 absolute bottom-0 bg-[#454e90]/80 rounded-t-md" style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 truncate max-w-full" title={entry.productName}>{entry.productName}</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 lg:p-8">
          <h5 className="font-['Plus_Jakarta_Sans'] text-xl font-bold mb-2 text-slate-900">Category Split</h5>
          <p className="text-sm text-slate-500 mb-8">Share by units sold</p>

          <div className="space-y-6">
            {(productRows.length ? productRows.slice(0, 4) : []).map((item, index) => (
              <div key={item.productId}>
                <div className="flex justify-between text-sm mb-2"><span className="font-semibold truncate">{item.productName}</span><span className="text-slate-500">{item.split}%</span></div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={[
                      'h-full rounded-full',
                      index === 0 ? 'bg-[#454e90]' : index === 1 ? 'bg-[#006689]' : index === 2 ? 'bg-[#893e00]' : 'bg-slate-400'
                    ].join(' ')}
                    style={{ width: `${item.split}%` }}
                  />
                </div>
              </div>
            ))}
            {!productRows.length ? <p className="text-sm text-slate-500">No product split data available yet.</p> : null}
          </div>

          <div className="mt-12 p-5 bg-slate-100 rounded-xl border-l-4 border-[#454e90]">
            <p className="text-xs font-bold text-[#454e90] uppercase mb-1">Backend Insight</p>
            <p className="text-[13px] leading-relaxed text-slate-600">This view is wired to `/api/admin/analytics/*` endpoints, so numbers reflect backend data rather than local mock metrics.</p>
          </div>
        </article>

        <article className="col-span-12 bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8 border-b border-slate-200/40">
            <h5 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">Order Status Snapshot</h5>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100/70 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="px-4 sm:px-6 lg:px-8 py-4 whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 whitespace-nowrap">Count</th>
                  <th className="px-4 sm:px-6 lg:px-8 py-4 whitespace-nowrap">Health</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orderStatusRows.map(([status, count]) => (
                  <tr key={status} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 whitespace-nowrap">{status}</td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 font-bold whitespace-nowrap">{count}</td>
                    <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-full ${statusClass(status)}`}>Tracked</span>
                    </td>
                  </tr>
                ))}
                {!orderStatusRows.length ? (
                  <tr>
                    <td className="px-4 sm:px-6 lg:px-8 py-5 text-slate-500" colSpan={3}>No order status data available.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
