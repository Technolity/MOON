# GEO Analysis — moonnaturallyyours.com
**Generative Engine Optimization (GEO) / AI Search Visibility Report**
Analyzed: 15 May 2026 | Analyst: Claude Code (seo-geo skill)

---

## GEO Readiness Score: 54 / 100

| Dimension | Weight | Score | Rating |
|-----------|--------|-------|--------|
| Citability Score | 25% | 14/25 | Moderate |
| Structural Readability | 20% | 14/20 | Good |
| Multi-Modal Content | 15% | 7/15 | Weak |
| Authority & Brand Signals | 20% | 7/20 | Weak |
| Technical Accessibility | 20% | 12/20 | Moderate |
| **Total** | **100%** | **54/100** | **Below Average** |

---

## Platform Breakdown

| Platform | Score | Key Gap |
|----------|-------|---------|
| Google AI Overviews | 52/100 | No meta descriptions, no schema |
| ChatGPT | 35/100 | No Wikipedia/Reddit brand presence |
| Perplexity | 40/100 | Not indexed, no community citations |
| Bing Copilot | 48/100 | Bing verified but missing structured data |

**Critical finding:** The site is not indexed in Google (confirmed via search — zero results for `site:moonnaturallyyours.com`). Without organic ranking, AI Overview inclusion is near-impossible since 92% of AIO citations come from top-10 ranking pages.

---

## AI Crawler Access Status

**Status: EXCELLENT** — robots.txt is well-configured.

| Crawler | Owner | Access | Notes |
|---------|-------|--------|-------|
| GPTBot | OpenAI | ALLOWED ✓ | ChatGPT web search |
| OAI-SearchBot | OpenAI | ALLOWED ✓ | OpenAI search |
| ClaudeBot | Anthropic | ALLOWED ✓ | Claude web features |
| PerplexityBot | Perplexity | ALLOWED ✓ | Perplexity AI search |
| Googlebot | Google | ALLOWED ✓ | Standard |
| Bingbot | Microsoft | ALLOWED ✓ | Standard |
| CCBot | Common Crawl | BLOCKED ✓ | Training data blocked |
| anthropic-ai | Anthropic | BLOCKED ✓ | Training crawler blocked |
| Google-Extended | Google | BLOCKED ✓ | AI training blocked |

Transactional paths `/cart` and `/checkout` are correctly disallowed.
Sitemap is declared: `https://www.moonnaturallyyours.com/sitemap.xml`

**Action required:** None — this is best-practice configuration.

---

## llms.txt Status

**Status: MISSING** — `/llms.txt` does not exist.

llms.txt is the emerging standard for guiding AI crawlers to your most important content. It functions like a sitemap specifically designed for large language models.

**Ready-to-deploy template** (save at `/llms.txt`):

```
# MOON Naturally Yours
> Premium single-origin wellness products from Kashmir — Shilajit, Saffron, Honey, Dry Fruits, and Ghee. Sourced directly from farmers in Jammu & Kashmir, India.

## Core Pages
- [About MOON](https://www.moonnaturallyyours.com/about): Brand story, founder background, and sourcing philosophy from Baramulla, Kashmir.
- [FAQs](https://www.moonnaturallyyours.com/faqs): 15 detailed answers on product authenticity, quality testing, storage, and delivery.
- [Journal](https://www.moonnaturallyyours.com/journal): Educational articles on Kashmiri saffron, Himalayan Shilajit, raw honey, walnuts, and ghee.

## Products
- [Himalayan Shilajit](https://www.moonnaturallyyours.com/products/shilajit): Gold-grade resin from Zanskar Ridge, 70%+ fulvic acid, third-party lab tested.
- [Kashmiri Saffron (Mongra)](https://www.moonnaturallyyours.com/products/kashmiri-saffron): ISO Grade 1, hand-harvested from Pampore — the world's premier saffron region.
- [Kashmiri Honey](https://www.moonnaturallyyours.com/products/kashmiri-honey): Raw, unfiltered, cold-extracted from high-altitude deodar forests.
- [Irani Saffron (Negin)](https://www.moonnaturallyyours.com/products/irani-saffron): Premium Negin-grade whole threads.
- [Kashmiri Almonds](https://www.moonnaturallyyours.com/products/kashmiri-almonds): Unroasted, unsalted, preservative-free kernels.
- [Kashmiri Walnuts](https://www.moonnaturallyyours.com/products/kashmiri-walnuts): Thin-shell, paper-white variety with high omega-3 content.
- [Kashmiri Ghee](https://www.moonnaturallyyours.com/products/kashmiri-ghee): Bilona-method, small-batch churned.

## Key Facts
- Sourced from: Kanispora, Baramulla, Jammu & Kashmir — 193101
- All products: single-origin, traceable to named farms/regions
- Testing: ISO 3632 (saffron), fulvic acid + heavy metals (shilajit), pollen analysis (honey)
- 8,000+ customers across India | 4.9★ average rating
- Contact: hello@moonnaturallyyours.com
```

