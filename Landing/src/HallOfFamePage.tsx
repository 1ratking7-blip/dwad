import { lazy, Suspense, useEffect } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { Coins, Sparkles, Zap, Gauge, Banknote, Trophy } from 'lucide-react';
import Header from './components/Header';
import BackToTop from './components/BackToTop';
import AnimatedBackground from './components/AnimatedBackground';
import CornerBrackets from './components/CornerBrackets';
import { trackEvent } from './lib/analytics';
import { useLocale } from './i18n/LocaleContext';

const Footer = lazy(() => import('./components/Footer'));

const HUNT_ICONS = [Coins, Sparkles, Zap, Gauge, Banknote];

/**
 * A genuinely separate page (own static HTML entry per locale — see
 * hallOfFame.ru.tsx/en.tsx/vi.tsx and hall-of-fame/index.html + en/ + vi/),
 * same pattern as CommunityPage.tsx. Growth page for the easter-egg hunt
 * added 2026-07-27: lists what to look for (hints, not full spoilers) and
 * how to get listed. The list itself starts genuinely empty — no fabricated
 * entries — real submissions get added here by hand later (see
 * Память/sessions for the process), matching this project's rule against
 * any invented social proof (GEMINI.md §8).
 */
export default function HallOfFamePage() {
  const { locale, t } = useLocale();
  const communityHref = locale === 'ru' ? '/community/' : `/community/${locale}/`;

  useEffect(() => {
    trackEvent('page_view', { locale, page: 'hall_of_fame' });
  }, [locale]);

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
      <div className="min-h-screen relative z-10">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-accent)] focus:text-black focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg"
        >
          {t.skipToContent}
        </a>
        <Header />
        <BackToTop />
        <main id="main-content" tabIndex={-1} className="pt-40 pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--color-border)] border border-[var(--color-border-soft)] text-[var(--color-accent)] text-xs font-bold tracking-widest uppercase mb-6">
                <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.hallOfFame.badge}</span>
              </span>
              <h1 className="metal-text text-5xl md:text-7xl font-black tracking-tighter mb-6">
                {t.hallOfFame.heading}
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t.hallOfFame.subtitle}</p>
            </motion.div>

            <h2 className="text-center text-sm font-bold uppercase tracking-[0.3em] text-gray-500 mb-8">
              {t.hallOfFame.huntHeading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
              {t.hallOfFame.hunts.map((hunt, i) => {
                const Icon = HUNT_ICONS[i % HUNT_ICONS.length];
                return (
                  <motion.div
                    key={hunt.title}
                    initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="relative"
                  >
                    <div className="hud-panel chamfered p-6 flex items-start space-x-4 h-full">
                      <div className="btn-metal chamfered-sm w-11 h-11 flex items-center justify-center text-black shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold mb-1">{hunt.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{hunt.hint}</p>
                      </div>
                    </div>
                    <CornerBrackets />
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="relative mb-16"
            >
              <div className="hud-panel chamfered p-10 text-center">
                <p className="text-white font-bold text-lg mb-2">{t.hallOfFame.emptyStateTitle}</p>
                <p className="text-gray-400 text-sm max-w-md mx-auto">{t.hallOfFame.emptyStateDesc}</p>
              </div>
              <CornerBrackets />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
                {t.hallOfFame.submitHeading}
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8">{t.hallOfFame.submitDesc}</p>
              <a
                href={communityHref}
                onClick={() => trackEvent('cta_click', { location: 'hall_of_fame_submit' })}
                className="btn-glow btn-premium shine-sweep chamfered inline-flex items-center px-8 py-4 font-black text-sm tracking-wide"
              >
                {t.hallOfFame.submitCta}
              </a>
              <p className="text-gray-500 text-xs mt-6 max-w-md mx-auto">{t.hallOfFame.rulesNote}</p>
            </motion.div>
          </div>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </MotionConfig>
  );
}
