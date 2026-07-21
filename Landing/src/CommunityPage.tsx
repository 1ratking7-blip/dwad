import { lazy, Suspense, useEffect } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import Header from './components/Header';
import BackToTop from './components/BackToTop';
import AnimatedBackground from './components/AnimatedBackground';
import FollowMe from './components/FollowMe';
import Crystal from './components/Crystal';
import { trackEvent } from './lib/analytics';
import { useLocale } from './i18n/LocaleContext';

const Footer = lazy(() => import('./components/Footer'));

/**
 * A genuinely separate page (own static HTML entry per locale — see
 * community.ru.tsx/community.en.tsx/community.vi.tsx and
 * community/index.html + community/en/ + community/vi/), not an anchor
 * section on the homepage. The user was explicit: social links don't
 * belong at the bottom of the main page, they get their own full page in
 * the same premium visual language.
 */
export default function CommunityPage() {
  const { locale, t } = useLocale();

  useEffect(() => {
    trackEvent('page_view', { locale, page: 'community' });
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7 }}
              className="relative text-center mb-16"
            >
              <Crystal />
              <h1 className="metal-text text-5xl md:text-7xl font-black tracking-tighter mb-6">
                {t.community.heading}
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t.community.subtitle}</p>
            </motion.div>

            <h2 className="text-center text-sm font-bold uppercase tracking-[0.3em] text-gray-500 mb-8">
              {t.community.channelsHeading}
            </h2>
            <FollowMe />
          </div>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </MotionConfig>
  );
}
