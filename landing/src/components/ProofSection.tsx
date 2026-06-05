import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { langFromPath, langHref } from '../i18n'

// Proof / trust. Rating + reviews slots stay empty until real ones exist
// (honest by construction — no invented social proof).
export function ProofSection() {
  const { t } = useTranslation('home')
  const lang = langFromPath(useLocation().pathname)

  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('proof.tag')}
        </h2>
        <h3 className="mb-10 text-2xl font-bold tracking-tight md:text-4xl">
          {t('proof.title')}
        </h3>

        {/* Science-grounded line → /research */}
        <p className="mx-auto mb-3 max-w-2xl text-base leading-relaxed text-white/60">
          {t('proof.science')}
        </p>
        <Link
          to={langHref('/research', lang)}
          className="inline-block font-mono text-xs text-terminal-cyan transition-colors hover:text-terminal-green"
        >
          {t('proof.scienceCta')}
        </Link>

        {/* Trust line (the 90-seconds friction-reducer) */}
        <p className="mx-auto mt-10 max-w-xl rounded-xl border border-terminal-green/15 bg-terminal-green/[0.04] px-5 py-4 font-mono text-sm leading-relaxed text-white/70">
          {t('proof.trust')}
        </p>

        {/* Light advisor note + reviews-pending slot */}
        <p className="mt-6 font-mono text-[11px] text-white/35">
          {t('proof.advisor')} · {t('proof.ratingPending')}
        </p>
      </div>
    </section>
  )
}
