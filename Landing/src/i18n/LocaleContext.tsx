import { createContext, useContext, type ReactNode } from 'react';
import { dictionaries } from './index';
import type { Dictionary, Locale } from './types';

const LocaleContext = createContext<{ locale: Locale; t: Dictionary } | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale, t: dictionaries[locale] }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): { locale: Locale; t: Dictionary } {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale() must be called inside a <LocaleProvider>');
  }
  return ctx;
}
