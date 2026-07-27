import { useRef, useState } from 'react';
import { useTilt } from '../lib/useTilt';
import { useLocale } from '../i18n/LocaleContext';
import { emitEgg } from '../lib/eggBus';
import { unlockAchievement, pushCustomToast } from '../lib/useAchievements';
import { trackEvent } from '../lib/analytics';

/** Easter egg #4 — click the headlights left → right → left → right. */
const HEADLIGHT_SEQUENCE = ['left', 'right', 'left', 'right'] as const;
const SEQUENCE_TIMEOUT_MS = 3500;

/**
 * Hero's visual anchor — generated photo per design/prompts/01-hero-car.md
 * (generic unbranded sports car, no make/model/badges). Reworked for the
 * "interactive & alive" pass (2026-07-27, third redesign) to react to the
 * cursor: on hover, contrast/brightness lift slightly, a soft headlight
 * glow fades in over the photo's approximate headlight position, the
 * contact-shadow/reflection intensifies, and a soft smoke-puff behind the
 * car grows — all via CSS transitions on hover state, no continuous rAF
 * loop needed since it's a discrete hover on/off, not a per-frame effect.
 * The mask-image dissolving the photo's rectangle into the scene (brief
 * §3-4 of the previous redesign — no visible card/frame around the car) is
 * unchanged. Purely decorative aria-hidden, except for the two small
 * headlight hotspots, which are real buttons for easter egg #4.
 */
export default function LuxuryCar() {
  const tiltRef = useTilt<HTMLDivElement>(3);
  const { t } = useLocale();
  const [hovering, setHovering] = useState(false);
  const [started, setStarted] = useState(false);
  const sequenceRef = useRef<string[]>([]);
  const sequenceTimer = useRef(0);

  function handleHeadlightClick(side: 'left' | 'right') {
    window.clearTimeout(sequenceTimer.current);
    sequenceRef.current = [...sequenceRef.current, side].slice(-HEADLIGHT_SEQUENCE.length);
    const matches = sequenceRef.current.every((v, i) => v === HEADLIGHT_SEQUENCE[i]);
    if (!matches) {
      sequenceRef.current = [];
      return;
    }
    if (sequenceRef.current.length === HEADLIGHT_SEQUENCE.length) {
      sequenceRef.current = [];
      setStarted(true);
      window.setTimeout(() => setStarted(false), 1800);
      pushCustomToast(t.easterEggs.engineStartedTitle, t.easterEggs.engineStartedDesc);
      unlockAchievement('secret_found', t.achievements.secretFoundTitle, t.achievements.secretFoundDesc);
      emitEgg('engine-started', { source: 'headlights' });
      trackEvent('easter_egg', { id: 'engine_started' });
      return;
    }
    sequenceTimer.current = window.setTimeout(() => {
      sequenceRef.current = [];
    }, SEQUENCE_TIMEOUT_MS);
  }

  return (
    <div
      ref={tiltRef}
      className="relative w-full h-full float-y"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Smoke puff behind the car — grows on hover */}
      <div
        aria-hidden="true"
        className="absolute right-[8%] bottom-[22%] w-[55%] h-[40%] rounded-full blur-3xl transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse, color-mix(in srgb, var(--color-chrome) 30%, transparent), transparent 75%)',
          opacity: hovering || started ? 0.55 : 0.22,
        }}
      />

      {/* Contact shadow + ground glow — neutral dark core so it grounds the
          car rather than just adding more color; brightens slightly on hover. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[80%] h-8 rounded-full blur-2xl transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(ellipse, rgba(0,0,0,0.75), color-mix(in srgb, var(--color-accent-dark) 30%, transparent) 55%, transparent 80%)',
          opacity: hovering || started ? 1 : 0.85,
        }}
      />

      <img
        src="/images/hero-car.webp"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        decoding="async"
        className="absolute bottom-0 right-0 w-full h-auto max-h-full object-contain object-bottom transition-[filter] duration-500"
        style={{
          filter: `drop-shadow(0 18px 22px rgba(0,0,0,0.55)) drop-shadow(0 0 ${hovering || started ? 30 : 20}px color-mix(in srgb, var(--color-accent) ${hovering || started ? 32 : 22}%, transparent)) brightness(${hovering || started ? 1.04 : 0.94}) contrast(${hovering || started ? 1.08 : 1}) saturate(0.9)`,
          maskImage:
            'radial-gradient(ellipse 78% 82% at 62% 62%, black 48%, rgba(0,0,0,0.75) 68%, transparent 96%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 78% 82% at 62% 62%, black 48%, rgba(0,0,0,0.75) 68%, transparent 96%)',
        }}
      />

      {/* Headlight glow — fades in on hover/engine-started, approximate
          position over the photo's front-left headlight cluster. */}
      <div
        aria-hidden="true"
        className={`absolute rounded-full blur-md transition-opacity duration-300 ${started ? 'headlight-blink' : ''}`}
        style={{
          left: '38%',
          bottom: '30%',
          width: '9%',
          height: '9%',
          background: 'radial-gradient(circle, #fff8e0, #ffd98a 60%, transparent 80%)',
          opacity: started ? undefined : hovering ? 0.9 : 0,
        }}
      />

      {/* Easter egg #4 hotspots — approximate headlight positions on the
          photo. Small, low-contrast, discoverable rather than obvious;
          never block the tilt/hover interaction on the rest of the car. */}
      <button
        type="button"
        aria-label={t.easterEggs.headlightButtonAria}
        onClick={() => handleHeadlightClick('left')}
        className="absolute w-[7%] h-[7%] rounded-full opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
        style={{ left: '36%', bottom: '31%' }}
      />
      <button
        type="button"
        aria-label={t.easterEggs.headlightButtonAria}
        onClick={() => handleHeadlightClick('right')}
        className="absolute w-[6%] h-[6%] rounded-full opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
        style={{ left: '58%', bottom: '38%' }}
      />
    </div>
  );
}
