import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import FollowMe from './FollowMe';

/**
 * Own top-level section (was previously nested inside Footer) — the user
 * explicitly asked for social links to live in their own tab/section
 * instead of at the bottom of the page. Header links here via #social.
 */
export default function Social() {
  const { t } = useLocale();

  return (
    <section id="social" className="py-24 bg-[color-mix(in_srgb,var(--color-bg-darker)_92%,transparent)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tight">
            {t.footer.followMeHeading}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">{t.footer.followMeSubtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FollowMe />
        </motion.div>
      </div>
    </section>
  );
}
