import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const wins = [
  { user: 'user_9**', game: 'Crash', amount: '2.45 ETH', multiplier: '15.4x' },
  { user: 'Kryp**', game: 'Plinko', amount: '14,200 TRX', multiplier: '250x' },
  { user: 'Alex**', game: 'Hash Dice', amount: '0.045 BTC', multiplier: '2.0x' },
  { user: 'Whal**', game: 'Limbo', amount: '500 USDT', multiplier: '50x' },
  { user: 'Sol_**', game: 'Crash', amount: '12.5 SOL', multiplier: '4.2x' },
];

export default function SocialProof() {
  const [currentWin, setCurrentWin] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWin((prev) => (prev + 1) % wins.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Скрываем плавающий тост рядом с Hero и футером — в этих зонах он перекрывает
  // основной CTA и копирайт/ссылки (см. id="hero" в Hero.tsx, id="site-footer" в Footer.tsx).
  useEffect(() => {
    const targets = ['hero', 'site-footer']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const states = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => states.set(entry.target, entry.isIntersecting));
        setShouldHide([...states.values()].some(Boolean));
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (shouldHide) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWin}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-[color-mix(in_srgb,var(--color-card)_90%,transparent)] backdrop-blur-md border border-[var(--color-border)] p-4 rounded-2xl shadow-2xl flex items-center space-x-4 max-w-[280px]"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] flex items-center justify-center text-black font-bold text-xs shrink-0">
            {wins[currentWin].user[0]}
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Live Win • {wins[currentWin].game}</div>
            <div className="text-sm font-bold text-white mb-0.5">
              {wins[currentWin].user} <span className="text-[var(--color-accent)]">выиграл {wins[currentWin].amount}</span>
            </div>
            <div className="text-[10px] text-gray-400">Множитель: <span className="text-white">{wins[currentWin].multiplier}</span></div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
