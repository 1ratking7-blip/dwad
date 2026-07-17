
import { UserPlus, CreditCard, PlayCircle, Trophy } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { REF_LINK } from '../lib/links';

const steps = [
  {
    title: 'Регистрация',
    desc: 'Создайте аккаунт в 1 клик через Google, Telegram или почту. Не требуется KYC.',
    icon: <UserPlus className="w-6 h-6 text-black" />,
    color: 'bg-[var(--color-accent)]'
  },
  {
    title: 'Депозит',
    desc: 'Пополните баланс любой из 100+ криптовалют и получите бонус до 360%.',
    icon: <CreditCard className="w-6 h-6 text-black" />,
    color: 'bg-[var(--color-accent-2)]'
  },
  {
    title: 'Играйте',
    desc: 'Выбирайте из 10,000+ слотов или оригинальных игр с контролем честности.',
    icon: <PlayCircle className="w-6 h-6 text-black" />,
    color: 'bg-blue-400'
  },
  {
    title: 'Вывод',
    desc: 'Забирайте выигрыш мгновенно на свой криптокошелек. Без задержек.',
    icon: <Trophy className="w-6 h-6 text-black" />,
    color: 'bg-orange-400'
  }
];

export default function HowItWorks() {
  const refLink = REF_LINK;

  return (
    <section id="how-it-works" className="py-24 bg-[var(--color-bg)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight italic">КАК НАЧАТЬ ИГРАТЬ?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Всего 4 простых шага отделяют вас от первого выигрыша на самой технологичной крипто-платформе в мире.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {i !== steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-[var(--color-border)] to-transparent -translate-x-4 z-0"></div>
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed px-4">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
            <a
                href={refLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_click', { location: 'how_it_works' })}
                className="bg-[var(--color-card)] border border-[var(--color-border)] text-white px-8 py-4 rounded-2xl font-bold hover:border-[color-mix(in_srgb,var(--color-accent)_50%,transparent)] transition-all flex items-center space-x-3 group"
            >
                <span className="group-hover:text-[var(--color-accent)] transition-colors">Начать сейчас</span>
                <div className="bg-[var(--color-accent)] w-6 h-6 rounded-full flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-black" />
                </div>
            </a>
        </div>
      </div>
    </section>
  );
}
