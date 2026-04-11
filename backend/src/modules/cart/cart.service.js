const { randomUUID } = require('crypto');

const ApiError = require('../../core/errors/api-error');
const { findProductById } = require('../products/products.repository');
const cartRepository = require('./cart.repository');

function cartKey(user, sessionId) {
  return user ? { userId: user.sub } : { sessionId: sessionId || null };
}

async function getCart({ user, query }) {
  const key = cartKey(user, query?.sessionId);
  if (!key.userId && !key.sessionId) return [];
  const cart = await cartRepository.getCart(key);
  return cart ? cart.items : [];
}

async function addItem({ user, input, sessionId }) {
  const key = cartKey(user, sessionId);
  if (!key.userId && !key.sessionId) throw new ApiError(400, 'Session ID required for guest cart.');

  const { productId, quantity } = input;
  const product = await findProductById(productId);
  if (!product) throw new ApiError(404, 'Product not found.');

  const cart = await cartRepository.getCart(key);
  const items = cart ? [...cart.items] : [];

  const existing = items.find(i => i.productId === productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 99);
  } else {
    items.push({
      itemId: randomUUID(),
      productId,
      productName: product.name,
      price: Number(product.discount_price ?? product.price),
      quantity
    });
  }

  const updated = await cartRepository.upsertCart({ ...key, items });
  return updated.items;
}

async function updateItem({ user, params, input, sessionId }) {
  const key = cartKey(user, sessionId);
  if (!key.userId && !key.sessionId) throw new ApiError(400, 'Session ID required for guest cart.');

  const cart = await cartRepository.getCart(key);
  if (!cart) throw new ApiError(404, 'Cart not found.');

  const items = cart.items.map(i =>
    i.itemId === params.itemId ? { ...i, quantity: input.quantity } : i
  );
  const updated = await cartRepository.upsertCart({ ...key, items });
  return updated.items;
}

async function removeItem({ user, params, sessionId }) {
  const key = cartKey(user, sessionId);
  if (!key.userId && !key.sessionId) throw new ApiError(400, 'Session ID required for guest cart.');

  const cart = await cartRepository.getCart(key);
  if (!cart) throw new ApiError(404, 'Cart not found.');

  const items = cart.items.filter(i => i.itemId !== params.itemId);
  const updated = await cartRepository.upsertCart({ ...key, items });
  return updated.items;
}

async function clearCart({ user, sessionId }) {
  const key = cartKey(user, sessionId);
  if (!key.userId && !key.sessionId) return [];
  await cartRepository.deleteCart(key);
  return [];
}

module.exports = { addItem, clearCart, getCart, removeItem, updateItem };
