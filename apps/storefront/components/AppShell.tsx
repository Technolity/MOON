'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { ProductDetailModal } from './ProductDetailModal';
import { AppContext } from './AppContext';
import { WhatsAppWidget } from './WhatsAppWidget';
import { productOrder, productStories } from '@/lib/data/product-statics';
import { mapBackendProductsToCatalogItems, productKeyBySlug } from '@/lib/products/catalog';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  useAddCartItemMutation,
  useClearCartMutation,
  useGetCartQuery,
  useGetProductsQuery,
  useRemoveCartItemMutation,
} from '@/lib/store/services/storefront-api';
import { getGuestCartSessionId } from '@/lib/store/services/cartSession';
import { addItem, clearCart, removeItem, setItems } from '@/lib/store/slices/cartSlice';
import { CART_STORAGE_KEY } from '@/lib/store';
import type { BackendCartItem } from '@/lib/store/services/storefront-api';
import type { CartItem, CatalogItem, ProductKey } from '@/lib/types';
import type { ReactNode } from 'react';

const slugByProductKey: Partial<Record<ProductKey, string>> = {
  shilajit: 'shilajit',
  kashmiriSaffron: 'kashmiri-saffron',
  kashmiriHoney: 'kashmiri-honey',
  iraniSaffron: 'irani-saffron',
  kashmiriAlmonds: 'kashmiri-almonds',
  walnuts: 'kashmiri-walnuts',
  kashmiriGhee: 'kashmiri-ghee',
};

function trackEvent(eventName: string, payload: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof (window as typeof window & { gtag?: Function }).gtag === 'function') {
    (window as typeof window & { gtag: Function }).gtag('event', eventName, {
      event_category: 'ecommerce',
      ...payload,
    });
  }
}

