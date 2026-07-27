/**
 * Tiny typed pub/sub for cross-component easter-egg effects. A plain
 * EventTarget rather than React context: the emitters (Header logo,
 * LuxuryCar headlights, the secret-word listener) and the consumers
 * (MoneyStormOverlay, GoldMode, AchievementToast) don't share a parent
 * short of <App/> itself, and none of this needs to trigger a re-render
 * of the tree between them — it's fire-and-forget decorative effects.
 */
export type EggEventName = 'money-storm' | 'gold-mode' | 'engine-started' | 'secret-found';

export type EggDetail = { source: string };

const target = new EventTarget();

export function emitEgg(name: EggEventName, detail: EggDetail): void {
  target.dispatchEvent(new CustomEvent(name, { detail }));
}

export function onEgg(name: EggEventName, handler: (detail: EggDetail) => void): () => void {
  function listener(e: Event) {
    handler((e as CustomEvent<EggDetail>).detail);
  }
  target.addEventListener(name, listener);
  return () => target.removeEventListener(name, listener);
}
