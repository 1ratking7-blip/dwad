
import { lazy, Suspense, useEffect } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import UrgencyTimer from './components/UrgencyTimer';
import AnimatedBackground from './components/AnimatedBackground';
import BackToTop from './components/BackToTop';
import SectionDivider from './components/SectionDivider';
import CornerBrackets from './components/CornerBrackets';
import { trackEvent } from './lib/analytics';
import { refLinkForLocale } from './lib/links';
import { useLocale } from './i18n/LocaleContext';
import { useMagnetic } from './lib/useMagnetic';

// Below-the-fold sections split out of the initial bundle so the browser has
// less JS to parse/execute before the Hero (LCP element) can paint.
const LuckyWheel = lazy(() => import('./components/LuckyWheel'));
const Games = lazy(() => import('./components/Games'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  const { locale, t } = useLocale();
  const refLink = refLinkForLocale(locale);
  const magneticBonusCta = useMagnetic<HTMLAnchorElement>(0.2);

  useEffect(() => {
    trackEvent('page_view', { locale });
  }, [locale]);

  // Preloader lives in index.html (pure CSS, no bundle cost) so it's visible
  // immediately on HTML parse. Dismissing it here — the first effect to run
  // after the initial commit — means it only fills the pre-existing gap
  // before React mounts rather than adding any new delay.
  useEffect(() => {
    const el = document.getElementById('preloader');
    if (!el) return;
    el.classList.add('preloader-hidden');
    const timeout = window.setTimeout(() => el.remove(), 300);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatedBackground />
      <div className="noise-overlay" aria-hidden="true" />
      {/* No solid background here on purpose — body's own bg-color (index.css) is the
          fallback base layer, AnimatedBackground paints on top of it, and this wrapper
          stays transparent so the canvas is actually visible through it. Individual
          sections below control their own opacity (solid where text needs full
          contrast, transparent where the moving background should show through). */}
      <div className="min-h-screen relative z-10">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-accent)] focus:text-black focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg"
        >
          {t.skipToContent}
        </a>
        <Header />
        <SocialProof />
        <BackToTop />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <SectionDivider />
          <Suspense fallback={null}>
            <LuckyWheel />
            <SectionDivider />
            <Games />
            {/* Bonus Section (CTA) */}
            <section id="bonuses" className="py-24 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)] blur-[120px] rounded-full pointer-events-none"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6 }}
                  className="gradient-border chamfered backdrop-blur-2xl p-12 md:p-20 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8">
                    <div className="text-[120px] font-black text-white/5 select-none leading-none">360%</div>
                  </div>

                  <h2 className="text-3xl md:text-6xl font-black mb-8 text-white tracking-tight">
                    {t.bonusSection.h2Line1} <br />
                    <span className="text-[var(--color-accent)]">{t.bonusSection.h2Line2}</span>
                  </h2>
                  <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                    {t.bonusSection.description}
                  </p>

                  <a
                    ref={magneticBonusCta}
                    href={refLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('cta_click', { location: 'bonus_section' })}
                    className="btn-glow btn-metal shine-sweep chamfered inline-flex items-center space-x-3 text-black px-12 py-6 font-black text-xl tracking-wide shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]"
                  >
                    <span>{t.bonusSection.ctaLabel} <UrgencyTimer />{t.bonusSection.remainingLabel}</span>
                    <span className="sr-only"> {t.opensInNewWindow}</span>
                  </a>
                  <p className="text-gray-400 text-xs mt-4">{t.bonusSection.disclaimer}</p>
                </motion.div>
                <CornerBrackets />
              </div>
            </section>

            <SectionDivider />
            <HowItWorks />
            <SectionDivider />
            <FAQ />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </MotionConfig>
  );
}

export default App;
