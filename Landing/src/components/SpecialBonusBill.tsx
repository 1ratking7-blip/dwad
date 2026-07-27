import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';
import { emitEgg } from '../lib/eggBus';
import { unlockAchievement, incrementCollectorProgress, pushCustomToast } from '../lib/useAchievements';
import { trackEvent } from '../lib/analytics';

const MIN_INTERVAL_MS = 50_000;
const MAX_INTERVAL_MS = 95_000;
const VISIBLE_MS = 9_000;

/**
 * The one particle in the whole atmosphere system that's actually
 * clickable (brief §2: "иногда одна специальная банкнота должна
 * становиться кликабельной"). Rendered as a real <button>, not a canvas/SVG
 * particle, specifically so it's reachable by keyboard and screen readers —
 * the ambient decorative particles (AnimatedBackground, FloatingWealth) stay
 * aria-hidden/pointer-events:none, but this one is a genuine interactive
 * control while it's on screen. Appears rarely, at a random safe position,
 * for a limited window, then withdraws itself from the DOM (and the tab
 * order) if not clicked.
 */
export default function SpecialBonusBill() {
  const { t } = useLocale();
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let showTimer = 0;
    let hideTimer = 0;

    function scheduleNext() {
      const delay = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
      showTimer = window.setTimeout(() => {
        if (!document.hidden) {
          setPos({ top: 22 + Math.random() * 42, left: 12 + Math.random() * 70 });
          hideTimer = window.setTimeout(() => {
            setPos(null);
            scheduleNext();
          }, VISIBLE_MS);
        } else {
          scheduleNext();
        }
      }, delay);
    }

    scheduleNext();
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!pos) return null;

  function handleClick() {
    setPos(null);
    pushCustomToast(t.easterEggs.secretFoundTitle, t.easterEggs.secretFoundDesc);
    unlockAchievement('secret_found', t.achievements.secretFoundTitle, t.achievements.secretFoundDesc);
    incrementCollectorProgress(t.achievements.collectorTitle, t.achievements.collectorDesc);
    emitEgg('secret-found', { source: 'special-bill' });
    trackEvent('easter_egg', { id: 'special_bill' });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t.easterEggs.specialBillAria}
      className="special-bonus-bill"
      style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
    >
      <svg width="56" height="30" viewBox="0 0 64 32" aria-hidden="true">
        <defs>
          <linearGradient id="special-bill-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-graphite)" />
            <stop offset="55%" stopColor="var(--color-accent-dark)" />
            <stop offset="100%" stopColor="var(--color-metal-black)" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="62" height="30" rx="2.5" fill="url(#special-bill-grad)" stroke="var(--color-gold)" strokeWidth="1.2" />
        <path d="M32 9 L38 13 L38 20 L32 24 L26 20 L26 13 Z" fill="none" stroke="var(--color-gold)" strokeWidth="1" opacity="0.85" />
      </svg>
      <span className="special-bonus-bill-spark" aria-hidden="true">
        <Zap className="w-4 h-4" />
      </span>
    </button>
  );
}
