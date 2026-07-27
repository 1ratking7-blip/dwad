import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Accessible modal for easter egg #3 (the rare lightning window in
 * NightSkyline). Same Escape/click-outside/focus-return conventions as
 * LanguageSwitcher's dropdown: focus moves into the dialog on open and back
 * to the trigger on close, Escape closes, backdrop click closes.
 */
export default function ProjectFactsModal({ open, onClose }: Props) {
  const { t } = useLocale();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  // Portaled to document.body — this modal is triggered from a button
  // nested inside NightSkyline, whose wrapper gets a JS-driven CSS
  // `transform` from the parallax hook on mousemove. A `transform` on any
  // ancestor makes that ancestor the containing block for `position: fixed`
  // descendants (a CSS spec quirk, not a bug in this component), which
  // silently shrank this modal's "fixed inset-0" backdrop down to
  // NightSkyline's own box instead of the real viewport and pushed it below
  // the Hero text in stacking order — found via Playwright QA (the backdrop
  // measured exactly NightSkyline's 820px height instead of the viewport's).
  // Portaling to <body> sidesteps the whole class of ancestor-transform/
  // filter/will-change containing-block issues for good.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-facts-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="chamfered relative w-full max-w-md p-8 max-h-[85vh] overflow-y-auto border border-[var(--color-border-emerald)]"
            style={{
              background: 'color-mix(in srgb, var(--color-bg) 94%, black)',
              boxShadow: '0 25px 60px -20px rgba(0,0,0,0.85), 0 0 40px -10px color-mix(in srgb, var(--color-accent) 15%, transparent)',
            }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg p-1.5"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="flex items-center space-x-2 mb-5">
              <Zap className="w-5 h-5 text-[var(--color-gold)]" aria-hidden="true" />
              <h2 id="project-facts-title" className="text-lg font-black text-[var(--color-text)] tracking-tight">
                {t.easterEggs.lightningModalTitle}
              </h2>
            </div>

            <ul className="space-y-3">
              {t.easterEggs.lightningModalFacts.map((fact, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" aria-hidden="true" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onClose}
              className="btn-glow btn-premium shine-sweep chamfered-sm w-full mt-7 py-3 font-bold text-sm"
            >
              {t.easterEggs.lightningModalClose}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
