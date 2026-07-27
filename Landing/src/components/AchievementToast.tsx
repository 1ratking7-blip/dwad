import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, Sparkles, X, Share2 } from 'lucide-react';
import { useAchievementsStore, dismissOldestToast } from '../lib/useAchievements';
import { useEffect } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import { trackEvent } from '../lib/analytics';

const AUTO_DISMISS_MS = 5000;

function handleShare(shareText: string) {
  const url = `${window.location.origin}/?utm_source=share&utm_medium=achievement_toast`;
  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  window.open(intent, '_blank', 'noopener,noreferrer,width=600,height=500');
  trackEvent('easter_egg', { id: 'share_click' });
}

/**
 * Renders the current head of the achievement/egg toast queue (see
 * useAchievements.ts) — one at a time, bottom-right, auto-dismissing.
 * `role="status"`/`aria-live="polite"` so screen-reader users get the same
 * "achievement unlocked" moment as sighted users, without it being
 * disruptive like `aria-live="assertive"` would be for a purely decorative
 * feature. Not a browser `alert()` per the brief.
 */
export default function AchievementToast() {
  const { toastQueue } = useAchievementsStore();
  const { t } = useLocale();
  const current = toastQueue[0];

  useEffect(() => {
    if (!current) return;
    const timer = window.setTimeout(dismissOldestToast, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [current]);

  return (
    <div className="fixed bottom-6 right-6 z-[70] pointer-events-none" aria-live="polite" role="status">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="achievement-toast pointer-events-auto"
          >
            <div className="achievement-toast-icon">
              {current.kind === 'achievement' ? (
                <Trophy className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              {current.kind === 'achievement' && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-gold)] mb-0.5">
                  {t.achievements.unlockedLabel}
                </div>
              )}
              <div className="text-sm font-bold text-[var(--color-text)] truncate">{current.title}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mb-2">{current.desc}</div>
              <button
                type="button"
                onClick={() => handleShare(t.achievements.shareText)}
                aria-label={t.achievements.shareButtonAria}
                className="achievement-toast-share"
              >
                <Share2 className="w-3 h-3" aria-hidden="true" />
                <span>{t.achievements.shareButtonLabel}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={dismissOldestToast}
              aria-label={t.close}
              className="achievement-toast-close"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
