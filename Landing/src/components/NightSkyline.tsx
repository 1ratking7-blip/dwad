import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useParallax } from '../lib/useParallax';
import { useLocale } from '../i18n/LocaleContext';
import ProjectFactsModal from './ProjectFactsModal';

/**
 * A handful of sparse window lights overlaid on the photo — plausible
 * positions across the skyline's middle band, each blinking rarely and
 * independently (long, staggered delays so it reads as "occasional windows
 * lighting up," not a synchronized blink). One of them (id `lightning`) is
 * easter egg #3: a lightning glyph instead of a plain light, a real
 * <button>, opens ProjectFactsModal on click.
 */
const WINDOW_LIGHTS = [
  { id: 'w1', top: 34, left: 18, delay: 0, duration: 9 },
  { id: 'w2', top: 41, left: 33, delay: 3.2, duration: 11 },
  { id: 'lightning', top: 29, left: 52, delay: 0, duration: 0 },
  { id: 'w3', top: 46, left: 64, delay: 5.5, duration: 8 },
  { id: 'w4', top: 37, left: 77, delay: 1.8, duration: 10 },
  { id: 'w5', top: 52, left: 87, delay: 4.1, duration: 12 },
] as const;

export default function NightSkyline() {
  const parallaxRef = useParallax<HTMLDivElement>(4);
  const { t } = useLocale();
  const [factsOpen, setFactsOpen] = useState(false);

  return (
    // Fixed-height band anchored to the top of Hero — deliberately NOT `inset-0`:
    // the <section> this lives in is as tall as all of its content (H1, CTA, stats
    // grid below), and stretching the image to cover that whole (often 1000px+)
    // height would force an extreme crop. A bounded band keeps the scale sane; the
    // ground-haze gradient below fades it into the section background either way.
    <div
      ref={parallaxRef}
      className="absolute inset-x-0 top-0 h-screen max-h-[820px] overflow-hidden pointer-events-none"
    >
      <img
        src="/images/night-city.webp"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        decoding="async"
        className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom"
        style={{ filter: 'brightness(0.72) contrast(1.1) saturate(0.82)' }}
      />

      {/* Local drifting fog between the buildings — confined patches, not a
          full-frame tint, so the city stays dark/neutral rather than turning
          green overall (see index.css .fog-layer-a/b for the palette). */}
      <div className="fog-layer fog-layer-a" aria-hidden="true" />
      <div className="fog-layer fog-layer-b" aria-hidden="true" />

      {/* Very faint static drizzle texture — cheap (no animation), just a hint
          of wet-weather atmosphere over the skyline. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(100deg, rgba(240,243,242,0.5) 0px, rgba(240,243,242,0.5) 1px, transparent 1px, transparent 5px)',
        }}
      />

      {/* Sparse window lights + the hidden lightning easter egg */}
      {WINDOW_LIGHTS.map((w) =>
        w.id === 'lightning' ? (
          <button
            key={w.id}
            type="button"
            onClick={() => setFactsOpen(true)}
            aria-label={t.easterEggs.lightningButtonAria}
            className="window-lightning-egg"
            style={{ top: `${w.top}%`, left: `${w.left}%` }}
          >
            <Zap className="w-3 h-3" aria-hidden="true" />
          </button>
        ) : (
          <span
            key={w.id}
            aria-hidden="true"
            className="window-light"
            style={{ top: `${w.top}%`, left: `${w.left}%`, animationDelay: `${w.delay}s`, animationDuration: `${w.duration}s` }}
          />
        )
      )}

      {/* Ground haze — a soft gradient the skyline sits in, blending into the section background. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--color-bg) 90%)',
        }}
      />

      <ProjectFactsModal open={factsOpen} onClose={() => setFactsOpen(false)} />
    </div>
  );
}
