import { useEffect, useState } from 'react';
import { onEgg } from '../lib/eggBus';

const STORM_DURATION_MS = 4000;
const PARTICLE_COUNT = 24;

interface StormParticle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  kind: 'bill' | 'coin';
}

function makeParticles(): StormParticle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 18 + Math.random() * 26,
    duration: 1.6 + Math.random() * 1.6,
    delay: Math.random() * 0.9,
    rotate: (Math.random() - 0.5) * 720,
    kind: Math.random() < 0.6 ? 'bill' : 'coin',
  }));
}

/**
 * Easter egg #1 — 5 rapid logo clicks (see Header.tsx) trigger a ~4s money
 * storm. Particles are generated once per activation (a bounded, short-lived
 * burst — not a continuous per-frame creation loop, so it doesn't run afoul
 * of the "reuse objects, don't spam the DOM" performance guidance that
 * applies to the always-on ambient particle systems) and the whole overlay
 * unmounts itself when the storm ends. Purely decorative: aria-hidden,
 * pointer-events-none.
 */
export default function MoneyStormOverlay() {
  const [particles, setParticles] = useState<StormParticle[] | null>(null);

  useEffect(() => {
    return onEgg('money-storm', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setParticles(makeParticles());
      window.setTimeout(() => setParticles(null), STORM_DURATION_MS);
    });
  }, []);

  if (!particles) return null;

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[65] overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="money-storm-particle"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.kind === 'bill' ? p.size * 0.55 : p.size,
              borderRadius: p.kind === 'bill' ? '3px' : '50%',
              background:
                p.kind === 'bill'
                  ? 'linear-gradient(135deg, var(--color-graphite), var(--color-accent-dark))'
                  : 'radial-gradient(circle at 35% 30%, #f5e3ad, var(--color-gold) 55%, var(--color-gold-dark))',
              border: p.kind === 'bill' ? '1px solid var(--color-gold)' : '1px solid var(--color-gold-dark)',
              '--storm-duration': `${p.duration}s`,
              '--storm-delay': `${p.delay}s`,
              '--storm-rotate': `${p.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
