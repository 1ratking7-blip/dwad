import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { refLinkWithSubId } from '../lib/links';

const refLink = refLinkWithSubId('lucky_wheel');

const segments = [
  { label: '50 FS', highlight: false, weight: 10 },
  { label: 'БОНУС 100%', highlight: false, weight: 15 },
  { label: '150 FS', highlight: false, weight: 10 },
  { label: 'БОНУС 200%', highlight: false, weight: 15 },
  { label: '250 FS', highlight: false, weight: 8 },
  { label: 'БОНУС 300%', highlight: false, weight: 12 },
  { label: '100 USDT', highlight: false, weight: 5 },
  { label: '360% + 100FS', highlight: true, weight: 25 },
];

const segmentAngle = 360 / segments.length;

function pickWeightedSegment(): number {
  const totalWeight = segments.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < segments.length; i++) {
    roll -= segments[i].weight;
    if (roll <= 0) return i;
  }
  return segments.length - 1;
}

const conicGradient = `conic-gradient(${segments
  .map((s, i) => {
    const from = i * segmentAngle;
    const to = from + segmentAngle;
    const color = s.highlight ? 'var(--color-accent)' : i % 2 === 0 ? 'var(--color-card)' : 'var(--color-border)';
    return `${color} ${from}deg ${to}deg`;
  })
  .join(', ')})`;

export default function LuckyWheel() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const spinTimeoutRef = useRef<number | undefined>(undefined);

  // Компонент не размонтируется в текущем приложении (нет роутинга), но таймер
  // на 4.2с без очистки — классический источник "setState после unmount" при
  // будущих изменениях (например, если секцию сделают условно скрываемой).
  useEffect(() => {
    return () => window.clearTimeout(spinTimeoutRef.current);
  }, []);

  const handleSpin = () => {
    if (isSpinning || result) return;

    const winningIndex = pickWeightedSegment();
    const segmentCenter = winningIndex * segmentAngle + segmentAngle / 2;
    const fullSpins = 5 * 360;
    const targetRotation = fullSpins + (360 - segmentCenter);

    setIsSpinning(true);
    setRotation(targetRotation);
    trackEvent('wheel_spin', { result: segments[winningIndex].label });

    spinTimeoutRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setResult(segments[winningIndex].label);
    }, 4200);
  };

  return (
    <section id="lucky-wheel" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[color-mix(in_srgb,var(--color-accent-2)_5%,transparent)] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--color-border)] border border-[var(--color-border-soft)] text-[var(--color-accent)] text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              <span>Daily Lucky Spin</span>
            </span>

            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
              КРУТИ КОЛЕСО — <br />
              <span className="text-[var(--color-accent)]">ЗАБИРАЙ БОНУС ПРЯМО СЕЙЧАС</span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Один бесплатный спин уже ждёт тебя. Никакого депозита — просто нажми «Вращать» и получи гарантированный бонус на первый депозит на BC.Game.
            </p>

            <ul className="space-y-3 text-sm text-gray-400 inline-block text-left">
              <li className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <span>Гарантированный приз в каждом спине</span>
              </li>
              <li className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <span>Без депозита и скрытых условий</span>
              </li>
              <li className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <span>Активация сразу после регистрации</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[var(--color-accent)] drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]"></div>

              <motion.div
                className="w-full h-full rounded-full border-[6px] border-[var(--color-border)] shadow-[0_0_60px_color-mix(in_srgb,var(--color-accent)_15%,transparent)] relative"
                style={{ background: conicGradient }}
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: [0.21, 0.62, 0.15, 1] }}
              >
                {segments.map((s, i) => {
                  const angle = i * segmentAngle + segmentAngle / 2 - 90;
                  return (
                    <div
                      key={s.label}
                      className="absolute top-1/2 left-1/2 w-1/2 origin-left flex items-center justify-end pr-4"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <span className={`text-[10px] sm:text-xs font-black tracking-tight whitespace-nowrap ${s.highlight ? 'text-black' : 'text-white'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </motion.div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[var(--color-bg)] border-4 border-[var(--color-accent)] flex items-center justify-center z-10 shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]">
                <span className="text-xl" aria-hidden="true">⚡</span>
              </div>
            </div>

            <div className="mt-10 w-full max-w-xs">
              {!result ? (
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-full bg-[var(--color-accent)] text-black px-8 py-5 rounded-2xl font-black text-lg tracking-wide hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_50%,transparent)] hover:-translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSpinning ? 'КРУТИТСЯ...' : 'ВРАЩАТЬ КОЛЕСО'}
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center" role="status" aria-live="polite">
                  <div className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Твой приз</div>
                  <div className="text-2xl font-black text-[var(--color-accent)] mb-6">{result}</div>
                  <a
                    href={refLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('cta_click', { location: 'lucky_wheel', label: result })}
                    className="w-full inline-flex items-center justify-center bg-[var(--color-accent)] text-black px-8 py-5 rounded-2xl font-black text-lg tracking-wide hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_50%,transparent)] hover:-translate-y-1 transition-all"
                  >
                    ЗАБРАТЬ ВЫИГРЫШ
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
