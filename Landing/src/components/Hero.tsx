
import { Rocket, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocation } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';
import { useMagnetic } from '../lib/useMagnetic';
import { useParallax } from '../lib/useParallax';
import { useCardTilt } from '../lib/useTilt';
import AnimatedCounter from './AnimatedCounter';
import LuxuryCar from './LuxuryCar';
import NightSkyline from './NightSkyline';
import FloatingWealth from './FloatingWealth';
import CornerBrackets from './CornerBrackets';

const CTA_PULSE_MS = 550;

function HeroStatCard({ label, value, sub, extra }: { label: string; value: string; sub: string; extra: string }) {
  // useCardTilt already no-ops under prefers-reduced-motion and on
  // touch-only devices (see lib/useTilt.ts), so the "no 3D on mobile"
  // requirement is satisfied by the hook itself, not a separate check here.
  const tiltRef = useCardTilt<HTMLDivElement>(5);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative"
    >
      <div
        ref={tiltRef}
        className="tilt-card card-shine hud-panel chamfered p-8 text-center hover:shadow-[0_0_25px_color-mix(in_srgb,var(--color-accent)_14%,transparent)] transition-shadow duration-300 group overflow-hidden"
      >
        <div className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-[var(--color-accent)] transition-colors">{label}</div>
        <div className="text-3xl font-black text-[var(--color-text)] mb-1">
          <AnimatedCounter value={value} />
        </div>
        <div className="text-[var(--color-text-secondary)] text-sm">{sub}</div>
        {/* Short extra description — revealed on hover/focus, height-animated
            rather than just opacity so it doesn't leave dead empty space
            in the resting card (brief §5). */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out mt-0">
          <div className="overflow-hidden">
            <p className="text-xs text-[var(--color-text-muted)] pt-3 border-t border-[var(--color-border-thin)] mt-3 leading-relaxed">
              {extra}
            </p>
          </div>
        </div>
      </div>
      <CornerBrackets />
    </motion.div>
  );
}