function mapBackendCartItems(items: BackendCartItem[], catalog: CatalogItem[] = []) {
  const catalogById = catalog.reduce((map, ci) => { map[ci.id] = ci; return map; }, {} as Record<string, CatalogItem>);
  return items.map((item) => ({
    id: item.productId,
    itemId: item.itemId,
    title: item.productName,
    price: Number(item.price),
    quantity: item.quantity,
    image: catalogById[item.productId]?.image,
  }));
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const guestSessionId = useMemo(() => getGuestCartSessionId(), []);

  const [activeProduct, setActiveProduct] = useState<ProductKey>('shilajit');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);
  const [isClosingProductRoute, setIsClosingProductRoute] = useState(false);

  const { data: backendProducts } = useGetProductsQuery();
  const { data: backendCartItems, isSuccess: isCartLoaded } = useGetCartQuery({ sessionId: guestSessionId });
  const [addCartItemMutation] = useAddCartItemMutation();
  const [removeCartItemMutation] = useRemoveCartItemMutation();
  const [clearCartMutation] = useClearCartMutation();

  const catalogItems = useMemo(() => {
    return mapBackendProductsToCatalogItems(backendProducts);
  }, [backendProducts]);

  const catalogByProductKey = useMemo(
    () =>
      catalogItems.reduce((map, item) => {
        if (item.productKey) map[item.productKey] = { id: item.id, title: item.title, price: item.price };
        return map;
      }, {} as Partial<Record<ProductKey, { id: string; title: string; price: number }>>),
    [catalogItems]
  );

  const resolvedProductKey: ProductKey = useMemo(() => {
    const current = String(activeProduct);
    return (productOrder as string[]).includes(current) ? activeProduct : 'shilajit';
  }, [activeProduct]);

  const activeStory = productStories[resolvedProductKey] ?? productStories.shilajit;
  const isAdminRoute = pathname.startsWith('/admin');

  useRevealAnimation();

  // Restore persisted cart from localStorage after client mount (avoids SSR hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed: CartItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        dispatch(setItems(parsed));
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isCartLoaded || !backendCartItems) return;
    const mapped = mapBackendCartItems(backendCartItems, catalogItems);
    // Skip empty backend response — never wipe a locally-added cart that hasn't synced yet
    if (mapped.length === 0) return;
    dispatch(setItems(mapped));
  }, [backendCartItems, catalogItems, dispatch, isCartLoaded]);

  useEffect(() => {
    if (activeStory?.theme) {
      document.body.dataset.theme = activeStory.theme;
    }
  }, [activeStory]);

  useEffect(() => {
    const updateNavbarOnScroll = () => {
      const navbar = document.getElementById('navbar');
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    };
    updateNavbarOnScroll();
    window.addEventListener('scroll', updateNavbarOnScroll);
    return () => window.removeEventListener('scroll', updateNavbarOnScroll);
  }, []);

  // Handle hash-based scroll on route change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else if (pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname]);

  useEffect(() => {
    if (isAdminRoute && isCartDrawerOpen) setIsCartDrawerOpen(false);
  }, [isAdminRoute, isCartDrawerOpen]);

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isCartDrawerOpen]);

  // Auto-open product modal when navigating directly to /products/:slug
  useEffect(() => {
    const match = pathname.match(/^\/products\/(.+)$/);
    if (!match) return;
    if (isClosingProductRoute) return;
    const slug = match[1];
    const backendProduct = backendProducts?.find((product) => product.slug === slug);
    const productKey = productKeyBySlug[slug];
    const item = backendProduct
      ? catalogItems.find((ci) => ci.id === backendProduct.id)
      : productKey
        ? catalogItems.find((ci) => ci.productKey === productKey)
        : null;
    if (item && (!selectedProduct || selectedProduct.id !== item.id)) {
      setSelectedProduct(item);
      setIsCartDrawerOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, catalogItems, backendProducts, isClosingProductRoute]);

  useEffect(() => {
    if (!isClosingProductRoute || pathname.startsWith('/products/')) return;
    setSelectedProduct(null);
    setIsClosingProductRoute(false);
  }, [isClosingProductRoute, pathname]);

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const openCartDrawer = () => {
    trackEvent('view_cart', { items: cartCount, value: cartSubtotal });
    setIsCartDrawerOpen(true);
  };

  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const openShopSection = () => {
    closeCartDrawer();
    router.push('/#shop');
  };

  const handleAddCatalogItem = async (item: { id: string; title: string; price: number }) => {
    const image = catalogItems.find((ci) => ci.id === item.id)?.image;
    let syncedWithServer = false;
    try {
      const updatedCart = await addCartItemMutation({
        sessionId: guestSessionId,
        productId: item.id,
        quantity: 1,
      }).unwrap();
      dispatch(setItems(mapBackendCartItems(updatedCart, catalogItems)));
      syncedWithServer = true;
    } catch {
      dispatch(addItem({ ...item, image }));
    }
    trackEvent('add_to_cart', {
      product_name: item.title,
      value: item.price,
      source: syncedWithServer ? 'backend' : 'local-fallback',
    });
    setIsCartDrawerOpen(true);
  };

  const handleProductClick = (item: CatalogItem) => {
    setIsClosingProductRoute(false);
    setSelectedProduct(item);
    setIsCartDrawerOpen(false);
    const backendSlug = backendProducts?.find((product) => product.id === item.id)?.slug;
    const slug = backendSlug ?? (item.productKey ? slugByProductKey[item.productKey] : undefined);
    if (slug && pathname !== `/products/${slug}`) {
      router.push(`/products/${slug}`);
    }
  };

  const handleAddCurrentStory = async () => {
    const storyItem = catalogByProductKey[resolvedProductKey];
    if (!storyItem) return;
    await handleAddCatalogItem(storyItem);
  };

  const handleRemoveItem = async (id: string) => {
    const removed = cartItems.find((item) => item.id === id);
    if (!removed) return;
    if (removed.itemId) {
      try {
        const updated = await removeCartItemMutation({
          sessionId: guestSessionId,
          itemId: removed.itemId,
        }).unwrap();
        dispatch(setItems(mapBackendCartItems(updated, catalogItems)));
      } catch {
        dispatch(removeItem(id));
      }
    } else {
      dispatch(removeItem(id));
    }
    trackEvent('remove_from_cart', { product_name: removed.title, value: removed.price });
  };

  const contextValue = {
    catalogItems,
    cartItems,
    cartSubtotal,
    cartCount,
    isCartDrawerOpen,
    resolvedProductKey,
    openCartDrawer,
    closeCartDrawer,
    openShopSection,
    handleAddCatalogItem,
    handleRemoveItem,
    handleProductClick,
    handleAddCurrentStory,
    setActiveProduct,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <a className="skip-link" href="#main-content">Skip to content</a>

      {!isAdminRoute ? (
        <Navbar
          cartCount={cartCount}
          onCartClick={openCartDrawer}
          onSearchClick={openShopSection}
          heroTheme="dark"
        />
      ) : null}

      {children}

      {!isAdminRoute ? (
        <CartDrawer
          isOpen={isCartDrawerOpen}
          items={cartItems}
          subtotal={cartSubtotal}
          onClose={closeCartDrawer}
          onRemoveItem={handleRemoveItem}
          onContinueShopping={openShopSection}
          onCheckout={() => {
            if (!cartItems.length) {
              window.alert('Your cart is empty.');
              return;
            }
            trackEvent('begin_checkout', { items: cartCount, value: cartSubtotal });
            closeCartDrawer();
            router.push('/checkout');
          }}
        />
      ) : null}

      {!isAdminRoute && selectedProduct && (
        <ProductDetailModal
          item={selectedProduct}
          onClose={() => {
            if (pathname.startsWith('/products/')) {
              setIsClosingProductRoute(true);
              router.replace('/#shop');
              return;
            }
            setSelectedProduct(null);
          }}
          onAddToCart={async (item) => {
            if (pathname.startsWith('/products/')) {
              setIsClosingProductRoute(true);
              router.replace('/#shop');
            } else {
              setSelectedProduct(null);
            }
            await handleAddCatalogItem(item);
          }}
        />
      )}

      {!isAdminRoute ? <Footer /> : null}

      {!isAdminRoute ? <WhatsAppWidget /> : null}
    </AppContext.Provider>
  );
}