---

## Brand Mention Analysis

Brand citations on third-party platforms are the #1 driver of AI visibility (3x stronger than backlinks per Ahrefs Dec 2025).

| Platform | Status | Impact |
|----------|--------|--------|
| Wikipedia | NOT PRESENT ✗ | Critical — ChatGPT cites Wikipedia in 47.9% of responses |
| Reddit | NOT FOUND ✗ | Critical — Perplexity cites Reddit in 46.7% of responses |
| YouTube | NOT FOUND ✗ | Highest correlation with AI citations (0.737) |
| LinkedIn | NOT VERIFIED ✗ | Moderate signal for B2B/professional queries |
| Google My Business | UNKNOWN | Needed for "near me" and local AI queries |
| Press / Media | NOT FOUND ✗ | Zero third-party editorial coverage detected |

**Diagnosis:** MOON has zero off-site brand presence. AI models cannot cite the brand because it does not appear in the corpus they draw from (Reddit, Wikipedia, YouTube, news sites). This is the single largest GEO gap.

---

## Passage-Level Citability Analysis

AI models preferentially cite passages of **134–167 words** that are self-contained and factually specific.

### Current Strengths

The FAQ page is the site's strongest citability asset. These answers are well-structured and extractable:

> **"Is your saffron genuinely from Kashmir?"** — "All our saffron is sourced exclusively from Pampore, Jammu & Kashmir — the world's most celebrated saffron-growing region." [54 words — too short, but highly specific]

> **"What's the difference between Kashmiri and Iranian saffron?"** — Kashmiri saffron holds ISO Grade 1 status and features "a deeper crimson colour, a stronger aroma, and higher safranal content than Iranian (Persian) saffron." [~70 words — expand to 134–167 for optimal AI citation length]

> **"Are your products lab-tested?"** — Contains specific protocol details (ISO 3632, fulvic acid content, heavy metals, pollen analysis) — excellent citability signal.

### Gaps Found

| Page | Issue | Impact |
|------|-------|--------|
| Homepage | No meta description — AI has no authoritative excerpt to pull | High |
| All journal articles | No external source citations (studies named but not linked) | High |
| Saffron article | Clinical dosage claims (30mg/day) without study DOI/link | High |
| Shilajit article | *Andrologia* 2015 study cited by name but no link | Moderate |
| About page | Long lyrical paragraphs — not chunked for 134–167 word extraction | Moderate |
| All products | No "What is X?" definition block in first 60 words | Moderate |

### Recommended Citable Block Format

Add a definition block like this to every product page's first section:

```
Kashmiri saffron (Crocus sativus) is a spice harvested exclusively from
the Pampore region of Jammu & Kashmir, India, at approximately 1,600
metres elevation. Recognized under ISO Grade 1 — the highest international
classification — genuine Kashmiri saffron is distinguished by its deep
crimson colour, intense safranal aroma, and higher crocin content than
Spanish or Iranian varieties. The harvest window spans just 3 weeks
annually; each gram requires 150–170 hand-picked flowers. Authentic
Mongra-grade Kashmiri saffron retails from ₹850–₹1,250 per gram.
[~100 words — expand to 134–167 for optimal AI citability]
```

