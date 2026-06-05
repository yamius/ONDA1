import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { langFromPath, langHref } from '../i18n'

// Proof / trust. Rating + reviews stay honest (no invented social proof).
// The science screen shows the research is in the app, not buried in a blog.
export function ProofSection() {
  const { t } = useTranslation('home')
  const lang = langFromPath(useLocation().pathname)

  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-14">
          {/* Left: the claims */}
          <div className="md:flex-1 text-center md:text-left">
            <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
              {t('proof.tag')}
            </h2>
            <h3 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
              {t('proof.title')}
            </h3>

            <p className="mb-3 max-w-xl text-base leading-relaxed text-white/60">
              {t('proof.science')}
            </p>
            <Link
              to={langHref('/research', lang)}
              className="inline-block font-mono text-xs text-terminal-cyan transition-colors hover:text-terminal-green"
            >
              {t('proof.scienceCta')}
            </Link>

            <p className="mt-8 max-w-xl rounded-xl border border-terminal-green/15 bg-terminal-green/[0.04] px-5 py-4 font-mono text-sm leading-relaxed text-white/70">
              {t('proof.trust')}
            </p>

            <p className="mt-6 font-mono text-[11px] text-white/35">
              {t('proof.advisor')} · {t('proof.ratingPending')}
            </p>
          </div>

          {/* Right: the in-app science screen */}
          <div className="w-full max-w-[220px] md:flex-shrink-0">
            <figure className="flex flex-col items-center">
              <img
                src="/images/home/proof.webp"
                alt={t('proof.shotAlt')}
                loading="lazy"
                width="940"
                height="1960"
                className="w-full rounded-[1.9rem] shadow-2xl shadow-black/40 ring-1 ring-white/10"
              />
              <figcaption className="mt-4 text-center font-mono text-[11px] leading-relaxed text-white/45">
                {t('proof.shotCaption')}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
