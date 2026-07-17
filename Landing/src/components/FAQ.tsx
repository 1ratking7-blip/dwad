import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

const faqs = [
  {
    q: "Как получить бонус 360% на BC.Game?",
    a: "Приветственный бонус распределяется на первые 4 депозита. После регистрации через ZHELEZO, перейдите в раздел 'Deposit', выберите удобную криптовалюту и активируйте бонусное предложение. Максимальный суммарный бонус может достигать эквивалента $20,000 в монете BCD."
  },
  {
    q: "Что такое Lucky Spin и как его крутить?",
    a: "Lucky Spin — это бесплатное колесо фортуны, которое доступно всем зарегистрированным пользователям каждые 24 часа. Для вращения не требуется депозит. Вы можете выиграть различные криптовалюты, включая USDT, TRX, ETH и главный приз до 1 или 5 BTC (в зависимости от уровня аккаунта)."
  },
  {
    q: "Нужно ли проходить верификацию (KYC)?",
    a: "BC.Game является крипто-ориентированной платформой и позволяет начать игру, делать депозиты и выводить средства без обязательной верификации личности на большинстве уровней активности. Это обеспечивает полную анонимность и конфиденциальность."
  },
  {
    q: "Как проверить честность игры в Crash или Plinko?",
    a: "В каждой оригинальной игре есть кнопка 'Verify'. Нажав на нее, вы увидите хэш раунда (Round Hash) и клиентское зерно. Вы можете скопировать эти данные и вставить в любой независимый сторонний валидатор, чтобы убедиться, что результат был сгенерирован честно еще до начала раунда."
  },
  {
    q: "Какие криптовалюты поддерживаются?",
    a: "Платформа поддерживает более 100 криптовалют, включая Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Tron (TRX), Tether (USDT), Dogecoin (DOGE) и многие другие. Также доступен фиатный шлюз для покупки крипты прямо с банковской карты."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const toggleFaq = (i: number) => {
    const isOpening = openIndex !== i;
    setOpenIndex(isOpening ? i : null);
    if (isOpening) {
      trackEvent('faq_expand', { question: faqs[i].q });
    }
  };

  return (
    <section id="faq" className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ</h2>
          <p className="text-gray-400">Все, что вам нужно знать перед началом игры на BC.Game через портал ZHELEZO.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden transition-colors hover:border-[color-mix(in_srgb,var(--color-border)_80%,transparent)]"
            >
              <button
                onClick={() => toggleFaq(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
                className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-white group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <span className="pr-8 group-hover:text-[var(--color-accent)] transition-colors">{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-[var(--color-accent)] shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
                )}
              </button>

              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                aria-hidden={openIndex !== i}
                className={`px-6 transition-all duration-300 ease-in-out ${
                  openIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-400 leading-relaxed border-t border-[var(--color-border)] pt-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
