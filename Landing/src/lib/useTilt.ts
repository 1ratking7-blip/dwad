import { useEffect, useRef } from 'react';

/**
 * Subtle 3D tilt that tracks the cursor across the whole viewport (not just
 * while hovering the element itself) — the "mouse follow" effect for the
 * Hero visual. Same guards as useMagnetic: off under prefers-reduced-motion
 * and on touch-only devices, rAF-throttled to one pending update.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let pending: { rx: number; ry: number } | null = null;

    function apply() {
      raf = 0;
      if (!pending || !el) return;
      el.style.transform = `perspective(800px) rotateX(${pending.rx}deg) rotateY(${pending.ry}deg)`;
    }

    function onMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 .. 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pending = { rx: -ny * maxDeg, ry: nx * maxDeg };
      if (!raf) raf = requestAnimationFrame(apply);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [maxDeg]);

  return ref;
}
