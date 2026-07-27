import { useParallax } from '../lib/useParallax';

/**
 * Hero background layer — a stylized night-city skyline silhouette with
 * glowing windows, standing in for the "ночной город" photo brief
 * (design/prompts/03-night-city.md) until a real generated/stock image
 * replaces it. Pure SVG + CSS (no raster asset, no extra network request),
 * furthest-back layer in the Hero parallax stack (smallest useParallax
 * strength). Purely decorative: aria-hidden.
 */
const BUILDINGS = [
  { x: 0, w: 60, h: 180, windows: 14 },
  { x: 58, w: 40, h: 120, windows: 9 },
  { x: 96, w: 70, h: 230, windows: 18 },
  { x: 164, w: 46, h: 150, windows: 11 },
  { x: 208, w: 55, h: 260, windows: 20 },
  { x: 261, w: 38, h: 110, windows: 8 },
  { x: 297, w: 64, h: 200, windows: 16 },
  { x: 359, w: 42, h: 140, windows: 10 },
  { x: 399, w: 58, h: 245, windows: 19 },
  { x: 455, w: 45, h: 165, windows: 12 },
] as const;

function windowRects(building: (typeof BUILDINGS)[number], seed: number) {
  const rects = [];
  const cols = 3;
  const rows = Math.max(3, Math.floor(building.windows / cols));
  const padX = building.w * 0.15;
  const padY = 10;
  const cellW = (building.w - padX * 2) / cols;
  const cellH = (building.h - padY * 2) / rows;
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      i++;
      // Deterministic pseudo-random lit/unlit + delay from indices, not Math.random(),
      // so the skyline doesn't reshuffle on every re-render.
      const lit = (seed * 7 + r * 3 + c * 5) % 4 !== 0;
      if (!lit) continue;
      const delay = ((seed + r + c) % 7) * 0.6;
      rects.push(
        <rect
          key={i}
          className="skyline-window"
          x={padX + c * cellW}
          y={padY + r * cellH}
          width={cellW * 0.55}
          height={cellH * 0.45}
          fill="var(--color-gold)"
          style={{ animationDelay: `${delay}s` }}
        />
      );
    }
  }
  return rects;
}

export default function NightSkyline() {
  const parallaxRef = useParallax<HTMLDivElement>(6);
  const width = 520;
  const height = 280;

  return (
    // Fixed-height band anchored to the top of Hero — deliberately NOT `inset-0`:
    // the <section> this lives in is as tall as all of its content (H1, CTA, stats
    // grid below), and stretching a `preserveAspectRatio="slice"` SVG to cover that
    // whole (often 1000px+) height blows the window rects up into huge vertical
    // streaks that fight the H1 for attention (found via screenshot QA — see
    // Skyline QA note in CHANGELOG). A bounded band keeps the scale sane; the
    // ground-haze gradient below fades it into the section background either way.
    <div
      ref={parallaxRef}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-screen max-h-[820px] overflow-hidden pointer-events-none"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 w-full h-full opacity-70"
      >
        <defs>
          <linearGradient id="skyline-fade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--color-bg-darker)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-graphite)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {BUILDINGS.map((b, i) => (
          <g key={i} transform={`translate(${b.x}, ${height - b.h})`}>
            <rect width={b.w} height={b.h} fill="url(#skyline-fade)" />
            {windowRects(b, i + 1)}
          </g>
        ))}
      </svg>
      {/* Ground haze — a soft gradient the skyline silhouette sits in, blending into the section background. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--color-bg) 90%)',
        }}
      />
    </div>
  );
}
