import { Instagram, Send, Facebook, Twitter, Music2, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { trackEvent } from '../lib/analytics';
import CornerBrackets from './CornerBrackets';

/**
 * Real social links, per the user's explicit list — Telegram Channel,
 * Instagram, Facebook, X, TikTok only. Explicitly excluded: personal
 * Telegram, Discord, YouTube. lucide-react has no official TikTok mark
 * (it's a generic icon set, not brand logos) — Music2 substitutes, same
 * stroke style as the rest so it doesn't look out of place.
 */
const SOCIALS: { name: string; href: string; Icon: LucideIcon }[] = [
  { name: 'Telegram Channel', href: 'https://t.me/zhe1ez', Icon: Send },
  { name: 'Instagram', href: 'https://www.instagram.com/zhe1ezz/', Icon: Instagram },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61583455052068&locale=ru_RU', Icon: Facebook },
  { name: 'X (Twitter)', href: 'https://x.com/zhelez23', Icon: Twitter },
  { name: 'TikTok', href: 'https://www.tiktok.com/@zhelez777?lang=ru-RU', Icon: Music2 },
];

export default function FollowMe() {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {SOCIALS.map(({ name, href, Icon }, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="relative"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { location: 'community', label: name })}
            className="shine-sweep hud-panel chamfered group flex flex-col items-center text-center gap-4 p-10 hover:shadow-[0_0_35px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] transition-shadow"
          >
            <div className="btn-metal chamfered-sm w-16 h-16 flex items-center justify-center text-black">
              <Icon className="w-7 h-7" aria-hidden="true" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide group-hover:text-[var(--color-accent)] transition-colors">
              {name}
            </span>
            <span className="sr-only"> {t.opensInNewWindow}</span>
          </a>
          <CornerBrackets />
        </motion.div>
      ))}
    </div>
  );
}
