import { useRef, useState, useEffect, RefObject } from 'react';

interface UseNativeInViewOptions {
  /** Only trigger once (default: false) */
  once?: boolean;
  /** Visibility threshold 0-1 (default: 0) */
  threshold?: number;
  /** Root margin string (default: '0px') */
  rootMargin?: string;
}

/**
 * Lightweight replacement for framer-motion's useInView.
 * Uses native IntersectionObserver — no forced reflows.
 */
export function useNativeInView<T extends HTMLElement = HTMLDivElement>(
  options: UseNativeInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { once = false, threshold = 0, rootMargin = '0px' } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        if (inView && once) {
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return [ref, isInView];
}
