import { useEffect, useRef } from 'react';

/**
 * Thin scroll-progress bar fixed under the header. Writes width directly to
 * the DOM node via a ref (not React state) so scrolling never triggers a
 * re-render — same rAF-throttled-single-pending-frame pattern as the
 * cursor/parallax hooks. Purely decorative: aria-hidden.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    function update() {
      raf = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, doc.scrollTop / scrollable)) : 0;
      if (el) el.style.transform = `scaleX(${progress})`;
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="scroll-progress-track">
      <div ref={ref} className="scroll-progress-fill" />
    </div>
  );
}
