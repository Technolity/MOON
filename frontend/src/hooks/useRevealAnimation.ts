import { useEffect } from 'react';

export function useRevealAnimation() {
  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('.reveal');
    if (!revealItems.length) return;

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, []);
}
