import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Counts up to the first number found in `value` when scrolled into view,
 * keeping whatever text surrounds it intact ("До 5 BTC" -> animates 0..5,
 * renders "До {n} BTC" each frame). Falls back to just rendering the string
 * as-is if it has no number, or if prefers-reduced-motion is set.
 */
export default function AnimatedCounter({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const match = value.match(/\d+/);
  const target = match ? parseInt(match[0], 10) : null;
  const [display, setDisplay] = useState(target === null ? value : value.replace(/\d+/, '0'));

  useEffect(() => {
    if (!inView || target === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let raf = 0;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      // ease-out cubic — fast start, gentle settle, matches the rest of the
      // site's motion feel rather than a linear mechanical count.
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target! * eased);
      setDisplay(value.replace(/\d+/, String(current)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Deliberately only re-runs on `inView` — target/value/duration are stable for a
    // given instance (no locale switch remounts this without a fresh component identity).
  }, [inView]);

  return <span ref={ref}>{display}</span>;
}
