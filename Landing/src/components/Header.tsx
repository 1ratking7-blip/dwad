import { useEffect, useRef, useState } from 'react';
import { Menu, X, Coins } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocation } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';
import { useMagnetic } from '../lib/useMagnetic';
import { useActiveSection } from '../lib/useActiveSection';
import { emitEgg } from '../lib/eggBus';
import { unlockAchievement } from '../lib/useAchievements';
import LanguageSwitcher from './LanguageSwitcher';

const SCROLL_THRESHOLD_PX = 24;
const NAV_SECTION_IDS = ['hero', 'mission'];
const LOGO_EGG_CLICKS = 5;
const LOGO_EGG_WINDOW_MS = 2000;
const LOGO_GOLD_MS = 4000;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoGold, setLogoGold] = useState(false);
  const [logoSpark, setLogoSpark] = useState(false);
  const { locale, t } = useLocale();
  const desktopRefLink = refLinkForLocation(locale, 'header_desktop');
  const mobileRefLink = refLinkForLocation(locale, 'header_mobile');
  const magneticCta = useMagnetic<HTMLAnchorElement>(0.2);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const logoClicksRef = useRef<number[]>([]);
  const logoNavTimerRef = useRef(0);
  const homeHref = locale === 'ru' ? '/' : `/${locale}/`;
  const communityHref = locale === 'ru' ? '/community/' : `/community/${locale}/`;
  // Mission is a section on the home page (id="mission"), not its own route —
  // the hash works whether the link is clicked from the home page itself or
  // from another page like /community/.
  const missionHref = `${homeHref}#mission`;
  const activeSection = useActiveSection(NAV_SECTION_IDS);
  const onCommunityPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/community');

  // Easter egg #1: 5 rapid logo clicks trigger a ~4s money storm and turn
  // the logo gold. The anchor's real navigation would otherwise fire (and
  // full-page-reload, resetting the click counter) on click #1 already —
  // since this is a plain <a>, not a client-side router link — so every
  // click is held back briefly; if a 5th click doesn't arrive in time, it
  // navigates home just like a normal click would, only ~350ms later.
  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.clearTimeout(logoNavTimerRef.current);

    const now = Date.now();
    logoClicksRef.current = [...logoClicksRef.current, now].filter((t0) => now - t0 < LOGO_EGG_WINDOW_MS);

    if (logoClicksRef.current.length >= LOGO_EGG_CLICKS) {
      logoClicksRef.current = [];
      setLogoGold(true);
      window.setTimeout(() => setLogoGold(false), LOGO_GOLD_MS);
      emitEgg('money-storm', { source: 'logo' });
      unlockAchievement('secret_found', t.achievements.secretFoundTitle, t.achievements.secretFoundDesc);
      trackEvent('easter_egg', { id: 'money_storm' });
      return;
    }

    logoNavTimerRef.current = window.setTimeout(() => {
      logoClicksRef.current = [];
      if (window.location.pathname === homeHref) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = homeHref;
      }
    }, 350);
  }

  // Escape-to-close, same convention as LanguageSwitcher — a keyboard user who
  // opened the mobile nav shouldn't have to tab all the way through its links
  // just to dismiss it.
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

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

  // The logo's continuous "breathing" glow (CSS-only, see .logo-bolt-icon in index.css)
  // already reads as animated; this adds an occasional brighter "spark" on top so it feels
  // genuinely electric rather than a fixed pulse. Randomized (not every tick) so it doesn't
  // read as a metronome. Skips entirely under prefers-reduced-motion — the CSS side already
  // disables the continuous animation too, this just avoids running a pointless timer.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      if (Math.random() < 0.5) {
        setLogoSpark(true);
        window.setTimeout(() => setLogoSpark(false), 700);
      }
    }, 4500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? 'nav-glass-scrolled border-[var(--color-border-thin)]'
          : 'nav-glass-top border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href={homeHref}
            aria-label={t.header.logoAria}
            onClick={handleLogoClick}
            className="flex items-center space-x-3"
            data-cursor-glow
          >
            <span
              className={`logo-bolt-icon ${logoGold ? 'logo-bolt-gold' : ''} ${logoSpark ? 'logo-bolt-spark' : ''}`}
            >
              <img
                src="/logo-icon.png"
                alt=""
                width={40}
                height={40}
                className="w-9 h-9 sm:w-10 sm:h-10"
              />
            </span>
            <span
              className={`logo-wordmark text-lg sm:text-xl font-bold tracking-[0.15em] bg-clip-text text-transparent transition-[background-image] duration-500 ${
                logoGold
                  ? 'logo-wordmark-gold bg-gradient-to-r from-[var(--color-gold-light)] to-[var(--color-gold)]'
                  : 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]'
              } ${logoSpark ? 'logo-wordmark-spark' : ''}`}
            >
              ZHELEZO
            </span>
          </a>

          {/* Desktop Nav — minimal by design: Home / Mission / Community / the big Play Now CTA. */}
          <nav className="hidden lg:flex items-center space-x-10 text-sm font-semibold tracking-wide text-gray-300">
            <a href={homeHref} className={`nav-link ${activeSection === 'hero' && !onCommunityPage ? 'nav-link-active' : ''}`}>{t.header.navHome}</a>
            <a href={missionHref} className={`nav-link ${activeSection === 'mission' && !onCommunityPage ? 'nav-link-active' : ''}`}>{t.header.navMission}</a>
            <a href={communityHref} className={`nav-link ${onCommunityPage ? 'nav-link-active' : ''}`}>{t.header.navCommunity}</a>
          </nav>

          {/* Desktop CTA — the single main CTA of the whole site, per the brief: chamfered
              metal button, neon glow, magnetic hover, gentle idle pulse. */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            <a
              ref={magneticCta}
              href={desktopRefLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('cta_click', { location: 'header_desktop' })}
              className="btn-glow btn-premium shine-sweep chamfered nav-pulse px-7 py-3 font-black text-sm tracking-wide flex items-center space-x-2"
            >
              <Coins className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
              <span>{t.header.ctaPlayNow}</span>
              <span className="sr-only"> {t.opensInNewWindow}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              ref={menuButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? t.header.menuClose : t.header.menuOpen}
              className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg p-2.5"
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
              href={missionHref}
              onClick={() => setIsOpen(false)}
              className="hover:text-[var(--color-accent)] py-2 border-b border-[color-mix(in_srgb,var(--color-border)_50%,transparent)] transition-colors"
            >
              {t.header.navMission}
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
            href={mobileRefLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { location: 'header_mobile' })}
            className="btn-glow btn-premium shine-sweep chamfered nav-pulse w-full text-center block py-3 font-black text-sm tracking-wide"
          >
            {t.header.mobileCta}
            <span className="sr-only"> {t.opensInNewWindow}</span>
          </a>
        </div>
      )}
    </header>
  );
}
