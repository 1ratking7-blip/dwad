import { useEffect, useState } from 'react';

/**
 * Flying designer banknotes/coins for the Hero (premium cinematic hero brief,
 * 2026-07-27) — replaces the single flat money-coins photo with procedural
 * SVG particles so each one can have its own random position, trajectory,
 * rotation, scale, opacity, blur and duration without shipping dozens of
 * cutout images. Fictional currency only: no logos, no real banknote/coin
 * likeness, no portraits, no country symbols — abstract hex/web3 emblem and
 * gold guilloché-style lines instead (see index.css .hero-note for the
 * shared drift keyframe, driven by per-instance CSS custom properties).
 *
 * Three depth layers (far/mid/near) with different size/opacity/blur/speed
 * ranges. Mounted full-bleed inside Hero's content container (same box the
 * car sits in, see Hero.tsx), but each layer's `left` range is pre-shifted
 * toward the right so particles stay out of the left "safe zone" where the
 * H1/subtitle/CTA live — see LAYER_RANGES below. Purely decorative:
 * aria-hidden + pointer-events-none, no interactive elements, so it never
 * enters the accessibility tree or tab order.
 */

type Layer = 'far' | 'mid' | 'near';
type Kind = 'bill' | 'coin';

interface Particle {
  id: number;
  kind: Kind;
  layer: Layer;
  top: number; // %
  left: number; // %
  size: number; // px
  opacity: number;
  blur: number; // px
  nbase: number; // deg, resting tilt
  nrot: number; // deg, added rotation at the peak of the drift
  ndx: number; // px
  ndy: number; // px
  ndur: number; // s
  ndelay: number; // s
  scaleStatic: number;
  accent: 'gold' | 'emerald';
}

const LAYER_RANGES: Record<Layer, {
  size: [number, number];
  opacity: [number, number];
  blur: [number, number];
  scale: [number, number];
  duration: [number, number];
  drift: [number, number];
  rot: [number, number];
  top: [number, number];
  left: [number, number];
}> = {
  far: { size: [16, 24], opacity: [0.18, 0.32], blur: [1.5, 3], scale: [0.35, 0.55], duration: [26, 35], drift: [10, 22], rot: [40, 100], top: [6, 42], left: [28, 90] },
  mid: { size: [30, 44], opacity: [0.35, 0.6], blur: [0.5, 1.5], scale: [0.75, 1.05], duration: [18, 26], drift: [16, 34], rot: [90, 210], top: [14, 76], left: [46, 97] },
  near: { size: [54, 76], opacity: [0.55, 0.85], blur: [0, 0.8], scale: [1.0, 1.4], duration: [14, 20], drift: [22, 46], rot: [150, 320], top: [32, 86], left: [58, 101] },
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeParticle(id: number, layer: Layer): Particle {
  const r = LAYER_RANGES[layer];
  const scale = rand(r.scale[0], r.scale[1]);
  return {
    id,
    kind: Math.random() < 0.72 ? 'bill' : 'coin',
    layer,
    top: rand(r.top[0], r.top[1]),
    left: rand(r.left[0], r.left[1]),
    size: rand(r.size[0], r.size[1]),
    opacity: rand(r.opacity[0], r.opacity[1]),
    blur: rand(r.blur[0], r.blur[1]),
    nbase: rand(-25, 25),
    nrot: rand(r.rot[0], r.rot[1]) * (Math.random() < 0.5 ? -1 : 1),
    ndx: rand(-r.drift[1], r.drift[1]),
    ndy: -rand(r.drift[0], r.drift[1]),
    ndur: rand(r.duration[0], r.duration[1]),
    ndelay: rand(0, 20),
    scaleStatic: scale,
    accent: Math.random() < 0.65 ? 'emerald' : 'gold',
  };
}

// Generated once at module load (no SSR in this app — plain Vite CSR SPA —
// so there's no hydration-mismatch concern here). A generous fixed pool is
// built up front; the component only ever slices from it, so the visible
// set never reshuffles/jumps as the viewport crosses a breakpoint.
const POOL: Particle[] = [
  ...Array.from({ length: 6 }, (_, i) => makeParticle(i, 'far')),
  ...Array.from({ length: 6 }, (_, i) => makeParticle(100 + i, 'mid')),
  ...Array.from({ length: 3 }, (_, i) => makeParticle(200 + i, 'near')),
];

/** Desktop-large / laptop / tablet / mobile counts per the brief's table (§19), as {far, mid, near}. */
function tierForWidth(width: number): { far: number; mid: number; near: number } {
  if (width >= 1280) return { far: 4, mid: 4, near: 2 };
  if (width >= 1024) return { far: 3, mid: 3, near: 1 };
  if (width >= 768) return { far: 2, mid: 2, near: 1 };
  return { far: 1, mid: 2, near: 0 };
}

function useResponsiveParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(reduceQuery.matches);

    function pick() {
      const tier = tierForWidth(window.innerWidth);
      const far = POOL.filter((p) => p.layer === 'far').slice(0, tier.far);
      const mid = POOL.filter((p) => p.layer === 'mid').slice(0, tier.mid);
      const near = POOL.filter((p) => p.layer === 'near').slice(0, tier.near);
      setParticles([...far, ...mid, ...near]);
    }

    pick();
    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(pick, 200);
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return { particles, reducedMotion };
}

