import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import { storefrontApi } from './services/storefront-api';

export const CART_STORAGE_KEY = 'moon_cart_v1';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [storefrontApi.reducerPath]: storefrontApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storefrontApi.middleware),
});

// Persist cart items to localStorage on every state change (client-only)
store.subscribe(() => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart.items));
  } catch {}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
