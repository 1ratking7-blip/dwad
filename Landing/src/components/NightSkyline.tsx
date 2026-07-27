import { useParallax } from '../lib/useParallax';

/**
 * Hero background layer — generated night-city photo per
 * design/prompts/03-night-city.md. Furthest-back layer in the Hero
 * parallax stack (smallest useParallax strength). Purely decorative:
 * aria-hidden.
 */
export default function NightSkyline() {
  const parallaxRef = useParallax<HTMLDivElement>(6);

  return (
    // Fixed-height band anchored to the top of Hero — deliberately NOT `inset-0`:
    // the <section> this lives in is as tall as all of its content (H1, CTA, stats
    // grid below), and stretching the image to cover that whole (often 1000px+)
    // height would force an extreme crop. A bounded band keeps the scale sane; the
    // ground-haze gradient below fades it into the section background either way.
    <div
      ref={parallaxRef}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-screen max-h-[820px] overflow-hidden pointer-events-none"
    >
      <img
        src="/images/night-city.webp"
        alt=""
        width={1536}
        height={1024}
        decoding="async"
        className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom opacity-70"
      />
      {/* Ground haze — a soft gradient the skyline sits in, blending into the section background. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--color-bg) 90%)',
        }}
      />
    </div>
  );
}
