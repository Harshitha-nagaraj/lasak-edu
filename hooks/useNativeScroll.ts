import { useState, useEffect, useCallback } from 'react';

/**
 * Lightweight native scroll Y position hook.
 * Uses passive scroll listener + rAF — no forced reflows.
 */
export function useNativeScrollY(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return scrollY;
}

/**
 * Returns scroll progress (0-1) for the page.
 * Uses rAF-batched native scroll listener — no forced reflows.
 */
export function useNativeScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    const update = () => {
      rafId = requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    // Initial calculation
    update();
    return () => {
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}
