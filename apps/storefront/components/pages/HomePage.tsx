'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { productStories } from '@/lib/data/product-statics';
import type { CatalogItem, ProductKey } from '@/lib/types';
import '@/styles/HomePage.css';

type SlidePos = { productKey: ProductKey; isDetails: boolean };
const SLIDE_CONFIG: SlidePos[] = [
  { productKey: 'shilajit', isDetails: false },
  { productKey: 'kashmiriSaffron', isDetails: false },
  { productKey: 'kashmiriHoney', isDetails: false },
];
const TOTAL_SLIDES = SLIDE_CONFIG.length; // 3

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

/* v2 — Themed card image backgrounds & accent colors per product */
const CARD_THEMES: Record<string, { imgBg: string; accentColor: string; starColor: string; btnBg: string }> = {
  shilajit: { imgBg: 'linear-gradient(145deg,#0F0603,#2C1810)', accentColor: '#7C4A2A', starColor: '#9E6A42', btnBg: '#2C1810' },
  kashmiriSaffron: { imgBg: 'linear-gradient(145deg,#1A0200,#3D1200)', accentColor: '#E8730A', starColor: '#E8730A', btnBg: '#B63E0F' },
  kashmiriHoney: { imgBg: 'linear-gradient(145deg,#160900,#2B1800)', accentColor: '#C8960A', starColor: '#C8960A', btnBg: '#8B6000' },
  iraniSaffron: { imgBg: 'linear-gradient(145deg,#1A1000,#3A2600)', accentColor: '#C8901F', starColor: '#C8901F', btnBg: '#8B6000' },
  kashmiriAlmonds: { imgBg: 'linear-gradient(145deg,#120C07,#2A1C0E)', accentColor: '#CBA674', starColor: '#CBA674', btnBg: '#5A3921' },
  walnuts: { imgBg: 'linear-gradient(145deg,#0D0803,#1E120A)', accentColor: '#9E7A52', starColor: '#9E7A52', btnBg: '#3A2810' },
  kashmiriGhee: { imgBg: 'linear-gradient(145deg,#150F00,#2E2400)', accentColor: '#E8A040', starColor: '#E8A040', btnBg: '#6B4800' },
};
const DEFAULT_CARD = { imgBg: 'var(--bg-elevated)', accentColor: 'var(--accent-cta)', starColor: 'var(--accent-cta)', btnBg: 'var(--fg)' };

const BLOB = 'https://kxxv61zbiojiooac.public.blob.vercel-storage.com';

