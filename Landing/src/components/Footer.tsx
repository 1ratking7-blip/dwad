
import { Twitter, Send, Github, ShieldAlert } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocale } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { locale, t } = useLocale();
  const refLink = refLinkForLocale(locale);
  const blogHref = locale === 'ru' ? '/blog/' : `/blog/${locale}/`;
  const homeHref = locale === 'ru' ? '/' : `/${locale}/`;
  const privacyHref = locale === 'ru' ? '/privacy-policy' : `/${locale}/privacy-policy`;
  const termsHref = locale === 'ru' ? '/terms' : `/${locale}/terms`;

  return (
    <footer id="site-footer" className="bg-[var(--color-bg-darker)] border-t border-[var(--color-border)] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <a href={homeHref} className="flex items-center space-x-3 mb-6">
              <div className="bg-[var(--color-accent)] p-2 rounded-lg text-black font-extrabold flex items-center justify-center">
                <span className="text-xl" aria-hidden="true">⚡</span>
              </div>
              <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
                ZHELEZO
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              {/* Соцсети ещё не запущены — раньше это были href="#" с preventDefault,
                  что для зрячих пользователей выглядело как рабочая кнопка, которая
                  без объяснений ничего не делает по клику (aria-label "(скоро)" читали
                  только скринридеры). disabled <button> — стандартный паттерн для
                  "элемент существует, но пока не активен": видимое приглушение для
                  зрячих + корректная семантика для ассистивных технологий. */}
              <button
                type="button"
                disabled
                aria-label={t.footer.socialTwitterSoon}
                title={t.footer.soonTitle}
                className="p-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled
                aria-label={t.footer.socialTelegramSoon}
                title={t.footer.soonTitle}
                className="p-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled
                aria-label={t.footer.socialGithubSoon}
                title={t.footer.soonTitle}
                className="p-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide">{t.footer.platformHeading}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#games" className="hover:text-[var(--color-accent)] transition-colors">{t.footer.gamesOriginals}</a></li>
              <li><a href={refLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'footer', label: 'slots' })} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.slots}</a></li>
              <li><a href={refLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'footer', label: 'sportsbook' })} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.sportsbook}</a></li>
              <li><a href={refLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'footer', label: 'esports' })} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.esports}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide">{t.footer.supportHeading}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href={blogHref} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.blog}</a></li>
              <li><a href="#faq" className="hover:text-[var(--color-accent)] transition-colors">{t.footer.faq}</a></li>
              <li><a href="#how-it-works" className="hover:text-[var(--color-accent)] transition-colors">{t.footer.howToStart}</a></li>
              <li><a href={refLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'footer', label: 'vip_club' })} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.vipClub}</a></li>
              <li><a href="#faq" className="hover:text-[var(--color-accent)] transition-colors">{t.footer.contacts}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide">{t.footer.bonusesHeading}</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href={refLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'footer', label: 'welcome_360' })} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.welcome360}</a></li>
              <li><a href={refLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'footer', label: 'daily_lucky_spin' })} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.dailyLuckySpin}</a></li>
              <li><a href={refLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'footer', label: 'weekly_cashback' })} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.weeklyCashback}</a></li>
              <li><a href={refLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'footer', label: 'rakeback_20' })} className="hover:text-[var(--color-accent)] transition-colors">{t.footer.rakeback20}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-6 text-xs font-medium text-gray-400">
            <span>&copy; {currentYear} {t.footer.copyright}</span>
            <a href={privacyHref} className="hover:text-gray-300 transition-colors">{t.footer.privacyPolicy}</a>
            <a href={termsHref} className="hover:text-gray-300 transition-colors">{t.footer.termsOfUse}</a>
          </div>

          <div className="flex items-center space-x-4 bg-[var(--color-card)] px-4 py-2 rounded-xl border border-[var(--color-border)]">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {t.footer.responsibleGambling}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