function Bill({ size, accent, id }: { size: number; accent: 'gold' | 'emerald'; id: number }) {
  const gradId = `bill-grad-${id}`;
  const edge = accent === 'gold' ? 'var(--color-gold)' : 'var(--color-accent)';
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 64 32" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-graphite)" />
          <stop offset="55%" stopColor="var(--color-accent-dark)" />
          <stop offset="100%" stopColor="var(--color-metal-black)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="30" rx="2.5" fill={`url(#${gradId})`} stroke={edge} strokeWidth="1" opacity="0.95" />
      <rect x="4" y="4" width="56" height="24" rx="1.5" fill="none" stroke={edge} strokeWidth="0.4" opacity="0.5" />
      {/* abstract hex/web3 emblem — no letters, no currency symbols */}
      <path d="M32 10 L38 13.5 L38 20.5 L32 24 L26 20.5 L26 13.5 Z" fill="none" stroke={edge} strokeWidth="1" opacity="0.8" />
      <circle cx="32" cy="17" r="1.4" fill={edge} opacity="0.8" />
      {/* thin "security thread" accent */}
      <rect x="46" y="3" width="1" height="26" fill={edge} opacity="0.35" />
      <rect x="6" y="6" width="6" height="4" rx="0.8" fill={edge} opacity="0.4" />
      <rect x="52" y="22" width="6" height="4" rx="0.8" fill={edge} opacity="0.4" />
    </svg>
  );
}

function Coin({ size, accent, id }: { size: number; accent: 'gold' | 'emerald'; id: number }) {
  const gradId = `coin-grad-${id}`;
  const rim = accent === 'gold' ? 'var(--color-gold-dark)' : 'var(--color-accent-dark)';
  const face = accent === 'gold' ? 'var(--color-gold)' : 'var(--color-accent)';
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={accent === 'gold' ? '#f5e3ad' : 'var(--color-accent-2)'} />
          <stop offset="55%" stopColor={face} />
          <stop offset="100%" stopColor={rim} />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill={`url(#${gradId})`} stroke={rim} strokeWidth="1" />
      <circle cx="20" cy="20" r="12" fill="none" stroke={rim} strokeWidth="1" opacity="0.55" />
      <path d="M20 14 L25 17 L25 23 L20 26 L15 23 L15 17 Z" fill="none" stroke={rim} strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

export default function FloatingWealth() {
  const { particles, reducedMotion } = useResponsiveParticles();

  if (reducedMotion) {
    // Section 20 of the brief: keep a small, fully static composition —
    // no drift, no rotation — rather than nothing at all.
    const still = particles.slice(0, 3);
    return (
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {still.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              opacity: Math.min(p.opacity + 0.15, 0.9),
              transform: `rotate(${p.nbase}deg) scale(${p.scaleStatic})`,
            }}
          >
            {p.kind === 'bill' ? (
              <Bill size={p.size} accent={p.accent} id={p.id} />
            ) : (
              <Coin size={p.size} accent={p.accent} id={p.id} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-note absolute"
          style={
            {
              top: `${p.top}%`,
              left: `${p.left}%`,
              opacity: p.opacity,
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              '--nbase': `${p.nbase}deg`,
              '--nrot': `${p.nrot}deg`,
              '--ndx': `${p.ndx}px`,
              '--ndy': `${p.ndy}px`,
              '--nscale': p.scaleStatic,
              '--ndur': `${p.ndur}s`,
              '--ndelay': `${p.ndelay}s`,
            } as React.CSSProperties
          }
        >
          {p.kind === 'bill' ? (
            <Bill size={p.size} accent={p.accent} id={p.id} />
          ) : (
            <Coin size={p.size} accent={p.accent} id={p.id} />
          )}
        </div>
      ))}
    </div>
  );
}
