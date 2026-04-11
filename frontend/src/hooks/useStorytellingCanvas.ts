import { useEffect, useRef } from 'react';
import type { ProductKey } from '../types';

const TOTAL_FRAMES = 192;
const LERP_FACTOR  = 0.10; // how fast current frame chases target (lower = smoother)
const AUTO_FPS     = 20;   // auto-advance when near top

const frameFolders: Partial<Record<ProductKey, string>> = {
  shilajit:        '/moon333',
  kashmiriSaffron: '/moon2222',
  kashmiriHoney:   '/ezgif-2fae6b36993927b6-jpg',
  iraniSaffron:    '/ezgif-2fae6b36993927b6-jpg',
  kashmiriAlmonds: '/moon2222',
  walnuts:         '/moon333',
  kashmiriGhee:    '/ezgif-2fae6b36993927b6-jpg',
};

const createFrameSets = (): Record<ProductKey, HTMLImageElement[]> => ({
  shilajit: [], kashmiriSaffron: [], kashmiriHoney: [],
  iraniSaffron: [], kashmiriAlmonds: [], walnuts: [], kashmiriGhee: [],
});

const createCountRecord = (): Record<ProductKey, number> => ({
  shilajit: 0, kashmiriSaffron: 0, kashmiriHoney: 0,
  iraniSaffron: 0, kashmiriAlmonds: 0, walnuts: 0, kashmiriGhee: 0,
});

export function useStorytellingCanvas(activeProduct: ProductKey) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const ctxRef       = useRef<CanvasRenderingContext2D | null>(null);
  const framesRef    = useRef<Record<ProductKey, HTMLImageElement[]>>(createFrameSets());
  const countRef     = useRef<Record<ProductKey, number>>(createCountRecord());

  // smooth animation state
  const targetFrameRef  = useRef(0);
  const currentFloatRef = useRef(0);
  const lastDrawnRef    = useRef(-1);
  const rafIdRef        = useRef<number | null>(null);
  const scrollingRef    = useRef(false);
  const autoRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    /* ─── draw frame ─────────────────────────────────────────────── */
    const draw = (idx: number, product: ProductKey) => {
      const images = framesRef.current[product];
      if (!images) return;
      const clampedIdx = Math.max(0, Math.min(images.length - 1, idx));
      const img = images[clampedIdx];
      const cx = ctxRef.current;
      const cv = canvasRef.current;
      if (!img?.complete || img.naturalWidth === 0 || !cx || !cv) return;

      const dpr = window.devicePixelRatio || 1;
      const cw  = cv.width  / dpr;
      const ch  = cv.height / dpr;
      cx.clearRect(0, 0, cw, ch);

      const ia = img.naturalWidth / img.naturalHeight;
      const ca = cw / ch;
      let dw: number, dh: number, ox: number, oy: number;

      // cover: fill panel, crop sides if needed
      if (ia > ca) {
        dh = ch; dw = dh * ia;
        ox = (cw - dw) / 2; oy = 0;
      } else {
        dw = cw; dh = dw / ia;
        ox = 0; oy = (ch - dh) / 2;
      }
      cx.drawImage(img, ox, oy, dw, dh);
    };

    /* ─── resize ─────────────────────────────────────────────────── */
    const resize = () => {
      const cv = canvasRef.current;
      const cx = ctxRef.current;
      if (!cv || !cx) return;
      const dpr  = window.devicePixelRatio || 1;
      const rect = cv.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      cv.width  = rect.width  * dpr;
      cv.height = rect.height * dpr;
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.scale(dpr, dpr);
      draw(Math.round(currentFloatRef.current), activeProduct);
    };

    /* ─── rAF loop: lerp current → target ───────────────────────── */
    const tick = () => {
      const target  = targetFrameRef.current;
      const current = currentFloatRef.current;
      const diff    = target - current;

      if (Math.abs(diff) > 0.5) {
        currentFloatRef.current = current + diff * LERP_FACTOR;
      } else {
        currentFloatRef.current = target;
      }

      const idx = Math.round(currentFloatRef.current);
      if (idx !== lastDrawnRef.current) {
        draw(idx, activeProduct);
        lastDrawnRef.current = idx;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    /* ─── preload ────────────────────────────────────────────────── */
    const preload = (product: ProductKey) => {
      const folder = frameFolders[product];
      if (!folder || framesRef.current[product].length > 0) return;

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `${folder}/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
        img.onload = () => {
          countRef.current[product] = (countRef.current[product] || 0) + 1;
          if (product === activeProduct && i === Math.round(currentFloatRef.current) + 1) {
            draw(Math.round(currentFloatRef.current), activeProduct);
          }
        };
        framesRef.current[product].push(img);
      }
    };

    /* ─── scroll → target frame ──────────────────────────────────── */
    const onScroll = () => {
      scrollingRef.current = true;
      const scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
      const heroHeight = window.innerHeight;
      // map 0 → heroHeight scroll to frame 0 → TOTAL_FRAMES-1
      const fraction   = Math.max(0, Math.min(1, scrollTop / heroHeight));
      targetFrameRef.current = Math.floor(fraction * (TOTAL_FRAMES - 1));
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    };

    /* ─── auto-advance when near top, not scrolled ───────────────── */
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 80) return; // stop when hero is scrolled past
      targetFrameRef.current = (targetFrameRef.current + 1) % TOTAL_FRAMES;
    }, 1000 / AUTO_FPS);

    preload(activeProduct);
    resize();

    // start rAF loop
    rafIdRef.current = requestAnimationFrame(tick);

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current)  cancelAnimationFrame(rafIdRef.current);
      if (autoRef.current)   clearInterval(autoRef.current);
    };
  }, [activeProduct]);

  return canvasRef;
}
