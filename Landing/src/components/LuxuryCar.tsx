import { useTilt } from '../lib/useTilt';

/**
 * Hero's visual anchor for the luxury redesign — generated photo per
 * design/prompts/01-hero-car.md (generic unbranded sports car, no
 * make/model/badges). Cursor-tracked tilt via useTilt, idle float via the
 * existing .float-y utility on the wrapper. Purely decorative: aria-hidden.
 */
export default function LuxuryCar() {
  const tiltRef = useTilt<HTMLDivElement>(5);

  return (
    <div
      ref={tiltRef}
      aria-hidden="true"
      className="relative w-full max-w-xl mx-auto float-y"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Ground glow beneath the car — emerald + gold, wide soft blur */}
      <div
        className="absolute left-1/2 bottom-2 -translate-x-1/2 w-[85%] h-10 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse, color-mix(in srgb, var(--color-accent) 45%, transparent), color-mix(in srgb, var(--color-gold) 20%, transparent) 60%, transparent 80%)',
        }}
      />

      <img
        src="/images/hero-car.webp"
        alt=""
        width={1536}
        height={1024}
        decoding="async"
        className="relative w-full h-auto rounded-xl"
        style={{ filter: 'drop-shadow(0 0 28px color-mix(in srgb, var(--color-accent) 35%, transparent))' }}
      />
    </div>
  );
}
