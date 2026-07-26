
import { Trophy, BadgeCheck, ShieldCheck, Infinity as InfinityIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { trackEvent } from '../lib/analytics';
import CornerBrackets from './CornerBrackets';

const icons = [Trophy, BadgeCheck, ShieldCheck, InfinityIcon];

/**
 * Trust/about section built entirely from facts the founder gave directly
 * (name, sport background, brand mission) — no invented stats or testimonials,
 * per the site's standing rule against fabricated social proof (see FAQ/SocialProof).
 *
 * The photo slot is a monogram placeholder, not a stock photo standing in for
 * a real person — the founder's own rule elsewhere in this project is that a
 * stranger's stock photo must never be presented as if it were him. Swap the
 * placeholder block below for a real <img> the moment an actual photo exists.
 */
export default function AboutFounder() {
  const { locale, t } = useLocale();
  const communityHref = locale === 'ru' ? '/community/' : `/community/${locale}/`;
  const { about } = t;

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--color-border)] border border-[var(--color-border-soft)] text-[var(--color-accent)] text-xs font-bold tracking-widest uppercase mb-6">
            <span>{about.badge}</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tight italic">{about.heading}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto mb-16"
        >
          <div className="hud-panel chamfered p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:gap-10 items-start mb-8">
              {/* Photo placeholder — chamfered frame + monogram, matches the
                  rest of the site's HUD language instead of a generic circle
                  avatar, so an empty photo slot still looks intentional. */}
              <div className="mx-auto sm:mx-0 shrink-0">
                <div
                  className="chamfered-sm w-28 h-28 sm:w-32 sm:h-32 btn-metal flex items-center justify-center relative"
                  role="img"
                  aria-label={about.name}
                >
                  <span className="text-3xl sm:text-4xl font-black text-black tracking-tight">{about.photoInitials}</span>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <div className="text-2xl font-black text-white mb-1">{about.name}</div>
                <div className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-widest mb-6">{about.role}</div>
                {about.bioParagraphs.map((p, i) => (
                  <p key={i} className="text-gray-400 leading-relaxed mb-4 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="hud-hairline mb-8" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {about.timeline.map((item) => (
                <div key={item.label} className="text-center sm:text-left">
                  <div className="text-lg font-black text-[var(--color-accent)] mb-1">{item.year}</div>
                  <div className="text-gray-400 text-xs leading-snug">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <CornerBrackets />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {about.pillars.map((pillar, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative"
              >
                <div className="hud-panel chamfered p-8 h-full hover:shadow-[0_0_25px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] transition-shadow">
                  <div className="btn-metal chamfered-sm w-12 h-12 flex items-center justify-center text-black mb-5">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{pillar.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
                <CornerBrackets />
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <a
            href={communityHref}
            onClick={() => trackEvent('cta_click', { location: 'about_founder' })}
            className="btn-glow hud-panel chamfered text-white px-8 py-4 font-bold flex items-center space-x-3 group"
          >
            <span className="group-hover:text-[var(--color-accent)] transition-colors">{about.ctaLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:text-[var(--color-accent)] transition-colors" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
