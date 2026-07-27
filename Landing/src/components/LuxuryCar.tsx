import { useTilt } from '../lib/useTilt';

/**
 * Hero's visual anchor for the luxury redesign — a stylized, deliberately
 * generic sports-car silhouette (no real make/model, no badges) standing in
 * for the "премиальный спортивный автомобиль" photo brief
 * (design/prompts/01-hero-car.md) until a real generated/stock image
 * replaces it. Pure SVG + CSS gradients (same technique as EnergyCore,
 * which this component replaces in Hero.tsx) — no WebGL/3D library, no
 * raster asset, no extra network request. Cursor-tracked tilt via useTilt,
 * gentle idle float via the existing .float-y utility on the wrapper.
 * Purely decorative: aria-hidden.
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

      <svg
        viewBox="0 0 600 240"
        className="relative w-full h-auto"
        style={{ filter: 'drop-shadow(0 0 28px color-mix(in srgb, var(--color-accent) 35%, transparent))' }}
      >
        <defs>
          <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chrome)" />
            <stop offset="18%" stopColor="var(--color-steel)" />
            <stop offset="45%" stopColor="var(--color-titanium)" />
            <stop offset="70%" stopColor="var(--color-metal-black)" />
            <stop offset="100%" stopColor="var(--color-bg-darker)" />
          </linearGradient>
          <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--color-accent) 55%, transparent)" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--color-bg-darker) 90%, transparent)" />
          </linearGradient>
          <radialGradient id="car-wheel" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="var(--color-chrome)" />
            <stop offset="55%" stopColor="var(--color-steel)" />
            <stop offset="100%" stopColor="#050607" />
          </radialGradient>
          <radialGradient id="wet-reflection" cx="50%" cy="0%" r="75%">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--color-accent) 30%, transparent)" />
            <stop offset="55%" stopColor="color-mix(in srgb, var(--color-gold) 12%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Main body silhouette — low, wide coupe stance */}
        <path
          d="M15,178
             C15,158 34,142 62,140
             L104,138
             C124,96 168,64 232,57
             C286,51 338,55 380,72
             C404,82 420,96 436,112
             L478,116
             C520,119 562,132 584,152
             L584,178
             C584,186 578,192 570,192
             L494,192
             C494,168 476,150 452,150
             C428,150 410,168 410,192
             L196,192
             C196,168 178,150 154,150
             C130,150 112,168 112,192
             L30,192
             C21,192 15,186 15,178 Z"
          fill="url(#car-body)"
          stroke="color-mix(in srgb, var(--color-accent) 45%, transparent)"
          strokeWidth="1.5"
        />

        {/* Windshield / greenhouse glass */}
        <path
          d="M150,136 C172,100 206,76 246,66 C284,58 322,60 356,72 C336,72 300,74 268,86 C232,100 202,116 182,138 Z"
          fill="url(#car-glass)"
          opacity="0.85"
        />

        {/* Emerald rim-light accent line along the roof/beltline */}
        <path
          d="M104,138 C124,96 168,64 232,57 C286,51 338,55 380,72"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Front + rear light strips */}
        <rect x="566" y="150" width="16" height="6" rx="3" fill="var(--color-accent)" opacity="0.9" />
        <rect x="20" y="150" width="14" height="5" rx="2.5" fill="var(--color-gold)" opacity="0.85" />

        {/* Wheels */}
        <circle cx="154" cy="192" r="34" fill="url(#car-wheel)" stroke="var(--color-metal-black)" strokeWidth="4" />
        <circle cx="154" cy="192" r="13" fill="var(--color-metal-black)" stroke="var(--color-chrome)" strokeWidth="1.5" />
        <circle cx="452" cy="192" r="34" fill="url(#car-wheel)" stroke="var(--color-metal-black)" strokeWidth="4" />
        <circle cx="452" cy="192" r="13" fill="var(--color-metal-black)" stroke="var(--color-chrome)" strokeWidth="1.5" />

        {/* Ground contact shadow */}
        <ellipse cx="300" cy="222" rx="270" ry="10" fill="black" opacity="0.45" />

        {/* Wet-asphalt reflection glow — flat gradient wash under the car rather than a
            literal mirrored copy, avoids fragile pixel-alignment of a reflected path while
            still reading as "wet ground catching the car's light". */}
        <ellipse cx="300" cy="220" rx="320" ry="26" fill="url(#wet-reflection)" opacity="0.6" />
      </svg>
    </div>
  );
}
