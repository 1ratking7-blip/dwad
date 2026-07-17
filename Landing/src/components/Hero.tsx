
import { Rocket, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../lib/analytics';

export default function Hero() {
  const refLink = "https://bcall-loop.bcgame-bet.com/dispatch-v6?i=zhelezo&p=/login/regist";

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[color-mix(in_srgb,var(--color-accent-2)_10%,transparent)] blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--color-border)] border border-[var(--color-border-soft)] text-[var(--color-accent)] text-xs font-bold tracking-widest uppercase mb-8">
              <Zap className="w-3 h-3 fill-current" />
              <span>Эксклюзивный доступ через ZHELEZO</span>
            </span>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
              ТВОЙ ПУТЬ В МИР <br />
              <span className="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
                WEB3 ГЕМБЛИНГА
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Регистрируйся на BC.Game сегодня: забирай бонус 360%, крути бесплатное колесо фортуны и играй в честные игры Provably Fair.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href={refLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_click', { location: 'hero' })}
                className="w-full sm:w-auto bg-[var(--color-accent)] text-black px-10 py-5 rounded-2xl font-black text-lg tracking-wide hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_50%,transparent)] hover:-translate-y-1 transition-all flex items-center justify-center space-x-3"
              >
                <span>ЗАБРАТЬ БОНУС 360%</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <div className="flex items-center space-x-4 text-gray-500 font-medium text-sm">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-5 h-5 text-gray-600" />
                  <span>No KYC Needed</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <div className="flex items-center space-x-1.5">
                  <Rocket className="w-5 h-5 text-gray-600" />
                  <span>Instant Payouts</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            { label: 'Ежедневный Бонус', value: 'До 5 BTC', sub: 'Lucky Spin' },
            { label: 'Поддержка Крипто', value: '100+', sub: 'Разных монет' },
            { label: 'Рейкбек Системы', value: 'До 20%', sub: 'С каждой ставки' },
          ].map((stat, i) => (
            <div key={i} className="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-3xl text-center hover:border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] transition-colors group">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-[var(--color-accent)] transition-colors">{stat.label}</div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
