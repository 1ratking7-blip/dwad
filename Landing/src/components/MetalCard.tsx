import { useCardTilt } from '../lib/useTilt';

/**
 * Premium metallic bank card — generated photo per
 * design/prompts/02-metal-card.md, "slipping out" from under the Hero
 * glass panel next to the CTA. The generated photo is a diagonal
 * composition (no payment network marks, no real numbers/branding), so
 * the wrapper uses a portrait aspect matching it rather than a literal
 * landscape credit-card shape. Hover tilt via useCardTilt (.tilt-card in
 * index.css), looping diagonal shine via .card-shine-loop (not
 * hover-gated — the card is a static accent, not itself a CTA, so the
 * shine plays regardless of pointer type).
 */
export default function MetalCard() {
  const tiltRef = useCardTilt<HTMLDivElement>(10);

  return (
    <div
      ref={tiltRef}
      aria-hidden="true"
      className="tilt-card relative w-40 sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden"
      style={{
        '--tilt-base': '-13deg',
        boxShadow: '0 25px 50px -18px rgba(0,0,0,0.7)',
      } as React.CSSProperties}
    >
      <img
        src="/images/metal-card.webp"
        alt=""
        width={1024}
        height={1536}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Thin gold border accent on top of the photo */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-gold) 40%, transparent)' }}
      />

      {/* Looping diagonal shine sweep */}
      <div className="card-shine-loop" />
    </div>
  );
}
