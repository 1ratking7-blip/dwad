/**
 * Floating cash/coins accent for the Hero — generated photo per
 * design/prompts/04-money-coins.md, drifting along the bottom-right
 * diagonal via the existing bill-drift-a keyframe (index.css). The
 * photo's near-black background matches the page background closely
 * enough to read as a soft cutout without a real alpha channel.
 * Purely decorative: aria-hidden.
 */
export default function FloatingWealth() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <img
        src="/images/money-coins.webp"
        alt=""
        width={1024}
        height={1024}
        decoding="async"
        className="bill-drift-a absolute w-56 sm:w-72 rounded-xl"
        style={{ top: '52%', left: '66%', opacity: 0.85 }}
      />
    </div>
  );
}
