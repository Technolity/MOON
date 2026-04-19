import { useEffect, useMemo, useState } from 'react';
import { SEOHead } from './components/SEOHead';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { catalogItems as staticCatalogItems, productOrder, productStories } from './data/products';
import { useRevealAnimation } from './hooks/useRevealAnimation';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useAddCartItemMutation, useClearCartMutation, useGetCartQuery, useGetProductsQuery, useRemoveCartItemMutation } from './store/services/api';
import { getGuestCartSessionId } from './store/services/cartSession';
import { addItem, clearCart, removeItem, setItems } from './store/slices/cartSlice';
import type { BackendCartItem, BackendProduct } from './store/services/api';
import type { CatalogItem, ProductKey } from './types';

const productKeyBySlug: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'kashmiri-saffron': 'kashmiriSaffron',
  'kashmiri-honey': 'kashmiriHoney',
  'irani-saffron': 'iraniSaffron',
  'kashmiri-almonds': 'kashmiriAlmonds',
  walnuts: 'walnuts',
  'kashmiri-walnuts': 'walnuts',
  'kashmiri-ghee': 'kashmiriGhee'
};

/** Reverse map — productKey → URL slug */
const slugByProductKey: Partial<Record<ProductKey, string>> = {
  shilajit: 'shilajit',
  kashmiriSaffron: 'kashmiri-saffron',
  kashmiriHoney: 'kashmiri-honey',
  iraniSaffron: 'irani-saffron',
  kashmiriAlmonds: 'kashmiri-almonds',
  walnuts: 'kashmiri-walnuts',
  kashmiriGhee: 'kashmiri-ghee',
};

