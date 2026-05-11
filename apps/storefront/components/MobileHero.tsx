'use client';

import { useEffect, type CSSProperties } from 'react';
import type { ProductKey } from '@/lib/types';
import '@/styles/MobileHero.css';

const HERO_DURATION_MS = 9500;

type HeadlineConfig = {
  lines: string[];
  top: number;
  left: number;
  width: number;
  rotate: number;
  size: number;
  lineHeight: number;
  color: string;
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

const px = (value: number, base: number) => `${(value / base) * 100}%`;

export const MOBILE_HERO_SLIDES: MobileHeroSlide[] = [
  {
    id: 'shilajit',
    shortId: 'shilajit',
    name: 'Himalayan Shilajit',
    cta: 'Shop shilajit',
    background: '/mobile-hero/shilajit-bg.png',
    product: '/mobile-hero/shilajit-product.png',
    accent: '#A6755D',
    warm: '#EFC88B',
    bg: '#130b07',
    headline: {
      lines: ['PURE', 'HIMALAYAN', 'RESIN'],
      top: 76,
      left: 21,
      width: 350,
      rotate: -4,
      size: 78,
      lineHeight: 0.9,
      color: 'rgba(139,116,99,0.92)',
    },
    productStyle: { width: 330, left: 30, top: 122 },
    effect: 'smoke',
    features: [
      { n: '1', text: ['Potent 70%+', 'Fulvic Acid'], left: 13, top: 322, fromX: 78, fromY: 34, path: 'M134 343 L174 343 L174 390' },
      { n: '2', text: ['Natural Energy', '& Vitality'], left: 239, top: 322, fromX: -76, fromY: 34, path: 'M257 343 L224 343 L224 394' },
      { n: '3', text: ['Ayurvedic', 'Wellness Support'], left: 226, top: 555, fromX: -50, fromY: -36, path: 'M246 576 L197 576 L197 516' },
    ],
  },
  {
    id: 'kashmiriSaffron',
    shortId: 'saffron',
    name: 'Kashmiri Saffron',
    cta: 'Shop saffron',
    background: '/mobile-hero/saffron-bg.png',
    product: '/mobile-hero/saffron-product.png',
    accent: '#CF5C36',
    warm: '#F5E1D8',
    bg: '#290302',
    headline: {
      lines: ['THE RED GOLD'],
      top: 118,
      left: 6,
      width: 378,
      rotate: -6,
      size: 62,
      lineHeight: 0.9,
      color: '#F05A4C',
    },
    productStyle: { width: 346, left: 25, top: 265 },
    effect: 'saffron',
    features: [
      { n: '1', text: ['Grade-A', 'Kashmiri Stigmas'], left: 15, top: 328, fromX: 70, fromY: 30, path: 'M130 349 L172 349 L172 390' },
      { n: '2', text: ['Mood & Skin', 'Radiance'], left: 240, top: 328, fromX: -74, fromY: 30, path: 'M258 349 L225 349 L225 390' },
      { n: '3', text: ['Deep Aroma,', 'Rich Flavor'], left: 238, top: 566, fromX: -58, fromY: -32, path: 'M256 587 L202 587 L202 514' },
    ],
  },
  {
    id: 'kashmiriHoney',
    shortId: 'honey',
    name: "Bee's Honey",
    cta: 'Shop honey',
    background: '/mobile-hero/honey-bg.png',
    product: '/mobile-hero/honey-product.png',
    accent: '#EFC88B',
    warm: '#FFE0A2',
    bg: '#2a1604',
    headline: {
      lines: ["NATURE'S PUREST", 'SWEETNESS'],
      top: 104,
      left: 14,
      width: 362,
      rotate: -8,
      size: 50,
      lineHeight: 0.88,
      color: '#D49A31',
    },
    productStyle: { width: 350, left: 50, top: 185 },
    effect: 'honey',
    features: [
      { n: '1', text: ['100% Raw &', 'Unfiltered'], left: 14, top: 318, fromX: 74, fromY: 34, path: 'M124 339 L161 339 L161 382' },
      { n: '2', text: ['Antioxidant', 'Rich'], left: 247, top: 318, fromX: -70, fromY: 34, path: 'M266 339 L226 339 L226 386' },
      { n: '3', text: ['Sweet & Floral', 'Notes'], left: 236, top: 562, fromX: -54, fromY: -34, path: 'M255 583 L197 583 L197 515' },
    ],
  },
];

interface MobileHeroProps {
  activeIndex: number;
  onSlideChange: (index: number) => void;
  onShop: () => void;
}

function Headline({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  const h = slide.headline;
  return (
    <h1
      className="mobile-hero__headline"
      style={{
        top: px(h.top, 780),
        left: px(h.left, 390),
        width: px(h.width, 390),
        transform: `rotate(${h.rotate}deg)`,
        fontSize: `${(h.size / 390) * 100}cqw`,
        lineHeight: h.lineHeight,
        color: h.color,
        opacity: active ? 1 : 0,
      }}
    >
      {h.lines.map((line, i) => (
        <span className="mobile-hero__headline-mask" key={line}>
          <span
            className="mobile-hero__distressed-type"
            data-text={line}
            style={{
              '--headline-color': h.color,
              animation: active ? `mobileHeadlineRise 950ms cubic-bezier(.16,.84,.25,1) ${160 + i * 115}ms both` : 'none',
            } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}

function EffectLayer({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  if (slide.effect === 'smoke') {
    return (
      <div className="mobile-hero__effects" data-active={active}>
        {[0, 1].map((i) => (
          <span
            key={i}
            className="mobile-hero__smoke-wisp"
            style={{
              left: px(38 + i * 68, 390),
              top: px(258 + (i % 2) * 34, 780),
              width: px(122 + i * 10, 390),
              animationDelay: `${i * 260}ms`,
            }}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <span
            key={`dust-${i}`}
            className="mobile-hero__rock-dust"
            style={{
              left: px(58 + i * 48, 390),
              top: px(426 + (i % 3) * 18, 780),
              animationDelay: `${i * 180}ms`,
            }}
          />
        ))}
      </div>
    );
  }

  if (slide.effect === 'saffron') {
    return (
      <div className="mobile-hero__effects" data-active={active}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="mobile-hero__red-droplet"
            style={{
              left: px(52 + i * 62, 390),
              top: px(184 + (i % 2) * 34, 780),
              width: `${8 + (i % 2) * 4}px`,
              height: `${8 + (i % 2) * 4}px`,
              animationDelay: `${i * 210}ms`,
            }}
          />
        ))}
        <span className="mobile-hero__saffron-sheen" />
      </div>
    );
  }

  return (
    <div className="mobile-hero__effects" data-active={active}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="mobile-hero__honey-drop"
          style={{
            left: px([28, 118, 286, 336][i], 390),
            top: px([260, 240, 238, 430][i], 780),
            animationDelay: `${i * 240}ms`,
          }}
        />
      ))}
      <span className="mobile-hero__honey-wave" />
    </div>
  );
}

function FeatureChip({ feature, slide, active }: { feature: FeatureConfig; slide: MobileHeroSlide; active: boolean }) {
  let wordOffset = 0;

  return (
    <div
      className="mobile-hero__feature"
      style={{
        left: px(feature.left, 390),
        top: px(feature.top, 780),
        transform: active ? 'translate3d(0,0,0) scale(1)' : `translate3d(${feature.fromX}px, ${feature.fromY}px, 0) scale(0.78)`,
        opacity: active ? 1 : 0,
        transformOrigin: feature.fromX > 0 ? '100% 50%' : '0% 50%',
        transitionDelay: `${Number(feature.n) * 125 + 380}ms`,
      }}
    >
      <span
        className="mobile-hero__feature-number"
        style={{ boxShadow: `0 0 0 2px rgba(0,0,0,0.42), 0 0 18px ${slide.accent}44` }}
      >
        {feature.n}
      </span>
      <span className="mobile-hero__feature-copy">
        {feature.text.map((line) => (
          <span className="mobile-hero__feature-line" key={line}>
            {line.split(' ').map((word) => {
              const currentOffset = wordOffset;
              wordOffset += 1;
              return (
                <span
                  key={`${word}-${currentOffset}`}
                  className="mobile-hero__kinetic-word"
                  style={{
                    animation: active ? `mobileWordPop 560ms cubic-bezier(.12,.92,.2,1.08) ${Number(feature.n) * 125 + 620 + currentOffset * 46}ms both` : 'none',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </div>
  );
}

function Callouts({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  return (
    <>
      <svg className="mobile-hero__callout-lines" viewBox="0 0 390 780" aria-hidden="true" data-active={active}>
        {slide.features.map((feature) => (
          <path
            key={feature.n}
            d={feature.path}
            fill="none"
            stroke="rgba(255,255,255,0.74)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transitionDelay: `${Number(feature.n) * 120 + 360}ms` }}
          />
        ))}
      </svg>
      {slide.features.map((feature) => (
        <FeatureChip key={feature.n} feature={feature} slide={slide} active={active} />
      ))}
    </>
  );
}

function MobileHeroFrame({ slide, active }: { slide: MobileHeroSlide; active: boolean }) {
  return (
    <div className="mobile-hero__slide" data-active={active} data-slide={slide.shortId}>
      <div className="mobile-hero__artboard">
        <img className="mobile-hero__background" src={slide.background} alt="" aria-hidden="true" loading="eager" decoding="async" />
        <div className="mobile-hero__scrim" />
        <Headline slide={slide} active={active} />
        <EffectLayer slide={slide} active={active} />
        <Callouts slide={slide} active={active} />
        <img
          className="mobile-hero__product"
          src={slide.product}
          alt={slide.name}
          style={{
            width: px(slide.productStyle.width, 390),
            left: px(slide.productStyle.left, 390),
            top: px(slide.productStyle.top, 780),
          }}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg className="mobile-hero__chevron-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={direction === 'left' ? 'M15 18L9 12l6-6' : 'M9 6l6 6-6 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MobileHero({ activeIndex, onSlideChange, onShop }: MobileHeroProps) {
  const slide = MOBILE_HERO_SLIDES[activeIndex] ?? MOBILE_HERO_SLIDES[0];
  const nextSlide = MOBILE_HERO_SLIDES[(activeIndex + 1) % MOBILE_HERO_SLIDES.length];
  const goPrev = () => onSlideChange((activeIndex - 1 + MOBILE_HERO_SLIDES.length) % MOBILE_HERO_SLIDES.length);
  const goNext = () => onSlideChange((activeIndex + 1) % MOBILE_HERO_SLIDES.length);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 880px)').matches) return;
    const timer = window.setTimeout(() => {
      onSlideChange((activeIndex + 1) % MOBILE_HERO_SLIDES.length);
    }, HERO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, onSlideChange]);

  return (
    <div
      className="mobile-hero"
      data-theme={slide.shortId}
      style={{ '--mobile-hero-accent': slide.accent, '--mobile-hero-warm': slide.warm, backgroundColor: slide.bg } as CSSProperties}
    >
      <MobileHeroFrame key={slide.id} slide={slide} active />
      <img className="mobile-hero__preload" src={nextSlide.background} alt="" aria-hidden="true" loading="eager" decoding="async" />
      <img className="mobile-hero__preload" src={nextSlide.product} alt="" aria-hidden="true" loading="eager" decoding="async" />

      <div className="mobile-hero__progress" aria-hidden="true">
        {MOBILE_HERO_SLIDES.map((s, i) => (
          <span className="mobile-hero__progress-track" key={s.id}>
            <span
              className="mobile-hero__progress-fill"
              style={{
                width: i < activeIndex ? '100%' : undefined,
                animation: i === activeIndex ? `mobileHeroProgress ${HERO_DURATION_MS}ms linear forwards` : 'none',
              }}
            />
          </span>
        ))}
      </div>

      <div className="mobile-hero__bottom-nav">
        <button type="button" className="mobile-hero__round-btn" onClick={goPrev} aria-label="Previous product">
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          className="mobile-hero__shop-btn"
          onClick={onShop}
          aria-label={`View ${slide.name} details`}
        >
          {slide.cta} <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="mobile-hero__round-btn" onClick={goNext} aria-label="Next product">
          <ChevronIcon direction="right" />
        </button>
      </div>
    </div>
  );
}
