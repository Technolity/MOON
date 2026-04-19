import { useEffect, useRef } from 'react';

// px from top — in this zone the video loops freely (hero idle state)
const AUTOPLAY_ZONE = 80;
// base lerp; adaptive boost keeps up with fast scroll without big jumps
const BASE_LERP = 0.14;

export function useVideoScrubbing(activeProduct: string, enabled = true) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let current = 0;       // tracked video time (seconds)
    let rafId: number | null = null;
    let inAutoplay = true; // whether we are in the looping hero zone

    const tick = () => {
      const scrollY = window.scrollY;

      if (scrollY <= AUTOPLAY_ZONE) {
        // ── Hero zone: play the video as a smooth loop ────────────────
        inAutoplay = true;
        if (!video.loop) video.loop = true;
        if (video.paused) {
          video.playbackRate = 1;
          video.play().catch(() => {});
        }
      } else {
        // ── Scroll zone: drive currentTime from scroll position ───────
        if (inAutoplay) {
          // Entering scrub mode: sync tracked position to actual time
          // so there is no jump on the first seek
          inAutoplay = false;
          current = video.currentTime;
          video.loop = false;
        }

        if (video.duration) {
          const fraction = Math.min(1, scrollY / window.innerHeight);
          const target = fraction * video.duration;
          const diff = target - current;

          if (Math.abs(diff) > 0.006) {
            // Adaptive lerp: larger gap → faster catch-up → fewer skipped frames
            const rate = Math.min(1, BASE_LERP + Math.abs(diff) * 0.25);
            current += diff * rate;
            video.currentTime = current;
          }

          // Pause so the browser holds the decoded frame (no free-running)
          if (!video.paused) video.pause();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      current = 0;
      inAutoplay = true;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    if (video.readyState >= 2) {
      start();
    } else {
      video.addEventListener('loadeddata', start, { once: true });
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled, activeProduct]);

  return videoRef;
}