/** SEO metadata for each product route (used when real assets aren't ready) */
const productSEOMeta: Partial<Record<ProductKey, { title: string; description: string }>> = {
  shilajit: {
    title: 'Himalayan Shilajit Gold Grade | MOON Naturally Yours',
    description:
      'Gold grade Himalayan Shilajit resin sourced above 16,000 ft. Rich in fulvic acid and 84 trace minerals. Third-party tested. Ships across India.',
  },
  kashmiriSaffron: {
    title: 'Kashmiri Saffron Mongra A++ Grade | MOON Naturally Yours',
    description:
      'Genuine Mongra A++ Kashmiri saffron hand-sorted from Pampore — India\'s only GI-tagged saffron region. Deep red stigmas, no yellow style attached.',
  },
  kashmiriHoney: {
    title: 'Kashmiri Honey Wild Mountain Raw | MOON Naturally Yours',
    description:
      'Unfiltered raw honey harvested from high-altitude Kashmir meadows. Wild-sourced, enzyme-rich, free from heating or additives. Ships across India.',
  },
  iraniSaffron: {
    title: 'Irani Saffron Negin Grade | MOON Naturally Yours',
    description:
      'Negin grade Iranian saffron — whole long threads with strong colour release and balanced flavour. Ideal for everyday cooking, teas and desserts.',
  },
  kashmiriAlmonds: {
    title: 'Kashmiri Almonds Premium Whole Kernels | MOON Naturally Yours',
    description:
      'Premium whole almond kernels from Kashmir valley orchards. Unroasted, unsalted, rich in vitamin E and healthy fats. Ships across India.',
  },
  walnuts: {
    title: 'Kashmiri Walnuts Orchard Select | MOON Naturally Yours',
    description:
      'Fresh-crop Kashmir walnuts — half and whole kernels. Naturally high in omega-3 fatty acids for heart and brain health. Ships across India.',
  },
  kashmiriGhee: {
    title: 'Kashmiri Ghee Bilona Process | MOON Naturally Yours',
    description:
      'Small-batch bilona-process clarified butter. Traditional Kashmiri preparation with a deep aromatic finish. Ideal for Ayurvedic cooking.',
  },
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
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);

  const { data: backendProducts } = useGetProductsQuery();
  const { data: backendCartItems, isSuccess: isCartLoaded } = useGetCartQuery({ sessionId: guestSessionId });
  const [addCartItemMutation] = useAddCartItemMutation();
  const [removeCartItemMutation] = useRemoveCartItemMutation();
  const [clearCartMutation] = useClearCartMutation();
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
    // Push the product URL so sharing / back-button works correctly
    if (item.productKey) {
      const slug = slugByProductKey[item.productKey];
      if (slug && location.pathname !== `/products/${slug}`) {
        navigate(`/products/${slug}`, { state: { fromShop: true } });
      }
    }
  };

  // Auto-open correct modal when landing directly on a /products/:slug URL
  useEffect(() => {
    const match = location.pathname.match(/^\/products\/(.+)$/);
    if (!match) return;
    const slug = match[1];
    const productKey = productKeyBySlug[slug];
    if (!productKey) return;
    const item = catalogItems.find((ci) => ci.productKey === productKey);
    if (item && (!selectedProduct || selectedProduct.productKey !== productKey)) {
      setSelectedProduct(item);
      setIsCartDrawerOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, catalogItems]);

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

  // Determine SEO metadata for the current route
  const productRouteMatch = location.pathname.match(/^\/products\/(.+)$/);
  const productRouteKey = productRouteMatch
    ? productKeyBySlug[productRouteMatch[1]]
    : null;

  return (
    <>
      {/* ── Per-route SEO head tags ─────────────────────────────────── */}
      {!productRouteKey && !isAdminRoute && location.pathname === '/' && (
        <SEOHead
          title="MOON Naturally Yours | Kashmiri Saffron, Shilajit & Wellness Products India"
          description="Premium single-origin Kashmiri saffron, Himalayan shilajit, raw mountain honey, almonds, walnuts and bilona ghee. Sourced with care, delivered across India."
          canonicalUrl="https://www.moonnaturallyyours.com/"
        />
      )}
      {productRouteKey && (
        <SEOHead
          title={productSEOMeta[productRouteKey]?.title}
          description={productSEOMeta[productRouteKey]?.description}
          canonicalUrl={`https://www.moonnaturallyyours.com/products/${productRouteMatch![1]}`}
          noIndex={true}
        />
      )}
      {location.pathname === '/cart' && (
        <SEOHead
          title="Your Cart | MOON Naturally Yours"
          description="Review your cart items before checkout."
          canonicalUrl="https://www.moonnaturallyyours.com/cart"
          noIndex={true}
        />
      )}
      {location.pathname === '/checkout' && (
        <SEOHead
          title="Checkout | MOON Naturally Yours"
          description="Complete your order — shipping and payment."
          canonicalUrl="https://www.moonnaturallyyours.com/checkout"
          noIndex={true}
        />
      )}

      <a className="skip-link" href="#main-content">Skip to content</a>

      {!isAdminRoute ? (
        <Navbar
          cartCount={cartCount}
          onCartClick={openCartDrawer}
          onSearchClick={openShopSection}
          onAccountClick={() => {}}
          heroTheme="light"
        />
      ) : null}

      <Routes>
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
        {/* Product URL routes — open the modal on the homepage, noindex for now */}
        <Route
          path="/products/:slug"
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
          onClose={() => {
            setSelectedProduct(null);
            // Navigate back to homepage when modal is closed from a product URL
            if (location.pathname.startsWith('/products/')) {
              const fromShop = (location.state as { fromShop?: boolean } | null)?.fromShop;
              navigate(fromShop ? '/#shop' : '/', { replace: true });
            }
          }}
          onAddToCart={async (item) => {
            setSelectedProduct(null);
            if (location.pathname.startsWith('/products/')) {
              const fromShop = (location.state as { fromShop?: boolean } | null)?.fromShop;
              navigate(fromShop ? '/#shop' : '/', { replace: true });
            }
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