export default function Hero() {
  const { locale, t } = useLocale();
  const refLink = refLinkForLocation(locale, 'hero');
  const magneticCta = useMagnetic<HTMLAnchorElement>(0.25);
  // Brief: the car should stay "practically still" under parallax — a much
  // smaller strength than the money particles get.
  const carParallax = useParallax<HTMLDivElement>(3);

  const stats = [
    { label: t.hero.statDailyLabel, value: t.hero.statDailyValue, sub: t.hero.statDailySub, extra: t.heroCards.dailyExtra },
    { label: t.hero.statCryptoLabel, value: t.hero.statCryptoValue, sub: t.hero.statCryptoSub, extra: t.heroCards.cryptoExtra },
    { label: t.hero.statRakebackLabel, value: t.hero.statRakebackValue, sub: t.hero.statRakebackSub, extra: t.heroCards.rakebackExtra },
  ];

  // Click pulse — a short neon-impulse class toggled directly via ref (no
  // re-render needed). Deliberately does NOT preventDefault/delay the
  // anchor's own navigation: the browser opens the referral link immediately
  // as normal, the pulse just plays out visually in this tab regardless, so
  // reduced-motion or the animation failing to fire never blocks the link.
  function handleCtaClick(e: React.MouseEvent<HTMLAnchorElement>) {
    trackEvent('cta_click', { location: 'hero' });
    const el = e.currentTarget;
    el.classList.remove('cta-pulse');
    // Force reflow so re-adding the class restarts the animation on rapid re-clicks.
    void el.offsetWidth;
    el.classList.add('cta-pulse');
    window.setTimeout(() => el.classList.remove('cta-pulse'), CTA_PULSE_MS);
  }

  return (
    <section id="hero" className="relative pt-32 pb-20 overflow-hidden">
      {/* Night-city backdrop — furthest-back layer, see design/prompts/03-night-city.md */}
      <NightSkyline />
      <div className="luxury-vignette" />

      {/* pointer-events-none here, not on <section> itself: this box has no
          explicit z-index, so simply being a later DOM sibling of
          NightSkyline/vignette makes it paint on top of their *entire*
          bounding box — including the empty space around the decorative
          window-lights/lightning easter egg nested inside NightSkyline —
          and would swallow clicks meant for them even though it has no
          visible content there. Each actually-interactive island below
          (the car, the text/CTA block, the stat cards) re-enables
          pointer-events explicitly. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pointer-events-none">
        {/* Background Glows — emerald + gold, both driven by theme CSS variables */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[color-mix(in_srgb,var(--color-accent-2)_10%,transparent)] blur-[120px] rounded-full"></div>
          <div className="absolute top-[30%] right-[5%] w-[25%] h-[25%] bg-[color-mix(in_srgb,var(--color-gold)_8%,transparent)] blur-[100px] rounded-full"></div>
        </div>

        {/* Car — embedded directly in the scene (wet asphalt + skyline behind
            it, mask-faded edges), not a boxed/collaged element. Hidden below
            `md` together with the text switching to left-aligned, so it never
            has room to collide with the H1/CTA on tablet-narrow widths. */}
        <div
          ref={carParallax}
          className="hidden lg:block absolute right-0 bottom-0 w-[48%] xl:w-[44%] max-w-[640px] h-[70%] max-h-[420px] z-[5] pointer-events-auto"
        >
          <LuxuryCar />
        </div>

        {/* Flying designer banknotes/coins — layered depth, kept out of the
            left safe zone (see FloatingWealth.tsx LAYER_RANGES). */}
        <FloatingWealth />

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7 }}
          className="relative z-20 text-center md:text-left max-w-[620px] mx-auto md:mx-0 pointer-events-auto"
        >
            {/* Responsive font-size/tracking, not a fixed text-xs tracking-widest: at
                narrow phone widths this badge's uppercase Cyrillic text was wide enough
                to overflow the 390px viewport (found via mobile screenshot QA).
                Near-black bg + thin emerald border + reduced glow (premium cinematic
                hero brief, п.15) instead of the louder --color-border fill. */}
            <span
              className="inline-flex items-center space-x-2 px-5 py-1.5 rounded-full text-[var(--color-accent)] text-[10px] sm:text-xs font-bold tracking-normal sm:tracking-widest uppercase mb-8 max-w-[92vw]"
              style={{
                background: 'color-mix(in srgb, var(--color-bg) 85%, black)',
                border: '1px solid var(--color-border-emerald)',
                boxShadow: '0 0 14px color-mix(in srgb, var(--color-accent) 12%, transparent)',
              }}
            >
              <Zap className="w-3 h-3 fill-current shrink-0" />
              <span>{t.hero.badge}</span>
            </span>

            {/* Two block-level lines (not one flow joined by a literal <br/>) so
                `text-wrap: balance` gets its own context per phrase — with a
                single <br/>-joined flow, Chromium balances across the whole
                H1 and can still leave a short orphan word on one of the two
                lines (found via EN screenshot QA: "YOUR GATEWAY" / "TO"). */}
            <h1 className="text-[clamp(2.5rem,1.35rem+4vw,5.5rem)] font-black tracking-tighter mb-6 leading-[1.05]">
              <div className="gold-text [text-wrap:balance]">{t.hero.h1Line1}</div>
              <div className="emerald-text [text-wrap:balance]">{t.hero.h1Line2}</div>
            </h1>

            <p className="text-base md:text-lg text-[var(--color-text-secondary)] mb-10 leading-[1.55] max-w-[600px] mx-auto md:mx-0">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                ref={magneticCta}
                href={refLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                data-cursor-glow
                className="group btn-glow btn-premium shine-sweep chamfered w-full sm:w-auto px-10 py-5 font-black text-lg tracking-wide flex items-center justify-center space-x-3 relative"
              >
                {/* Hover-burst sparks — pure CSS, paused by default, played
                    via .group:hover so no extra JS state is needed. */}
                <span aria-hidden="true" className="cta-spark" style={{ '--spark-x': '-14px', '--spark-y': '-22px', '--spark-delay': '0s' } as React.CSSProperties} />
                <span aria-hidden="true" className="cta-spark" style={{ '--spark-x': '20px', '--spark-y': '-18px', '--spark-delay': '0.08s' } as React.CSSProperties} />
                <span aria-hidden="true" className="cta-spark" style={{ '--spark-x': '-6px', '--spark-y': '24px', '--spark-delay': '0.16s' } as React.CSSProperties} />
                <span aria-hidden="true" className="cta-spark" style={{ '--spark-x': '26px', '--spark-y': '20px', '--spark-delay': '0.05s' } as React.CSSProperties} />
                <span>{t.hero.ctaButton}</span>
                <ArrowRight className="w-5 h-5 text-[var(--color-accent)] transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true" />
                <span className="sr-only"> {t.opensInNewWindow}</span>
              </a>

              {/* flex-wrap + gap (not space-x, which only works single-row) — this row
                  of 3 items + 2 dot separators was wide enough to overflow narrow
                  phones without wrapping (found via mobile screenshot QA). */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-[var(--color-text-secondary)] font-medium text-sm">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  <span>{t.hero.noKyc}</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <div className="flex items-center space-x-1.5">
                  <Rocket className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  <span>{t.hero.instantPayouts}</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <span className="text-xs">{t.hero.ageGate}</span>
              </div>
            </div>
        </motion.div>

        {/* Stats Grid — premium dark cards (brief §16): near-black bg, thin
            border, local emerald glow only on hover, no permanent glow. */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 pointer-events-auto"
        >
          {stats.map((stat, i) => (
            <HeroStatCard key={i} label={stat.label} value={stat.value} sub={stat.sub} extra={stat.extra} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
