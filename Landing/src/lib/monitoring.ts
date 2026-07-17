import { trackEvent } from './analytics';

/**
 * Сайт статический, без бэкенда — выделенного error-tracking сервиса
 * (Sentry и т.п.) нет и заводить его ради этого не стал (новая внешняя
 * зависимость и, как правило, платный тариф — решение не мне принимать
 * посреди аудита). Вместо этого репортим реальные JS-ошибки у живых
 * посетителей через уже существующий канал аналитики (GA4/Яндекс.Метрика,
 * см. lib/analytics.ts) как событие client_error — этого достаточно, чтобы
 * увидеть в отчётах, что вообще что-то ломается в проде, и на каких страницах.
 */
export function initErrorMonitoring(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    trackEvent('client_error', {
      kind: 'error',
      message: String(event.message).slice(0, 200),
      source: String(event.filename || '').slice(0, 200),
      line: event.lineno || 0,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
    trackEvent('client_error', {
      kind: 'unhandled_rejection',
      message: reason.slice(0, 200),
      source: '',
      line: 0,
    });
  });
}
