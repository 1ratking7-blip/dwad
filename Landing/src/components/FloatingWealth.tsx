/**
 * Floating cash/coins accent for the Hero — a small, fixed set of
 * SVG bill/coin shapes drifting along the bottom-right-to-center diagonal
 * (per the GPT art-direction brief: decorative, softly blurred, must never
 * compete with the CTA for attention). Deliberately NOT a canvas particle
 * system: the brief calls for a handful of large, legible shapes rather
 * than many small ones, and a fixed count of DOM nodes with CSS keyframe
 * animation (see the bill-drift and coin-spin classes in index.css) is
 * cheaper than a rAF loop for that. Stands in for design/prompts/04-money-coins.md until a
 * real generated/stock asset replaces it. Purely decorative: aria-hidden.
 */
type Particle =
  | { kind: 'bill'; top: string; left: string; size: number; rotate: number; blur: number; drift: 'a' | 'b' | 'c'; accent: 'gold' | 'accent' }
  | { kind: 'coin'; top: string; left: string; size: number; blur: number; spin: number };

const PARTICLES: Particle[] = [
  { kind: 'bill', top: '58%', left: '78%', size: 64, rotate: -18, blur: 0, drift: 'a', accent: 'gold' },
  { kind: 'coin', top: '48%', left: '88%', size: 34, blur: 0, spin: 3.2 },
  { kind: 'bill', top: '74%', left: '62%', size: 46, rotate: 12, blur: 1.5, drift: 'b', accent: 'accent' },
  { kind: 'coin', top: '80%', left: '84%', size: 24, blur: 1, spin: 4.1 },
  { kind: 'coin', top: '66%', left: '70%', size: 20, blur: 2, spin: 3.7 },
  { kind: 'bill', top: '86%', left: '80%', size: 38, rotate: -8, blur: 2, drift: 'c', accent: 'gold' },
];

function Bill({ size, rotate, accent }: { size: number; rotate: number; accent: 'gold' | 'accent' }) {
  const color = accent === 'gold' ? 'var(--color-gold)' : 'var(--color-accent)';
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 64 32" style={{ transform: `rotate(${rotate}deg)` }}>
      <rect x="1" y="1" width="62" height="30" rx="3" fill="var(--color-graphite)" stroke={color} strokeWidth="1.5" opacity="0.9" />
      <circle cx="32" cy="16" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
      <rect x="6" y="6" width="8" height="5" rx="1" fill={color} opacity="0.5" />
      <rect x="50" y="21" width="8" height="5" rx="1" fill={color} opacity="0.5" />
    </svg>
  );
}

function Coin({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <radialGradient id="fw-coin" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f5e3ad" />
          <stop offset="55%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-gold-dark)" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#fw-coin)" stroke="var(--color-gold-dark)" strokeWidth="1" />
      <circle cx="20" cy="20" r="12" fill="none" stroke="#8a6a26" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export default function FloatingWealth() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.kind === 'bill' ? `bill-drift-${p.drift}` : 'coin-spin'}`}
          style={{
            top: p.top,
            left: p.left,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            opacity: p.kind === 'bill' ? 0.5 : 0.6,
            ...(p.kind === 'coin' ? ({ '--coin-spin-duration': `${p.spin}s` } as React.CSSProperties) : {}),
          }}
        >
          {p.kind === 'bill' ? <Bill size={p.size} rotate={p.rotate} accent={p.accent} /> : <Coin size={p.size} />}
        </div>
      ))}
    </div>
  );
}
