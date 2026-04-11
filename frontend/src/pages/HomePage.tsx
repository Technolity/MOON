import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { productStories } from '../data/products';
import type { CatalogItem, ProductKey, ProductStory } from '../types';

const CAROUSEL_PRODUCTS: ProductKey[] = ['shilajit', 'kashmiriSaffron', 'kashmiriHoney'];
const CAROUSEL_MS = 6000;

interface CarouselTheme {
  primary: string;
  accent: string;
  glow: string;
}

const THEMES: Record<ProductKey, CarouselTheme> = {
  shilajit:        { primary: '#2C1810', accent: '#7C4A2A', glow: '44,24,16' },
  kashmiriSaffron: { primary: '#C44A0C', accent: '#E8730A', glow: '196,74,12' },
  kashmiriHoney:   { primary: '#8B6000', accent: '#C8960A', glow: '139,96,0' },
  iraniSaffron:    { primary: '#D8A03F', accent: '#C8901F', glow: '216,160,63' },
  kashmiriAlmonds: { primary: '#CBA674', accent: '#A87854', glow: '203,166,116' },
  walnuts:         { primary: '#9E7A52', accent: '#7E5A32', glow: '158,122,82' },
  kashmiriGhee:    { primary: '#F1B65A', accent: '#E8A040', glow: '241,182,90' },
};

