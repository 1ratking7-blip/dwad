
import { UserPlus, CreditCard, PlayCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocale } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';

const icons = [
  <UserPlus className="w-6 h-6 text-black" />,
  <CreditCard className="w-6 h-6 text-black" />,
  <PlayCircle className="w-6 h-6 text-black" />,
  <Trophy className="w-6 h-6 text-black" />,
];
const colors = ['bg-[var(--color-accent)]', 'bg-[var(--color-accent-2)]', 'bg-blue-400', 'bg-orange-400'];

export default function HowItWorks() {
  const { locale, t } = useLocale();
  const refLink = refLinkForLocale(locale);
  const steps = t.howItWorks.steps;

  return (
    <section id="how-it-works" className="py-24 bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight italic">{t.howItWorks.heading}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              {i !== steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-[var(--color-border)] to-transparent -translate-x-4 z-0"></div>
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`${colors[i]} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {icons[i]}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed px-4">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
            <a
                href={refLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_click', { location: 'how_it_works' })}
                className="btn-glow glass-card text-white px-8 py-4 rounded-2xl font-bold hover:border-[color-mix(in_srgb,var(--color-accent)_50%,transparent)] transition-colors flex items-center space-x-3 group"
            >
                <span className="group-hover:text-[var(--color-accent)] transition-colors">{t.howItWorks.ctaButton}</span>
                <div className="bg-[var(--color-accent)] w-6 h-6 rounded-full flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-black" aria-hidden="true" />
                </div>
                <span className="sr-only"> {t.opensInNewWindow}</span>
            </a>
        </div>
      </div>
    </section>
  );
}
