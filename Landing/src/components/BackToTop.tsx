import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';

const SHOW_AFTER_PX = 600;

export default function BackToTop() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.backToTop}
      className={`btn-glow fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--color-accent)] text-black shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_40%,transparent)] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
