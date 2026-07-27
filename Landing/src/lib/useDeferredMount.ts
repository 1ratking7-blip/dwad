import { useEffect, useState } from 'react';

/**
 * Returns false on the initial render, true once the browser has had a
 * chance to paint — used to defer mounting purely decorative, non-critical
 * widgets (cursor glow, scroll progress, toasts, easter-egg overlays) so
 * their effects/listeners don't compete with Hero's own mount work for
 * main-thread time during the LCP/TBT-critical first paint window. Falls
 * back to a short timeout if requestIdleCallback isn't available (Safari).
 */
export function useDeferredMount(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = (window as typeof window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) {
      const id = idle(() => setReady(true));
      return () => (window as typeof window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return ready;
}
