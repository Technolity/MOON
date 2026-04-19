import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HeroProductMedia } from '../components/HeroProductMedia';
import { productStories } from '../data/products';
import type { CatalogItem, ProductKey } from '../types';

const CAROUSEL_PRODUCTS: ProductKey[] = ['shilajit', 'kashmiriSaffron', 'kashmiriHoney'];
const CAROUSEL_MS = 10000;

interface CarouselTheme {
  primary: string;
  accent: string;
  glow: string;
}

const THEMES: Record<ProductKey, CarouselTheme> = {
  shilajit: { primary: '#2C1810', accent: '#7C4A2A', glow: '44,24,16' },
  kashmiriSaffron: { primary: '#C44A0C', accent: '#E8730A', glow: '196,74,12' },
  kashmiriHoney: { primary: '#8B6000', accent: '#C8960A', glow: '139,96,0' },
  iraniSaffron: { primary: '#D8A03F', accent: '#C8901F', glow: '216,160,63' },
  kashmiriAlmonds: { primary: '#CBA674', accent: '#A87854', glow: '203,166,116' },
  walnuts: { primary: '#9E7A52', accent: '#7E5A32', glow: '158,122,82' },
  kashmiriGhee: { primary: '#F1B65A', accent: '#E8A040', glow: '241,182,90' },
};

const EDITORIAL_SLIDES = [
  {
    image: '/moon333/ezgif-frame-162.png',
    title: 'Shilajit',
    tagline: 'Mountain Strength',
    desc: 'Purified Himalayan resin — gold grade, third-party tested.',
    accent: '#2C1810',
    light: '#7C4A2A',
  },
  {
    image: '/moon2222/ezgif-frame-162.png',
    title: 'Kashmiri Saffron',
    tagline: 'Crimson Ritual',
    desc: 'Mongra A++ threads from Pampore, hand-sorted and sun-dried.',
    accent: '#C44A0C',
    light: '#E8730A',
  },
  {
    image: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
    title: 'Kashmiri Honey',
    tagline: 'Liquid Gold',
    desc: 'Raw wild honey from high-altitude Kashmir meadows.',
    accent: '#8B6000',
    light: '#C8960A',
  },
];

const SLIDESHOW_MS = 3200;

const STATS = [
  { value: '800+', label: 'Orders Delivered' },
  { value: '5,000+', label: 'Happy Customers' },
  { value: '100%', label: 'Pure & Lab Tested' },
  { value: '4.9 ★', label: 'Average Rating' },
];

const TESTIMONIALS = [
  { name: 'Aryan S.', role: 'Fitness Enthusiast', quote: 'MOON Shilajit transformed my recovery. Genuine quality, no shortcuts — this is the real deal.', rating: 5 },
  { name: 'Priya K.', role: 'Home Chef', quote: 'The Kashmiri Saffron aroma is truly unmatched. Rich red stigmas, incredible colour. I use it in everything now.', rating: 5 },
  { name: 'Rahul M.', role: 'Wellness Coach', quote: 'Been recommending MOON to every client. Pure, potent, and ethically sourced — exactly what wellness should be.', rating: 5 },
];

const CATEGORIES = [
  { label: 'All Products' },
  { label: 'Resin & Mineral' },
  { label: 'Kashmiri Saffron' },
  { label: 'Irani Saffron' },
  { label: 'Dry Fruits' },
  { label: 'Ghee' },
];

interface HomePageProps {
  catalogItems: CatalogItem[];
  onSelectProduct: (key: ProductKey) => void;
  onAddDetailToCart: () => void;
  onAddCatalogToCart: (item: { id: string; title: string; price: number }) => void;
  onBrowseCollection: () => void;
  onProductClick: (item: CatalogItem) => void;
}

