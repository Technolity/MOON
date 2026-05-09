'use client';

import { useMemo, useState } from 'react';
import { useGetInventoryQuery, useUpdateInventoryMutation } from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card, cardStyle } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';
import { StatCard } from '@/components/ui/StatCard';
import { Bars } from '@/components/ui/Bars';
import { Placeholder } from '@/components/ui/Placeholder';
import type { CSSProperties } from 'react';

type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface InventoryRow {
  id: string;
  name: string;
  subtitle: string;
  sku: string;
  slug: string;
  stock: number;
  reserved: number;
  available: number;
  status: InventoryStatus;
}

function inferStatus(quantity: number): InventoryStatus {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity < 10) return 'Low Stock';
  return 'In Stock';
}

function exportInventoryCsv(rows: InventoryRow[]) {
  const headers = ['product_name', 'sku', 'quantity', 'reserved', 'available', 'status'];
  const csvRows = rows.map((row) => [row.name, row.sku, String(row.stock), String(row.reserved), String(row.available), row.status].join(','));
  const csv = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'moon-inventory-report.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function InventoryPage() {
  const [filter, setFilter] = useState<'all' | 'critical'>('all');
  const [rowError, setRowError] = useState('');
  const [pendingQty, setPendingQty] = useState<Map<string, number>>(new Map());

  const getPending = (id: string, stock: number) =>
    pendingQty.has(id) ? pendingQty.get(id)! : stock;

  const { data: inventory, isLoading, isError, refetch } = useGetInventoryQuery();
  const [updateInventory, { isLoading: isUpdating }] = useUpdateInventoryMutation();

  const rows = useMemo<InventoryRow[]>(() => {
    return (inventory ?? []).map((item) => {
      const quantity = Number(item.quantity ?? 0);
      const reserved = Number(item.reserved ?? 0);
      return {
        id: item.id,
        name: item.products?.name ?? 'Unknown Product',
        subtitle: item.products?.category ?? 'No category',
        sku: item.sku,
        slug: item.products?.slug ?? '',
        stock: quantity,
        reserved,
        available: Math.max(quantity - reserved, 0),
        status: inferStatus(quantity),
      };
    });
  }, [inventory]);

  const visibleRows = useMemo(() => {
    if (filter === 'all') return rows;
    return rows.filter((row) => row.status !== 'In Stock');
  }, [rows, filter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const lowOrOut = rows.filter((row) => row.status !== 'In Stock').length;
    const totalQty = rows.reduce((sum, row) => sum + row.stock, 0);
    const outOfStock = rows.filter((row) => row.stock === 0).length;
    return { total, lowOrOut, totalQty, outOfStock };
  }, [rows]);

  const velocitySeries = useMemo(() => {
    return rows.map((r) => r.stock).slice(0, 30);
  }, [rows]);

  const updateStock = async (row: InventoryRow, nextQty: number) => {
    setRowError('');
    try {
      await updateInventory({ id: row.id, quantity: Math.max(nextQty, 0) }).unwrap();
      await refetch();
    } catch {
      setRowError(`Could not update inventory for ${row.name}.`);
    }
  };

  const lowStockRows = rows.filter((r) => r.stock <= 10 && r.stock >= 0);

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="Catalog"
        title="Inventory"
        subtitle="Stock levels across the catalog. We will alert you when items dip below their reorder threshold."
        actions={[
          <Btn key="a" variant="secondary" icon="download" size="sm" onClick={() => exportInventoryCsv(visibleRows)}>Export</Btn>,
          <Btn key="b" variant="primary" icon="add_box" size="sm" onClick={() => refetch()}>Refresh</Btn>,
        ]}
      />

      {isError && (
        <div style={{
          ...(cardStyle as CSSProperties), padding: '14px 18px',
          borderColor: 'var(--terracotta)', fontSize: 13, color: 'var(--terracotta)',
        }}>
          Unable to load inventory from backend.
        </div>
      )}

      {rowError && (
        <div style={{
          ...(cardStyle as CSSProperties), padding: '14px 18px',
          borderColor: 'var(--gold)', fontSize: 13, color: 'var(--gold)',
        }}>
          {rowError}
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <StatCard label="Total units" value={isLoading ? '...' : stats.totalQty.toLocaleString()} sub={`across ${stats.total} SKUs`} tone="ink" />
        <StatCard label="Low stock" value={isLoading ? '...' : String(stats.lowOrOut)} sub="≤ 10 units left" tone="gold" />
        <StatCard label="Out of stock" value={isLoading ? '...' : String(stats.outOfStock)} sub="reorder needed" tone="terracotta" />
      </div>

      {/* Stock alerts */}
      <Card title="Stock alerts" subtitle="Items at or below their reorder threshold" action={
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setFilter('all')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            padding: '4px 10px', borderRadius: 999,
            border: '1px solid ' + (filter === 'all' ? 'var(--saffron)' : 'var(--line)'),
            background: filter === 'all' ? 'var(--saffron-soft)' : 'transparent',
            color: filter === 'all' ? 'var(--saffron-ink)' : 'var(--ink-3)',
            cursor: 'pointer',
          }}>All</button>
          <button onClick={() => setFilter('critical')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            padding: '4px 10px', borderRadius: 999,
            border: '1px solid ' + (filter === 'critical' ? 'var(--terracotta)' : 'var(--line)'),
            background: filter === 'critical' ? 'rgba(181,87,58,0.1)' : 'transparent',
            color: filter === 'critical' ? 'var(--terracotta)' : 'var(--ink-3)',
            cursor: 'pointer',
          }}>Low/Out</button>
        </div>
      }>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {visibleRows.map((row, i) => (
            <div key={row.id} style={{
              display: 'grid', gridTemplateColumns: '50px 1fr 100px 140px 120px',
              alignItems: 'center', gap: 16,
              padding: '12px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--line)',
            }}>
              <Placeholder label="" w={42} h={42} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{row.name}</div>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{row.sku}</div>
              </div>
              <Pill tone="neutral">{row.subtitle}</Pill>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setPendingQty(m => { const n = new Map(m); n.set(row.id, Math.max(0, getPending(row.id, row.stock) - 1)); return n; })}
                  disabled={isUpdating}
                  style={{
                    width: 26, height: 26, borderRadius: 6,
                    border: '1px solid var(--line-strong)', background: 'var(--bg-elev)',
                    color: 'var(--ink-2)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 500,
                  }}
                >−</button>
                <input
                  type="number"
                  min="0"
                  value={getPending(row.id, row.stock)}
                  onChange={e => setPendingQty(m => { const n = new Map(m); n.set(row.id, Math.max(0, Number(e.target.value))); return n; })}
                  style={{
                    width: 52, textAlign: 'center',
                    border: '1px solid var(--line)', borderRadius: 6,
                    background: 'var(--bg-elev)', padding: '2px 4px',
                    fontSize: 13, fontFamily: 'var(--font-mono)',
                    color: row.stock === 0 ? 'var(--terracotta)' : row.stock <= 10 ? 'var(--gold)' : 'var(--ink)',
                  }}
                />
                <button
                  onClick={() => setPendingQty(m => { const n = new Map(m); n.set(row.id, getPending(row.id, row.stock) + 1); return n; })}
                  disabled={isUpdating}
                  style={{
                    width: 26, height: 26, borderRadius: 6,
                    border: '1px solid var(--line-strong)', background: 'var(--bg-elev)',
                    color: 'var(--ink-2)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 500,
                  }}
                >+</button>
                {pendingQty.has(row.id) && (
                  <button
                    onClick={() => {
                      updateStock(row, pendingQty.get(row.id)!);
                      setPendingQty(m => { const n = new Map(m); n.delete(row.id); return n; });
                    }}
                    disabled={isUpdating}
                    style={{
                      marginLeft: 6, padding: '3px 10px', fontSize: 12, borderRadius: 6,
                      border: '1px solid var(--sage)', background: 'var(--sage-soft)',
                      color: 'var(--sage)', cursor: 'pointer', fontWeight: 500,
                    }}
                  >Save</button>
                )}
              </div>
              <Pill tone={row.status === 'In Stock' ? 'sage' : row.status === 'Low Stock' ? 'gold' : 'terracotta'}>
                {row.status}
              </Pill>
            </div>
          ))}
          {!isLoading && visibleRows.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
              No inventory items match this filter.
            </div>
          )}
          {isLoading && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
              Loading inventory…
            </div>
          )}
        </div>
      </Card>

      {/* Velocity */}
      {velocitySeries.length > 1 && (
        <Card title="Stock distribution" subtitle="Current stock levels across products">
          <Bars data={velocitySeries} height={140} />
        </Card>
      )}
    </div>
  );
}
