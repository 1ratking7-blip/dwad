import { useTilt } from '../lib/useTilt';

/**
 * Hero's visual anchor — an abstract "energy core": rotating conic-gradient
 * rings, a pulsing glowing center, small orbiting motes, and a subtle
 * cursor-tracked 3D tilt. Built entirely from CSS (conic-gradient + masking,
 * the same technique LuckyWheel.tsx already uses for its wheel segments) —
 * deliberately not a WebGL/Three.js object. The brief allowed either
 * ("если считаешь нужным") and a 3D library would be a real bundle-size and
 * GPU-cost risk on the exact Lighthouse score this session already fought
 * to protect twice. Purely decorative: aria-hidden.
 */
export default function EnergyCore() {
  const tiltRef = useTilt<HTMLDivElement>(6);

  const motes = [0, 1, 2, 3, 4];

  return (
    <div
      ref={tiltRef}
      aria-hidden="true"
      className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Outer soft glow */}
      <div className="absolute inset-[-20%] rounded-full bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] blur-[60px]" />

      {/* Outer ring — slow clockwise, conic gradient masked to a ring (border-only look) */}
      <div
        className="energy-ring-cw absolute inset-0 rounded-full"
        style={
          {
            '--spin-duration': '18s',
            background: `conic-gradient(from 0deg, transparent, var(--color-accent), transparent 40%)`,
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            opacity: 0.7,
          } as React.CSSProperties
        }
      />

      {/* Middle ring — faster counter-clockwise, slightly inset */}
      <div
        className="energy-ring-ccw absolute inset-[12%] rounded-full"
        style={
          {
            '--spin-duration': '11s',
            background: `conic-gradient(from 90deg, transparent, var(--color-accent-2), transparent 35%)`,
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            opacity: 0.55,
          } as React.CSSProperties
        }
      />

      {/* Thin static facet ring for depth */}
      <div className="absolute inset-[22%] rounded-full border border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)]" />

      {/* Pulsing core */}
      <div className="absolute inset-[30%] rounded-full energy-core-pulse">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ffffff, var(--color-accent) 45%, var(--color-accent-dark) 100%)',
            boxShadow: '0 0 40px color-mix(in srgb, var(--color-accent) 60%, transparent), 0 0 80px color-mix(in srgb, var(--color-accent) 30%, transparent)',
          }}
        />
      </div>

      {/* Orbiting motes */}
      {motes.map((i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] energy-mote"
          style={
            {
              '--orbit-radius': `${100 + i * 18}px`,
              '--orbit-duration': `${7 + i * 2.4}s`,
              boxShadow: '0 0 8px var(--color-accent)',
              animationDelay: `${i * -1.3}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
