import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.moonnaturallyyours.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og/og-homepage.jpg`;

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  /** Set true for transactional or placeholder pages that should never be indexed */
  noIndex?: boolean;
}

/**
 * SEOHead — renders per-route <title>, <meta>, <link rel="canonical"> and OG tags
 * via react-helmet-async. Wrap the app root in <HelmetProvider> from react-helmet-async.
 *
 * Usage:
 *   <SEOHead
 *     title="Kashmiri Saffron | MOON Naturally Yours"
 *     description="Mongra A++ grade Kashmiri saffron from Pampore..."
 *     canonicalUrl="https://www.moonnaturallyyours.com/products/kashmiri-saffron"
 *     ogImage="https://www.moonnaturallyyours.com/og/kashmiri-saffron.jpg"
 *   />
 */
export function SEOHead({
  title = 'MOON Naturally Yours | Kashmiri Saffron, Shilajit & Wellness Products India',
  description = 'MOON Naturally Yours — premium Kashmiri saffron, Himalayan shilajit, raw mountain honey, almonds, walnuts and bilona ghee. Single-origin wellness delivered across India.',
  canonicalUrl = `${BASE_URL}/`,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
}: SEOHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow'}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MOON Naturally Yours" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@moonnaturallyyours" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
