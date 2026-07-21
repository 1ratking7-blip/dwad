import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { useLocale } from '../i18n/LocaleContext';

export default function FAQ() {
  const { t } = useLocale();
  const faqs = t.faq.items;
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
  }, [faqs]);

  const toggleFaq = (i: number) => {
    const isOpening = openIndex !== i;
    setOpenIndex(isOpening ? i : null);
    if (isOpening) {
      trackEvent('faq_expand', { question: faqs[i].q });
    }
  };

  return (
    <section id="faq" className="py-24 bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">{t.faq.heading}</h2>
          <p className="text-gray-400">{t.faq.subtitle}</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              className="hud-panel chamfered-sm overflow-hidden"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
