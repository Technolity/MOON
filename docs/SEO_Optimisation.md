# SEO Optimisation Tracker — MOON

This file tracks every SEO task: what has been done, what is pending, and what changes
when the frontend migrates from static HTML to React.

**Domain:** `moonnaturallyyours.com`
**Last updated:** 2026-04-11

---

## Status Legend

- `[x]` Done
- `[ ]` Not done
- `[~]` Partially done / needs revisiting
- `[!]` Blocked — depends on something else (hosting, React migration, etc.)

---

## 1. Code-Level SEO (Static HTML Phase)

### Head tags
- [x] `<title>` — keyword-rich: "MOON | Buy Kashmiri Saffron, Sidr Honey & Shilajit Online India"
- [x] `<meta name="description">` — includes products, grade, free shipping threshold, India
- [x] `<meta name="robots" content="index, follow">`
- [x] `<link rel="canonical" href="https://moonnaturallyyours.com/">`
- [x] Open Graph tags — `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale`
- [x] Twitter Card — `summary_large_image`
- [x] `<meta name="theme-color">`
- [~] Favicon — `<link rel="icon">` and `<link rel="apple-touch-icon">` added, **actual files not created yet**
- [~] OG cover image — meta tag added, **`assets/og-cover.jpg` (1200×630px) not created yet**

### Structured data (JSON-LD)
- [x] `Organization` schema — name, url, logo, sameAs social links
- [x] `WebSite` schema — with `SearchAction` (sitelinks search box)
- [x] `ItemList` schema — 3 products with `Product` + `Offer` (price INR, InStock)
- [ ] Individual `Product` schema per product page (needed once product pages exist)
- [ ] `BreadcrumbList` schema (needed on product pages)
- [ ] `Review` / `AggregateRating` schema (needed when reviews are added)

### On-page content
- [x] `<h1>` exists in hero — "Red Jewel." (JS-dynamic, replaced per product selection)
- [x] Heading hierarchy — h1 → h2 → h3 correct on static load
- [x] Shop section heading changed from "Modular Product Grid" → "Premium Wellness Collection"
- [x] Newsletter `<h3>` corrected to `<h2>`
- [x] All product images have descriptive, keyword-rich alt text
- [x] Below-fold images have `loading="lazy"` and `decoding="async"`
- [ ] **Known issue:** Showcase featured image (`moon2222/ezgif-frame-097.jpg`) missing `loading="lazy"`
- [ ] **Known issue:** Banner background image (`moon333/ezgif-frame-140.jpg`) missing `loading="lazy"`
- [ ] **Known issue:** `<h2 id="detail-title">Red Jewel.</h2>` — JS-mutated, non-descriptive on initial load
- [ ] **Known issue:** `<h2 id="feature-product-name">` starts as "Kashmiri Saffron" but is JS-replaced — verify Google sees the static value
- [x] Footer copyright `(c)` → `©`
- [ ] Footer social links still point to generic `instagram.com` / `x.com` / `youtube.com` — replace with actual brand handles

### Technical files
- [x] `robots.txt` — `Allow: /`, points to sitemap
- [x] `sitemap.xml` — homepage entry with `lastmod`, `changefreq`, `priority`
- [ ] Sitemap needs updating when product pages, blog, and other URLs are added

---

## 2. Things Needed Before Go-Live

- [ ] Replace `moonnaturallyyours.com` in all 3 files if domain changes:
  - `index.html` — canonical, OG URLs, JSON-LD `url` fields (×7 occurrences)
  - `robots.txt` — sitemap URL
  - `sitemap.xml` — `<loc>` URL
- [ ] Create `assets/og-cover.jpg` — 1200×630px cinematic product shot (used for WhatsApp/social previews)
- [ ] Create `favicon.png` (32×32) and `apple-touch-icon.png` (180×180)
- [ ] Update `Organization.sameAs` in JSON-LD with actual social media profile URLs
- [ ] Submit sitemap to Google Search Console after hosting
- [ ] Verify domain ownership in Google Search Console
- [ ] Set up Google Analytics 4 and connect to GSC

---

## 3. React Migration — What Changes for SEO

When the frontend moves to React, SEO requires a different setup because React renders
in the browser (client-side), not on the server — Google can crawl client-rendered pages
but it is slower and less reliable for indexing.

### Recommended framework
Use **Next.js** (App Router). It gives SSR/SSG out of the box, which is essential for
product pages to be indexed reliably.

