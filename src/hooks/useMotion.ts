import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia(QUERY);
    setReduced(media.matches);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return reduced;
}

/** Smooth-scrolls to a section, respecting the sticky header offset and reduced motion. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia(QUERY).matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
}
