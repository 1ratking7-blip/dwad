import { useEffect, useRef } from 'react';

/**
 * Subtle cursor-tracked translate (not rotate — see useTilt for that) used to
 * fake depth-of-field parallax between Hero layers (skyline further back,
 * car closer, particles closest). Each layer gets a different `strength` so
 * they drift at different speeds relative to one another. Same guards as
 * useTilt/useMagnetic: off under prefers-reduced-motion and on touch-only
 * devices, rAF-throttled to one pending update.
 */
export function useParallax<T extends HTMLElement>(strength = 12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    function apply() {
      raf = 0;
      if (!pending || !el) return;
      el.style.transform = `translate3d(${pending.x}px, ${pending.y}px, 0)`;
    }

    function onMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 .. 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pending = { x: nx * strength, y: ny * strength };
      if (!raf) raf = requestAnimationFrame(apply);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
