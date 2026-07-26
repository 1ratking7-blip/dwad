
import { useEffect, useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocale } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';

const SHOW_AFTER_PX = 400;

/**
 * Thumb-reach CTA bar for small screens only (lg:hidden) — the header CTA is
 * easy to miss once a mobile visitor has scrolled past it. Hidden near the
 * footer (same pattern as SocialProof) so it doesn't sit on top of the
 * footer's own links/copyright. BackToTop is offset up on mobile (see its
 * bottom-24 class) to avoid overlapping this bar.
 */
export default function MobileStickyCta() {
  const { locale, t } = useLocale();
  const refLink = refLinkForLocale(locale);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible((v) => (entry.isIntersecting ? false : v)),
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-xl border-t border-[var(--color-border)] px-4 py-3"
          >
            <a
              href={refLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('cta_click', { location: 'mobile_sticky' })}
              className="btn-glow btn-metal shine-sweep chamfered w-full text-black py-3.5 font-black text-sm tracking-wide flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>{t.hero.ctaButton}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only"> {t.opensInNewWindow}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
