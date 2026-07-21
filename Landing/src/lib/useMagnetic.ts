import { useEffect, useRef } from 'react';

/**
 * "Magnetic" hover: the element leans slightly toward the cursor while
 * hovered, snapping back on leave. Returns a ref to attach to the target
 * element — deliberately NOT a wrapping component, so it drops onto
 * existing <a>/<button> CTAs without restructuring their JSX or losing
 * href/onClick/rel attributes.
 *
 * rAF-throttled (only ever one pending frame), disabled entirely under
 * prefers-reduced-motion, and only active on pointer:fine devices — a
 * magnetic pull effect on a touchscreen has no cursor to react to and
 * would just be dead weight.
 *
 * Writes CSS custom properties (--magnet-x/--magnet-y) rather than
 * `style.transform` directly — an inline transform would silently win over
 * .btn-glow's `:hover { transform: ... }` (inline beats a class selector
 * regardless of :hover), killing the lift/scale effect on any button this
 * is combined with. index.css's .btn-glow composes both via
 * `translate(var(--magnet-x, 0px), var(--magnet-y, 0px)) ...`.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
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
      el.style.setProperty('--magnet-x', `${pending.x}px`);
      el.style.setProperty('--magnet-y', `${pending.y}px`);
    }

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      pending = { x: relX * strength, y: relY * strength };
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeave() {
      pending = { x: 0, y: 0 };
      if (!raf) raf = requestAnimationFrame(apply);
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
