
import { ExternalLink, Terminal, BarChart3, Binary, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocale } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';

const icons = [
  <Rocket className="w-8 h-8 text-[var(--color-accent)]" />,
  <Binary className="w-8 h-8 text-[var(--color-accent-2)]" />,
  <Terminal className="w-8 h-8 text-blue-400" />,
  <BarChart3 className="w-8 h-8 text-orange-400" />,
];

export default function Games() {
  const { locale, t } = useLocale();
  const refLink = refLinkForLocale(locale);
  const games = t.games.list;

  return (
    <section id="games" className="py-24 bg-[color-mix(in_srgb,var(--color-bg-darker)_92%,transparent)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
              {t.games.h2Line1} <br />
              <span className="text-[var(--color-accent)]">{t.games.h2Line2}</span>
            </h2>
            <p className="text-gray-400 text-lg">
              {t.games.description}
            </p>
          </div>
          <a
            href={refLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { location: 'games_header' })}
            className="flex items-center space-x-2 text-[var(--color-accent)] font-bold border-b-2 border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] hover:border-[var(--color-accent)] transition-all pb-1 group"
          >
            <span>{t.games.viewAll}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
            <span className="sr-only"> {t.opensInNewWindow}</span>
          </a>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-card p-8 rounded-3xl hover:border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_15%,transparent)] transition-[border-color,box-shadow] group flex flex-col justify-between"
            >
              <div>
                <div className="mb-8">{icons[i]}</div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{game.title}</h3>
                  <span className="text-[10px] font-black bg-[var(--color-border)] text-[var(--color-accent)] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    RTP {game.rtp}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {game.desc}
                </p>
              </div>
              <a
                href={refLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_click', { location: 'games_card', game: game.title })}
                className="w-full bg-[var(--color-border)] text-white py-3 rounded-xl font-bold text-sm text-center group-hover:bg-[var(--color-accent)] group-hover:text-black transition-colors"
              >
                {t.games.playButton}
                <span className="sr-only"> {t.opensInNewWindow}</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