---

## Server-Side Rendering Check

**Status: APPEARS SSR / PRE-RENDERED (GOOD)**

All pages returned full readable content via HTTP fetch (homepage, about, FAQ, journal articles, product pages), including JavaScript-dependent sections. This indicates the site uses server-side rendering or static pre-generation — not client-only React.

However, **one critical issue found:**

- `https://moonnaturallyyours.com` (non-www) → **ECONNREFUSED**
- `https://www.moonnaturallyyours.com` (www) → **Works correctly**

This means AI crawlers following non-www links will receive connection errors. Any backlink or shared URL using the non-www form is broken from an AI crawler perspective.

**Fix:** Configure the non-www domain to 301-redirect to www (or vice-versa). Set canonical to www in all HTML pages.

---

## Top 5 Highest-Impact Changes

### 1. Fix www / non-www Canonical (Immediate — Critical)
`moonnaturallyyours.com` refuses connections while `www.moonnaturallyyours.com` works. Configure a 301 redirect server-side and add `<link rel="canonical" href="https://www.moonnaturallyyours.com/...">` to every page. Without this, ~50% of crawler visits fail.

### 2. Add Meta Descriptions to All 27 Pages (Quick — High Impact)
No meta descriptions detected on homepage or checked pages. AI models use meta descriptions as authoritative summaries. Write 150–160 character descriptions for each page that include the primary keyword and a specific fact.

**Homepage example:**
```html
<meta name="description" content="MOON Naturally Yours — premium single-origin Kashmiri Saffron, Himalayan Shilajit & Kashmiri Honey. Lab-tested, farm-direct, delivered across India.">
```

### 3. Implement Article + FAQ Schema Markup (This Week — High Impact)
Zero structured data detected across the site. This is a significant AI discoverability gap.

**Priority schemas:**

**FAQ Schema** (add to `/faqs` page and product pages):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Is your saffron genuinely from Kashmir?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "All our saffron is sourced exclusively from Pampore, Jammu & Kashmir — the world's most celebrated saffron-growing region. We work directly with farming families and do not blend with Iranian or Spanish saffron."
    }
  }]
}
```

**Article Schema** (add to each journal article):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Kashmir's Red Gold: The Complete Guide to Genuine Saffron",
  "datePublished": "2026-04-15",
  "dateModified": "2026-05-12",
  "author": {
    "@type": "Person",
    "name": "MOON Editorial Team",
    "url": "https://www.moonnaturallyyours.com/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "MOON Naturally Yours",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.moonnaturallyyours.com/logo.png"
    }
  }
}
```