### Head management
| Static HTML approach | React / Next.js equivalent |
|---|---|
| `<title>` in `<head>` | `export const metadata = { title: '...' }` in each page (App Router) |
| `<meta name="description">` | `export const metadata = { description: '...' }` |
| Open Graph tags | `export const metadata = { openGraph: { ... } }` |
| Twitter Card | `export const metadata = { twitter: { ... } }` |
| `<link rel="canonical">` | `export const metadata = { alternates: { canonical: '...' } }` |
| JSON-LD `<script>` blocks | Import `next/script` or use a `<JsonLd>` component in each page layout |

### Per-page SEO (critical once product pages exist)
Each product page (`/kashmiri-saffron`, `/sidr-honey`, `/shilajit`) needs:
- [ ] Unique `<title>` — e.g., "Buy Kashmiri Saffron Online | Mongra A++ — MOON"
- [ ] Unique `<meta description>` — 150–160 chars, includes product name + benefit + brand
- [ ] Unique canonical URL
- [ ] Individual `Product` JSON-LD schema with `Review` and `AggregateRating` once reviews exist
- [ ] `BreadcrumbList` schema: Home > Shop > [Product Name]
- [ ] OG image per product (product-specific photo, 1200×630)

### Dynamic rendering
- **Product pages**: use SSG (`generateStaticParams`) — pages are pre-built at deploy time
- **Search / filter results**: use SSR if query-dependent, or client-side with a static shell
- **Cart / checkout**: client-side only — no SEO needed, add `noindex` to checkout pages

### Images in React
- Replace `<img loading="lazy">` with `next/image` (`<Image>` component)
- `next/image` handles lazy loading, WebP conversion, srcset, and CLS prevention automatically
- Frame animation images (ezgif folders) are a performance concern — consider converting to WebP and using a sprite sheet or CSS animation instead of preloading 576 individual frames

### Sitemap
- Use `next-sitemap` or the built-in `app/sitemap.ts` in Next.js App Router
- Auto-generates sitemap entries for all pages; update `sitemap.ts` to include product pages and blog posts

### robots.txt in Next.js
- Use `app/robots.ts` — Next.js serves it at `/robots.txt` automatically

---

## 4. Keyword Targets (Reference)

| Product | Primary keyword | Secondary keywords |
|---|---|---|
| Kashmiri Saffron | buy kashmiri saffron online india | kesar mongra grade, kashmiri kesar price, pampore saffron |
| Sidr Honey | buy sidr honey india | yemeni sidr honey, sidr honey price india, raw sidr honey |
| Shilajit | himalayan shilajit india | buy shilajit online, pure shilajit resin, shilajit fulvic acid |
| Brand | prophetic wellness india | sunnah wellness products, moon wellness india |
| Bundle | sunnah gift box india | wellness gift hamper india, islamic wellness products |

---

## 5. Post-Launch SEO Roadmap

### Month 1 — Foundation
- [ ] GSC domain verified, sitemap submitted
- [ ] GA4 connected
- [ ] Google Business Profile created (even for online-only — builds trust)
- [ ] All product pages live with individual SEO metadata
- [ ] OG images created for homepage + 3 product pages
- [ ] WebP conversion of all product images

### Month 2 — Content
- [ ] Blog launched with 3–5 foundational articles:
  - "Benefits of Kashmiri Saffron (Kesar) — What the Science Says"
  - "How to Use Shilajit: Dosage, Benefits, and Side Effects"
  - "What Makes Sidr Honey Different from Regular Honey"
  - "The Sunnah Wellness Lifestyle — A Beginner's Guide"
- [ ] Internal linking: blog posts → product pages
- [ ] FAQ section on each product page (increases page depth, answers search queries)

### Month 3+ — Authority
- [ ] Backlinks from Muslim lifestyle blogs, wellness publications, Indian health sites
- [ ] Instagram and YouTube optimised (bio keywords, video descriptions, alt text on posts)
- [ ] Customer review system live — `AggregateRating` schema populated
- [ ] Explore Google Merchant Center for Shopping listings (free product listings in India)

---

## 6. Known Issues in Current index.html

These are deferred until the React rewrite — no need to fix them in the static file:

1. Showcase featured image missing `loading="lazy"` — (`moon2222/ezgif-frame-097.jpg`, line ~212)
2. Banner background image missing `loading="lazy"` — (`moon333/ezgif-frame-140.jpg`, line ~269)
3. `<h2 id="detail-title">Red Jewel.</h2>` — JS overwrites this; non-descriptive on initial HTML parse
4. `<h2 id="feature-product-name">` — JS-replaced heading; Google may see the default static value

All four are consequences of the JS-driven, single-page architecture. The React migration with
Next.js SSR will resolve these by serving the correct server-rendered HTML to crawlers.
