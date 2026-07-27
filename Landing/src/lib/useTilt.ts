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

/**
 * Per-element hover tilt for cards (bank card, Games/HowItWorks tiles) — as
 * opposed to useTilt above, which tracks the cursor across the whole
 * viewport for a single hero visual. This one only reacts while the pointer
 * is over the element itself, and writes CSS custom properties
 * (--tilt-x/--tilt-y, consumed by .tilt-card in index.css) rather than
 * `style.transform` directly, so it composes with any class-based
 * `:hover`/`:active` transform the element already has (same reasoning as
 * useMagnetic's --magnet-x/--magnet-y). Resets to flat on pointer leave.
 * Same guards as the other pointer-tracking hooks: off under
 * prefers-reduced-motion and on touch-only devices.
 */
export function useCardTilt<T extends HTMLElement>(maxDeg = 8) {
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
      el.style.setProperty('--tilt-x', `${pending.rx}deg`);
      el.style.setProperty('--tilt-y', `${pending.ry}deg`);
    }

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 .. 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pending = { rx: -ny * maxDeg, ry: nx * maxDeg };
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeave() {
      pending = { rx: 0, ry: 0 };
      if (!raf) raf = requestAnimationFrame(apply);
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [maxDeg]);

  return ref;
}
