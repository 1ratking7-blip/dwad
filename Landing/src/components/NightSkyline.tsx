import { useParallax } from '../lib/useParallax';

/**
 * Hero background layer — generated night-city photo per
 * design/prompts/03-night-city.md, deepened for the "premium cinematic
 * hero" pass (2026-07-27): darkened/desaturated via a static CSS filter
 * (not opacity — opacity would wash the image toward the page background
 * instead of deepening its blacks) plus two slow-drifting fog patches for
 * atmosphere. The `.luxury-vignette` sibling in Hero.tsx layers the
 * left/right/top/bottom cinematic grading on top of this. Furthest-back
 * layer in the Hero parallax stack (smallest useParallax strength).
 * Purely decorative: aria-hidden.
 */
export default function NightSkyline() {
  const parallaxRef = useParallax<HTMLDivElement>(4);

  return (
    // Fixed-height band anchored to the top of Hero — deliberately NOT `inset-0`:
    // the <section> this lives in is as tall as all of its content (H1, CTA, stats
    // grid below), and stretching the image to cover that whole (often 1000px+)
    // height would force an extreme crop. A bounded band keeps the scale sane; the
    // ground-haze gradient below fades it into the section background either way.
    <div
      ref={parallaxRef}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-screen max-h-[820px] overflow-hidden pointer-events-none"
    >
      <img
        src="/images/night-city.webp"
        alt=""
        width={1536}
        height={1024}
        decoding="async"
        className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom"
        style={{ filter: 'brightness(0.72) contrast(1.1) saturate(0.82)' }}
      />

      {/* Local drifting fog between the buildings — confined patches, not a
          full-frame tint, so the city stays dark/neutral rather than turning
          green overall (see index.css .fog-layer-a/b for the palette). */}
      <div className="fog-layer fog-layer-a" />
      <div className="fog-layer fog-layer-b" />

      {/* Very faint static drizzle texture — cheap (no animation), just a hint
          of wet-weather atmosphere over the skyline. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(100deg, rgba(240,243,242,0.5) 0px, rgba(240,243,242,0.5) 1px, transparent 1px, transparent 5px)',
        }}
      />

      {/* Ground haze — a soft gradient the skyline sits in, blending into the section background. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--color-bg) 90%)',
        }}
      />
    </div>
  );
}
