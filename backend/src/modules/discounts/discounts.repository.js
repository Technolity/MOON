const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

const DATA_PATH = path.resolve(__dirname, '../../../data/discount-codes.json');

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase();
}

function isMissingDiscountTable(error) {
  const message = String(error?.message || '');
  return message.includes('discount_codes') && (
    message.includes('schema cache') ||
    message.includes('does not exist') ||
    message.includes('relation')
  );
}

async function readLocalDiscounts() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeLocalDiscounts(discounts) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(discounts, null, 2));
}

function localRowFromInput(fields, existing = {}) {
  const now = new Date().toISOString();
  return {
    id: existing.id || randomUUID(),
    code: 'code' in fields ? normalizeCode(fields.code) : existing.code,
    type: 'type' in fields ? fields.type : existing.type,
    value: 'value' in fields ? fields.value : existing.value,
    minimum_subtotal: 'minimumSubtotal' in fields ? fields.minimumSubtotal : (existing.minimum_subtotal ?? 0),
    max_discount: 'maxDiscount' in fields ? fields.maxDiscount : (existing.max_discount ?? null),
    usage_limit: 'usageLimit' in fields ? fields.usageLimit : (existing.usage_limit ?? null),
    usage_count: existing.usage_count ?? 0,
    starts_at: 'startsAt' in fields ? fields.startsAt : (existing.starts_at ?? null),
    ends_at: 'endsAt' in fields ? fields.endsAt : (existing.ends_at ?? null),
    is_active: 'isActive' in fields ? fields.isActive : (existing.is_active ?? true),
    created_at: existing.created_at || now,
    updated_at: now
  };
}

async function listLocalDiscounts() {
  const discounts = await readLocalDiscounts();
  return discounts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

async function findLocalDiscountByCode(code) {
  const normalized = normalizeCode(code);
  const discounts = await readLocalDiscounts();
  return discounts.find((discount) => normalizeCode(discount.code) === normalized) || null;
}

async function createLocalDiscount(fields) {
  const discounts = await readLocalDiscounts();
  const normalized = normalizeCode(fields.code);
  if (discounts.some((discount) => normalizeCode(discount.code) === normalized)) {
    throw new ApiError(409, 'Discount code already exists.');
  }
  const discount = localRowFromInput(fields);
  discounts.push(discount);
  await writeLocalDiscounts(discounts);
  return discount;
}

async function updateLocalDiscount(id, fields) {
  const discounts = await readLocalDiscounts();
  const index = discounts.findIndex((discount) => discount.id === id);
  if (index === -1) throw new ApiError(404, 'Discount code not found.');

  if (fields.code) {
    const normalized = normalizeCode(fields.code);
    const duplicate = discounts.some((discount) => discount.id !== id && normalizeCode(discount.code) === normalized);
    if (duplicate) throw new ApiError(409, 'Discount code already exists.');
  }

  const updated = localRowFromInput(fields, discounts[index]);
  discounts[index] = updated;
  await writeLocalDiscounts(discounts);
  return updated;
}

async function deleteLocalDiscount(id) {
  const discounts = await readLocalDiscounts();
  await writeLocalDiscounts(discounts.filter((discount) => discount.id !== id));
}

function mapInput(fields) {
  const mapped = {};
  if ('code' in fields) mapped.code = normalizeCode(fields.code);
  if ('type' in fields) mapped.type = fields.type;
  if ('value' in fields) mapped.value = fields.value;
  if ('minimumSubtotal' in fields) mapped.minimum_subtotal = fields.minimumSubtotal;
  if ('maxDiscount' in fields) mapped.max_discount = fields.maxDiscount;
  if ('usageLimit' in fields) mapped.usage_limit = fields.usageLimit;
  if ('startsAt' in fields) mapped.starts_at = fields.startsAt;
  if ('endsAt' in fields) mapped.ends_at = fields.endsAt;
  if ('isActive' in fields) mapped.is_active = fields.isActive;
  return mapped;
}

async function listDiscounts() {
  const db = getSupabaseAdminClient();
  if (!db) return listLocalDiscounts();

  const { data, error } = await db
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (isMissingDiscountTable(error)) return listLocalDiscounts();
  if (error) throw new ApiError(500, error.message);
  return data ?? [];
}

async function findDiscountByCode(code) {
  const db = getSupabaseAdminClient();
  if (!db) return findLocalDiscountByCode(code);

  const { data, error } = await db
    .from('discount_codes')
    .select('*')
    .eq('code', normalizeCode(code))
    .maybeSingle();

  if (isMissingDiscountTable(error)) return findLocalDiscountByCode(code);
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function createDiscount(fields) {
  const db = getSupabaseAdminClient();
  if (!db) return createLocalDiscount(fields);

  const { data, error } = await db
    .from('discount_codes')
    .insert(mapInput(fields))
    .select()
    .single();

  if (isMissingDiscountTable(error)) return createLocalDiscount(fields);
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function updateDiscount(id, fields) {
  const db = getSupabaseAdminClient();
  if (!db) return updateLocalDiscount(id, fields);

  const { data, error } = await db
    .from('discount_codes')
    .update(mapInput(fields))
    .eq('id', id)
    .select()
    .single();

  if (isMissingDiscountTable(error)) return updateLocalDiscount(id, fields);
  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, 'Discount code not found.');
  return data;
}

async function deleteDiscount(id) {
  const db = getSupabaseAdminClient();
  if (!db) return deleteLocalDiscount(id);

  const { error } = await db.from('discount_codes').delete().eq('id', id);
  if (isMissingDiscountTable(error)) return deleteLocalDiscount(id);
  if (error) throw new ApiError(500, error.message);
}

module.exports = {
  createDiscount,
  deleteDiscount,
  findDiscountByCode,
  listDiscounts,
  normalizeCode,
  updateDiscount
};