export function HomePage({
  catalogItems,
  onSelectProduct,
  onAddDetailToCart,
  onAddCatalogToCart,
  onBrowseCollection,
  onProductClick,
}: HomePageProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [editorialSlide, setEditorialSlide] = useState(0);
  const [editorialFading, setEditorialFading] = useState(false);
  // 0 = video only | 1 = CTA buttons visible | 2 = full details visible
  const [heroPhase, setHeroPhase] = useState<0 | 1 | 2>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number>(0);
  const advanceRef = useRef<() => void>(() => {});

  const activeKey = CAROUSEL_PRODUCTS[slideIndex];
  const theme = THEMES[activeKey];
  const activeStory = productStories[activeKey];

  const catalogByKey = useMemo(() =>
    catalogItems.reduce((map, item) => {
      if (item.productKey) map[item.productKey] = item;
      return map;
    }, {} as Partial<Record<ProductKey, CatalogItem>>),
    [catalogItems]
  );

  const activeItem = catalogByKey[activeKey];

  const fmt = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true);
    setHeroPhase(0);
    setTimeout(() => {
      setSlideIndex(index);
      setAnimKey((k) => k + 1);
      onSelectProduct(CAROUSEL_PRODUCTS[index]);
      setIsTransitioning(false);
    }, 700);
  }, [onSelectProduct]);

  const advance = useCallback(() => {
    goToSlide((slideIndex + 1) % CAROUSEL_PRODUCTS.length);
  }, [slideIndex, goToSlide]);

  // Keep advanceRef current so phase timers can call it without stale closure
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  // Phase cascade per slide:
  // 0→video (3s) → 1→CTA buttons (4s) → 2→details (12s) → auto-advance
  useEffect(() => {
    setHeroPhase(0);
    const t1 = setTimeout(() => setHeroPhase(1), 3000);   // 3s: CTA appears
    const t2 = setTimeout(() => setHeroPhase(2), 7000);   // 7s: details appear right after CTA fades
    const t3 = setTimeout(() => advanceRef.current(), 19000); // 19s: auto-advance (12s on details)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [slideIndex]);

  /* ── Editorial slideshow: cross-fade between slides ── */
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setEditorialFading(true);
      setTimeout(() => {
        setEditorialSlide((s) => (s + 1) % EDITORIAL_SLIDES.length);
        setEditorialFading(false);
      }, 500);
    }, SLIDESHOW_MS);
    return () => clearInterval(slideTimer);
  }, []);

  const bullets = activeStory.details.split('<br>').filter(Boolean);

  const onNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) { window.alert('Please enter your email.'); return; }
    window.alert(`Thanks for subscribing, ${newsletterEmail.trim()}.`);
    setNewsletterEmail('');
  };

  return (
    <main id="main-content" style={{ background: 'var(--paper-0, #FAF6EF)', color: 'var(--ink-0, #0B0806)' }}>

      {/* ── HERO CAROUSEL ───────────────────────────────────────────── */}
      <section
        id="sanctuary"
        className="relative min-h-[100svh] overflow-hidden"
        style={{ background: 'var(--paper-0, #FAF6EF)' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 48) {
            if (diff > 0) goToSlide((slideIndex + 1) % CAROUSEL_PRODUCTS.length);
            else goToSlide((slideIndex - 1 + CAROUSEL_PRODUCTS.length) % CAROUSEL_PRODUCTS.length);
          }
        }}
      >
        {/* Giant ghosted product name — left-anchored, sits behind image */}
        <div
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
          style={{ zIndex: 1 }}
        >
          <h2
            key={`bg-${animKey}`}
            className="font-display uppercase leading-none hero-bg-text-enter"
            style={{
              fontSize: 'clamp(7rem, 22vw, 20rem)',
              letterSpacing: '-0.04em',
              color: `rgba(${theme.glow}, 0.06)`,
              whiteSpace: 'nowrap',
              paddingLeft: '3vw',
              fontWeight: 900,
            }}
          >
            {activeStory.featureName}
          </h2>
        </div>

        {/* Warm radial tint — right panel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: `radial-gradient(ellipse 55% 75% at 75% 55%, rgba(${theme.glow},0.08), transparent 65%)`,
            transition: 'background 0.9s ease',
          }}
        />

        {/* ── HERO MEDIA — positioned relative to section (full-width) ── */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.7s ease',
          pointerEvents: 'none',
        }}>
          <HeroProductMedia
            activeItem={activeItem}
            activeProduct={activeKey}
            activeStory={activeStory}
            glow={theme.glow}
          />
        </div>

        {/* ── HERO CTA OVERLAY — phase 1 only ── */}
        <div style={{
          position: 'absolute',
          bottom: '14%',
          left: 0,
          right: 0,
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 30,
          opacity: heroPhase === 1 ? 1 : 0,
          transform: heroPhase === 1 ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: heroPhase === 1 ? 'auto' : 'none',
        }}>
          <button
            type="button"
            onClick={() => { setHeroPhase(0); onBrowseCollection(); }}
            style={{
              background: 'rgba(11,8,6,0.60)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.65)',
              color: '#fff',
              padding: '13px 32px',
              fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
              fontSize: '0.625rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >Shop Now</button>
          <button
            type="button"
            onClick={() => setHeroPhase(2)}
            style={{
              background: 'transparent',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.45)',
              color: 'rgba(255,255,255,0.9)',
              padding: '13px 32px',
              fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
              fontSize: '0.625rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >Explore</button>
        </div>

        {/* ── SPLIT LAYOUT ── */}
        <div className="relative flex min-h-[100svh]" style={{ zIndex: 10 }}>

          {/* LEFT PANEL — editorial text content, revealed at phase 2 */}
          <div className="relative flex w-full flex-col justify-start overflow-hidden px-8 pb-12 pt-28 md:w-[48%] md:justify-center md:px-14 md:pb-28 md:pt-32 lg:px-20 xl:px-24">
            {/* Mobile gradient scrim — always present so text is readable */}
            <div
              className="absolute inset-0 pointer-events-none md:hidden"
              style={{
                background: 'linear-gradient(to bottom, rgba(250,246,239,0.55) 0%, rgba(250,246,239,0.88) 100%)',
                zIndex: 0,
                opacity: heroPhase >= 2 ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
            />

            {/* Slide counter + eyebrow — always visible */}
            <p
              key={`label-${animKey}`}
              className="mb-5 font-display text-[10px] uppercase tracking-[0.44em] carousel-text-enter"
              style={{ color: heroPhase >= 2 ? theme.accent : 'rgba(255,255,255,0.75)', position: 'relative', zIndex: 1, transition: 'color 0.6s ease' }}
            >
              {String(slideIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(CAROUSEL_PRODUCTS.length).padStart(2, '0')}&nbsp;&nbsp;·&nbsp;&nbsp;Himalayan Origin
            </p>
            {/* Content panel — fades in at phase 2 */}
            <div style={{
              opacity: heroPhase >= 2 ? 1 : 0,
              transform: heroPhase >= 2 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              position: 'relative', zIndex: 1,
            }}>

            {/* Product name — massive */}
            <h1
              key={`title-${animKey}`}
              className="font-display uppercase leading-[0.9] tracking-tighter carousel-text-enter"
              style={{
                fontSize: 'clamp(2rem, 8vw, 4.4rem)',
                color: theme.primary,
                animationDelay: '0.06s',
                fontWeight: 900,
              }}
            >
              {activeStory.featureName}
            </h1>

            {/* Tagline italic */}
            <p
              key={`tag-${animKey}`}
              className="mt-3 font-headline text-base italic carousel-text-enter md:text-lg"
              style={{ color: theme.accent, animationDelay: '0.1s' }}
            >
              {activeStory.title}
            </p>

            {/* Accent rule */}
            <div
              className="my-5 h-px w-12 carousel-text-enter"
              style={{ background: `rgba(${theme.glow},0.45)`, animationDelay: '0.13s' }}
            />

            {/* Description */}
            <p
              key={`desc-${animKey}`}
              className="max-w-sm text-sm leading-relaxed carousel-text-enter"
              style={{ color: '#4A3A30', animationDelay: '0.16s' }}
            >
              {activeStory.desc}
            </p>

            {/* Feature tags */}
            <div
              key={`tags-${animKey}`}
              className="mt-6 flex flex-wrap gap-2 carousel-text-enter"
              style={{ animationDelay: '0.2s' }}
            >
              {bullets.slice(0, 3).map((b) => (
                <span
                  key={b}
                  className="px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.16em]"
                  style={{
                    border: `1px solid rgba(${theme.glow},0.32)`,
                    background: `rgba(${theme.glow},0.05)`,
                    color: theme.primary,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Price + CTAs */}
            <div
              key={`cta-${animKey}`}
              className="mt-8 flex flex-col gap-4 carousel-text-enter sm:flex-row sm:items-center"
              style={{ animationDelay: '0.24s' }}
            >
              <p
                className="font-display text-2xl font-bold tracking-tight"
                style={{ color: theme.primary }}
              >
                {activeItem ? fmt(activeItem.price) : activeStory.price}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onAddDetailToCart}
                  className="px-9 py-3.5 font-headline text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: theme.primary,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  Shop Now
                </button>
                <button
                  type="button"
                  onClick={onBrowseCollection}
                  className="px-9 py-3.5 font-headline text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    border: `1.5px solid rgba(${theme.glow},0.45)`,
                    color: theme.primary,
                    background: 'rgba(250,246,239,0.25)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
            </div>{/* end content panel wrapper */}
          </div>

        </div>

        {/* ── CAROUSEL DOTS — pill style ── */}
        <div
          className="absolute bottom-10 left-8 flex items-center gap-3 md:left-14 lg:left-20 xl:left-24"
          style={{ zIndex: 30 }}
        >
          {CAROUSEL_PRODUCTS.map((key, i) => (
            <button
              key={key}
              type="button"
              aria-label={`View ${productStories[key].featureName}`}
              onClick={() => goToSlide(i)}
              className="h-2 transition-all duration-500 hover:opacity-80"
              style={{
                width: i === slideIndex ? '28px' : '8px',
                borderRadius: '4px',
                background: i === slideIndex ? theme.primary : `rgba(${theme.glow},0.28)`,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        {!isPaused && (
          <div
            className="absolute bottom-0 left-0 h-[2px] w-full"
            style={{ zIndex: 30, background: `rgba(${theme.glow},0.12)` }}
          >
            <div
              key={animKey}
              className="h-full carousel-progress"
              style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` }}
            />
          </div>
        )}
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--ink-0, #0B0806)', overflow: 'hidden', padding: '14px 0' }}>
        <div style={{ display: 'flex', animation: 'marquee 40s linear infinite', whiteSpace: 'nowrap' }}>
          {['MOON RITUALS', 'PROPHETIC WELLNESS', 'PURE ORIGINS', 'HIMALAYAN · KASHMIRI · ORCHARD', 'NATURALLY YOURS',
            'MOON RITUALS', 'PROPHETIC WELLNESS', 'PURE ORIGINS', 'HIMALAYAN · KASHMIRI · ORCHARD', 'NATURALLY YOURS',
            'MOON RITUALS', 'PROPHETIC WELLNESS', 'PURE ORIGINS', 'HIMALAYAN · KASHMIRI · ORCHARD', 'NATURALLY YOURS'].map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, paddingRight: 32 }}>
                <span style={{
                  fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
                  color: 'rgba(250,246,239,0.7)',
                }}>{p}</span>
                <span style={{ color: 'var(--saffron-500, #D2571B)', fontSize: 14 }}>·</span>
              </span>
            ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ────────────────────────────────────────── */}
      <section style={{ background: 'var(--paper-0, #FAF6EF)', padding: 'clamp(32px,6vw,56px) clamp(16px,4vw,64px) 20px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
            fontSize: '0.6875rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', fontWeight: 700,
            color: 'var(--ink-3, #8A7A66)', marginBottom: 16,
          }}>The Archive · 06 Essentials</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(({ label }, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => { setActiveCategoryIndex(idx); onBrowseCollection(); }}
                style={{
                  border: idx === activeCategoryIndex
                    ? '1px solid var(--ink-0, #0B0806)'
                    : '1px solid var(--hairline, rgba(11,8,6,0.12))',
                  padding: '8px 20px',
                  fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                  fontSize: '0.625rem', letterSpacing: '0.16em',
                  textTransform: 'uppercase', fontWeight: 700,
                  background: idx === activeCategoryIndex ? 'var(--ink-0, #0B0806)' : 'transparent',
                  color: idx === activeCategoryIndex ? 'var(--paper-0, #FAF6EF)' : 'var(--ink-2, #4A3E31)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT COLLECTION ──────────────────────────────────────── */}
      <section id="rituals" style={{
        background: 'var(--paper-0, #FAF6EF)',
        padding: '16px clamp(16px,4vw,64px) clamp(48px,8vw,96px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginBottom: 32, flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif, Fraunces, serif)',
                fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
                lineHeight: 1.12, letterSpacing: '-0.01em', fontWeight: 400,
                color: 'var(--ink-0, #0B0806)', margin: 0,
              }}>
                Curated by origin, <em>not by trend.</em>
              </h2>
              <p style={{
                marginTop: 8, fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                color: 'var(--ink-2, #4A3E31)', maxWidth: '36ch',
              }}>
                Single-origin staples — each jar carries the place, season and hands that made it.
              </p>
            </div>
            <button
              type="button"
              onClick={onBrowseCollection}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: 700, color: 'var(--ink-0)',
                borderBottom: '1px solid var(--ink-0)',
                padding: '4px 0',
              }}
            >
              View full catalogue →
            </button>
          </div>

          <div id="shop" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
            gap: '20px',
          }}>
            {catalogItems.map((item, idx) => (
              <article
                key={item.id}
                className="group"
                style={{
                  border: '1px solid rgba(11,8,6,0.08)',
                  background: 'var(--paper-0, #FAF6EF)',
                  transition: 'transform 0.3s var(--ease-out), box-shadow 0.3s',
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: 4,
                  boxShadow: '0 1px 8px rgba(11,8,6,0.07), 0 4px 20px rgba(11,8,6,0.04)',
                  overflow: 'hidden',
                }}
                onClick={() => onProductClick(item)}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lift)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--paper-1)' }}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="group-hover:scale-[1.04]"
                    style={{
                      height: 260, width: '100%',
                      objectFit: 'cover',
                      transition: 'transform 700ms var(--ease-out)',
                      display: 'block',
                    }}
                  />
                  {item.featured && (
                    <span style={{
                      position: 'absolute', left: 12, top: 12,
                      background: 'var(--saffron-500, #D2571B)', color: '#fff',
                      padding: '4px 10px',
                      fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                      letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                    }}>Best Seller</span>
                  )}
                </div>

                <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{
                    fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'var(--ink-3, #8A7A66)',
                  }}>{item.subtitle || 'Moon · Origin'}</div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif, Fraunces, serif)',
                    fontSize: '1.125rem', fontWeight: 500,
                    color: 'var(--ink-0, #0B0806)', margin: 0,
                  }}>{item.title}</h3>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>★★★★★</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <span style={{
                      fontFamily: 'var(--font-serif, Fraunces, serif)',
                      fontSize: '1.125rem', fontWeight: 500,
                      color: 'var(--ink-0)',
                    }}>{fmt(item.price)}</span>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); onAddCatalogToCart(item); }}
                      style={{
                        background: 'var(--ink-0, #0B0806)',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        fontFamily: 'var(--font-mark)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >Add to Cart</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL / BRAND STORY — live frame slideshow ──────────── */}
      <section id="archives" style={{ background: 'var(--paper-1, #F4EDE2)', overflow: 'hidden' }}>
        <div className="mx-auto grid w-full max-w-7xl md:grid-cols-2">

          {/* LEFT — static product image with cross-fade between slides */}
          <div className="group relative h-[420px] overflow-hidden md:h-[640px]">
            {/* Static mid-point frame — grayscale by default, full color on hover */}
            <img
              src={EDITORIAL_SLIDES[editorialSlide].image}
              alt={EDITORIAL_SLIDES[editorialSlide].title}
              className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0"
              style={{
                opacity: editorialFading ? 0 : 1,
                transition: 'opacity 0.5s ease, filter 0.8s ease',
              }}
            />
            {/* Overlay gradient for readability */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(${EDITORIAL_SLIDES[editorialSlide].accent === '#2C1810' ? '44,24,16' : EDITORIAL_SLIDES[editorialSlide].accent === '#C44A0C' ? '196,74,12' : '139,96,0'},0.55) 0%, transparent 50%)`,
                transition: 'background 0.5s ease',
              }}
            />
            {/* Slide label bottom-left */}
            <div className="absolute bottom-6 left-6 right-6">
              <p
                className="font-display text-[10px] uppercase tracking-[0.36em]"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {String(editorialSlide + 1).padStart(2, '0')} / {String(EDITORIAL_SLIDES.length).padStart(2, '0')}
              </p>
              <p
                className="mt-1 font-display text-2xl uppercase tracking-tight text-white"
                style={{ opacity: editorialFading ? 0 : 1, transition: 'opacity 0.5s ease' }}
              >
                {EDITORIAL_SLIDES[editorialSlide].tagline}
              </p>
            </div>
            {/* Slide dots */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {EDITORIAL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Editorial slide ${i + 1}`}
                  onClick={() => { setEditorialSlide(i); }}
                  className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: i === editorialSlide ? 'white' : 'rgba(255,255,255,0.35)',
                    transform: i === editorialSlide ? 'scale(1.5)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — editorial text */}
          <div
            className="flex flex-col justify-center space-y-6 px-8 py-16 md:px-14 lg:px-16"
            style={{
              opacity: editorialFading ? 0.6 : 1,
              transition: 'opacity 0.5s ease',
            }}
          >
            <p className="font-display text-xs uppercase tracking-[0.35em] text-zinc-400">The Archive</p>
            <h2
              className="font-headline text-4xl leading-tight tracking-tight text-zinc-900 md:text-5xl"
              style={{ transition: 'color 0.5s ease' }}
            >
              {EDITORIAL_SLIDES[editorialSlide].title}
              <br />
              <em className="font-normal italic" style={{ color: EDITORIAL_SLIDES[editorialSlide].light }}>
                {EDITORIAL_SLIDES[editorialSlide].tagline}
              </em>
            </h2>
            <div
              className="h-px w-16 transition-all duration-500"
              style={{ background: EDITORIAL_SLIDES[editorialSlide].accent }}
            />
            <p className="text-base leading-loose text-zinc-600">
              {EDITORIAL_SLIDES[editorialSlide].desc}
            </p>
            <p className="text-sm leading-loose text-zinc-500">
              Each MOON product embodies centuries of traditional sourcing — from Shilajit resin harvested at 16,000 ft to Mongra saffron threads hand-sorted at dawn. Pure. Potent. Purposeful.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBrowseCollection}
                className="inline-block border border-zinc-300 px-8 py-3 font-label text-xs uppercase tracking-[0.2em] text-zinc-700 transition-all hover:border-zinc-500 hover:text-zinc-900"
              >
                Explore Our Story
              </button>
              {/* Slideshow dots (desktop) */}
              <div className="flex gap-2">
                {EDITORIAL_SLIDES.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={s.title}
                    onClick={() => { setEditorialSlide(i); }}
                    className="h-2 rounded-full transition-all duration-400"
                    style={{
                      width: i === editorialSlide ? '24px' : '8px',
                      background: i === editorialSlide ? EDITORIAL_SLIDES[i].accent : 'rgba(0,0,0,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--paper-1, #F4EDE2)',
        borderTop: '1px solid var(--hairline, rgba(11,8,6,0.12))',
        borderBottom: '1px solid var(--hairline, rgba(11,8,6,0.12))',
        padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,64px)',
      }}>
        <div style={{
          maxWidth: 1320, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(24px,5vw,48px)',
        }} className="md:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'var(--font-serif, Fraunces, serif)',
                fontSize: 'clamp(2rem,5vw,3.5rem)',
                fontWeight: 300, lineHeight: 1,
                color: 'var(--saffron-500, #D2571B)',
                letterSpacing: '-0.02em', margin: 0,
              }}>{value}</p>
              <p style={{
                marginTop: 10,
                fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                fontSize: '0.625rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--ink-3, #8A7A66)',
              }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--paper-0, #FAF6EF)',
        padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,64px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
              fontSize: '0.6875rem', letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 16,
            }}>Voices · The Private List</div>
            <h2 style={{
              fontFamily: 'var(--font-serif, Fraunces, serif)',
              fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
              lineHeight: 1.12, fontWeight: 400, letterSpacing: '-0.01em',
              color: 'var(--ink-0)', margin: 0,
            }}>
              Thousands of Indian <em>households</em>, one origin.
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 24,
          }}>
            {TESTIMONIALS.map(({ name, role, quote, rating }) => (
              <figure
                key={name}
                style={{
                  border: '1px solid var(--hairline, rgba(11,8,6,0.12))',
                  background: 'var(--paper-0)',
                  padding: '28px 24px',
                  margin: 0,
                  boxShadow: 'var(--shadow-1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-1)';
                }}
              >
                <div style={{ marginBottom: 16 }} aria-label={`${rating} stars`}>
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--saffron-500, #D2571B)', fontSize: 14 }} aria-hidden>★</span>
                  ))}
                </div>
                <blockquote style={{
                  fontFamily: 'var(--font-serif, Fraunces, serif)',
                  fontStyle: 'italic', fontSize: '1rem',
                  lineHeight: 1.6, color: 'var(--ink-1, #1F1811)',
                  margin: 0, marginBottom: 20,
                }}>"{quote}"</blockquote>
                <figcaption style={{
                  borderTop: '1px solid var(--hairline, rgba(11,8,6,0.12))',
                  paddingTop: 16,
                }}>
                  <strong style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                    fontWeight: 700, color: 'var(--ink-0)',
                    display: 'block',
                  }}>{name}</strong>
                  <span style={{
                    fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'var(--ink-3)', marginTop: 4, display: 'block',
                  }}>{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section id="journal" style={{
        background: 'var(--paper-1, #F4EDE2)',
        padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,64px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gap: 'clamp(32px,6vw,80px)', alignItems: 'center',
          }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <div style={{
                fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                fontSize: '0.6875rem', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 16,
              }}>Join the Private List</div>
              <h2 style={{
                fontFamily: 'var(--font-serif, Fraunces, serif)',
                fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
                lineHeight: 1.12, fontWeight: 400, letterSpacing: '-0.01em',
                color: 'var(--ink-0)', margin: '0 0 20px',
              }}>
                Letters, <em>not</em> marketing.
              </h2>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '1.125rem',
                lineHeight: 1.75, color: 'var(--ink-2)', maxWidth: '40ch',
              }}>
                A quarterly letter from the moon archive — harvest notes from our growers, small-batch drops, and the occasional recipe. Nothing you could call a newsletter.
              </p>
            </div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={onNewsletterSubmit} id="newsletter">
              <div className="flex flex-col sm:flex-row" style={{ gap: 0 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  aria-label="Email address"
                  required
                  style={{
                    flex: 1,
                    border: '1px solid var(--hairline-strong, rgba(11,8,6,0.22))',
                    background: 'var(--paper-0)',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                    color: 'var(--ink-0)', outline: 'none',
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--saffron-500, #D2571B)', color: '#fff',
                    border: 'none', padding: '14px 28px',
                    fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--saffron-400, #E67336)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--saffron-500, #D2571B)'; }}
                >
                  Subscribe
                </button>
              </div>
              <p style={{
                fontSize: '0.6875rem', color: 'var(--ink-3)', letterSpacing: '0.04em',
              }}>
                No spam, no affiliate links. One letter per season.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
