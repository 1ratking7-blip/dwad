import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_PATH_PREFIX, type Locale } from '../i18n';
import { trackEvent } from '../lib/analytics';

const STORAGE_KEY = 'zhelezo_locale';

/** Called on click, not just relying on the redirect-based storage set in index.html's
 * bootstrap — a manual switch should always win over auto-detection for future visits. */
function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Storage can throw in private-browsing modes on some browsers — not worth failing over.
  }
}

export default function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t.languageSwitcher.label}: ${LOCALE_LABELS[locale].name}`}
        className="flex items-center space-x-1.5 text-xs font-semibold text-gray-300 hover:text-[var(--color-accent)] border border-[var(--color-border)] px-3 py-1.5 rounded-full transition-colors"
      >
        <span aria-hidden="true">{LOCALE_LABELS[locale].flag}</span>
        <span>{LOCALE_LABELS[locale].name}</span>
        <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-2xl min-w-[160px] z-50"
        >
          {SUPPORTED_LOCALES.map((loc) => (
            <a
              key={loc}
              role="menuitem"
              href={`${LOCALE_PATH_PREFIX[loc]}/`}
              onClick={() => {
                persistLocale(loc);
                trackEvent('cta_click', { location: 'language_switcher', label: loc });
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-[var(--color-border)] transition-colors ${
                loc === locale ? 'text-[var(--color-accent)] font-bold' : 'text-gray-300'
              }`}
            >
              <span aria-hidden="true">{LOCALE_LABELS[loc].flag}</span>
              <span>{LOCALE_LABELS[loc].name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
