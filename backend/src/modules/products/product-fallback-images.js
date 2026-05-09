/**
 * Stock fallback images for products that don't yet have
 * images uploaded to Supabase Storage.
 *
 * Each product slug maps to an array of 5 Unsplash stock URLs.
 * These are served when `images` is null / empty and are marked
 * with `isFallback: true` so the frontend can show an indicator.
 *
 * Once real images are uploaded via the admin panel, these are
 * automatically ignored.
 */

const FALLBACK_IMAGES = {
  /* ── Pure Shilajit ──────────────────────────────────────────── */
  'pure-shilajit': [
    {
      url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Pure Shilajit — Himalayan wellness resin',
    },
    {
      url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Natural wellness ingredients',
    },
    {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Wellness ritual — morning practice',
    },
    {
      url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Himalayan mountain landscape',
    },
    {
      url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Wellness lifestyle',
    },
  ],

  /* ── Traditional Kufa ───────────────────────────────────────── */
  'traditional-kufa': [
    {
      url: 'https://images.unsplash.com/photo-1534119428213-bd2626145164?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Traditional textile craftsmanship',
    },
    {
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Minimal product shot',
    },
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Premium retail display',
    },
    {
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Fashion apparel',
    },
    {
      url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Traditional craftsmanship detail',
    },
  ],

  /* ── The Sunnah Box ─────────────────────────────────────────── */
  'the-sunnah-box': [
    {
      url: 'https://images.unsplash.com/photo-1549465220-1a8b9238f70e?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Premium gift box',
    },
    {
      url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Elegant gift packaging',
    },
    {
      url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Unboxing experience',
    },
    {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Curated wellness gift set',
    },
    {
      url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Beautifully wrapped gift box',
    },
  ],

  /* ── Premium Dates ──────────────────────────────────────────── */
  'premium-dates': [
    {
      url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Premium Medjool dates',
    },
    {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Gourmet food photography',
    },
    {
      url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Fresh fruit arrangement',
    },
    {
      url: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Dates close-up texture',
    },
    {
      url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Natural dried fruit',
    },
  ],

  /* ── Kashmiri Saffron ───────────────────────────────────────── */
  'kashmiri-saffron': [
    {
      url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Kashmiri saffron threads close-up',
    },
    {
      url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Saffron spice on wooden surface',
    },
    {
      url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Cooking with saffron',
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Kashmir valley landscape',
    },
    {
      url: 'https://images.unsplash.com/photo-1531951860504-7e62dafc4e5e?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Premium spice collection',
    },
  ],

  /* ── Sidr Honey ─────────────────────────────────────────────── */
  'sidr-honey': [
    {
      url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Raw Sidr honey in jar',
    },
    {
      url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Golden honey close-up',
    },
    {
      url: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Honey dipper with dripping honey',
    },
    {
      url: 'https://images.unsplash.com/photo-1607198179219-cd8b3c5b2db4?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Natural honeycomb',
    },
    {
      url: 'https://images.unsplash.com/photo-1534604738127-77f70e5df163?w=800&h=800&fit=crop&crop=center&q=80',
      alt: 'Honey dripping macro',
    },
  ],
};

/**
 * Returns fallback images array for a given product slug.
 * Each image is enriched with `order` and `isFallback: true`.
 * Returns empty array if no fallback is configured.
 */
function getFallbackImages(slug) {
  const items = FALLBACK_IMAGES[slug];
  if (!items) return [];
  return items.map((img, i) => ({
    url: img.url,
    alt: img.alt,
    order: i,
    blurDataUrl: null,
    isFallback: true,
  }));
}

/**
 * Enrich a product (or array of products) with fallback images
 * when the product has no uploaded images.
 */
function enrichWithFallbackImages(productOrProducts) {
  if (Array.isArray(productOrProducts)) {
    return productOrProducts.map(enrichSingle);
  }
  return enrichSingle(productOrProducts);
}

function enrichSingle(product) {
  if (!product) return product;
  const hasUploadedImages = product.images && Array.isArray(product.images) && product.images.length > 0;
  if (hasUploadedImages) return product;

  const fallback = getFallbackImages(product.slug);
  if (fallback.length === 0) return product;

  return { ...product, images: fallback };
}

module.exports = {
  FALLBACK_IMAGES,
  getFallbackImages,
  enrichWithFallbackImages,
};
