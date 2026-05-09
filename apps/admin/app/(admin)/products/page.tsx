'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetAdminProductsQuery, useUpdateAdminProductMutation } from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Toggle } from '@/components/ui/Toggle';
import { Placeholder } from '@/components/ui/Placeholder';

type FilterType = 'all' | 'active' | 'archived';

function currency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

export default function ProductsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const { data: products, isLoading, isError } = useGetAdminProductsQuery();
  const [updateProduct] = useUpdateAdminProductMutation();

  const toggleActive = (id: string, current: boolean) => {
    updateProduct({ id, patch: { is_active: !current } });
  };

  const visibleProducts = (products || []).filter((p) => {
    if (filter === 'active' && !p.is_active) return false;
    if (filter === 'archived' && p.is_active) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  if (isError) {
    return <div style={{ padding: 40, color: 'var(--terracotta)' }}>Failed to load products.</div>;
  }

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        actions={[
          <Btn key="1" variant="secondary" icon="download" size="sm" onClick={() => {
            const headers = ['name','slug','category','price','discount_price','is_active'];
            const rows = visibleProducts.map(p => [p.name, p.slug, p.category ?? '', String(p.price), String(p.discount_price ?? ''), String(!!p.is_active)].join(','));
            const csv = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = 'moon-products.csv'; link.click();
            URL.revokeObjectURL(url);
          }}>Export</Btn>,
          <Btn key="2" variant="primary" icon="add" size="sm" onClick={() => router.push('/products/new')}>New product</Btn>,
        ]}
      />

      <Card padding={0}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'active', 'archived'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'capitalize',
                padding: '6px 14px', borderRadius: 999,
                border: '1px solid ' + (filter === f ? 'var(--ink)' : 'transparent'),
                background: filter === f ? 'var(--ink)' : 'transparent',
                color: filter === f ? 'var(--bg)' : 'var(--ink-2)',
                cursor: 'pointer',
              }}>{f}</button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 240 }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: 8, fontSize: 16, color: 'var(--ink-3)' }}>search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '6px 12px 6px 32px',
                background: 'var(--bg-sunk)', border: '1px solid var(--line)', borderRadius: 8,
                fontSize: 13, color: 'var(--ink)', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)', borderBottom: '1px solid var(--line)' }}>
              <th style={{ padding: '16px 22px', textAlign: 'left', fontWeight: 500, width: 40 }} />
              <th style={{ padding: '16px 22px', textAlign: 'left', fontWeight: 500 }}>Product</th>
              <th style={{ padding: '16px 22px', textAlign: 'left', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 22px', textAlign: 'left', fontWeight: 500 }}>Category</th>
              <th style={{ padding: '16px 22px', textAlign: 'right', fontWeight: 500 }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>Loading products...</td></tr>
            ) : visibleProducts.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>No products found.</td></tr>
            ) : visibleProducts.map((p) => {
              const rawThumb = p.images?.[0]?.url || p.image_url;
              const isFallback = p.images?.[0]?.isFallback === true;
              const thumb = (() => { try { new URL(rawThumb!); return rawThumb; } catch { return null; } })();
              
              return (
                <tr
                  key={p.id}
                  style={{ borderBottom: '1px solid var(--line)', transition: 'background .15s', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  onClick={(e) => {
                    // Don't navigate if clicking the toggle
                    if ((e.target as HTMLElement).closest('button[role="switch"]')) return;
                    router.push(`/products/${p.id}`);
                  }}
                >
                  <td style={{ padding: '14px 22px' }}>
                    {thumb ? (
                      <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)' }}>
                        <Image src={thumb} alt={p.name} width={44} height={44} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {isFallback && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 7, textAlign: 'center', padding: '1px 0', letterSpacing: '0.05em', fontWeight: 600 }}>STOCK</div>
                        )}
                      </div>
                    ) : (
                      <Placeholder label="IMG" w={44} h={44} />
                    )}
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{p.name}</div>
                    <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{p.slug}</div>
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Toggle checked={!!p.is_active} onChange={() => toggleActive(p.id, !!p.is_active)} />
                      <span style={{ fontSize: 13, color: p.is_active ? 'var(--ink)' : 'var(--ink-3)' }}>
                        {p.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    {p.category ? <Pill tone="neutral">{p.category}</Pill> : <span style={{ color: 'var(--ink-4)' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 22px', textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 13, color: 'var(--ink)' }}>{currency(p.discount_price ?? p.price)}</div>
                    {p.discount_price && <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', textDecoration: 'line-through' }}>{currency(p.price)}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