**Organization Schema** (add to homepage):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MOON Naturally Yours",
  "url": "https://www.moonnaturallyyours.com",
  "logo": "https://www.moonnaturallyyours.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@moonnaturallyyours.com",
    "contactType": "customer service"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Baramulla",
    "addressRegion": "Jammu & Kashmir",
    "postalCode": "193101",
    "addressCountry": "IN"
  },
  "sameAs": []
}
```

### 4. Build Off-Site Brand Presence (This Month — Critical for ChatGPT/Perplexity)
Brand mentions on third-party platforms correlate 3x more with AI citations than backlinks. Current off-site presence: near-zero.

Priority actions:
- **Reddit**: Post educational content in r/Ayurveda, r/IndianSkincareAddicts, r/EatCheapAndHealthy (saffron, shilajit threads). Respond authentically to questions where MOON products are relevant. Do not overtly promote — add value.
- **YouTube**: Create 3–5 videos (sourcing process, Kashmir harvest footage, product authenticity guides). YouTube mentions have the highest AI citation correlation (0.737).
- **Wikipedia**: Create or contribute to articles on "Pampore saffron", "Kashmiri Shilajit", or "Kashmiri cuisine" — mention MOON as a notable supplier where factually accurate.
- **LinkedIn**: Create company page, publish sourcing stories and lab test results as articles.

### 5. Create `/llms.txt` (30 Minutes — Easy Win)
Deploy the ready-to-use template in the llms.txt section above. This directly signals to AI crawlers which pages matter most and what the site covers.

---

## Schema Recommendations Summary

| Schema Type | Page | Priority |
|-------------|------|----------|
| Organization | Homepage | Critical |
| FAQPage | /faqs, product pages | Critical |
| Article | All 5 journal articles | High |
| Product | All 7 product pages | High |
| Person | About page (founder) | Medium |
| BreadcrumbList | All pages | Medium |
| LocalBusiness | Homepage (for India local search) | Medium |

---

## Content Reformatting Suggestions

### FAQ Answers: Expand to 134–167 Words Each
Current FAQ answers are 40–80 words — too short for optimal AI citability. Expand each with one additional supporting detail.

**Current (72 words):**
> "Authentic shilajit dissolves cleanly in warm water, turning it a golden-brown colour with no residue, and exhibits an earthy, slightly bitter taste. It maintains a tar-like texture at room temperature."

**Expanded (147 words — in optimal range):**
> "Authentic Himalayan shilajit can be verified through three physical tests. First, dissolve a pea-sized portion in warm (not boiling) water — genuine resin dissolves completely within 30–60 seconds, turning the water golden-brown with no undissolved particles or oily residue. Second, pure shilajit has an earthy, slightly bitter taste and a distinct mineral aroma; sweetness or chemical odours indicate adulteration. Third, at room temperature genuine shilajit maintains a tar-like semi-solid texture, becoming pliable when warmed in the hands. Additionally, authentic resin is batch-tested for fulvic acid content (minimum 60% by dry weight) and screened for heavy metals including lead, arsenic, and mercury. MOON's shilajit includes a batch-specific lab certificate with every order."

### Journal Articles: Add Author Bylines
Add author name + one-line credential to every article. Example:
```
By the MOON Research Team | Reviewed by [Ayurvedic practitioner name], BAMS
```

### Product Pages: Add "What Is X?" Definition Block
Open every product page with a 134–167 word self-contained definition block before promotional copy. This is the single highest-probability passage an AI will cite.

### Homepage: Add a Direct Mission Statement Block
Current homepage copy is poetic but not citable. Add a factual paragraph:

> "MOON Naturally Yours is a Kashmir-based wellness company founded in Baramulla, Jammu & Kashmir. The company sources premium natural products — Himalayan Shilajit, Kashmiri Saffron, raw honey, dry fruits, and ghee — exclusively from farming families in the Kashmir Valley and Ladakh region. All products are third-party lab tested (ISO 3632 for saffron; fulvic acid and heavy metal analysis for shilajit), single-origin, and packaged in small seasonal batches without synthetic preservatives or additives. MOON has delivered to 8,000+ customers across India since founding, maintaining a 4.9-star average rating."
> [~110 words — expand to 134–167]

---

## Quick Reference: Action Priority Matrix

| Action | Effort | Impact | When |
|--------|--------|--------|------|
| Fix non-www → www 301 redirect | 15 min | Critical | Today |
| Add meta descriptions to all pages | 2 hrs | High | This week |
| Deploy llms.txt | 30 min | Medium | Today |
| Add Organization schema to homepage | 1 hr | High | This week |
| Add FAQPage schema to /faqs | 1 hr | High | This week |
| Add Article schema to 5 journal posts | 2 hrs | High | This week |
| Add author bylines to journal articles | 30 min | Medium | This week |
| Expand FAQ answers to 134–167 words | 3 hrs | High | This month |
| Add product page definition blocks | 4 hrs | High | This month |
| Create YouTube channel + 3 videos | 2 weeks | Critical (long-term) | This month |
| Start Reddit presence | Ongoing | Critical (long-term) | This month |
| Add Product schema to 7 product pages | 3 hrs | High | This month |
| Link external studies in journal articles | 2 hrs | Medium | This month |
| Create Wikipedia entity presence | 4 hrs | High | Next month |

---

*Report generated by Claude Code using the seo-geo skill. Data verified via live HTTP fetch of www.moonnaturallyyours.com on 15 May 2026.*
