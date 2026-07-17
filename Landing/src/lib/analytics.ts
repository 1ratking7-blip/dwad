declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
    YM_COUNTER_ID?: number;
  }
}

export type AnalyticsEventName = 'page_view' | 'wheel_spin' | 'cta_click' | 'faq_expand';

/**
 * Единая точка отправки событий во все подключённые системы аналитики
 * (GA4 через gtag, Yandex Metrica через ym, и dataLayer для GTM).
 * События и их параметры описаны в Analytics/HYPOTHESES.md, раздел 3.
 */
export function trackEvent(name: AnalyticsEventName, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === 'undefined') return;

  // Тема (Гипотеза 2) прикладывается ко всем событиям, чтобы сравнивать
  // CR1/CR2/Bounce Rate между cyberpunk и web3 вариантами в GA4/Metrica.
  const theme = document.documentElement.getAttribute('data-theme') ?? 'cyberpunk';
  params = { theme, ...params };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });

  window.gtag?.('event', name, params);

  if (window.ym && window.YM_COUNTER_ID) {
    window.ym(window.YM_COUNTER_ID, 'reachGoal', name, params);
  }
}
