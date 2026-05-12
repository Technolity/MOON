'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import type { ProductKey } from '@/lib/types';
import '@/styles/MobileHero.css';

const HERO_DURATION_MS = 9500;

type HeadlineConfig = {
  lines: string[];
  top: number;   // px at 780-base
  left: number;  // px at 390-base
  rotate: number;
  skewY: number;
  rotateX: number;
  size: number;  // px at 390-base → (size/390)*100 cqw
  lineHeight: number;
  color: string;
  glow: string;
};

type FeatureConfig = {
  n: string;
  text: string[];
  left: number;
  top: number;
  fromX: number;
  fromY: number;
  path: string;
};

type MobileHeroSlide = {
  id: ProductKey;
  shortId: 'shilajit' | 'saffron' | 'honey';
  name: string;
  cta: string;
  background: string;
  product: string;
  accent: string;
  warm: string;
  bg: string;
  headline: HeadlineConfig;
  productStyle: { width: number; left: number; top: number };
  effect: 'smoke' | 'saffron' | 'honey';
  features: FeatureConfig[];
};

const px = (v: number, base: number) => `${(v / base) * 100}%`;

/*
 * Font sizes are capped so each slide's widest line fits within ~88% of the
 * container width (390px). Computed via Bebas Neue em-width ratios:
 *   "HIMALAYAN" (9 wide caps) at 78px → ~351px = 90%  ✓
 *   "THE RED"   (7 chars+space) at 106px → ~339px = 87% ✓
 *   "SWEETNESS" (9 caps+W)   at 78px  → ~347px = 89%  ✓
 */
export const MOBILE_HERO_SLIDES: MobileHeroSlide[] = [
  {
    id: 'shilajit',
    shortId: 'shilajit',
    name: 'Himalayan Shilajit',
    cta: 'Shop shilajit',
    background: '/mobile-hero/shilajit-bg.png',
    product:    '/mobile-hero/shilajit-product.png',
    accent: '#8B6B42',
    warm:   '#C8955A',
    bg:     '#0c0704',
    headline: {
      lines: ['PURE', 'HIMALAYAN', 'RESIN'],
      top: 94, left: 22,
      rotate: -6, skewY: -1.2, rotateX: 2.0,
      size: 78, lineHeight: 0.86,
      color: 'rgba(138,102,66,0.82)',
      glow:  'rgba(150,100,50,0.22)',
    },
    productStyle: { width: 330, left: 30, top: 140 },
    effect: 'smoke',
    features: [
      { n:'1', text:['Potent 70%+','Fulvic Acid'],      left:13,  top:322, fromX: 78, fromY: 34, path:'M138 343 L88 343 L88 378'   },
      { n:'2', text:['Natural Energy','& Vitality'],     left:239, top:322, fromX:-76, fromY: 34, path:'M239 343 L310 343 L310 378'  },
      { n:'3', text:['Ayurvedic','Wellness Support'],    left:226, top:555, fromX:-50, fromY:-36, path:'M246 576 L205 576 L205 502'  },
    ],
  },
  {
    id: 'kashmiriSaffron',
    shortId: 'saffron',
    name: 'Kashmiri Saffron',
    cta: 'Shop saffron',
    background: '/mobile-hero/saffron-bg.png',
    product:    '/mobile-hero/saffron-product.png',
    accent: '#A83220',
    warm:   '#E8B89A',
    bg:     '#1a0100',
    headline: {
      lines: ['THE RED', 'GOLD'],
      top: 90, left: 20,
      rotate: -6, skewY: -1.0, rotateX: 2.2,
      size: 106, lineHeight: 0.88,
      color: 'rgba(168,32,28,0.88)',
      glow:  'rgba(195,36,30,0.28)',
    },
    productStyle: { width: 346, left: 25, top: 285 },
    effect: 'saffron',
    features: [
      { n:'1', text:['Grade-A','Kashmiri Stigmas'],  left:15,  top:328, fromX: 70, fromY: 30, path:'M140 349 L82 349 L82 395'   },
      { n:'2', text:['Mood & Skin','Radiance'],       left:240, top:328, fromX:-74, fromY: 30, path:'M240 349 L318 349 L318 395'  },
      { n:'3', text:['Deep Aroma,','Rich Flavor'],    left:238, top:566, fromX:-58, fromY:-32, path:'M256 587 L210 587 L210 520'  },
    ],
  },
  {
    id: 'kashmiriHoney',
    shortId: 'honey',
    name: "Bee's Honey",
    cta: 'Shop honey',
    background: '/mobile-hero/honey-bg.png',
    product:    '/mobile-hero/honey-product.png',
    accent: '#A87418',
    warm:   '#E8C070',
    bg:     '#180e02',
    headline: {
      lines: ["NATURE'S", 'PUREST', 'SWEETNESS'],
      top: 92, left: 22,
      rotate: -5, skewY: -1.2, rotateX: 1.8,
      size: 78, lineHeight: 0.86,
      color: 'rgba(178,118,18,0.84)',
      glow:  'rgba(188,124,22,0.24)',
    },
    productStyle: { width: 350, left: 50, top: 195 },
    effect: 'honey',
    features: [
      { n:'1', text:['100% Raw &','Unfiltered'],   left:14,  top:318, fromX: 74, fromY: 34, path:'M138 339 L85 339 L85 382'   },
      { n:'2', text:['Antioxidant','Rich'],          left:247, top:318, fromX:-70, fromY: 34, path:'M247 339 L322 339 L322 386'  },
      { n:'3', text:['Sweet & Floral','Notes'],      left:236, top:562, fromX:-54, fromY:-34, path:'M255 583 L205 583 L205 512'  },
    ],
  },
];

