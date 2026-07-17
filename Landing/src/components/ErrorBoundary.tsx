import { Component, type ErrorInfo, type ReactNode } from 'react';
import { trackEvent } from '../lib/analytics';
import { REF_LINK } from '../lib/links';

interface Props {
  children: ReactNode;
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
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-center px-6">
          <div>
            <h1 className="text-2xl font-black text-white mb-4">Что-то пошло не так</h1>
            <p className="text-gray-400 mb-8">Попробуйте обновить страницу — мы уже знаем об ошибке.</p>
            <a
              href={REF_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[var(--color-accent)] text-black px-8 py-4 rounded-2xl font-black tracking-wide"
            >
              ПЕРЕЙТИ НА BC.GAME
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
