import { useEffect, useState } from 'react';
import type { CatalogItem, ProductKey, ProductStory } from '../types';
import { useVideoScrubbing } from '../hooks/useStorytellingCanvas';
import '../styles/HeroProductMedia.css';

interface HeroProductMediaProps {
  activeProduct: ProductKey;
  activeStory: ProductStory;
  activeItem?: CatalogItem;
  glow: string;
}

interface HeroMediaAsset {
  mp4: string;
  poster: string;
  webm: string;
}

const HERO_MEDIA: Record<ProductKey, HeroMediaAsset> = {
  shilajit: {
    webm: '/moon333.webm',
    mp4: '/moon333.mp4',
    poster: '/moon333/ezgif-frame-162.png',
  },
  kashmiriSaffron: {
    webm: '/moon2222.webm',
    mp4: '/moon2222.mp4',
    poster: '/moon2222/ezgif-frame-162.png',
  },
  kashmiriHoney: {
    webm: '/honey.webm',
    mp4: '/honey.mp4',
    poster: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
  },
  iraniSaffron: {
    webm: '/honey.webm',
    mp4: '/honey.mp4',
    poster: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
  },
  kashmiriAlmonds: {
    webm: '/moon2222.webm',
    mp4: '/moon2222.mp4',
    poster: '/moon2222/ezgif-frame-162.png',
  },
  walnuts: {
    webm: '/moon333.webm',
    mp4: '/moon333.mp4',
    poster: '/moon333/ezgif-frame-162.png',
  },
  kashmiriGhee: {
    webm: '/honey.webm',
    mp4: '/honey.mp4',
    poster: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
  },
};

const DESKTOP_MQ = '(min-width: 768px)';

export function HeroProductMedia({ activeProduct, activeStory, activeItem, glow }: HeroProductMediaProps) {
  const [isDesktop, setIsDesktop] = useState(false);
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

  return (
    <div className="hero-media-container absolute inset-0 overflow-hidden md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[55%]">
      {/* Glow */}
      <div
        className="hero-media-glow absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 75% at 55% 50%, rgba(${glow},0.10), transparent 70%)`,
        }}
      />

      {/* Mobile: looping autoplay video — hidden on desktop */}
      <video
        key={`${activeProduct}-loop`}
        aria-label={`${activeStory.featureName} product animation`}
        autoPlay
        className="hero-product-enter hero-media-video absolute inset-0 h-full w-full object-cover"
        disablePictureInPicture
        loop
        muted
        playsInline
        poster={poster}
        preload="metadata"
        style={{ display: isDesktop ? 'none' : 'block' }}
      >
        <source src={media.webm} type="video/webm" />
        <source src={media.mp4} type="video/mp4" />
      </video>

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
