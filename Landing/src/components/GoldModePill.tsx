import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { onEgg } from '../lib/eggBus';

const GOLD_MODE_MS = 10_000;

/**
 * Small persistent indicator for the 10s "secret gold mode" (easter egg
 * #2, see useSecretWord.ts) — bottom-left, opposite corner from
 * AchievementToast/SocialProof, so it never stacks with them. A fleeting
 * toast wouldn't communicate "this lasts 10 seconds"; a pill that stays up
 * for the whole window does.
 */
export default function GoldModePill() {
  const { t } = useLocale();
  const [active, setActive] = useState(false);

  useEffect(() => {
    return onEgg('gold-mode', () => {
      setActive(true);
      window.setTimeout(() => setActive(false), GOLD_MODE_MS);
    });
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[70] pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="gold-mode-pill"
          >
            <Crown className="w-4 h-4" aria-hidden="true" />
            <div>
              <div className="text-xs font-black uppercase tracking-widest">{t.easterEggs.goldModeTitle}</div>
              <div className="text-[11px] opacity-80">{t.easterEggs.goldModeDesc}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