const HERO_MEDIA: Record<string, { webm: string; mp4: string; poster: string }> = {
  shilajit:        { webm: `${BLOB}/moon333.webm`,  mp4: `${BLOB}/moon333.mp4`,  poster: '/moon333/ezgif-frame-162.png' },
  kashmiriSaffron: { webm: `${BLOB}/moon2222.webm`, mp4: `${BLOB}/moon2222.mp4`, poster: '/moon2222/ezgif-frame-162.png' },
  kashmiriHoney:   { webm: `${BLOB}/honey.webm`,    mp4: `${BLOB}/honey.mp4`,    poster: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png' },
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
  { value: '1,200+', label: 'Orders Delivered' },
  { value: '8,000+', label: 'Customers across India' },
  { value: '100%', label: 'Origin-Verified' },
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
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [editorialSlide, setEditorialSlide] = useState(0);
  const [editorialFading, setEditorialFading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number>(0);
  const advanceRef = useRef<() => void>(() => { });
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeKey = SLIDE_CONFIG[slideIndex].productKey;
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
    const newKey = SLIDE_CONFIG[index].productKey;
    const isSameProduct = newKey === SLIDE_CONFIG[slideIndex]?.productKey;
    // NOTE: do NOT set heroPhase here — phase effect handles it to avoid blank flash
    if (isSameProduct) {
      // Same video keeps playing — no crossfade, no animKey reset (text already in place)
      setSlideIndex(index);
      onSelectProduct(newKey);
    } else {
      // New product — crossfade video, reset text animations
      setIsTransitioning(true);
      setTimeout(() => {
        setSlideIndex(index);
        setAnimKey((k) => k + 1);
        onSelectProduct(newKey);
        setIsTransitioning(false);
      }, 700);
    }
  }, [slideIndex, onSelectProduct]);

  const advance = useCallback(() => {
    goToSlide((slideIndex + 1) % TOTAL_SLIDES);
  }, [slideIndex, goToSlide]);

  // Keep advanceRef current so phase timers can call it without stale closure
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  // Play video for 8s, then pause and hold 1.5s, then advance
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }

    const pauseTimer = setTimeout(() => {
      videoRef.current?.pause();
    }, 8000);

    const advanceTimer = setTimeout(() => {
      advanceRef.current();
    }, 9500);

    return () => {
      clearTimeout(pauseTimer);
      clearTimeout(advanceTimer);
    };
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
    <main id="main-content" style={{ background: 'var(--bg, #F5EFE6)', color: 'var(--fg, #1F1814)' }}>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section
        id="sanctuary"
        className="moon-hero"
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 48) {
            if (diff > 0) goToSlide((slideIndex + 1) % TOTAL_SLIDES);
            else goToSlide((slideIndex - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
          }
        }}
      >
        <div className="moon-hero__split">

          {/* LEFT — editorial copy */}
          <div className="moon-hero__copy">
            {/* Ghosted backdrop product name */}
            <span className="moon-hero__backdrop" aria-hidden="true">
              {activeStory.featureName.split(' ')[0]}
            </span>

            {/* Meta row */}
            <div className="moon-hero__meta">
              <span className="t-label">{String(slideIndex + 1).padStart(2, '0')} / 0{TOTAL_SLIDES}</span>
              <span className="moon-hero__dot" />
              <span className="t-label">Kashmiri Origin</span>
            </div>

            {/* Title — Fraunces bold uppercase, massive */}
            <h1 key={`title-${animKey}`} className="moon-hero__title carousel-text-enter">
              {activeStory.featureName.includes(' ') ? (
                <>
                  <span className="moon-hero__title-line">
                    {activeStory.featureName.split(' ').slice(0, -1).join(' ')}
                  </span>
                  <span className="moon-hero__title-line">
                    {activeStory.featureName.split(' ').slice(-1)[0]}
                  </span>
                </>
              ) : (
                <span className="moon-hero__title-line">{activeStory.featureName}</span>
              )}
            </h1>

            {/* Italic tagline */}
            <p key={`tag-${animKey}`} className="moon-hero__tag carousel-text-enter" style={{ animationDelay: '0.08s' }}>
              {activeStory.title}
            </p>

            {/* Description */}
            <p key={`desc-${animKey}`} className="moon-hero__desc carousel-text-enter" style={{ animationDelay: '0.14s' }}>
              {activeStory.desc}
            </p>

            {/* Feature chips */}
            <ul key={`chips-${animKey}`} className="moon-hero__chips carousel-text-enter" style={{ animationDelay: '0.18s' }}>
              {bullets.slice(0, 3).map((b) => (
                <li key={b} className="moon-chip">{b}</li>
              ))}
            </ul>

            {/* Price + CTA */}
            <div key={`cta-${animKey}`} className="moon-hero__cta carousel-text-enter" style={{ animationDelay: '0.22s' }}>
              <span className="moon-hero__price">
                {activeItem ? fmt(activeItem.price) : activeStory.price}
              </span>
              {activeItem?.inStock === false && (
                <span style={{
                  fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                  background: 'rgba(20,16,13,0.12)', color: 'var(--fg-muted)',
                  padding: '3px 8px', borderRadius: 2,
                }}>Out of Stock</span>
              )}
              <button
                type="button"
                className="btn btn--primary"
                onClick={onAddDetailToCart}
                disabled={activeItem?.inStock === false}
                style={activeItem?.inStock === false ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
              >
                {activeItem?.inStock === false ? 'Out of Stock' : 'Shop Now'}
              </button>
              <button type="button" className="btn btn--ghost" onClick={onBrowseCollection}>
                Explore
              </button>
            </div>
          </div>

          {/* RIGHT — product video / image */}
          <div
            className="moon-hero__media"
            style={{ background: theme.primary + '18' }}
          >
            {/* Poster — shows instantly while video loads */}
            <img
              key={`hero-poster-${slideIndex}`}
              src={HERO_MEDIA[activeKey]?.poster ?? EDITORIAL_SLIDES[slideIndex]?.image}
              alt=""
              aria-hidden="true"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transition: 'opacity 0.6s ease',
              }}
            />
            {/* Animated video from Vercel Blob */}
            <video
              ref={videoRef}
              key={`hero-video-${activeKey}`}
              muted
              autoPlay
              playsInline
              loop
              preload="auto"
              aria-hidden="true"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transition: 'opacity 0.6s ease',
              }}
            >
              <source src={HERO_MEDIA[activeKey]?.webm} type="video/webm" />
              <source src={HERO_MEDIA[activeKey]?.mp4} type="video/mp4" />
            </video>
            {/* Pager dots */}
            <div className="moon-hero__pager">
              {SLIDE_CONFIG.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goToSlide(i)}
                  className={`moon-hero__pager-dot${i === slideIndex ? ' is-active' : ''}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-dark, #14100D)', overflow: 'hidden', padding: '14px 0' }}>
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
                <span style={{ color: 'var(--accent-cta, #E8763A)', fontSize: 14 }}>·</span>
              </span>
            ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg, #F5EFE6)', padding: 'clamp(32px,6vw,56px) clamp(16px,4vw,64px) 20px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-body, Manrope, sans-serif)',
            fontSize: '0.6875rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', fontWeight: 500,
            color: 'var(--fg-subtle, #8A7460)', marginBottom: 16,
          }}>The Archive · 06 Essentials</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(({ label }, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => { setActiveCategoryIndex(idx); onBrowseCollection(); }}
                style={{
                  border: idx === activeCategoryIndex
                    ? '1px solid var(--fg, #1F1814)'
                    : '1px solid var(--rule, rgba(20,16,13,0.10))',
                  padding: '8px 20px',
                  fontFamily: 'var(--font-body, Manrope, sans-serif)',
                  fontSize: '0.625rem', letterSpacing: '0.16em',
                  textTransform: 'uppercase', fontWeight: 500,
                  background: idx === activeCategoryIndex ? 'var(--fg, #1F1814)' : 'transparent',
                  color: idx === activeCategoryIndex ? 'var(--fg-on-dark, #F5EFE6)' : 'var(--fg-muted, #5A4634)',
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
        background: 'var(--bg, #F5EFE6)',
        padding: '16px clamp(16px,4vw,64px) clamp(48px,8vw,96px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginBottom: 32, flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading, Fraunces, serif)',
                fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
                lineHeight: 1.12, letterSpacing: '-0.01em', fontWeight: 400,
                color: 'var(--fg, #1F1814)', margin: 0,
              }}>
                Curated by origin, <em>not by trend.</em>
              </h2>
              <p style={{
                marginTop: 8, fontFamily: 'var(--font-body, Manrope, sans-serif)', fontSize: '0.875rem',
                color: 'var(--fg-muted, #5A4634)', maxWidth: '36ch',
              }}>
                Single-origin staples — each jar carries the place, season and hands that made it.
              </p>
            </div>
            <button
              type="button"
              onClick={onBrowseCollection}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body, Manrope, sans-serif)',
                fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: 500, color: 'var(--fg, #1F1814)',
                borderBottom: '1px solid var(--fg, #1F1814)',
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
            {catalogItems.map((item) => {
              const ct = item.productKey ? (CARD_THEMES[item.productKey] ?? DEFAULT_CARD) : DEFAULT_CARD;
              return (
                <article
                  key={item.id}
                  className="group moon-card-v2 stagger-up"
                  style={{
                    border: '1px solid var(--rule, rgba(20,16,13,0.10))',
                    background: 'var(--bg, #F5EFE6)',
                    cursor: 'pointer',
                    ['--card-accent' as string]: ct.accentColor,
                    boxShadow: 'var(--shadow-card)',
                  }}
                  onClick={() => onProductClick(item)}
                >
                  {/* Image section — product-themed dark background */}
                  <div className="moon-img-shimmer" style={{ position: 'relative', overflow: 'hidden', background: ct.imgBg }}>
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="group-hover:scale-[1.04]"
                      style={{
                        height: 260, width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 700ms var(--ease-out)',
                        display: 'block',
                        opacity: item.inStock === false ? 0.4 : 1,
                        filter: item.inStock === false ? 'grayscale(100%) blur(2px)' : 'none',
                      }}
                    />
                    {/* Bottom gradient in product accent color */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                      background: `linear-gradient(to top, ${ct.imgBg.match(/#[0-9A-Fa-f]{6}/)?.[1] ?? '#0B0806'}CC 0%, transparent 100%)`,
                      pointerEvents: 'none', zIndex: 2,
                    }} />
                    {item.inStock === false ? (
                      <span style={{
                        position: 'absolute', left: 12, top: 12, zIndex: 3,
                        background: 'rgba(20,16,13,0.78)', color: 'rgba(250,246,239,0.9)',
                        padding: '4px 10px',
                        fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                        letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
                      }}>Out of Stock</span>
                    ) : (item.stockCount != null && item.stockCount < 10) ? (
                      <span style={{
                        position: 'absolute', left: 12, top: 12, zIndex: 3,
                        background: 'rgba(180,90,0,0.85)', color: '#fff',
                        padding: '4px 10px',
                        fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                        letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
                      }}>Only {item.stockCount} left</span>
                    ) : item.featured && (
                      <span style={{
                        position: 'absolute', left: 12, top: 12, zIndex: 3,
                        background: ct.accentColor, color: '#fff',
                        padding: '4px 10px',
                        fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                        letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                        boxShadow: `0 2px 12px ${ct.accentColor}55`,
                      }}>Best Seller</span>
                    )}
                  </div>

                  <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{
                      fontFamily: 'var(--font-body, Manrope, sans-serif)', fontSize: '0.5625rem',
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: 'var(--fg-subtle, #8A7460)',
                    }}>{item.subtitle || 'Moon · Origin'}</div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading, Fraunces, serif)',
                      fontSize: '1.125rem', fontWeight: 500,
                      color: 'var(--fg, #1F1814)', margin: 0,
                    }}>{item.title}</h3>
                    <span style={{ fontSize: 11, color: ct.starColor, marginTop: 4, letterSpacing: 2 }}>★★★★★</span>
                    {item.inStock !== false && item.stockCount != null && item.stockCount < 10 && (
                      <span style={{
                        fontSize: '0.625rem', color: '#B45A00', fontFamily: 'var(--font-body, Manrope, sans-serif)',
                        fontWeight: 600, marginTop: 2,
                      }}>
                        {item.stockCount === 1 ? 'Only 1 left in stock' : `Only ${item.stockCount} left in stock`}
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                      <span style={{
                        fontFamily: 'var(--font-serif, Fraunces, serif)',
                        fontSize: '1.125rem', fontWeight: 500,
                        color: ct.accentColor,
                      }}>{fmt(item.price)}</span>
                      <button
                        type="button"
                        disabled={item.inStock === false}
                        onClick={e => { e.stopPropagation(); if (item.inStock !== false) onAddCatalogToCart(item); }}
                        style={{
                          background: item.inStock === false ? 'rgba(20,16,13,0.12)' : ct.btnBg,
                          color: item.inStock === false ? 'var(--fg-muted, #5A4634)' : '#fff',
                          border: 'none',
                          padding: '8px 16px',
                          fontFamily: 'var(--font-mark)',
                          fontSize: '0.5625rem',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          cursor: item.inStock === false ? 'not-allowed' : 'pointer',
                          borderRadius: 2,
                          whiteSpace: 'nowrap',
                          opacity: item.inStock === false ? 0.6 : 1,
                          transition: 'filter 0.2s, transform 0.2s',
                        }}
                        onMouseEnter={e => { if (item.inStock !== false) { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; } }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                      >{item.inStock === false ? 'Unavailable' : 'Add to Cart'}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THE ARCHIVE — brand story slideshow ─────────────────────── */}
      <section id="archives" className="moon-archive">

        {/* LEFT — product image with cross-fade */}
        <div className="moon-archive__media group">
          <img
            src={EDITORIAL_SLIDES[editorialSlide].image}
            alt={EDITORIAL_SLIDES[editorialSlide].title}
            className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0"
            style={{
              opacity: editorialFading ? 0 : 1,
              transition: 'opacity 0.5s ease, filter 0.8s ease',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, rgba(${EDITORIAL_SLIDES[editorialSlide].accent === '#2C1810' ? '44,24,16' : EDITORIAL_SLIDES[editorialSlide].accent === '#C44A0C' ? '196,74,12' : '139,96,0'},0.6) 0%, transparent 55%)`,
              transition: 'background 0.5s ease',
            }}
          />
          {/* Slide counter caption */}
          <div className="moon-archive__caption">
            <span style={{ letterSpacing: '0.36em', fontSize: '0.625rem' }}>
              {String(editorialSlide + 1).padStart(2, '0')} / {String(EDITORIAL_SLIDES.length).padStart(2, '0')}
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-heading, var(--font-serif))',
                fontSize: '1.25rem',
                letterSpacing: '-0.01em',
                marginTop: 4,
                opacity: editorialFading ? 0 : 1,
                transition: 'opacity 0.5s ease',
              }}
            >
              {EDITORIAL_SLIDES[editorialSlide].tagline}
            </span>
          </div>
          {/* Vertical dots */}
          <div className="moon-archive__img-dots">
            {EDITORIAL_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Editorial slide ${i + 1}`}
                onClick={() => setEditorialSlide(i)}
                className={`moon-archive__img-dot ${i === editorialSlide ? 'moon-archive__img-dot--active' : 'moon-archive__img-dot--inactive'}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — editorial copy */}
        <div
          className="moon-archive__copy"
          style={{ opacity: editorialFading ? 0.6 : 1, transition: 'opacity 0.5s ease' }}
        >
          <p className="moon-archive__eyebrow">The Archive</p>
          <h2 className="moon-archive__title">
            {EDITORIAL_SLIDES[editorialSlide].title}
          </h2>
          <p
            className="moon-archive__italic"
            style={{ opacity: editorialFading ? 0 : 1, transition: 'opacity 0.5s ease' }}
          >
            {EDITORIAL_SLIDES[editorialSlide].tagline}
          </p>
          <div className="moon-archive__rule" />
          <p className="moon-archive__lead">
            {EDITORIAL_SLIDES[editorialSlide].desc}
          </p>
          <p className="moon-archive__body">
            Each MOON product embodies centuries of traditional sourcing — from Shilajit resin harvested at 16,000 ft to Mongra saffron threads hand-sorted at dawn. Pure. Potent. Purposeful.
          </p>
          <div className="moon-archive__foot">
            <button
              type="button"
              onClick={onBrowseCollection}
              className="moon-archive__explore"
            >
              Explore Our Story
            </button>
            <div className="moon-archive__pager">
              {EDITORIAL_SLIDES.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={s.title}
                  onClick={() => setEditorialSlide(i)}
                  className={`moon-archive__pager-dot ${i === editorialSlide ? 'is-active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg-elevated, #FBF7F0)',
        borderTop: '1px solid var(--rule, rgba(20,16,13,0.10))',
        borderBottom: '1px solid var(--rule, rgba(20,16,13,0.10))',
        padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,64px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle radial tint */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(210,87,27,0.04), transparent 65%)' }} />
        <div style={{
          maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1,
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(16px,3vw,24px)',
        }} className="md:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="moon-stat-v2">
              <p style={{
                fontFamily: 'var(--font-heading, Fraunces, serif)',
                fontSize: 'clamp(2rem,5vw,3.5rem)',
                fontWeight: 300, lineHeight: 1,
                color: 'var(--accent-cta, #E8763A)',
                letterSpacing: '-0.02em', margin: 0,
              }}>{value}</p>
              <p style={{
                marginTop: 12,
                fontFamily: 'var(--font-body, Manrope, sans-serif)',
                fontSize: '0.625rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--fg-subtle, #8A7460)',
              }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE MOON PROMISE ────────────────────────────────────────── */}
      <section style={{
        background: '#1A0E07',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Ambient radial glows */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 0% 50%, rgba(194,137,30,0.06), transparent 60%), radial-gradient(ellipse 50% 60% at 100% 50%, rgba(194,137,30,0.04), transparent 60%)',
        }} />

        <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Section header — editorial two-column */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)',
            alignItems: 'end', padding: 'clamp(56px,9vw,100px) clamp(16px,4vw,64px) 0',
          }} className="promise-header">
            <div>
              <div style={{
                fontFamily: 'var(--font-mark)', fontSize: '1rem',
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: '#C2891E', marginBottom: 20,
              }}>Why Moon</div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem,5vw,3.8rem)',
                fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.01em',
                color: '#F5EEE3', margin: 0,
              }}>
                We stake our name<br /><em style={{ color: '#C2891E', fontStyle: 'italic' }}>on every jar.</em>
              </h2>
            </div>
            <div style={{ paddingBottom: 8 }}>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '1rem',
                lineHeight: 1.75, color: 'rgba(245,238,227,0.5)',
                maxWidth: '40ch',
              }}>
                Four commitments, made before a single product leaves Kashmir — the same ones we make to every customer, every order.
              </p>
            </div>
          </div>

          {/* Promise pillars grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: '20px',
            borderTop: '1px solid rgba(245,238,227,0.06)',
            paddingTop: 'clamp(40px,6vw,64px)',
            marginTop: 'clamp(40px,6vw,64px)',
          }}>
            {[
              {
                num: '01',
                title: 'Single-Origin Sourced',
                desc: 'Every product traces to one geography — no blending, no dilution. Kashmir Valley, Himalayan highlands, Kashmiri orchards. The provenance is on the label because we stand behind it.',
                bgImage: '/pillars/saffron.png',
              },
              {
                num: '02',
                title: 'Third-Party Lab Tested',
                desc: 'Each batch is verified by an independent laboratory for purity, potency and the absence of adulterants before it leaves our facility. You see the report, not just our word.',
                bgImage: '/pillars/honey.png',
              },
              {
                num: '03',
                title: 'Direct from Farmers',
                desc: 'No brokers, no aggregators, no middlemen. We work directly with growers, paying fair prices at farm gate and maintaining year-round relationships beyond the harvest.',
                bgImage: '/pillars/shilajit.png',
              },
              {
                num: '04',
                title: 'Small Seasonal Batches',
                desc: 'We harvest with the season, not against it. Limited runs mean every jar is fresh. When a batch sells out, it\'s gone until the next harvest cycle — we don\'t restock with old stock.',
                bgImage: '/pillars/moon.png',
                bgPos: '85% center',
              },
            ].map(({ num, title, desc, bgImage, bgPos }, i) => (
              <div
                key={num}
                style={{
                  position: 'relative',
                  padding: 'clamp(32px,4vw,48px) clamp(20px,3vw,36px)',
                  border: '1px solid rgba(245,238,227,0.06)',
                  borderRadius: '12px',
                  transition: 'border-color 0.4s ease, transform 0.4s ease',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,238,227,0.2)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  const bg = e.currentTarget.querySelector('.promise-bg') as HTMLElement;
                  if (bg) {
                    bg.style.opacity = '0.6';
                    bg.style.transform = 'scale(1.05)';
                  }
                  const titleEl = e.currentTarget.querySelector('h3') as HTMLElement;
                  if (titleEl) {
                    titleEl.style.fontWeight = '700';
                    titleEl.style.textShadow = '0 2px 10px rgba(0,0,0,0.5)';
                  }
                  const descEl = e.currentTarget.querySelector('p') as HTMLElement;
                  if (descEl) {
                    descEl.style.color = 'rgba(255,255,255,0.7)';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,238,227,0.06)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  const bg = e.currentTarget.querySelector('.promise-bg') as HTMLElement;
                  if (bg) {
                    bg.style.opacity = '0.15';
                    bg.style.transform = 'scale(1)';
                  }
                  const titleEl = e.currentTarget.querySelector('h3') as HTMLElement;
                  if (titleEl) {
                    titleEl.style.fontWeight = '400';
                    titleEl.style.textShadow = 'none';
                  }
                  const descEl = e.currentTarget.querySelector('p') as HTMLElement;
                  if (descEl) {
                    descEl.style.color = 'rgba(245,238,227,0.42)';
                  }
                }}
              >
                {/* Background Image Layer */}
                <div
                  className="promise-bg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: bgPos || 'center',
                    opacity: 0.15,
                    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 0,
                  }}
                />

                {/* Content Layer */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(3rem,5vw,4.5rem)',
                    fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em',
                    color: 'rgba(194,137,30,0.15)',
                    marginBottom: 28,
                    userSelect: 'none',
                    transition: 'color 0.4s ease',
                  }}>{num}</div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.1rem,1.6vw,1.4rem)',
                    fontWeight: 400, lineHeight: 1.22,
                    color: '#F5EEE3',
                    marginBottom: 16,
                    transition: 'font-weight 0.4s ease, text-shadow 0.4s ease',
                  }}>{title}</h3>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem', lineHeight: 1.72,
                    color: 'rgba(245,238,227,0.42)',
                    transition: 'color 0.4s ease',
                  }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
            padding: 'clamp(28px,4vw,40px) clamp(16px,4vw,64px)',
            borderTop: '1px solid rgba(245,238,227,0.06)',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
              color: 'rgba(245,238,227,0.35)', maxWidth: '50ch',
            }}>
              Every claim on this page is backed by documentation available on request.
            </p>
            <button
              type="button"
              onClick={onBrowseCollection}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                color: '#C2891E', borderBottom: '1px solid #C2891E',
                padding: '4px 0', transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#D4A83A'; (e.currentTarget as HTMLElement).style.borderBottomColor = '#D4A83A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#C2891E'; (e.currentTarget as HTMLElement).style.borderBottomColor = '#C2891E'; }}
            >
              Shop the Collection →
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg, #F5EFE6)',
        padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,64px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              fontFamily: 'var(--font-body, Manrope, sans-serif)',
              fontSize: '0.6875rem', letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--fg-subtle, #8A7460)', marginBottom: 16,
            }}>Voices · The Private List</div>
            <h2 style={{
              fontFamily: 'var(--font-heading, Fraunces, serif)',
              fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
              lineHeight: 1.12, fontWeight: 400, letterSpacing: '-0.01em',
              color: 'var(--fg, #1F1814)', margin: 0,
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
                className="moon-testimonial-v2 stagger-up"
                style={{ boxShadow: 'var(--shadow-1)', margin: 0 }}
              >
                <div style={{ marginBottom: 16 }} aria-label={`${rating} stars`}>
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--accent-cta, #E8763A)', fontSize: 14 }} aria-hidden>★</span>
                  ))}
                </div>
                <blockquote style={{
                  fontFamily: 'var(--font-heading, Fraunces, serif)',
                  fontStyle: 'italic', fontSize: '1rem',
                  lineHeight: 1.6, color: 'var(--fg, #1F1814)',
                  margin: 0, marginBottom: 20,
                }}>"{quote}"</blockquote>
                <figcaption style={{
                  borderTop: '1px solid var(--rule, rgba(20,16,13,0.10))',
                  paddingTop: 16,
                }}>
                  <strong style={{
                    fontFamily: 'var(--font-body, Manrope, sans-serif)', fontSize: '0.875rem',
                    fontWeight: 700, color: 'var(--fg, #1F1814)',
                    display: 'block',
                  }}>{name}</strong>
                  <span style={{
                    fontFamily: 'var(--font-body, Manrope, sans-serif)', fontSize: '0.5625rem',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'var(--fg-subtle, #8A7460)', marginTop: 4, display: 'block',
                  }}>{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section id="journal" style={{
        background: 'var(--bg-elevated, #FBF7F0)',
        padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,64px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gap: 'clamp(32px,6vw,80px)', alignItems: 'center',
          }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <div style={{
                fontFamily: 'var(--font-body, Manrope, sans-serif)',
                fontSize: '0.6875rem', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'var(--fg-subtle, #8A7460)', marginBottom: 16,
              }}>Join the Private List</div>
              <h2 style={{
                fontFamily: 'var(--font-heading, Fraunces, serif)',
                fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
                lineHeight: 1.12, fontWeight: 400, letterSpacing: '-0.01em',
                color: 'var(--fg, #1F1814)', margin: '0 0 20px',
              }}>
                Letters, <em>not</em> marketing.
              </h2>
              <p style={{
                fontFamily: 'var(--font-body, Manrope, sans-serif)', fontSize: '1.125rem',
                lineHeight: 1.75, color: 'var(--fg-muted, #5A4634)', maxWidth: '40ch',
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
                    border: '1px solid var(--rule-strong, rgba(20,16,13,0.18))',
                    background: 'var(--bg, #F5EFE6)',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-body, Manrope, sans-serif)', fontSize: '0.875rem',
                    color: 'var(--fg, #1F1814)', outline: 'none',
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--accent-cta, #E8763A)', color: '#fff',
                    border: 'none', padding: '14px 28px',
                    fontFamily: 'var(--font-body, Manrope, sans-serif)', fontSize: '0.5625rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-cta-hover, #C95A1F)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-cta, #E8763A)'; }}
                >
                  Subscribe
                </button>
              </div>
              <p style={{
                fontSize: '0.6875rem', color: 'var(--fg-subtle, #8A7460)', letterSpacing: '0.04em',
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
