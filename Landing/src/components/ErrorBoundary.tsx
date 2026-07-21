import { Component, type ErrorInfo, type ReactNode } from 'react';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocale } from '../lib/links';
import type { Dictionary, Locale } from '../i18n/types';

interface Props {
  children: ReactNode;
  locale: Locale;
  t: Dictionary;
}

interface State {
  hasError: boolean;
}

/**
 * Без этого — необработанное исключение при рендере любого компонента
 * (например, будущий баг в новой фиче) роняет всё React-дерево, и посетитель
 * сайта аффилиэйт-ссылки видит белый экран без единой кнопки. Здесь это
 * партнёрский лендинг — при падении рендера критично оставить хотя бы
 * рабочую реферальную ссылку, а не потерять посетителя молча.
 *
 * Живёт СНАРУЖИ LocaleProvider (см. main.*.tsx) — если сам провайдер или что-то
 * в дереве под ним упадёт, boundary должен пережить это без контекста, поэтому
 * locale/t приходят пропсами, а не через useLocale().
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    trackEvent('client_error', {
      kind: 'react_render_error',
      message: error.message.slice(0, 200),
      source: (info.componentStack || '').slice(0, 200),
      line: 0,
    });
  }

  render() {
    if (this.state.hasError) {
      const { locale, t } = this.props;
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-center px-6">
          <div>
            <h1 className="text-2xl font-black text-white mb-4">{t.errorBoundary.title}</h1>
            <p className="text-gray-400 mb-8">{t.errorBoundary.message}</p>
            <a
              href={refLinkForLocale(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-block bg-[var(--color-accent)] text-black px-8 py-4 rounded-2xl font-black tracking-wide shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_35%,transparent)]"
            >
              {t.errorBoundary.cta}
              <span className="sr-only"> {t.opensInNewWindow}</span>
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
