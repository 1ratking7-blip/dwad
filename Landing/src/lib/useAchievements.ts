import { useEffect, useState } from 'react';
import { trackEvent } from './analytics';

/**
 * Local-only achievement system — no account, no server, just localStorage.
 * A plain module-level store (not React context): achievements get unlocked
 * from all over the tree (section-visibility tracker, easter eggs, the
 * special bonus bill), and none of those emitters need to be inside the
 * same provider — they just call `unlockAchievement()`. Components that
 * need to render the current state (the toast queue) subscribe via the
 * hooks at the bottom.
 */
export type AchievementId = 'first_visit' | 'explorer' | 'collector' | 'secret_found' | 'zhelezo_mode';

const STORAGE_KEY = 'zhelezo_achievements_v1';
const SETTINGS_KEY = 'zhelezo_achievement_notifications';
const COLLECTOR_TARGET = 3;

interface StoredState {
  unlocked: Partial<Record<AchievementId, boolean>>;
  collectorProgress: number;
}

function readState(): StoredState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlocked: {}, collectorProgress: 0 };
    const parsed = JSON.parse(raw);
    return { unlocked: parsed.unlocked ?? {}, collectorProgress: parsed.collectorProgress ?? 0 };
  } catch {
    return { unlocked: {}, collectorProgress: 0 };
  }
}

function writeState(state: StoredState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private-browsing/storage-full — not worth failing over for a decorative feature.
  }
}

function readNotificationsEnabled(): boolean {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

export interface ToastEntry {
  key: string;
  kind: 'achievement' | 'custom';
  achievementId?: AchievementId;
  title: string;
  desc: string;
}

let state: StoredState = { unlocked: {}, collectorProgress: 0 };
let notificationsEnabled = true;
let hydrated = false;
let toastQueue: ToastEntry[] = [];
let toastSeq = 0;
const listeners = new Set<() => void>();

function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') return;
  state = readState();
  notificationsEnabled = readNotificationsEnabled();
  hydrated = true;
}

function notify() {
  listeners.forEach((l) => l());
}

/**
 * `title`/`desc` come from the caller (which has access to the localized
 * dictionary via useLocale()) — this module stays locale-agnostic so it can
 * be called from plain lib code (section tracker, secret-word listener)
 * that isn't itself a React component with access to `t`.
 */
export function unlockAchievement(id: AchievementId, title?: string, desc?: string): void {
  if (typeof window === 'undefined') return;
  ensureHydrated();
  if (state.unlocked[id]) return;
  state = { ...state, unlocked: { ...state.unlocked, [id]: true } };
  writeState(state);
  trackEvent('achievement_unlock', { id });
  if (notificationsEnabled && title && desc) {
    toastQueue = [...toastQueue, { key: `t${toastSeq++}`, kind: 'achievement', achievementId: id, title, desc }];
  }
  notify();
}

export function pushCustomToast(title: string, desc: string): void {
  if (typeof window === 'undefined' || !notificationsEnabled) return;
  ensureHydrated();
  toastQueue = [...toastQueue, { key: `t${toastSeq++}`, kind: 'custom', title, desc }];
  notify();
}

/** Collector achievement needs a few catches, not just one — tracks progress separately. */
export function incrementCollectorProgress(title?: string, desc?: string): void {
  if (typeof window === 'undefined') return;
  ensureHydrated();
  if (state.unlocked.collector) return;
  const next = state.collectorProgress + 1;
  state = { ...state, collectorProgress: next };
  writeState(state);
  notify();
  if (next >= COLLECTOR_TARGET) {
    unlockAchievement('collector', title, desc);
  }
}

export function setNotificationsEnabled(enabled: boolean): void {
  ensureHydrated();
  notificationsEnabled = enabled;
  try {
    window.localStorage.setItem(SETTINGS_KEY, enabled ? '1' : '0');
  } catch {
    // ignore
  }
  notify();
}

export function dismissOldestToast(): void {
  toastQueue = toastQueue.slice(1);
  notify();
}

export function useAchievementsStore() {
  ensureHydrated();
  const [, force] = useState(0);
  useEffect(() => {
    const listener = () => force((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return {
    unlocked: state.unlocked,
    collectorProgress: state.collectorProgress,
    notificationsEnabled,
    toastQueue,
  };
}
