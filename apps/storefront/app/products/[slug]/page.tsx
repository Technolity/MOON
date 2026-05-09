import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { catalogItems as staticCatalog } from '@/lib/data/product-statics';
import { normalizeProductImageUrl, stockImageForProduct } from '@/lib/products/images';
import type { ProductKey } from '@/lib/types';

export const revalidate = 3600;

const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/+$/, '');

const slugToProductKey: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'pure-shilajit': 'shilajit',
  'kashmiri-saffron': 'kashmiriSaffron',
  'kashmiri-honey': 'kashmiriHoney',
  'sidr-honey': 'kashmiriHoney',
  'irani-saffron': 'iraniSaffron',
  'kashmiri-almonds': 'kashmiriAlmonds',
  'kashmiri-walnuts': 'walnuts',
  walnuts: 'walnuts',
  'kashmiri-ghee': 'kashmiriGhee',
};

const productKeyByName: Record<string, ProductKey> = {
  shilajit: 'shilajit',
  'pure shilajit': 'shilajit',
  'kashmiri saffron': 'kashmiriSaffron',
  'kashmiri honey': 'kashmiriHoney',
  'sidr honey': 'kashmiriHoney',
  'irani saffron': 'iraniSaffron',
  'kashmiri almonds': 'kashmiriAlmonds',
  'kashmiri walnuts': 'walnuts',
  walnuts: 'walnuts',
  'kashmiri ghee': 'kashmiriGhee',
};

const slugToStaticProduct: Record<string, BackendProduct> = (() => {
  const result: Record<string, BackendProduct> = {};
  for (const [slug, key] of Object.entries(slugToProductKey)) {
    const item = staticCatalog.find(c => c.productKey === key);
    if (item) {
      result[slug] = {
        id: item.id,
        name: item.title,
        slug,
        description: item.subtitle,
        price: item.price,
        image_url: item.image,
      };
    }
  }
  return result;
})();

function inferProductKey(product: BackendProduct): ProductKey | null {
  return slugToProductKey[product.slug] ?? productKeyByName[product.name.trim().toLowerCase()] ?? null;
}

function staticFallbackImage(product: BackendProduct, key: ProductKey | null) {
  const fallback = key ? staticCatalog.find((item) => item.productKey === key) : undefined;
  return normalizeProductImageUrl(fallback?.image);
}

function firstRenderableImage(product: BackendProduct) {
  const key = inferProductKey(product);
  const firstImage = [...(product.images ?? [])].sort((a, b) => a.order - b.order)[0]?.url;
  return (
    normalizeProductImageUrl(firstImage) ||
    normalizeProductImageUrl(product.image_url) ||
    staticFallbackImage(product, key) ||
    stockImageForProduct(key, product.theme)
  );
}

interface ProductImage {
  url: string;
  alt: string;
  order: number;
  blurDataUrl: string | null;
}

interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  images?: ProductImage[];
  category?: string | null;
  theme?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  inStock?: boolean;
}

async function fetchProduct(slug: string): Promise<BackendProduct | null> {
  try {
    const res = await fetch(`${apiBase}/products/${slug}`, {
      next: { tags: ['products', `product-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(`${apiBase}/products`, { next: { tags: ['products'] } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = (await fetchProduct(slug)) ?? slugToStaticProduct[slug] ?? null;
  if (!product) return { title: 'Product Not Found | MOON Naturally Yours' };

  const title = product.meta_title || `${product.name} | MOON Naturally Yours`;
  const description =
    product.meta_description ||
    product.description ||
    `Shop ${product.name} at MOON Naturally Yours — premium single-origin wellness products from Kashmir.`;
  const imageUrl = firstRenderableImage(product);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'MOON Naturally Yours',
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1400, height: 1400 }] } : {}),
      url: `https://www.moonnaturallyyours.com/products/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    alternates: { canonical: `https://www.moonnaturallyyours.com/products/${slug}` },
  };
}

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = (await fetchProduct(slug)) ?? slugToStaticProduct[slug] ?? null;
  if (!product) notFound();

  const productKey = inferProductKey(product);
  const sortedImages = [...(product.images ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((img) => ({ ...img, url: normalizeProductImageUrl(img.url) }))
    .filter((img): img is ProductImage & { url: string } => Boolean(img.url));
  const primaryImage = sortedImages[0] ?? null;
  const imageUrl =
    primaryImage?.url ||
    normalizeProductImageUrl(product.image_url) ||
    staticFallbackImage(product, productKey) ||
    stockImageForProduct(productKey, product.theme);
  const blurDataUrl = primaryImage?.blurDataUrl ?? undefined;

  const displayPrice = Number(product.discount_price ?? product.price);
  const originalPrice = product.discount_price ? Number(product.price) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? '',
    image: imageUrl ?? undefined,
    url: `https://www.moonnaturallyyours.com/products/${product.slug}`,
    brand: { '@type': 'Brand', name: 'MOON Naturally Yours' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: displayPrice,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'MOON Naturally Yours' },
      ...(originalPrice ? { priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) } : {}),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Visible server-rendered content — crawlers read this; the AppShell modal overlays it for interactive users */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {imageUrl && (
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
              <Image
                src={imageUrl}
                alt={primaryImage?.alt || product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                placeholder={blurDataUrl ? 'blur' : 'empty'}
                blurDataURL={blurDataUrl}
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            {product.category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                {product.category}
              </span>
            )}
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-slate-900">{product.name}</h1>
            {product.description && (
              <p className="text-slate-600 text-base leading-relaxed">{product.description}</p>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-slate-900">₹{displayPrice.toLocaleString('en-IN')}</span>
              {originalPrice && (
                <span className="text-base line-through text-slate-400">₹{originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>
        </div>

        {sortedImages.length > 1 && (
          <div className="mt-10 max-w-4xl w-full grid grid-cols-4 gap-3">
            {sortedImages.slice(1).map((img) => (
              <div key={img.url} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                <Image
                  src={img.url}
                  alt={img.alt || product.name}
                  fill
                  sizes="(max-width: 768px) 25vw, 200px"
                  className="object-cover"
                  placeholder={img.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={img.blurDataUrl ?? undefined}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
