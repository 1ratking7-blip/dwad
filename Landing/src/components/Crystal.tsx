/**
 * Abstract faceted "crystal/gem" decoration for the Community page — the
 * honest stand-in for the "expensive CGI crystal/diamond" ask. No image
 * generation tool is available in this environment, so this is a CSS-only
 * geometric facet built from clip-path polygons + gradients, not a
 * photorealistic render. Used once, small, behind the heading — "moderate"
 * per the brief, not a centerpiece. Purely decorative: aria-hidden.
 */
export default function Crystal() {
  return (
    <div aria-hidden="true" className="absolute -z-10 top-8 right-4 sm:right-12 w-28 h-32 opacity-70 float-y pointer-events-none">
      <div
        className="w-full h-full"
        style={{
          clipPath: 'polygon(50% 0%, 90% 30%, 75% 100%, 25% 100%, 10% 30%)',
          background:
            'linear-gradient(160deg, var(--color-chrome) 0%, var(--color-accent) 35%, var(--color-accent-2) 55%, var(--color-steel) 75%, var(--color-titanium) 100%)',
          filter: 'drop-shadow(0 0 22px color-mix(in srgb, var(--color-accent) 45%, transparent))',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(50% 0%, 90% 30%, 50% 45%, 10% 30%)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.55), transparent)',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
