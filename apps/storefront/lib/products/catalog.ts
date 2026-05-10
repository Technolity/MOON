import { catalogItems as staticCatalogItems, productOrder } from '@/lib/data/product-statics';
import { normalizeProductImageUrl, productGalleryImages, stockImageForProduct } from '@/lib/products/images';
import type { BackendProduct } from '@/lib/store/services/storefront-api';
import type { CatalogItem, ProductKey } from '@/lib/types';

export const productKeyBySlug: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'pure-shilajit': 'shilajit',
  'kashmiri-saffron': 'kashmiriSaffron',
  'kashmiri-honey': 'kashmiriHoney',
  'sidr-honey': 'kashmiriHoney',
  'irani-saffron': 'iraniSaffron',
  'kashmiri-almonds': 'kashmiriAlmonds',
  walnuts: 'walnuts',
  'kashmiri-walnuts': 'walnuts',
  'kashmiri-ghee': 'kashmiriGhee',
};

export const productKeyByName: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'pure shilajit': 'shilajit',
  'kashmiri saffron': 'kashmiriSaffron',
  'kashmiri honey': 'kashmiriHoney',
  'sidr honey': 'kashmiriHoney',
  'irani saffron': 'iraniSaffron',
  'kashmiri almonds': 'kashmiriAlmonds',
  walnuts: 'walnuts',
  'kashmiri walnuts': 'walnuts',
  'kashmiri ghee': 'kashmiriGhee',
};

const fallbackCatalogByKey = staticCatalogItems.reduce((map, item) => {
  if (item.productKey) map[item.productKey] = item;
  return map;
}, {} as Record<ProductKey, CatalogItem>);

const themeFallbackKey: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  saffron: 'kashmiriSaffron',
  honey: 'kashmiriHoney',
};

function firstProductImage(product: BackendProduct) {
  const firstImage = [...(product.images ?? [])].sort((a, b) => a.order - b.order)[0]?.url;
  return normalizeProductImageUrl(firstImage ?? product.image_url);
}

function allProductImages(product: BackendProduct, key: ProductKey | null) {
  const sortedImages = [...(product.images ?? [])].sort((a, b) => a.order - b.order).map((image) => image.url);
  return productGalleryImages({
    primary: product.image_url,
    images: sortedImages,
    key,
    theme: product.theme,
  });
}

function stockState(product: BackendProduct) {
  if (product.inStock != null) return Boolean(product.inStock);
  if (product.in_stock != null) return Boolean(product.in_stock);
  if (product.inventory) return (product.inventory.quantity - product.inventory.reserved) > 0;
  return true;
}

function availableStock(product: BackendProduct): number | undefined {
  if (product.stockCount != null) return Math.max(0, product.stockCount);
  if (product.inventory) return Math.max(0, product.inventory.quantity - product.inventory.reserved);
  return undefined;
}

export function inferProductKey(product: BackendProduct): ProductKey | null {
  if (product.slug && productKeyBySlug[product.slug]) return productKeyBySlug[product.slug];
  const normalizedName = product.name.trim().toLowerCase();
  return productKeyByName[normalizedName] ?? null;
}

function fallbackForProduct(product: BackendProduct, key: ProductKey | null) {
  if (key) return fallbackCatalogByKey[key];
  const themeKey = product.theme?.trim().toLowerCase();
  return themeKey ? fallbackCatalogByKey[themeFallbackKey[themeKey]] : undefined;
}

function mapProduct(product: BackendProduct, key: ProductKey | null): CatalogItem {
  const fallback = fallbackForProduct(product, key);
  return {
    id: product.id,
    title: product.name,
    subtitle: product.description || fallback?.subtitle || product.category || 'Moon · Origin',
    price: Number(product.discount_price ?? product.price),
    image: firstProductImage(product) || normalizeProductImageUrl(fallback?.image) || stockImageForProduct(key, product.theme),
    images: allProductImages(product, key),
    alt: fallback?.alt ?? product.name,
    featured: fallback?.featured,
    productKey: key ?? undefined,
    inStock: stockState(product),
    stockCount: availableStock(product),
  };
}

export function mapBackendProductsToCatalogItems(products: BackendProduct[] | undefined | null): CatalogItem[] {
  if (!products?.length) return staticCatalogItems;

  const keyedItems: Partial<Record<ProductKey, CatalogItem>> = {};
  const dynamicItems: CatalogItem[] = [];

  for (const product of products) {
    const key = inferProductKey(product);
    const item = mapProduct(product, key);
    if (key) {
      keyedItems[key] = item;
    } else {
      dynamicItems.push(item);
    }
  }

  return [
    ...productOrder.map((key) => keyedItems[key]).filter((item): item is CatalogItem => item != null),
    ...dynamicItems,
  ];
}
