import { useEffect, useState } from 'react';
import { Menu, X, Coins } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocale } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';
import { useMagnetic } from '../lib/useMagnetic';
import LanguageSwitcher from './LanguageSwitcher';

const SCROLL_THRESHOLD_PX = 24;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, t } = useLocale();
  const refLink = refLinkForLocale(locale);
  const magneticCta = useMagnetic<HTMLAnchorElement>(0.2);
  const homeHref = locale === 'ru' ? '/' : `/${locale}/`;
  const communityHref = locale === 'ru' ? '/community/' : `/community/${locale}/`;

  // Minimal/transparent at the very top of the page, more opaque + more blur
  // once scrolled — the brief explicitly asked for opacity to change on scroll
  // rather than staying static.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? 'bg-[color-mix(in_srgb,var(--color-bg)_88%,transparent)] backdrop-blur-xl border-[var(--color-border)]'
          : 'bg-[color-mix(in_srgb,var(--color-bg)_35%,transparent)] backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={homeHref} aria-label={t.header.logoAria} className="flex items-center space-x-3">
            <div className="bg-[var(--color-accent)] p-2 rounded-lg text-black font-extrabold flex items-center justify-center">
              <span className="text-xl" aria-hidden="true">⚡</span>
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-widest bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
              ZHELEZO
            </span>
          </a>

          {/* Desktop Nav — minimal by design: Home / Community / the big Play Now CTA. */}
          <nav className="hidden lg:flex items-center space-x-10 text-sm font-semibold tracking-wide text-gray-300">
            <a href={homeHref} className="hover:text-[var(--color-accent)] transition-colors">{t.header.navHome}</a>
            <a href={communityHref} className="hover:text-[var(--color-accent)] transition-colors">{t.header.navCommunity}</a>
          </nav>

          {/* Desktop CTA — the single main CTA of the whole site, per the brief: chamfered
              metal button, neon glow, magnetic hover, gentle idle pulse. */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            <a
              ref={magneticCta}
              href={refLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('cta_click', { location: 'header_desktop' })}
              className="btn-glow btn-metal shine-sweep chamfered nav-pulse text-black px-7 py-3 font-black text-sm tracking-wide flex items-center space-x-2"
            >
              <Coins className="w-4 h-4" aria-hidden="true" />
              <span>{t.header.ctaPlayNow}</span>
              <span className="sr-only"> {t.opensInNewWindow}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? t.header.menuClose : t.header.menuOpen}
              className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg p-2"
            >
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div id="mobile-nav" className="lg:hidden bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-semibold text-gray-300">
            <a
              href={homeHref}
              onClick={() => setIsOpen(false)}
              className="hover:text-[var(--color-accent)] py-2 border-b border-[color-mix(in_srgb,var(--color-border)_50%,transparent)] transition-colors"
            >
              {t.header.navHome}
            </a>
            <a
              href={communityHref}
              onClick={() => setIsOpen(false)}
              className="hover:text-[var(--color-accent)] py-2 border-b border-[color-mix(in_srgb,var(--color-border)_50%,transparent)] transition-colors"
            >
              {t.header.navCommunity}
            </a>
          </nav>
          <a
            href={refLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { location: 'header_mobile' })}
            className="btn-glow btn-metal shine-sweep chamfered nav-pulse w-full text-center block text-black py-3 font-black text-sm tracking-wide"
          >
            {t.header.mobileCta}
            <span className="sr-only"> {t.opensInNewWindow}</span>
          </a>
        </div>
      )}
    </header>
  );
}
