import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LocaleProvider } from './i18n/LocaleContext';
import { dictionaries } from './i18n';
import type { Locale } from './i18n/types';
import { initErrorMonitoring } from './lib/monitoring';
import './index.css';

/** Shared mount logic for all 3 locale entry points (main.ru.tsx/main.en.tsx/main.vi.tsx) —
 * each static HTML page bakes in its own locale at build/serve time, no client-side
 * language detection needed for the content itself (only the switcher UI redirects
 * between the 3 real URLs). See src/i18n/LocaleContext.tsx and ErrorBoundary.tsx for
 * why locale/t is threaded as an explicit value here rather than only via context. */
export function bootstrap(locale: Locale) {
  initErrorMonitoring();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary locale={locale} t={dictionaries[locale]}>
        <LocaleProvider locale={locale}>
          <App />
        </LocaleProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
