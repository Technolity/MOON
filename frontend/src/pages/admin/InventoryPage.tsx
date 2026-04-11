import { useMemo, useState } from 'react';
import { useGetInventoryQuery, useUpdateInventoryMutation } from '../../store/services/api';

type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface InventoryRow {
  id: string;
  name: string;
  subtitle: string;
  sku: string;
  stock: number;
  reserved: number;
  available: number;
  status: InventoryStatus;
}

function statusClass(status: InventoryStatus) {
  if (status === 'In Stock') return 'bg-green-100 text-green-700';
  if (status === 'Low Stock') return 'bg-[#DA7937]/10 text-[#DA7937]';
  return 'bg-red-100 text-red-700';
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

  const {
    data: inventory,
    isLoading,
    isError,
    refetch
  } = useGetInventoryQuery();

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
        stock: quantity,
        reserved,
        available: Math.max(quantity - reserved, 0),
        status: inferStatus(quantity)
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
    return { total, lowOrOut, totalQty };
  }, [rows]);

  const updateStock = async (row: InventoryRow, nextQty: number) => {
    setRowError('');

    try {
      await updateInventory({
        id: row.id,
        quantity: Math.max(nextQty, 0)
      }).unwrap();
      await refetch();
    } catch {
      setRowError(`Could not update inventory for ${row.name}.`);
    }
  };

  return (
    <section className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto w-full" data-module="inventory-layout">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight">Inventory Management</h2>
          <p className="text-slate-500 mt-1">Live stock visibility from backend inventory API.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="px-5 py-2.5 bg-slate-100 text-slate-900 rounded-full font-semibold text-sm hover:bg-slate-200" type="button" onClick={() => exportInventoryCsv(visibleRows)}>
            Export Report
          </button>
          <button
            className="px-5 py-2.5 bg-gradient-to-br from-[#454e90] to-[#5e67aa] text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg"
            type="button"
            onClick={() => refetch()}
          >
            Refresh Inventory
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load inventory from backend.
        </div>
      ) : null}

      {rowError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {rowError}
        </div>
      ) : null}

      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilter('all')}
        >
          All Items
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === 'critical' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setFilter('critical')}
        >
          Low/Out of Stock
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-[0_10px_30px_-15px_rgba(26,28,30,0.25)] overflow-hidden border border-slate-200/60">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg">Product Registry</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/60 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Product Details</th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">SKU</th>
                  <th className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">Quantity</th>
                  <th className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">Available</th>
                  <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {visibleRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="font-semibold text-slate-900">{row.name}</div>
                      <div className="text-xs text-slate-400">{row.subtitle}</div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 sm:py-5 text-slate-500 font-mono whitespace-nowrap">{row.sku}</td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-center font-semibold whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          className="w-7 h-7 rounded-md border border-slate-300 text-slate-700"
                          onClick={() => updateStock(row, row.stock - 1)}
                          disabled={isUpdating}
                          aria-label={`Decrease stock for ${row.name}`}
                        >
                          -
                        </button>
                        <span className="min-w-[2ch]">{row.stock}</span>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-md border border-slate-300 text-slate-700"
                          onClick={() => updateStock(row, row.stock + 1)}
                          disabled={isUpdating}
                          aria-label={`Increase stock for ${row.name}`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-center font-semibold whitespace-nowrap">{row.available}</td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(row.status)}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
                {!isLoading && visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-6 text-sm text-slate-500">No inventory rows for this filter.</td>
                  </tr>
                ) : null}
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-6 text-sm text-slate-500">Loading inventory...</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <article className="bg-white rounded-2xl shadow-[0_10px_30px_-15px_rgba(26,28,30,0.25)] p-5 sm:p-6 border border-slate-200/60">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg">Inventory Snapshot</h3>
                <p className="text-xs text-slate-400">Real-time totals</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">monitoring</span>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] text-slate-400 uppercase">Tracked Products</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] text-slate-400 uppercase">Low/Out of Stock</p>
                <p className="text-2xl font-bold text-slate-900">{stats.lowOrOut}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] text-slate-400 uppercase">Total Units in Stock</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalQty}</p>
              </div>
            </div>
          </article>

          <article className="bg-gradient-to-br from-[#5e67aa] to-[#454e90] rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg mb-1">Operational Note</h3>
            <p className="text-xs text-white/70 mb-5">Use +/- controls in the table to update quantities. Changes are persisted via `/api/inventory/:id`.</p>
            <p className="text-sm leading-relaxed text-white/90">
              This page is now backend-driven. Any stock update here reflects directly in inventory records used for checkout validation.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
