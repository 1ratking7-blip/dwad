import { useEffect, useRef } from 'react';

/**
 * Soft emerald glow that follows the cursor on desktop — a large, very
 * low-opacity radial gradient, not a custom cursor replacement (the native
 * pointer stays exactly as-is). Intensifies over interactive elements via
 * event delegation (checking `closest('a, button, [data-cursor-glow]')`
 * on every move — cheap, no per-element listeners needed). Off entirely on
 * touch-only devices and under prefers-reduced-motion, per the brief.
 * rAF-throttled to one pending frame, single fixed DOM node reused for the
 * whole page lifetime (no per-frame allocation).
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let pending: { x: number; y: number; active: boolean } | null = null;

    function apply() {
      raf = 0;
      if (!pending || !el) return;
      el.style.transform = `translate3d(${pending.x - 220}px, ${pending.y - 220}px, 0)`;
      el.style.opacity = pending.active ? '0.9' : '0.55';
      el.style.setProperty('--cursor-glow-scale', pending.active ? '1.35' : '1');
    }

    function onMove(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const active = !!target?.closest('a, button, [data-cursor-glow]');
      pending = { x: e.clientX, y: e.clientY, active };
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeave() {
      if (el) el.style.opacity = '0';
    }
    function onEnter() {
      if (el) el.style.opacity = '0.55';
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="cursor-glow" />;
}
