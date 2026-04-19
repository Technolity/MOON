import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout } from './admin/AdminLayout';
import { clearAdminSession, createAdminSession, loadAdminSession, saveAdminSession } from './admin/adminAuth';
import type { AdminSession } from './admin/adminAuth';
import { RequireAdmin } from './admin/RequireAdmin';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { catalogItems as staticCatalogItems, productOrder, productStories } from './data/products';
import { useRevealAnimation } from './hooks/useRevealAnimation';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AnalyticsFocusPage } from './pages/admin/AnalyticsFocusPage';
import { DashboardOverviewPage } from './pages/admin/DashboardOverviewPage';
import { InventoryPage } from './pages/admin/InventoryPage';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { api, useAddCartItemMutation, useClearCartMutation, useGetCartQuery, useGetMeQuery, useGetProductsQuery, useLoginMutation, useRemoveCartItemMutation } from './store/services/api';
import { getGuestCartSessionId } from './store/services/cartSession';
import { addItem, clearCart, removeItem, setItems } from './store/slices/cartSlice';
import type { BackendCartItem, BackendProduct } from './store/services/api';
import type { CatalogItem, ProductKey } from './types';

const productKeyBySlug: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'kashmiri-saffron': 'kashmiriSaffron',
  'irani-saffron': 'iraniSaffron',
  'kashmiri-almonds': 'kashmiriAlmonds',
  walnuts: 'walnuts',
  'kashmiri-ghee': 'kashmiriGhee'
};

const productKeyByName: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'kashmiri saffron': 'kashmiriSaffron',
  'irani saffron': 'iraniSaffron',
  'kashmiri almonds': 'kashmiriAlmonds',
  walnuts: 'walnuts',
  'kashmiri ghee': 'kashmiriGhee'
};

const fallbackCatalogByKey = staticCatalogItems.reduce((map, item) => {
  if (item.productKey) {
    map[item.productKey] = item;
  }
  return map;
}, {} as Record<ProductKey, CatalogItem>);

function extractApiErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Request failed. Please try again.';
}

function inferProductKey(product: BackendProduct): ProductKey | null {
  if (product.slug && productKeyBySlug[product.slug]) {
    return productKeyBySlug[product.slug];
  }

  const normalizedName = product.name.trim().toLowerCase();
  if (productKeyByName[normalizedName]) {
    return productKeyByName[normalizedName];
  }

  return null;
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

function trackEvent(eventName: string, payload: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      event_category: 'ecommerce',
      ...payload
    });
  }
}

