
import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Games from './components/Games';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import SocialProof from './components/SocialProof';
import LuckyWheel from './components/LuckyWheel';
import UrgencyTimer from './components/UrgencyTimer';
import { trackEvent } from './lib/analytics';
import { REF_LINK } from './lib/links';

function App() {
  useEffect(() => {
    trackEvent('page_view');
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Header />
        <SocialProof />
        <main>
          <Hero />
          <LuckyWheel />
          <Games />
          {/* Bonus Section (CTA) */}
          <section id="bonuses" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)] blur-[120px] rounded-full pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="bg-gradient-to-br from-[var(--color-card)] to-[var(--color-bg-darker)] border border-[var(--color-border)] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="text-[120px] font-black text-white/5 select-none leading-none">360%</div>
                </div>

                <h2 className="text-3xl md:text-6xl font-black mb-8 text-white tracking-tight">
                  ГОТОВ К МАКСИМАЛЬНОМУ <br />
                  <span className="text-[var(--color-accent)]">ПРОФИТУ?</span>
                </h2>
                <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                  Регистрируйся по нашей ссылке и получи доступ к закрытому VIP-клубу, персональным бонусам и ежедневному колесу фортуны с призами в реальной крипте.
                </p>

                <a
                  href={REF_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('cta_click', { location: 'bonus_section' })}
                  className="inline-flex items-center space-x-3 bg-[var(--color-accent)] text-black px-12 py-6 rounded-2xl font-black text-xl tracking-wide hover:shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_40%,transparent)] transition-all"
                >
                  <span>ЗАБРАТЬ 360% БОНУС (ОСТАЛОСЬ <UrgencyTimer />)</span>
                </a>
                <p className="text-gray-400 text-xs mt-4">* Бонусное окно обновляется каждый час</p>
              </div>
            </div>
          </section>

          <HowItWorks />
          <FAQ />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
