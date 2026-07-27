import { useEffect } from 'react';
import { emitEgg } from './eggBus';
import { unlockAchievement } from './useAchievements';
import { trackEvent } from './analytics';

const SECRET = 'zhelezo';
const GOLD_MODE_MS = 10_000;
const GOLD_MODE_CLASS = 'gold-mode-active';

let revertTimer = 0;

/**
 * Shared activation used by both the "ZHELEZO" keyboard easter egg and the
 * `?gold=1` query-param shortcut (App.tsx) — the latter exists so the team
 * can link directly to a "gold mode" screenshot/trailer state for marketing
 * without making someone type the secret word on camera.
 */
export function activateGoldMode(source: string, achievementTitle: string, achievementDesc: string): void {
  document.documentElement.classList.add(GOLD_MODE_CLASS);
  emitEgg('gold-mode', { source });
  unlockAchievement('zhelezo_mode', achievementTitle, achievementDesc);
  trackEvent('easter_egg', { id: 'gold_mode', source });
  window.clearTimeout(revertTimer);
  revertTimer = window.setTimeout(() => {
    document.documentElement.classList.remove(GOLD_MODE_CLASS);
  }, GOLD_MODE_MS);
}

/**
 * Easter egg #2 — typing "ZHELEZO" anywhere on the page (not focused in a
 * text input) flips the site into a 10s "secret gold mode" via a single CSS
 * class on <html> that re-maps the accent color variables (see index.css
 * `.gold-mode-active`) — every component that already reads
 * var(--color-accent) picks it up for free, no per-component changes needed.
 */
export function useSecretWord(achievementTitle: string, achievementDesc: string): void {
  useEffect(() => {
    let buffer = '';
    let resetTimer = 0;

    function onKeydown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      buffer = (buffer + e.key).toLowerCase().slice(-SECRET.length);
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        buffer = '';
      }, 2500);

      if (buffer === SECRET) {
        buffer = '';
        activateGoldMode('secret-word', achievementTitle, achievementDesc);
      }
    }

    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
      window.clearTimeout(resetTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