function normalizeLegacyFramePath(imageUrl: string | null | undefined) {
  if (!imageUrl) return imageUrl ?? undefined;
  return imageUrl.replace(/(\/(?:moon2222|moon333|ezgif-2fae6b36993927b6-jpg)\/ezgif-frame-\d{3})\.jpg$/i, '$1.png');
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const guestSessionId = useMemo(() => getGuestCartSessionId(), []);

  const [activeProduct, setActiveProduct] = useState<ProductKey>('shilajit');
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => loadAdminSession());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);

  const { data: backendProducts } = useGetProductsQuery();
  const { data: backendCartItems, isSuccess: isCartLoaded } = useGetCartQuery({ sessionId: guestSessionId });
  const [addCartItemMutation] = useAddCartItemMutation();
  const [removeCartItemMutation] = useRemoveCartItemMutation();
  const [clearCartMutation] = useClearCartMutation();
  const [loginMutation, { isLoading: isAdminLoginLoading }] = useLoginMutation();

  const { error: profileError } = useGetMeQuery(undefined, {
    skip: !adminSession?.token
  });

  const catalogItems = useMemo(() => {
    if (!backendProducts || backendProducts.length === 0) {
      return staticCatalogItems;
    }

    const fromBackend: Partial<Record<ProductKey, CatalogItem>> = {};

    backendProducts.forEach((product) => {
      const key = inferProductKey(product);
      if (!key) return;

      const fallback = fallbackCatalogByKey[key];
      fromBackend[key] = {
        id: product.id,
        title: product.name,
        subtitle: product.description || fallback.subtitle,
        price: Number(product.discount_price ?? product.price),
        image: normalizeLegacyFramePath(product.image_url) || fallback.image,
        alt: fallback.alt,
        featured: fallback.featured,
        productKey: key
      };
    });

    return productOrder
      .map((key) => fromBackend[key] ?? fallbackCatalogByKey[key])
      .filter(Boolean);
  }, [backendProducts]);

  const catalogByProductKey: Partial<Record<ProductKey, { id: string; title: string; price: number }>> = useMemo(
    () =>
      catalogItems.reduce((map, item) => {
        if (item.productKey) {
          map[item.productKey] = { id: item.id, title: item.title, price: item.price };
        }
        return map;
      }, {} as Partial<Record<ProductKey, { id: string; title: string; price: number }>>),
    [catalogItems]
  );

  const resolvedProductKey: ProductKey = useMemo(() => {
    const current = String(activeProduct);
    return (productOrder as string[]).includes(current) ? activeProduct : 'shilajit';
  }, [activeProduct]);

  const activeStory = productStories[resolvedProductKey] ?? productStories.shilajit;
  const isAdminRoute = location.pathname.startsWith('/admin');

  useRevealAnimation();

  useEffect(() => {
    if (isCartLoaded && backendCartItems) {
      dispatch(setItems(mapBackendCartItems(backendCartItems, catalogItems)));
    }
  }, [backendCartItems, catalogItems, dispatch, isCartLoaded]);

  useEffect(() => {
    if (!adminSession || !profileError) return;

    clearAdminSession();
    setAdminSession(null);
    dispatch(api.util.resetApiState());

    if (location.pathname.startsWith('/admin')) {
      navigate('/admin/login', { replace: true });
    }
  }, [adminSession, dispatch, location.pathname, navigate, profileError]);

  useEffect(() => {
    if (resolvedProductKey !== activeProduct) {
      setActiveProduct(resolvedProductKey);
    }
  }, [resolvedProductKey, activeProduct]);

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

    return () => {
      window.removeEventListener('scroll', updateNavbarOnScroll);
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    if (location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (isAdminRoute && isCartDrawerOpen) {
      setIsCartDrawerOpen(false);
    }
  }, [isAdminRoute, isCartDrawerOpen]);

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartDrawerOpen]);

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
    navigate('/#shop');
  };

  const openAdminLogin = () => {
    navigate('/admin/login');
  };

  const handleAddCatalogItem = async (item: { id: string; title: string; price: number }) => {
    const image = catalogItems.find((ci) => ci.id === item.id)?.image;
    let syncedWithServer = false;

    try {
      const updatedCart = await addCartItemMutation({
        sessionId: guestSessionId,
        productId: item.id,
        quantity: 1
      }).unwrap();
      dispatch(setItems(mapBackendCartItems(updatedCart, catalogItems)));
      syncedWithServer = true;
    } catch {
      dispatch(addItem({ ...item, image }));
    }

    trackEvent('add_to_cart', {
      product_name: item.title,
      value: item.price,
      source: syncedWithServer ? 'backend' : 'local-fallback'
    });
    setIsCartDrawerOpen(true);
  };

  const handleProductClick = (item: CatalogItem) => {
    setSelectedProduct(item);
    setIsCartDrawerOpen(false);
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
          itemId: removed.itemId
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

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      const payload = await loginMutation({ email, password }).unwrap();

      if (payload.user.role !== 'admin') {
        return { ok: false, message: 'This account is not allowed to access admin dashboards.' };
      }

      const session = createAdminSession(payload);
      saveAdminSession(session);
      setAdminSession(session);

      return { ok: true };
    } catch (error) {
      return { ok: false, message: extractApiErrorMessage(error) };
    }
  };

  const handleAdminLogout = () => {
    clearAdminSession();
    setAdminSession(null);
    dispatch(api.util.resetApiState());
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      {!isAdminRoute ? (
        <Navbar
          cartCount={cartCount}
          onCartClick={openCartDrawer}
          onSearchClick={openShopSection}
          onAccountClick={openAdminLogin}
        />
      ) : null}

      <Routes>
        <Route
          path="/admin/login"
          element={<AdminLoginPage session={adminSession} onLogin={handleAdminLogin} isLoading={isAdminLoginLoading} />}
        />
        <Route
          path="/admin"
          element={(
            <RequireAdmin session={adminSession}>
              <AdminLayout session={adminSession!} onLogout={handleAdminLogout} />
            </RequireAdmin>
          )}
        >
          <Route index element={<Navigate to="dashboard-overview" replace />} />
          <Route path="dashboard-overview" element={<DashboardOverviewPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="analytics-focus" element={<AnalyticsFocusPage />} />
          <Route path="*" element={<Navigate to="dashboard-overview" replace />} />
        </Route>
        <Route
          path="/"
          element={
            <HomePage
              catalogItems={catalogItems}
              onSelectProduct={setActiveProduct}
              onAddDetailToCart={handleAddCurrentStory}
              onAddCatalogToCart={handleAddCatalogItem}
              onBrowseCollection={openShopSection}
              onProductClick={handleProductClick}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              items={cartItems}
              subtotal={cartSubtotal}
              onRemoveItem={handleRemoveItem}
              onContinueShopping={() => navigate('/#shop')}
              onCheckout={() => {
                if (!cartItems.length) {
                  window.alert('Your cart is empty.');
                  return;
                }
                trackEvent('begin_checkout', { items: cartCount, value: cartSubtotal });
                navigate('/checkout');
              }}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              items={cartItems}
              subtotal={cartSubtotal}
              onBackToCart={() => {
                navigate('/#shop');
                setIsCartDrawerOpen(true);
              }}
              onOrderPlaced={async ({ paymentMethod, total, shippingZone, shippingCost, orderNumber }) => {
                trackEvent('add_shipping_info', { zone: shippingZone, value: shippingCost });
                trackEvent('add_payment_info', { method: paymentMethod, value: total });
                trackEvent('purchase', { items: cartCount, value: total, order_number: orderNumber });

                try {
                  await clearCartMutation({ sessionId: guestSessionId }).unwrap();
                } catch {
                  // Ignore backend clear failure and still clear local state.
                }

                dispatch(clearCart());
                setIsCartDrawerOpen(false);
                navigate('/');
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute ? (
        <CartDrawer
          isOpen={isCartDrawerOpen}
          items={cartItems}
          subtotal={cartSubtotal}
          onClose={closeCartDrawer}
          onRemoveItem={handleRemoveItem}
          onContinueShopping={() => {
            closeCartDrawer();
            navigate('/#shop');
          }}
          onCheckout={() => {
            if (!cartItems.length) {
              window.alert('Your cart is empty.');
              return;
            }
            trackEvent('begin_checkout', { items: cartCount, value: cartSubtotal });
            closeCartDrawer();
            navigate('/checkout');
          }}
        />
      ) : null}

      {!isAdminRoute && selectedProduct && (
        <ProductDetailModal
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={async (item) => {
            setSelectedProduct(null);
            await handleAddCatalogItem(item);
          }}
        />
      )}

      {!isAdminRoute ? <Footer /> : null}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
