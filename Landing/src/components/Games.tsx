
import { ExternalLink, Terminal, BarChart3, Binary, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../lib/analytics';
import { refLinkForLocation } from '../lib/links';
import { useLocale } from '../i18n/LocaleContext';
import type { Locale } from '../i18n/types';
import { useCardTilt } from '../lib/useTilt';
import CornerBrackets from './CornerBrackets';

const icons = [
  <Rocket className="w-8 h-8 text-[var(--color-accent)]" />,
  <Binary className="w-8 h-8 text-[var(--color-accent-2)]" />,
  <Terminal className="w-8 h-8 text-[var(--color-gold)]" />,
  <BarChart3 className="w-8 h-8 text-[var(--color-turquoise)]" />,
];

interface GameCardProps {
  game: { title: string; rtp: string; desc: string };
  index: number;
  locale: Locale;
  playLabel: string;
  opensInNewWindow: string;
}

function GameCard({ game, index, locale, playLabel, opensInNewWindow }: GameCardProps) {
  const tiltRef = useCardTilt<HTMLDivElement>(6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group"
    >
      <div
        ref={tiltRef}
        className="tilt-card hud-panel chamfered p-8 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-gold)_15%,transparent)] transition-shadow flex flex-col justify-between h-full"
      >
        <div>
          <div className="mb-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">{icons[index]}</div>
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
          href={refLinkForLocation(locale, `games_card_${index}`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('cta_click', { location: 'games_card', game: game.title })}
          className="chamfered-sm shine-sweep w-full bg-[var(--color-border)] text-white py-3 font-bold text-sm text-center group-hover:bg-[var(--color-accent)] group-hover:text-black transition-colors"
        >
          {playLabel}
          <span className="sr-only"> {opensInNewWindow}</span>
        </a>
      </div>
      <CornerBrackets />
    </motion.div>
  );
}

export default function Games() {
  const { locale, t } = useLocale();
  const headerRefLink = refLinkForLocation(locale, 'games_header');
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
            href={headerRefLink}
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
            <GameCard
              key={i}
              game={game}
              index={i}
              locale={locale}
              playLabel={t.games.playButton}
              opensInNewWindow={t.opensInNewWindow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
