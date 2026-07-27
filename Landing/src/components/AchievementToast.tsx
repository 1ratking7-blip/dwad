import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';
import { useAchievementsStore, dismissOldestToast } from '../lib/useAchievements';
import { useEffect } from 'react';
import { useLocale } from '../i18n/LocaleContext';

const AUTO_DISMISS_MS = 5000;

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
              <div className="text-xs text-[var(--color-text-secondary)]">{current.desc}</div>
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
