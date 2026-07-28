import { useEffect, useRef, useState } from 'react';

// Natural pixel size of /branding/logo-19.png after cropping — the wrapper's
// aspect-ratio is locked to this so the absolutely-positioned SVG overlay
// (viewBox 0 0 IMG_W IMG_H) lines up 1:1 with the image at any render size,
// with no letterboxing from object-fit: contain to throw off alignment.
const IMG_W = 408;
const IMG_H = 497;

// Hand-placed to trace the "1" stroke's zigzag silhouette in that source
// image (top spike → main diagonal → small kick → bottom spike). Approximate,
// not pixel-traced — the blur/glow on top makes a few px of drift invisible,
// and what matters per the brief is direction-matching, not a perfect mask.
const BOLT_PATH = 'M 158 6 L 58 185 L 128 205 L 42 480';
const BOLT_LENGTH = 620; // approx path length, used for the dash animation

const RING_CX = 288;
const RING_CY = 312;
const RING_RX = 118;
const RING_RY = 152;

const PULSE_MIN_MS = 2500;
const PULSE_MAX_MS = 3500;
const PULSE_ANIM_MS = 750;

interface AnimatedLogo19Props {
  variant: 'header' | 'hero';
  href?: string;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

/**
 * ZHELEZO "19" monogram — the 1 reads as a lightning bolt, the 9 as a glowing
 * ring. Animation is CSS/SVG only (no canvas/WebGL, no new dependency):
 * - a JS interval (randomized 2.5-3.5s, see PULSE_MIN/MAX_MS) toggles a
 *   `.pulsing` class that plays the dash-offset "current running down the
 *   bolt" animation + a short flicker + 4 spark flashes, all defined in
 *   index.css.
 * - the base bolt outline and ring are ALWAYS visibly drawn (steady glow) —
 *   the pulse is an extra brighter layer animated on top of that, not the
 *   only thing making the mark visible. That's what makes
 *   prefers-reduced-motion safe: disabling the pulse layer's animation still
 *   leaves a fully legible, softly-glowing mark, never a blank/mid-animation
 *   frame.
 * - hover plays one accelerated pulse via pure CSS (:hover triggering a
 *   one-shot child animation) — no extra JS state needed for that part.
 */
export default function AnimatedLogo19({ variant, href, ariaLabel, onClick, className = '' }: AnimatedLogo19Props) {
  const [pulsing, setPulsing] = useState(false);
  const timeoutRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function scheduleNext() {
      const delay = PULSE_MIN_MS + Math.random() * (PULSE_MAX_MS - PULSE_MIN_MS);
      timeoutRef.current = window.setTimeout(() => {
        setPulsing(true);
        window.setTimeout(() => setPulsing(false), PULSE_ANIM_MS + 350);
        scheduleNext();
      }, delay);
    }
    scheduleNext();

    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  const mark = (
    <span className={`alogo19-wrap alogo19-${variant} ${pulsing ? 'alogo19-pulsing' : ''} ${className}`}>
      <img
        src="/branding/logo-19.png"
        alt={ariaLabel ?? 'Zhelezo 19 — официальный логотип'}
        width={IMG_W}
        height={IMG_H}
        className="alogo19-img"
      />
      <svg
        className="alogo19-svg"
        viewBox={`0 0 ${IMG_W} ${IMG_H}`}
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <filter id="alogo19-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="alogo19-glow-soft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* Base bolt — always drawn, this is the "static soft glow" that
            reduced-motion falls back to. */}
        <path
          d={BOLT_PATH}
          className="alogo19-bolt-base"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#alogo19-glow-soft)"
        />

        {/* Traveling bright segment — invisible at rest (dash positioned off
            the path), only shows while .alogo19-pulsing / :hover run the
            dash-offset animation defined in index.css. */}
        <path
          d={BOLT_PATH}
          className="alogo19-bolt-pulse"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#alogo19-glow)"
          pathLength={BOLT_LENGTH}
        />

        {/* Secondary short flicker right after the main pulse — same path,
            a duller/shorter animation chained via animation-delay. */}
        <path
          d={BOLT_PATH}
          className="alogo19-bolt-flicker"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sparks near the top and bottom tips of the bolt. */}
        <g className="alogo19-sparks">
          <circle className="alogo19-spark alogo19-spark-1" cx="158" cy="6" r="3" />
          <circle className="alogo19-spark alogo19-spark-2" cx="172" cy="18" r="2" />
          <circle className="alogo19-spark alogo19-spark-3" cx="42" cy="480" r="3" />
          <circle className="alogo19-spark alogo19-spark-4" cx="28" cy="466" r="2" />
        </g>

        {/* Slow lime sheen sweeping around the 9's ring — a short bright arc
            (dasharray) endlessly traveling the ellipse, one lap every ~6s.
            Never covers the whole ring at once, so it reads as a moving
            metallic highlight, not a colored outline. */}
        <ellipse
          className="alogo19-ring-sheen"
          cx={RING_CX}
          cy={RING_CY}
          rx={RING_RX}
          ry={RING_RY}
          fill="none"
        />
      </svg>
    </span>
  );

  if (!href) return mark;

  return (
    <a href={href} aria-label={ariaLabel ?? 'Zhelezo 19 — официальный логотип'} onClick={onClick} data-cursor-glow>
      {mark}
    </a>
  );
}
