
import { Target, Gem, Eye, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import CornerBrackets from './CornerBrackets';

const icons = [Target, Gem, Eye, Compass];

/**
 * Brand-mission section — distinct from AboutFounder (which is "who I am"):
 * this is "why this project exists / what it stands for / where it's going".
 * Same no-fabrication rule applies — the copy is a values statement, not a
 * claim about scale, traction, or user counts.
 */
export default function Mission() {
  const { t } = useLocale();
  const { mission } = t;

  return (
    <section id="mission" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--color-border)] border border-[var(--color-border-soft)] text-[var(--color-accent)] text-xs font-bold tracking-widest uppercase mb-6">
            <span>{mission.badge}</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight italic">{mission.heading}</h2>
          <p className="text-gray-400 leading-relaxed">{mission.intro}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mission.pillars.map((pillar, i) => {
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
      </div>
    </section>
  );
}