/* ─── Static SVG filters (no animated seed — pre-rendered once) ─ */
function SvgFilters() {
  return (
    <svg style={{ position:'absolute', width:0, height:0, overflow:'hidden' }} aria-hidden="true">
      <defs>
        <filter id="mh-concrete-texture" colorInterpolationFilters="sRGB" x="-8%" y="-15%" width="120%" height="140%">
          {/* Pass 1: coarse erosion — A' = 10R - 3.8 → ~38% pixels transparent */}
          <feTurbulence type="fractalNoise" baseFrequency="0.032 0.024" numOctaves="4" seed="13" result="coarse"/>
          <feColorMatrix in="coarse" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  10 0 0 -3.8 0" result="cm"/>
          <feComposite in="SourceGraphic" in2="cm" operator="in" result="pass1"/>
          {/* Pass 2: fine grain — A' = 5.5R - 1.8 → ~33% more transparent */}
          <feTurbulence type="fractalNoise" baseFrequency="0.58 0.46" numOctaves="3" seed="29" result="fine"/>
          <feColorMatrix in="fine" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  5.5 0 0 -1.8 0" result="fm"/>
          <feComposite in="pass1" in2="fm" operator="in"/>
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Cinematic atmosphere layers ───────────────────────────── */
function AtmosphereLayer({ slide }: { slide: MobileHeroSlide }) {
  const shadowTop  = slide.productStyle.top  + slide.productStyle.width * 1.08;
  const shadowLeft = slide.productStyle.left + slide.productStyle.width * 0.10;
  const shadowW    = slide.productStyle.width * 0.76;
  return (
    <div className="mobile-hero__atmosphere" aria-hidden="true">
      <div className="mobile-hero__fog-deep"/>
      <div className="mobile-hero__light-shaft"/>
      <div className="mobile-hero__bloom" style={{ top: px(slide.productStyle.top + 60, 780) }}/>
      <div className="mobile-hero__contact-shadow" style={{
        top:   px(shadowTop,  780),
        left:  px(shadowLeft, 390),
        width: px(shadowW,    390),
      }}/>
    </div>
  );
}

/* ─── Headline ──────────────────────────────────────────────── */
function Headline({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  const h   = slide.headline;
  const ref = useRef<HTMLHeadingElement>(null);

  /*
   * GSAP entrance — only opacity + y + scale (GPU compositor properties).
   * No filter animation: filter stays static so the browser caches the
   * rasterised layer and composites without re-painting every frame.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lines = Array.from(el.querySelectorAll<HTMLElement>('.mobile-hero__distressed-type'));

    if (!active) {
      gsap.set(lines, { y: 80, opacity: 0, scale: 0.9 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.06 });
    tl.set(lines, { y: 80, opacity: 0, scale: 0.9 })
      .to(lines, {
        y: 0, opacity: 1, scale: 1,
        duration: 1.4, stagger: 0.16,
        ease: 'expo.out',
      });

    return () => { tl.kill(); };
  }, [active]);

  /* GSAP quickTo parallax — rAF-paced, GPU only */
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' });

    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const cy = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      xTo((cx / window.innerWidth  - 0.5) * -14);
      yTo((cy / window.innerHeight - 0.5) *  -7);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, [active]);

  return (
    <h1
      ref={ref}
      className="mobile-hero__headline"
      style={{
        top:  px(h.top,  780),
        left: px(h.left, 390),
        transform: `perspective(1200px) rotateZ(${h.rotate}deg) rotateX(${h.rotateX}deg) skewY(${h.skewY}deg)`,
        transformOrigin: '0% 50%',
        fontSize: `${(h.size / 390) * 100}cqw`,
        lineHeight: h.lineHeight,
        '--headline-color': h.color,
        '--headline-glow':  h.glow,
      } as CSSProperties}
    >
      {h.lines.map((line) => (
        <span className="mobile-hero__headline-mask" key={line}>
          <span
            className="mobile-hero__distressed-type"
            data-text={line}
            style={{ opacity: 0 }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}

/* ─── Ambient particles (reduced count for performance) ─────── */
function EffectLayer({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  if (slide.effect === 'smoke') return (
    <div className="mobile-hero__effects" data-active={active}>
      {[0,1].map((i) => (
        <span key={i} className="mobile-hero__smoke-wisp" style={{ left:px(42+i*72,390), top:px(262+i*30,780), width:px(118+i*8,390), animationDelay:`${i*300}ms` }}/>
      ))}
      {[0,1].map((i) => (
        <span key={`d${i}`} className="mobile-hero__rock-dust" style={{ left:px(68+i*80,390), top:px(430+i*22,780), animationDelay:`${i*220}ms` }}/>
      ))}
    </div>
  );

  if (slide.effect === 'saffron') return (
    <div className="mobile-hero__effects" data-active={active}>
      {[0,1].map((i) => (
        <span key={i} className="mobile-hero__red-droplet" style={{ left:px(56+i*80,390), top:px(188+i*28,780), width:`${9+i*3}px`, height:`${9+i*3}px`, animationDelay:`${i*250}ms` }}/>
      ))}
      <span className="mobile-hero__saffron-sheen"/>
    </div>
  );

  return (
    <div className="mobile-hero__effects" data-active={active}>
      {[0,1].map((i) => (
        <span key={i} className="mobile-hero__honey-drop" style={{ left:px([34,290][i],390), top:px([262,242][i],780), animationDelay:`${i*280}ms` }}/>
      ))}
      <span className="mobile-hero__honey-wave"/>
    </div>
  );
}

/* ─── HUD callouts ──────────────────────────────────────────── */
function Callouts({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  const svgRef   = useRef<SVGSVGElement>(null);
  const chipsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const svg   = svgRef.current;
    const chips = chipsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path'));

    if (!active) {
      gsap.set(paths, { strokeDashoffset: 200 });
      gsap.set(chips, { x: 0, y: 0, scale: 0.72, opacity: 0 });
      return;
    }

    chips.forEach((c, i) => {
      const f = slide.features[i];
      gsap.set(c, { x: f.fromX, y: f.fromY, scale: 0.72, opacity: 0 });
    });

    const tl = gsap.timeline({ delay: 0.48 });
    tl.to(paths, { strokeDashoffset: 0, duration: 0.85, stagger: 0.1,  ease: 'expo.out' });
    tl.to(chips, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.68, stagger: 0.12, ease: 'back.out(1.6)' }, '-=0.5');

    return () => { tl.kill(); };
  }, [active, slide.features]);

  return (
    <>
      <svg ref={svgRef} className="mobile-hero__callout-lines" viewBox="0 0 390 780" aria-hidden="true" data-active={active}>
        {slide.features.map((f) => (
          <path key={f.n} d={f.path} fill="none" stroke="rgba(255,255,255,0.68)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDashoffset: 200 }}/>
        ))}
      </svg>
      {slide.features.map((f, i) => (
        <div
          key={f.n}
          ref={(el) => { chipsRef.current[i] = el; }}
          className="mobile-hero__feature"
          style={{ left:px(f.left,390), top:px(f.top,780), opacity:0, transformOrigin: f.fromX>0 ? '100% 50%' : '0% 50%' }}
        >
          <span className="mobile-hero__feature-number" style={{ boxShadow:`0 0 0 2px rgba(0,0,0,0.5), 0 0 16px ${slide.accent}44` }}>
            {f.n}
          </span>
          <span className="mobile-hero__feature-copy">
            {f.text.map((line) => <span className="mobile-hero__feature-line" key={line}>{line}</span>)}
          </span>
        </div>
      ))}
    </>
  );
}

/* ─── Product ───────────────────────────────────────────────── */
function ProductImage({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) { gsap.set(el, { y: 28, opacity: 0, scale: 0.95 }); return; }
    gsap.fromTo(el,
      { y: 28, opacity: 0, scale: 0.95 },
      { y: 0,  opacity: 1, scale: 1,  duration: 0.85, delay: 0.28, ease: 'expo.out' }
    );
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' });
    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const cy = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      xTo((cx / window.innerWidth  - 0.5) * 20);
      yTo((cy / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, [active]);

  return (
    <img
      ref={ref}
      className="mobile-hero__product"
      src={slide.product}
      alt={slide.name}
      style={{
        width: px(slide.productStyle.width, 390),
        left:  px(slide.productStyle.left,  390),
        top:   px(slide.productStyle.top,   780),
        opacity: 0,
      }}
      loading="eager"
      decoding="async"
    />
  );
}

/* ─── Frame ─────────────────────────────────────────────────── */
function MobileHeroFrame({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  return (
    <div className="mobile-hero__slide" data-active={active} data-slide={slide.shortId}>
      <div className="mobile-hero__artboard">
        <img className="mobile-hero__background" src={slide.background} alt="" aria-hidden="true" loading="eager" decoding="async"/>
        <div className="mobile-hero__scrim"/>
        <div className="mobile-hero__grain" aria-hidden="true"/>
        <SvgFilters/>
        <Headline  slide={slide} active={active}/>
        <AtmosphereLayer slide={slide}/>
        <EffectLayer slide={slide} active={active}/>
        <Callouts  slide={slide} active={active}/>
        <ProductImage slide={slide} active={active}/>
      </div>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg className="mobile-hero__chevron-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={direction==='left' ? 'M15 18L9 12l6-6' : 'M9 6l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Root ──────────────────────────────────────────────────── */
interface MobileHeroProps {
  activeIndex: number;
  onSlideChange: (index: number) => void;
  onShop: () => void;
}

export function MobileHero({ activeIndex, onSlideChange, onShop }: MobileHeroProps) {
  const slide     = MOBILE_HERO_SLIDES[activeIndex] ?? MOBILE_HERO_SLIDES[0];
  const nextSlide = MOBILE_HERO_SLIDES[(activeIndex + 1) % MOBILE_HERO_SLIDES.length];
  const goPrev = () => onSlideChange((activeIndex - 1 + MOBILE_HERO_SLIDES.length) % MOBILE_HERO_SLIDES.length);
  const goNext = () => onSlideChange((activeIndex + 1) % MOBILE_HERO_SLIDES.length);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 880px)').matches) return;
    const t = window.setTimeout(() => onSlideChange((activeIndex + 1) % MOBILE_HERO_SLIDES.length), HERO_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [activeIndex, onSlideChange]);

  return (
    <div
      className="mobile-hero"
      data-theme={slide.shortId}
      style={{ '--mobile-hero-accent': slide.accent, '--mobile-hero-warm': slide.warm, backgroundColor: slide.bg } as CSSProperties}
    >
      <MobileHeroFrame key={slide.id} slide={slide} active/>
      <img className="mobile-hero__preload" src={nextSlide.background} alt="" aria-hidden="true" loading="eager" decoding="async"/>
      <img className="mobile-hero__preload" src={nextSlide.product}    alt="" aria-hidden="true" loading="eager" decoding="async"/>

      <div className="mobile-hero__progress" aria-hidden="true">
        {MOBILE_HERO_SLIDES.map((s, i) => (
          <span className="mobile-hero__progress-track" key={s.id}>
            <span className="mobile-hero__progress-fill" style={{
              width:     i < activeIndex ? '100%' : undefined,
              animation: i === activeIndex ? `mobileHeroProgress ${HERO_DURATION_MS}ms linear forwards` : 'none',
            }}/>
          </span>
        ))}
      </div>

      <div className="mobile-hero__bottom-nav">
        <button type="button" className="mobile-hero__round-btn" onClick={goPrev} aria-label="Previous product">
          <ChevronIcon direction="left"/>
        </button>
        <button type="button" className="mobile-hero__shop-btn" onClick={onShop} aria-label={`View ${slide.name} details`}>
          {slide.cta} <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="mobile-hero__round-btn" onClick={goNext} aria-label="Next product">
          <ChevronIcon direction="right"/>
        </button>
      </div>
    </div>
  );
}
