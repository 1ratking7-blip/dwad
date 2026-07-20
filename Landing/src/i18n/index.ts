import { ru } from './ru';
import { en } from './en';
import { vi } from './vi';
import type { Dictionary, Locale } from './types';

export const dictionaries: Record<Locale, Dictionary> = { ru, en, vi };
export type { Dictionary, Locale, GameEntry, StepEntry, FaqEntry } from './types';

export const SUPPORTED_LOCALES: Locale[] = ['ru', 'en', 'vi'];
export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALE_LABELS: Record<Locale, { flag: string; name: string }> = {
  ru: { flag: '🇷🇺', name: 'Русский' },
  en: { flag: '🇺🇸', name: 'English' },
  vi: { flag: '🇻🇳', name: 'Tiếng Việt' },
};

// The path prefix each locale lives under. ru is the default and stays at the
// root ("") to preserve the site's existing URLs/SEO history rather than moving
// everything to /ru/ and losing accumulated signal on the original paths.
export const LOCALE_PATH_PREFIX: Record<Locale, string> = {
  ru: '',
  en: '/en',
  vi: '/vi',
};
