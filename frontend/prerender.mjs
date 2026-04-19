/**
 * prerender.mjs
 *
 * Lightweight SSG post-build script for MOON Naturally Yours.
 *
 * What this does:
 *   1. Reads the built dist/index.html shell
 *   2. Injects fully-rendered semantic HTML into <div id="root"> for the homepage
 *   3. Writes the enriched HTML back to dist/index.html
 *
 * This gives Googlebot real HTML to read without requiring a headless browser.
 * React will "take over" (createRoot) when the JS bundle loads for real users.
 *
 * Run: node prerender.mjs  (called automatically by `npm run build`)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');

// ─── Static content to inject ────────────────────────────────────────────────
// This mirrors what the React app renders but as plain HTML strings.
// Update this when real product content / images are available.

const SITE_NAME = 'MOON Naturally Yours';
const BASE_URL = 'https://www.moonnaturallyyours.com';

const products = [
  {
    name: 'Himalayan Shilajit — Gold Grade',
    slug: 'shilajit',
    description:
      'Gold grade Himalayan Shilajit resin sourced above 16,000 ft. Rich in fulvic acid and 84 trace minerals. Third-party tested. Used in Ayurveda for stamina, vitality, and cognitive function.',
    price: '₹1,999',
    image: `${BASE_URL}/moon333/ezgif-frame-162.png`,
    category: 'Resin & Mineral',
  },
  {
    name: 'Kashmiri Saffron — Mongra A++ Grade',
    slug: 'kashmiri-saffron',
    description:
      'Mongra A++ Kashmiri saffron hand-sorted from Pampore — India\'s only GI-tagged saffron region. Deep red stigmas, no yellow style attached. Sun-dried for peak aroma and colour.',
    price: '₹1,250',
    image: `${BASE_URL}/moon2222/ezgif-frame-162.png`,
    category: 'Kashmiri Saffron',
  },
  {
    name: 'Kashmiri Honey — Wild Mountain Raw',
    slug: 'kashmiri-honey',
    description:
      'Unfiltered raw honey harvested from high-altitude Kashmir meadows. Wild-sourced, enzyme-rich, free from heating or additives. Naturally crystallises in winter — a sign of purity.',
    price: '₹1,150',
    image: `${BASE_URL}/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png`,
    category: 'Honey',
  },
  {
    name: 'Irani Saffron — Negin Grade',
    slug: 'irani-saffron',
    description:
      'Whole Negin grade Iranian saffron threads with strong colour release and balanced flavour. Ideal for daily cooking, teas, and desserts.',
    price: '₹1,050',
    image: `${BASE_URL}/moon2222/ezgif-frame-162.png`,
    category: 'Irani Saffron',
  },
  {
    name: 'Kashmiri Almonds — Premium Whole Kernels',
    slug: 'kashmiri-almonds',
    description:
      'Premium whole almond kernels from Kashmir valley orchards. Unroasted, unsalted, rich in vitamin E and healthy fats.',
    price: '₹899',
    image: `${BASE_URL}/moon2222/ezgif-frame-162.png`,
    category: 'Dry Fruits',
  },
  {
    name: 'Kashmiri Walnuts — Orchard Select',
    slug: 'kashmiri-walnuts',
    description:
      'Fresh-crop Kashmir walnuts — half and whole kernels. Naturally high in omega-3 fatty acids for cardiovascular and cognitive health.',
    price: '₹950',
    image: `${BASE_URL}/moon333/ezgif-frame-162.png`,
    category: 'Dry Fruits',
  },
  {
    name: 'Kashmiri Ghee — Bilona Process',
    slug: 'kashmiri-ghee',
    description:
      'Small-batch bilona-process clarified butter. Traditional Kashmiri preparation with a deep aromatic finish. Ideal for Ayurvedic cooking and wellness routines.',
    price: '₹1,350',
    image: `${BASE_URL}/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png`,
    category: 'Ghee',
  },
];

function buildProductListHTML() {
  return products
    .map(
      (p) => `
  <article itemscope itemtype="https://schema.org/Product">
    <h3 itemprop="name"><a href="${BASE_URL}/products/${p.slug}">${p.name}</a></h3>
    <p itemprop="description">${p.description}</p>
    <span itemprop="category">${p.category}</span>
    <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
      <span itemprop="price">${p.price}</span>
      <meta itemprop="priceCurrency" content="INR" />
      <link itemprop="availability" href="https://schema.org/InStock" />
    </div>
  </article>`
    )
    .join('\n');
}

function buildHomepageHTML() {
  return `
<div id="root">
  <header>
    <h1>${SITE_NAME} — Premium Kashmiri Wellness Products</h1>
    <nav aria-label="Main navigation">
      <a href="${BASE_URL}/">Home</a>
      <a href="${BASE_URL}/#shop">Shop</a>
    </nav>
  </header>
  <main id="main-content">
    <section aria-labelledby="hero-heading">
      <h2 id="hero-heading">Single-Origin. Himalayan. Naturally Yours.</h2>
      <p>
        Premium Kashmiri saffron, Himalayan shilajit, raw mountain honey, almonds, walnuts
        and bilona ghee — sourced with care, delivered across India.
      </p>
    </section>

    <section id="shop" aria-labelledby="products-heading">
      <h2 id="products-heading">Our Products</h2>
      ${buildProductListHTML()}
    </section>

    <section aria-label="Trust signals">
      <ul>
        <li>800+ orders delivered across India</li>
        <li>5,000+ happy customers</li>
        <li>100% pure and lab tested</li>
        <li>Single-origin, traceable sourcing</li>
        <li>Ships in 2–7 days depending on location</li>
      </ul>
    </section>
  </main>
</div>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

try {
  const indexPath = join(distDir, 'index.html');
  let html = readFileSync(indexPath, 'utf-8');

  // Replace empty root div with pre-rendered HTML
  const emptyRoot = /<div id="root"><\/div>/;
  const emptyRootAlt = /<div id="root"\s*\/>/;

  if (!emptyRoot.test(html) && !emptyRootAlt.test(html)) {
    console.warn('[prerender] Could not find <div id="root"></div> in dist/index.html — skipping injection.');
    process.exit(0);
  }

  const rendered = buildHomepageHTML();
  html = html.replace(emptyRoot, rendered).replace(emptyRootAlt, rendered);

  // Remove the <noscript> block since we now have real HTML (avoid duplicate content)
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, '');

  writeFileSync(indexPath, html, 'utf-8');
  console.log('[prerender] ✅ Homepage pre-rendered successfully →', indexPath);
} catch (err) {
  console.error('[prerender] ❌ Failed:', err.message);
  process.exit(1);
}
