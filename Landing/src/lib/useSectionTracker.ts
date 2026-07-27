import { useEffect } from 'react';
import { unlockAchievement } from './useAchievements';

/** The site's main scroll sections — matches the `id` on each <section> in App.tsx. */
const TRACKED_SECTION_IDS = ['hero', 'about', 'mission', 'lucky-wheel', 'games', 'bonuses', 'how-it-works', 'faq'];

/**
 * "Explorer" achievement — unlocked once every main section has scrolled
 * into view at least once in this session. One shared IntersectionObserver
 * for all of them rather than one per section: cheaper, and this only ever
 * needs to run until the achievement unlocks, then it tears itself down.
 */
export function useSectionTracker(achievementTitle: string, achievementDesc: string): void {
  useEffect(() => {
    const seen = new Set<string>();
    const elements = TRACKED_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) seen.add(entry.target.id);
        });
        if (seen.size >= TRACKED_SECTION_IDS.length) {
          unlockAchievement('explorer', achievementTitle, achievementDesc);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