const EDITORIAL_SLIDES = [
  {
    folder: '/moon333',
    frameCount: 60,
    title: 'Shilajit',
    tagline: 'Mountain Strength',
    desc: 'Purified Himalayan resin — gold grade, third-party tested.',
    accent: '#2C1810',
    light: '#7C4A2A',
  },
  {
    folder: '/moon2222',
    frameCount: 60,
    title: 'Kashmiri Saffron',
    tagline: 'Crimson Ritual',
    desc: 'Mongra A++ threads from Pampore, hand-sorted and sun-dried.',
    accent: '#C44A0C',
    light: '#E8730A',
  },
  {
    folder: '/ezgif-2fae6b36993927b6-jpg',
    frameCount: 60,
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
  activeProduct: ProductKey;
  activeStory: ProductStory;
  catalogItems: CatalogItem[];
  canvasRef: RefObject<HTMLCanvasElement>;
  onPrevProduct: () => void;
  onNextProduct: () => void;
  onSelectProduct: (key: ProductKey) => void;
  onAddDetailToCart: () => void;
  onAddCatalogToCart: (item: { id: string; title: string; price: number }) => void;
  onOpenCart: () => void;
  onBrowseCollection: () => void;
}

export function HomePage({
  catalogItems,
  canvasRef,
  onSelectProduct,
  onAddDetailToCart,
  onAddCatalogToCart,
  onBrowseCollection,
}: HomePageProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [editorialSlide, setEditorialSlide] = useState(0);
  const [editorialFading, setEditorialFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeKey   = CAROUSEL_PRODUCTS[slideIndex];
  const theme       = THEMES[activeKey];
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
    setSlideIndex(index);
    setAnimKey((k) => k + 1);
    onSelectProduct(CAROUSEL_PRODUCTS[index]);
  }, [onSelectProduct]);

  const advance = useCallback(() => {
    goToSlide((slideIndex + 1) % CAROUSEL_PRODUCTS.length);
  }, [slideIndex, goToSlide]);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(advance, CAROUSEL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [advance, isPaused]);

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
    <main id="main-content" className="bg-white text-zinc-900">

      {/* ── HERO CAROUSEL ───────────────────────────────────────────── */}
      <section
        id="sanctuary"
        className="relative min-h-[100svh] overflow-hidden"
        style={{ background: '#FAFAF7' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
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

        {/* ── SPLIT LAYOUT ── */}
        <div className="relative flex min-h-[100svh]" style={{ zIndex: 10 }}>

          {/* LEFT PANEL — editorial text content */}
          <div className="flex w-full flex-col justify-center overflow-hidden px-8 pb-28 pt-32 md:w-[48%] md:px-14 lg:px-20 xl:px-24">

            {/* Slide counter + eyebrow */}
            <p
              key={`label-${animKey}`}
              className="mb-5 font-display text-[10px] uppercase tracking-[0.44em] carousel-text-enter"
              style={{ color: theme.accent }}
            >
              {String(slideIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(CAROUSEL_PRODUCTS.length).padStart(2, '0')}&nbsp;&nbsp;·&nbsp;&nbsp;Himalayan Origin
            </p>

            {/* Product name — massive */}
            <h1
              key={`title-${animKey}`}
              className="font-display uppercase leading-[0.9] tracking-tighter carousel-text-enter"
              style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 4.4rem)',
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
                  style={{ background: theme.primary }}
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
                    background: 'transparent',
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — scroll-driven frame animation, bleeds to edge */}
          <div
            className="absolute right-0 top-0 hidden h-full w-[55%] overflow-hidden md:block"
            style={{ zIndex: 15 }}
          >
            {/* Warm radial glow behind canvas */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 1,
                background: `radial-gradient(ellipse 70% 75% at 55% 50%, rgba(${theme.glow},0.10), transparent 70%)`,
                transition: 'background 0.9s ease',
              }}
            />
            {/* Frame animation canvas — scroll-driven + auto-advance */}
            <canvas
              ref={canvasRef}
              aria-label={`${activeStory.featureName} product animation`}
              className="hero-product-enter absolute inset-0 h-full w-full"
              style={{ zIndex: 2, display: 'block' }}
            />
            {/* Left feather — blends canvas into white left panel */}
            <div
              className="absolute inset-y-0 left-0 pointer-events-none"
              style={{
                zIndex: 3,
                width: '140px',
                background: 'linear-gradient(to right, #FAFAF7 0%, rgba(250,250,247,0.6) 60%, transparent 100%)',
              }}
            />
          </div>

          {/* MOBILE: static frame as fallback */}
          <div
            className="absolute bottom-16 left-0 right-0 flex h-[38vh] items-end justify-center overflow-hidden md:hidden"
            style={{ zIndex: 5 }}
          >
            <img
              key={`img-m-${animKey}`}
              src={activeItem?.image ?? '/moon333/ezgif-frame-001.jpg'}
              alt={activeItem?.alt ?? activeStory.featureName}
              className="hero-product-enter h-full w-auto object-contain"
            />
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
      <section className="overflow-hidden border-y border-zinc-200/60 bg-zinc-50 py-5">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 40s linear infinite' }}>
          {[0, 1].map((i) => (
            <div
              key={`marquee-${i}`}
              className="mr-12 flex flex-shrink-0 items-center gap-10 font-display text-3xl uppercase tracking-tight text-zinc-300 md:text-5xl"
            >
              <span>MOON RITUALS</span>
              <span style={{ color: theme.primary }}>•</span>
              <span>PROPHETIC WELLNESS</span>
              <span style={{ color: theme.primary }}>•</span>
              <span>PURE ORIGINS</span>
              <span style={{ color: theme.primary }}>•</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ────────────────────────────────────────── */}
      <section className="px-6 pt-14 pb-6 md:px-16 bg-white">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-5 font-display text-xs uppercase tracking-[0.35em] text-zinc-400">
            Shop by Category
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ label }, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => { setActiveCategoryIndex(idx); onBrowseCollection(); }}
                className="border px-5 py-2.5 font-label text-xs uppercase tracking-[0.16em] transition-all duration-200 hover:-translate-y-px"
                style={
                  idx === activeCategoryIndex
                    ? { borderColor: theme.primary, color: theme.primary, background: `rgba(${theme.glow},0.08)` }
                    : { borderColor: 'rgba(255,255,255,0.1)', color: '#71717a', background: 'transparent' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT COLLECTION ──────────────────────────────────────── */}
      <section id="rituals" className="px-6 pb-24 pt-6 md:px-16 bg-white">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-zinc-900 md:text-4xl">
                The Curated Collection
              </h2>
              <p className="mt-2 font-label text-xs uppercase tracking-[0.18em] text-zinc-500">
                Premium wellness, sourced from the Himalayas
              </p>
            </div>
            <button
              type="button"
              onClick={onBrowseCollection}
              className="hidden font-label text-xs uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-900 md:block"
            >
              View All →
            </button>
          </div>

          <div id="shop" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogItems.map((item, idx) => (
              <article
                key={item.id}
                className="group relative overflow-hidden border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="relative overflow-hidden bg-zinc-50">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] md:h-60"
                  />
                  {item.featured && (
                    <span className="absolute left-3 top-3 bg-zinc-100 px-2 py-1 font-label text-[9px] uppercase tracking-[0.22em] text-zinc-900">
                      Signature
                    </span>
                  )}
                  {/* Hover overlay CTA */}
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onAddCatalogToCart(item)}
                      className="border border-white/80 px-6 py-2.5 font-label text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all hover:bg-white hover:text-zinc-900"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between p-5">
                  <div>
                    <h3 className="font-headline text-base font-semibold text-zinc-900">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">{item.subtitle}</p>
                  </div>
                  <p className="font-headline text-lg font-bold text-zinc-900">{fmt(item.price)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL / BRAND STORY — live frame slideshow ──────────── */}
      <section id="archives" className="bg-stone-50 overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl md:grid-cols-2">

          {/* LEFT — static product image with cross-fade between slides */}
          <div className="group relative h-[420px] overflow-hidden md:h-[640px]">
            {/* Static mid-point frame — grayscale by default, full color on hover */}
            <img
              src={`${EDITORIAL_SLIDES[editorialSlide].folder}/ezgif-frame-096.jpg`}
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
      <section className="border-y border-zinc-200 bg-white px-6 py-16 md:px-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-10 md:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl font-bold md:text-4xl" style={{ color: theme.accent }}>
                {value}
              </p>
              <p className="mt-2 font-label text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24 md:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl uppercase tracking-tight text-zinc-900 md:text-4xl">
              Trusted by Our Community
            </h2>
            <p className="mt-3 font-label text-xs uppercase tracking-[0.22em] text-zinc-500">
              Real experiences from MOON ritual practitioners
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, quote, rating }) => (
              <article
                key={name}
                className="border border-zinc-200 bg-zinc-50 p-6 transition-all duration-300 hover:border-zinc-300"
              >
                <div className="mb-4 flex gap-0.5" aria-label={`${rating} stars`}>
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} className="text-amber-500 text-sm" aria-hidden>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">"{quote}"</p>
                <div className="mt-6 border-t border-zinc-200 pt-4">
                  <p className="font-headline text-sm font-semibold text-zinc-900">{name}</p>
                  <p className="mt-0.5 font-label text-[10px] uppercase tracking-[0.16em] text-zinc-500">{role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section id="about" className="bg-stone-50 px-6 py-24 md:px-16">
        <div className="mx-auto w-full max-w-4xl border border-zinc-200 p-8 md:p-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-zinc-400">The Archive</p>
              <h2 className="mt-4 font-display text-3xl uppercase leading-tight text-zinc-900 md:text-4xl">
                Join the<br />Private List
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                Harvest drops, batch releases, and editorial updates from the MOON wellness studio — delivered to your inbox.
              </p>
            </div>
            <form className="space-y-3" onSubmit={onNewsletterSubmit} id="newsletter">
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full border border-zinc-300 bg-white px-4 py-3.5 font-label text-sm text-zinc-800 outline-none placeholder:text-zinc-400 transition focus:border-zinc-500"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="w-full bg-zinc-900 py-3.5 font-headline text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-700 active:scale-[0.99]"
              >
                Subscribe to Archive
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
