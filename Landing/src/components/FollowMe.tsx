import { Instagram, Send, Facebook, Twitter, Youtube, Gamepad2, Music2 } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';

/**
 * Placeholder social block — user explicitly said "I'll send the links later,
 * just prepare the slots." Every entry starts with an empty href: fill it in
 * here and the icon automatically switches from a disabled placeholder to a
 * real working link (see the ternary in the render loop below). Brand names
 * are proper nouns — not translated across RU/EN/VI, same as elsewhere on
 * the web.
 *
 * Same accessible "coming soon" pattern as the rest of Footer.tsx: a real
 * disabled <button> (not a fake href="#"), so screen readers correctly
 * announce it as unavailable instead of a link that silently does nothing.
 */
const SOCIALS: { name: string; href: string; Icon: typeof Instagram }[] = [
  { name: 'Instagram', href: '', Icon: Instagram },
  { name: 'Telegram', href: '', Icon: Send },
  { name: 'Telegram Channel', href: '', Icon: Send },
  { name: 'Facebook', href: '', Icon: Facebook },
  { name: 'X (Twitter)', href: '', Icon: Twitter },
  { name: 'TikTok', href: '', Icon: Music2 },
  { name: 'YouTube', href: '', Icon: Youtube },
  { name: 'Discord', href: '', Icon: Gamepad2 },
];

export default function FollowMe() {
  const { t } = useLocale();

  return (
    <div className="glass-card rounded-3xl p-8 md:p-10">
      <h3 className="text-white font-black text-xl md:text-2xl mb-2 tracking-tight">
        {t.footer.followMeHeading}
      </h3>
      <p className="text-gray-400 text-sm mb-8">{t.footer.followMeSubtitle}</p>
      <div className="flex flex-wrap gap-3">
        {SOCIALS.map(({ name, href, Icon }) =>
          href ? (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="btn-glow group flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-border)] text-gray-300 hover:text-black hover:bg-[var(--color-accent)] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_50%,transparent)] transition-colors"
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only"> {t.opensInNewWindow}</span>
            </a>
          ) : (
            <button
              key={name}
              type="button"
              disabled
              aria-label={`${name} — ${t.footer.soonTitle}`}
              title={t.footer.soonTitle}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-border)]/50 text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
