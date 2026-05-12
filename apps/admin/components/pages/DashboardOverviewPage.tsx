'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetAdminDashboardQuery,
  useGetAdminOrderMetricsQuery,
  useGetAdminProductMetricsQuery,
  useGetAdminRevenueMetricsQuery,
  useGetAnalyticsTimelineQuery,
} from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card, cardClass } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';
import { AreaChart } from '@/components/ui/AreaChart';

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
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function DashboardOverviewPage() {
  const router = useRouter();
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
    refetch,
  } = useGetAdminDashboardQuery(queryParams);

  const { data: revenueMetrics } = useGetAdminRevenueMetricsQuery(queryParams);
  const { data: orderMetrics } = useGetAdminOrderMetricsQuery(queryParams);
  const { data: productMetrics } = useGetAdminProductMetricsQuery({ ...queryParams, limit: 6 });
  const { data: analyticsTimeline } = useGetAnalyticsTimelineQuery(queryParams);

  const totalRevenue = revenueMetrics?.totalRevenue ?? dashboard?.revenue ?? 0;
  const totalOrders = dashboard?.totalOrders ?? orderMetrics?.total ?? 0;
  const avgOrder = revenueMetrics?.averageOrderValue ?? 0;
  const lowStock = dashboard?.lowStockCount ?? 0;

  // Build revenue series from real timeline data for the chart
  const revenueSeries = useMemo(() => {
    if (analyticsTimeline?.timeline && analyticsTimeline.timeline.length > 0) {
      return analyticsTimeline.timeline.map(b => b.revenue);
    }
    // Fallback to flat line if no timeline data yet
    const days = timeframe === 'daily' ? 1 : timeframe === 'weekly' ? 7 : 30;
    return Array.from({ length: days }, () => totalRevenue / Math.max(days, 1));
  }, [analyticsTimeline, totalRevenue, timeframe]);

  const stats = [
    { label: `Revenue · ${timeframe === 'daily' ? '1d' : timeframe === 'weekly' ? '7d' : '30d'}`, value: currency(totalRevenue), delta: revenueMetrics?.orderCount ? `${revenueMetrics.orderCount} orders` : '—', positive: true, sub: 'vs prev. period' },
    { label: 'Orders', value: String(totalOrders), delta: `${timeframe}`, positive: true, sub: 'total placed' },
    { label: 'Avg. order', value: currency(avgOrder), delta: '—', positive: true, sub: 'rolling average' },
    { label: 'Low Stock SKUs', value: String(lowStock), delta: lowStock > 0 ? `${lowStock} items` : '0', positive: lowStock === 0, sub: 'need attention' },
  ];

  const statusRows = useMemo(
    () => Object.entries(orderMetrics?.byStatus ?? {}).sort((a, b) => b[1] - a[1]),
    [orderMetrics?.byStatus]
  );

  const pillTone = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'confirmed' || s === 'paid') return 'sage' as const;
    if (s === 'shipped' || s === 'packed' || s === 'fulfilled') return 'saffron' as const;
    if (s === 'cancelled' || s === 'refunded') return 'plum' as const;
    return 'gold' as const;
  };

  return (
    <div className="anim-fade-in flex flex-col gap-[24px]">
      <PageHeader
        eyebrow={getTodayLabel()}
        title={<>{getGreeting()}, <em className="italic text-[var(--saffron)]">Admin</em>.</>}
        subtitle="Here is how Moon is performing today."
        actions={[
          <Btn key="1" variant="secondary" icon="download" size="sm">Export report</Btn>,
          <Btn key="2" variant="primary" icon="add" size="sm">New product</Btn>,
        ]}
      />

      {isDashboardError ? (
        <div className={`${cardClass} py-[14px] px-[18px] border-[var(--terracotta)] flex items-center justify-between gap-[12px] text-[13px] text-[var(--terracotta)]`}>
          <span>Could not load dashboard analytics from backend.</span>
          <Btn variant="danger" size="sm" onClick={() => refetch()}>Retry</Btn>
        </div>
      ) : null}

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-[14px]">
        {stats.map((s, i) => (
          <div key={i} className={`${cardClass} p-[18px] flex flex-col gap-[10px]`}>
            <div className="text-[11.5px] text-[var(--ink-3)] tracking-[0.05em] uppercase">{s.label}</div>
            <div className="display text-[34px] leading-none text-[var(--ink)]">
              {isDashboardLoading ? '...' : s.value}
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <Pill tone={s.positive ? 'sage' : 'terracotta'} size="sm">
                <Icon name={s.positive ? 'arrow_upward' : 'arrow_downward'} size={12} weight={500} /> {s.delta}
              </Pill>
              <span className="text-[var(--ink-3)]">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div className="grid grid-cols-[1.7fr_1fr] gap-[14px]">
        <Card title="Revenue" subtitle={`${timeframe === 'daily' ? 'Last 24h' : timeframe === 'weekly' ? 'Last 7 days' : 'Last 30 days'}`} action={
          <div className="flex gap-[6px]">
            {[
              { id: 'daily' as Timeframe, label: '1d' },
              { id: 'weekly' as Timeframe, label: '7d' },
              { id: 'monthly' as Timeframe, label: '30d' },
            ].map((t) => (
              <button key={t.id} onClick={() => setTimeframe(t.id)} className={`font-mono text-[11px] py-[4px] px-[10px] rounded-full border cursor-pointer ${timeframe === t.id ? 'border-[var(--saffron)] bg-[var(--saffron-soft)] text-[var(--saffron-ink)]' : 'border-[var(--line)] bg-transparent text-[var(--ink-3)]'}`}>
                {t.label}
              </button>
            ))}
          </div>
        }>
          <AreaChart data={revenueSeries.length > 1 ? revenueSeries : [0, 0]} height={220} />
          <div className="flex gap-[24px] mt-[14px] text-[12px] text-[var(--ink-3)]">
            <div><span className="mono text-[var(--ink)]">{currency(totalRevenue)}</span> total</div>
            <div><span className="mono text-[var(--saffron)]">{currency(avgOrder)}</span> avg. order</div>
            <div><span className="mono text-[var(--ink)]">{totalOrders}</span> orders</div>
          </div>
        </Card>

        <Card title="Order status" subtitle="Distribution by status">
          <div className="flex flex-col gap-[13px]">
            {statusRows.length > 0 ? statusRows.map(([status, count]) => {
              const total = orderMetrics?.total ?? 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-[13px] mb-[5px]">
                    <span className="text-[var(--ink)] font-medium">{status}</span>
                    <span className="mono text-[var(--ink-3)] text-[12px]">{count} ({pct}%)</span>
                  </div>
                  <div className="h-[6px] bg-[var(--bg-sunk)] rounded-[4px] overflow-hidden">
                    <div className="h-full bg-[var(--saffron)] rounded-[4px]" style={{ width: `${Math.min(pct * 2.5, 100)}%` }} />
                  </div>
                </div>
              );
            }) : (
              <p className="text-[13px] text-[var(--ink-3)]">No order data yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card title="Top products" subtitle="By units sold" action={
        <Btn variant="ghost" size="sm" iconRight="arrow_forward" onClick={() => router.push('/inventory')}>All inventory</Btn>
      }>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[11px] tracking-[0.06em] uppercase text-[var(--ink-3)]">
              <th className="text-left pb-[10px] font-medium">Product</th>
              <th className="text-right pb-[10px] font-medium">Units Sold</th>
              <th className="text-right pb-[10px] font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {(productMetrics ?? []).map((p) => (
              <tr key={p.productId} className="border-t border-[var(--line)] text-[13px]">
                <td className="py-[12px] text-[var(--ink)] font-medium">{p.productName}</td>
                <td className="py-[12px] text-right text-[var(--ink-2)] mono">{p.unitsSold}</td>
                <td className="py-[12px] text-right text-[var(--ink)] mono">{currency(p.revenue)}</td>
              </tr>
            ))}
            {!productMetrics?.length ? (
              <tr>
                <td className="py-[12px] text-[var(--ink-3)]" colSpan={3}>No product data available yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
