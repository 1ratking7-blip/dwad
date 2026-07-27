import { useCardTilt } from '../lib/useTilt';

/**
 * Premium metallic bank card — decorative, "slipping out" from under the
 * Hero glass panel next to the CTA (see design/prompts/02-metal-card.md for
 * the photo brief this stands in for). Deliberately generic: no payment
 * network marks, no real card numbers, no bank branding — an abstract chip
 * + accent mark only, per the project's "no recognizable brand logos" rule.
 * Hover tilt via useCardTilt (.tilt-card in index.css), looping diagonal
 * shine via .card-shine-loop (not hover-gated — the card is a static
 * accent, not itself a CTA, so the shine plays regardless of pointer type).
 */
export default function MetalCard() {
  const tiltRef = useCardTilt<HTMLDivElement>(10);

  return (
    <div
      ref={tiltRef}
      aria-hidden="true"
      className="tilt-card relative w-56 sm:w-64 aspect-[1.586/1] rounded-2xl overflow-hidden"
      style={{
        '--tilt-base': '-13deg',
        background:
          'linear-gradient(135deg, var(--color-chrome) 0%, var(--color-steel) 12%, var(--color-titanium) 35%, var(--color-metal-black) 60%, var(--color-graphite) 100%)',
        boxShadow:
          '0 25px 50px -18px rgba(0,0,0,0.7), inset 0 1px 0 color-mix(in srgb, white 25%, transparent), inset 0 -2px 6px color-mix(in srgb, black 45%, transparent)',
      } as React.CSSProperties}
    >
      {/* Thin gold border accent along one edge */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-gold) 55%, transparent)' }}
      />

      {/* Looping diagonal shine sweep */}
      <div className="card-shine-loop" />

      {/* Chip */}
      <div
        className="absolute top-[22%] left-[8%] w-9 h-7 sm:w-10 sm:h-8 rounded-md"
        style={{
          background: 'linear-gradient(135deg, var(--color-gold) 0%, #f5e3ad 40%, var(--color-gold-dark) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35)',
        }}
      />

      {/* Abstract "premium mark" — a diamond, not a payment-network logo */}
      <div
        className="absolute top-[20%] right-[8%] w-7 h-7 sm:w-8 sm:h-8 rotate-45"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
          opacity: 0.85,
          boxShadow: '0 0 14px color-mix(in srgb, var(--color-accent) 55%, transparent)',
        }}
      />

      {/* Abstract embossed guilloché-style lines — texture only, never real digits */}
      <div className="absolute bottom-[24%] left-[8%] right-[8%] flex gap-2" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: 'color-mix(in srgb, var(--color-chrome) 45%, transparent)' }}
          />
        ))}
      </div>
      <div
        className="absolute bottom-[10%] left-[8%] w-1/2 h-1 rounded-full"
        style={{ background: 'color-mix(in srgb, var(--color-chrome) 30%, transparent)' }}
      />
    </div>
  );
}
