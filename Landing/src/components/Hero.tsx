
import { Rocket, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocale } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';
import { useMagnetic } from '../lib/useMagnetic';
import AnimatedCounter from './AnimatedCounter';
import EnergyCore from './EnergyCore';

export default function Hero() {
  const { locale, t } = useLocale();
  const refLink = refLinkForLocale(locale);
  const magneticCta = useMagnetic<HTMLAnchorElement>(0.25);

  const stats = [
    { label: t.hero.statDailyLabel, value: t.hero.statDailyValue, sub: t.hero.statDailySub },
    { label: t.hero.statCryptoLabel, value: t.hero.statCryptoValue, sub: t.hero.statCryptoSub },
    { label: t.hero.statRakebackLabel, value: t.hero.statRakebackValue, sub: t.hero.statRakebackSub },
  ];

  return (
    <section id="hero" className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[color-mix(in_srgb,var(--color-accent-2)_10%,transparent)] blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left lg:col-span-3 max-w-4xl mx-auto lg:mx-0"
          >
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--color-border)] border border-[var(--color-border-soft)] text-[var(--color-accent)] text-xs font-bold tracking-widest uppercase mb-8">
              <Zap className="w-3 h-3 fill-current" />
              <span>{t.hero.badge}</span>
            </span>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.05]">
              {t.hero.h1Line1} <br />
              <span className="neon-text-green bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
                {t.hero.h1Line2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                ref={magneticCta}
                href={refLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_click', { location: 'hero' })}
                className="btn-glow shine-sweep w-full sm:w-auto bg-[var(--color-accent)] text-black px-10 py-5 rounded-2xl font-black text-lg tracking-wide shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_50%,transparent)] flex items-center justify-center space-x-3"
              >
                <span>{t.hero.ctaButton}</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only"> {t.opensInNewWindow}</span>
              </a>

              <div className="flex items-center space-x-4 text-gray-400 font-medium text-sm">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-5 h-5 text-gray-400" />
                  <span>{t.hero.noKyc}</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <div className="flex items-center space-x-1.5">
                  <Rocket className="w-5 h-5 text-gray-400" />
                  <span>{t.hero.instantPayouts}</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <span className="text-xs">{t.hero.ageGate}</span>
              </div>
            </div>
          </motion.div>

          {/* Energy core — hidden below `sm` to avoid crowding the fold on small
              phones (the brief explicitly warned against overload/overflow on
              mobile); visible from `sm` up, full prominence at `lg`. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="hidden sm:block lg:col-span-2 float-y"
          >
            <EnergyCore />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="glass-card p-8 rounded-3xl text-center hover:border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] hover:shadow-[0_0_25px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] transition-[border-color,box-shadow] group"
            >
              <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-[var(--color-accent)] transition-colors">{stat.label}</div>
              <div className="text-3xl font-black text-white mb-1">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-gray-400 text-sm">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
