import { useEffect, useRef, useState } from 'react';
import type { CatalogItem, ProductKey, ProductStory } from '../types';
import { useVideoScrubbing } from '../hooks/useStorytellingCanvas';
import '../styles/HeroProductMedia.css';

interface HeroProductMediaProps {
  activeProduct: ProductKey;
  activeStory: ProductStory;
  activeItem?: CatalogItem;
  glow: string;
  onVideoEnded?: () => void;
}

interface HeroMediaAsset {
  mp4: string;
  poster: string;
  webm: string;
}

const BLOB = 'https://kxxv61zbiojiooac.public.blob.vercel-storage.com';

const HERO_MEDIA: Record<ProductKey, HeroMediaAsset> = {
  shilajit: {
    webm: `${BLOB}/moon333.webm`,
    mp4: `${BLOB}/moon333.mp4`,
    poster: '/moon333/ezgif-frame-162.png',
  },
  kashmiriSaffron: {
    webm: `${BLOB}/moon2222.webm`,
    mp4: `${BLOB}/moon2222.mp4`,
    poster: '/moon2222/ezgif-frame-162.png',
  },
  kashmiriHoney: {
    webm: `${BLOB}/honey.webm`,
    mp4: `${BLOB}/honey.mp4`,
    poster: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
  },
  iraniSaffron: {
    webm: `${BLOB}/honey.webm`,
    mp4: `${BLOB}/honey.mp4`,
    poster: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
  },
  kashmiriAlmonds: {
    webm: `${BLOB}/moon2222.webm`,
    mp4: `${BLOB}/moon2222.mp4`,
    poster: '/moon2222/ezgif-frame-162.png',
  },
  walnuts: {
    webm: `${BLOB}/moon333.webm`,
    mp4: `${BLOB}/moon333.mp4`,
    poster: '/moon333/ezgif-frame-162.png',
  },
  kashmiriGhee: {
    webm: `${BLOB}/honey.webm`,
    mp4: `${BLOB}/honey.mp4`,
    poster: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
  },
};

const DESKTOP_MQ = '(min-width: 768px)';

export function HeroProductMedia({ activeProduct, activeStory, activeItem, glow, onVideoEnded }: HeroProductMediaProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileVideoReady, setMobileVideoReady] = useState(false);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const scrubRef = useVideoScrubbing(activeProduct, isDesktop);
  const media = HERO_MEDIA[activeProduct];
  const poster = activeItem?.image?.endsWith('.png') ? activeItem.image : media.poster;

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = (e: MediaQueryList | MediaQueryListEvent) =>
      setIsDesktop('matches' in e ? e.matches : false);
    sync(mq);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', sync);
      return () => mq.removeEventListener('change', sync);
    }
    mq.addListener(sync as EventListener);
    return () => mq.removeListener(sync as EventListener);
  }, []);

  // Mobile: defer video load until page is idle to avoid blocking first paint
  useEffect(() => {
    if (isDesktop) return;
    setMobileVideoReady(false);
    let handle: number | ReturnType<typeof setTimeout>;
    if ('requestIdleCallback' in window) {
      handle = (window as Window & typeof globalThis).requestIdleCallback(
        () => setMobileVideoReady(true),
        { timeout: 2000 }
      );
      return () => (window as Window & typeof globalThis).cancelIdleCallback(handle as number);
    }
    handle = setTimeout(() => setMobileVideoReady(true), 1200);
    return () => clearTimeout(handle as ReturnType<typeof setTimeout>);
  }, [isDesktop, activeProduct]);

  // Once video element exists, assign src and play
  useEffect(() => {
    if (!mobileVideoReady || isDesktop) return;
    const v = mobileVideoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [mobileVideoReady, isDesktop, activeProduct]);

  return (
    <div className="hero-media-container absolute inset-0 overflow-hidden md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[55%]">
      {/* Glow */}
      <div
        className="hero-media-glow absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 75% at 55% 50%, rgba(${glow},0.10), transparent 70%)`,
        }}
      />

      {/* Mobile: poster shown instantly; video fades in after idle */}
      {!isDesktop && (
        <>
          {/* Poster — visible immediately, zero network cost */}
          <img
            src={poster}
            alt={activeStory.featureName}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: mobileVideoReady ? 0 : 1, transition: 'opacity 0.6s ease' }}
          />
          {/* Video — src assigned after idle, fades over poster */}
          <video
            ref={mobileVideoRef}
            key={`${activeProduct}-loop`}
            aria-label={`${activeStory.featureName} product animation`}
            className="hero-product-enter hero-media-video absolute inset-0 h-full w-full object-cover"
            disablePictureInPicture
            muted
            playsInline
            poster={poster}
            preload="none"
            onEnded={onVideoEnded}
            style={{ opacity: mobileVideoReady ? 1 : 0, transition: 'opacity 0.6s ease' }}
          >
            {mobileVideoReady && <source src={media.webm} type="video/webm" />}
            {mobileVideoReady && <source src={media.mp4} type="video/mp4" />}
          </video>
        </>
      )}

      {/* Desktop: scroll-driven video — loops at hero, scrubs on scroll */}
      {isDesktop && (
        <>
          <video
            ref={scrubRef}
            key={`${activeProduct}-scrub`}
            aria-hidden="true"
            className="hero-product-enter hero-media-scrub-video absolute inset-0 h-full w-full object-cover"
            disablePictureInPicture
            muted
            playsInline
            poster={poster}
            preload="auto"
          >
            <source src={media.webm} type="video/webm" />
            <source src={media.mp4} type="video/mp4" />
          </video>
          {/* Left-edge fade to blend into page background */}
          <div className="hero-media-feather absolute inset-y-0 left-0 pointer-events-none" />
        </>
      )}
    </div>
  );
}
