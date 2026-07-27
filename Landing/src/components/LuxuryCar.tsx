import { useTilt } from '../lib/useTilt';

/**
 * Hero's visual anchor — generated photo per design/prompts/01-hero-car.md
 * (generic unbranded sports car, no make/model/badges), reworked for the
 * "premium cinematic hero" pass (2026-07-27) to read as part of the scene
 * rather than a pasted rectangle: a soft radial `mask-image` dissolves the
 * photo's hard edges into the surrounding NightSkyline/vignette instead of
 * a visible photo boundary (brief §3-4 — no visible card/frame around the
 * car). The photo already contains its own wet-asphalt reflection under the
 * car (baked in at generation time, see the prompt brief) — a separate
 * CSS-mirrored duplicate was deliberately not added on top of it, since this
 * asset is a full scene photo (car + ground + skyline), not an isolated
 * cutout with alpha; mirroring the whole rectangle would duplicate the
 * skyline/ground behind the car as well and break the illusion instead of
 * reinforcing it. A tuned dark contact-shadow gradient grounds the car
 * instead. Cursor-tracked tilt via useTilt (kept subtle — the brief asks for
 * the car to stay "practically still"), idle float via .float-y. Purely
 * decorative: aria-hidden.
 */
export default function LuxuryCar() {
  const tiltRef = useTilt<HTMLDivElement>(3);

  return (
    <div
      ref={tiltRef}
      aria-hidden="true"
      className="relative w-full h-full float-y"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Contact shadow + ground glow — neutral dark core so it grounds the
          car rather than just adding more color, emerald/gold only as a
          thin outer wash. */}
      <div
        className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[80%] h-8 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse, rgba(0,0,0,0.75), color-mix(in srgb, var(--color-accent-dark) 30%, transparent) 55%, transparent 80%)',
        }}
      />

      <img
        src="/images/hero-car.webp"
        alt=""
        width={1536}
        height={1024}
        decoding="async"
        className="absolute bottom-0 right-0 w-full h-auto max-h-full object-contain object-bottom"
        style={{
          filter: 'drop-shadow(0 18px 22px rgba(0,0,0,0.55)) drop-shadow(0 0 20px color-mix(in srgb, var(--color-accent) 22%, transparent)) brightness(0.94) saturate(0.9)',
          maskImage:
            'radial-gradient(ellipse 78% 82% at 62% 62%, black 48%, rgba(0,0,0,0.75) 68%, transparent 96%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 78% 82% at 62% 62%, black 48%, rgba(0,0,0,0.75) 68%, transparent 96%)',
        }}
      />
    </div>
  );
}
