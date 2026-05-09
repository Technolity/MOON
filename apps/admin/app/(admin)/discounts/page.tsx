'use client';

import { FormEvent, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Btn } from '@/components/ui/Btn';
import { Field } from '@/components/ui/Field';
import { MoonInput } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import {
  useCreateAdminDiscountMutation,
  useDeleteAdminDiscountMutation,
  useGetAdminDiscountsQuery,
  useUpdateAdminDiscountMutation,
} from '@/lib/store/services/admin-api';
import type { DiscountCode, DiscountWritePayload } from '@/lib/store/services/admin-api';

const currency = (value: number | null | undefined) => `₹${Number(value ?? 0).toLocaleString('en-IN')}`;

function toDateTimeLocal(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function emptyForm(): DiscountWritePayload {
  return {
    code: '',
    type: 'percent',
    value: 10,
    minimumSubtotal: 0,
    maxDiscount: null,
    usageLimit: null,
    startsAt: null,
    endsAt: null,
    isActive: true,
  };
}

function formFromDiscount(discount: DiscountCode): DiscountWritePayload {
  return {
    code: discount.code,
    type: discount.type,
    value: Number(discount.value),
    minimumSubtotal: Number(discount.minimum_subtotal),
    maxDiscount: discount.max_discount == null ? null : Number(discount.max_discount),
    usageLimit: discount.usage_limit,
    startsAt: discount.starts_at,
    endsAt: discount.ends_at,
    isActive: discount.is_active,
  };
}

export default function DiscountsPage() {
  const { data: discounts = [], isLoading } = useGetAdminDiscountsQuery();
  const [createDiscount, { isLoading: isCreating }] = useCreateAdminDiscountMutation();
  const [updateDiscount, { isLoading: isUpdating }] = useUpdateAdminDiscountMutation();
  const [deleteDiscount] = useDeleteAdminDiscountMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DiscountWritePayload>(emptyForm());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const activeCount = useMemo(() => discounts.filter((discount) => discount.is_active).length, [discounts]);
  const isBusy = isCreating || isUpdating;

  const updateForm = <K extends keyof DiscountWritePayload>(key: K, value: DiscountWritePayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError('');
    setMessage('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const payload: DiscountWritePayload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      value: Number(form.value),
      minimumSubtotal: Number(form.minimumSubtotal ?? 0),
      maxDiscount: form.maxDiscount == null || Number(form.maxDiscount) === 0 ? null : Number(form.maxDiscount),
      usageLimit: form.usageLimit == null || Number(form.usageLimit) === 0 ? null : Number(form.usageLimit),
      startsAt: form.startsAt ? fromDateTimeLocal(form.startsAt) : null,
      endsAt: form.endsAt ? fromDateTimeLocal(form.endsAt) : null,
      isActive: Boolean(form.isActive),
    };

    try {
      if (editingId) {
        await updateDiscount({ id: editingId, patch: payload }).unwrap();
        setMessage('Discount updated.');
      } else {
        await createDiscount(payload).unwrap();
        setMessage('Discount created.');
      }
      setEditingId(null);
      setForm(emptyForm());
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message ?? 'Discount save failed.');
    }
  };

  const edit = (discount: DiscountCode) => {
    setEditingId(discount.id);
    setForm(formFromDiscount(discount));
    setError('');
    setMessage('');
  };

  const remove = async (discount: DiscountCode) => {
    if (!window.confirm(`Delete discount ${discount.code}?`)) return;
    setError('');
    try {
      await deleteDiscount(discount.id).unwrap();
      if (editingId === discount.id) resetForm();
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message ?? 'Delete failed.');
    }
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1120 }}>
      <PageHeader
        eyebrow="Commerce"
        title="Discounts"
        subtitle={`${activeCount} active code${activeCount === 1 ? '' : 's'} available at checkout.`}
      />

      {error ? <div style={{ padding: 12, border: '1px solid var(--terracotta)', color: 'var(--terracotta)', borderRadius: 10 }}>{error}</div> : null}
      {message ? <div style={{ padding: 12, border: '1px solid var(--sage)', color: 'var(--sage)', borderRadius: 10 }}>{message}</div> : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 24, alignItems: 'start' }}>
        <Card title={editingId ? 'Edit discount' : 'Create discount'} subtitle="Use these codes in checkout to test exact Razorpay payment amounts.">
          <form onSubmit={submit} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Code">
              <MoonInput value={form.code} onChange={(event) => updateForm('code', event.target.value)} placeholder="PAYTEST" required />
            </Field>

            <Field label="Type">
              <select
                value={form.type}
                onChange={(event) => updateForm('type', event.target.value as DiscountWritePayload['type'])}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg-sunk)' }}
              >
                <option value="percent">Percentage off</option>
                <option value="fixed">Fixed amount off</option>
              </select>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label={form.type === 'percent' ? 'Percent' : 'Amount'}>
                <MoonInput type="number" min={0} step="0.01" value={form.value} onChange={(event) => updateForm('value', Number(event.target.value))} required />
              </Field>
              <Field label="Minimum subtotal">
                <MoonInput type="number" min={0} step="0.01" value={form.minimumSubtotal ?? 0} onChange={(event) => updateForm('minimumSubtotal', Number(event.target.value))} />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Max discount">
                <MoonInput type="number" min={0} step="0.01" value={form.maxDiscount ?? ''} onChange={(event) => updateForm('maxDiscount', event.target.value ? Number(event.target.value) : null)} placeholder="Optional" />
              </Field>
              <Field label="Usage limit">
                <MoonInput type="number" min={1} step="1" value={form.usageLimit ?? ''} onChange={(event) => updateForm('usageLimit', event.target.value ? Number(event.target.value) : null)} placeholder="Optional" />
              </Field>
            </div>

            <Field label="Starts at">
              <MoonInput type="datetime-local" value={toDateTimeLocal(form.startsAt ?? null)} onChange={(event) => updateForm('startsAt', event.target.value || null)} />
            </Field>
            <Field label="Ends at">
              <MoonInput type="datetime-local" value={toDateTimeLocal(form.endsAt ?? null)} onChange={(event) => updateForm('endsAt', event.target.value || null)} />
            </Field>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Toggle checked={Boolean(form.isActive)} onChange={(value) => updateForm('isActive', value)} />
              <span style={{ fontSize: 13, color: 'var(--ink)' }}>Active at checkout</span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Btn type="submit" disabled={isBusy} icon="sell">{isBusy ? 'Saving...' : editingId ? 'Update code' : 'Create code'}</Btn>
              {editingId ? <Btn variant="secondary" onClick={resetForm}>Cancel</Btn> : null}
            </div>
          </form>
        </Card>

        <Card title="Codes" subtitle={isLoading ? 'Loading discounts...' : `${discounts.length} total`}>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {discounts.length === 0 && !isLoading ? (
              <div style={{ padding: 24, color: 'var(--ink-2)', textAlign: 'center' }}>No discount codes yet.</div>
            ) : null}
            {discounts.map((discount) => {
              const valueLabel = discount.type === 'percent'
                ? `${Number(discount.value)}% off`
                : `${currency(Number(discount.value))} off`;
              return (
                <div
                  key={discount.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 16,
                    padding: 14,
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    background: 'var(--bg-sunk)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink)' }}>{discount.code}</span>
                      <span style={{ fontSize: 11, color: discount.is_active ? 'var(--sage)' : 'var(--ink-3)' }}>
                        {discount.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-2)' }}>
                      {valueLabel}
                      {Number(discount.minimum_subtotal) > 0 ? ` · min ${currency(Number(discount.minimum_subtotal))}` : ''}
                      {discount.max_discount != null ? ` · cap ${currency(Number(discount.max_discount))}` : ''}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-3)' }}>
                      Used {discount.usage_count}{discount.usage_limit ? ` / ${discount.usage_limit}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Btn variant="secondary" size="sm" onClick={() => edit(discount)}>Edit</Btn>
                    <Btn variant="danger" size="sm" onClick={() => remove(discount)}>Delete</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
