
import { ExternalLink, Terminal, BarChart3, Binary } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

const games = [
  {
    title: 'Crash',
    desc: 'Масштабируй свои ставки вместе с растущим графиком. Успей забрать до падения!',
    icon: <Rocket className="w-8 h-8 text-[var(--color-accent)]" />,
    rtp: '99.0%',
    tag: 'Самое популярное'
  },
  {
    title: 'Plinko',
    desc: 'Классическая игра с шариками и множителями. Настрой свой уровень риска.',
    icon: <Binary className="w-8 h-8 text-[var(--color-accent-2)]" />,
    rtp: '98.5%',
    tag: 'Высокий RTP'
  },
  {
    title: 'Limbo',
    desc: 'Задай целевой множитель и сорви куш, если результат окажется выше.',
    icon: <Terminal className="w-8 h-8 text-blue-400" />,
    rtp: '99.0%',
    tag: 'Быстрые раунды'
  },
  {
    title: 'Hash Dice',
    desc: 'Предскажи диапазон выпадения чисел и получи мгновенную выплату.',
    icon: <BarChart3 className="w-8 h-8 text-orange-400" />,
    rtp: '98.8%',
    tag: 'Честная математика'
  }
];

import { Rocket } from 'lucide-react';

export default function Games() {
  const refLink = "https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist";

  return (
    <section id="games" className="py-24 bg-[var(--color-bg-darker)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
              ОРИГИНАЛЬНЫЕ <br />
              <span className="text-[var(--color-accent)]">BC ORIGINALS</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Игры на основе технологии Provably Fair. Честность каждого раунда подтверждена в блокчейне и доступна для проверки любому пользователю.
            </p>
          </div>
          <a
            href={refLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { location: 'games_header' })}
            className="flex items-center space-x-2 text-[var(--color-accent)] font-bold border-b-2 border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] hover:border-[var(--color-accent)] transition-all pb-1 group"
          >
            <span>Посмотреть все игры</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, i) => (
            <div key={i} className="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-3xl hover:border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] transition-all group flex flex-col justify-between">
              <div>
                <div className="mb-8">{game.icon}</div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{game.title}</h3>
                  <span className="text-[10px] font-black bg-[var(--color-border)] text-[var(--color-accent)] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    RTP {game.rtp}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
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
                ИГРАТЬ
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
