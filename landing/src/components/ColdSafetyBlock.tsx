import { Link } from 'react-router-dom'
import { langHref, type Lang } from '../i18n'
import { COLD_SAFETY } from '../data/cold-safety-i18n'

/** Articles with a cold-exposure protocol that get the block. */
export const COLD_SAFETY_ARTICLE_SLUGS = new Set([
  'longevity-protocol-biological-clock-reset',
  'adaptation-hack-range-fractionation',
  'longevity-hardware-cellular-cleanup',
])

/** "Safety first" warning for cold-plunge pages. Pure render (prerender-safe). */
export default function ColdSafetyBlock({ lang }: { lang: Lang }) {
  const t = COLD_SAFETY[lang] ?? COLD_SAFETY.en
  return (
    <aside
      role="note"
      data-block="cold-safety"
      className="not-prose mb-8 rounded-xl border border-amber-400/40 bg-amber-400/[0.06] p-5"
    >
      <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-amber-300">⚠ {t.title}</h2>
      <p className="mb-3 text-[15px] font-semibold leading-relaxed text-white/90">{t.shock}</p>
      <ul className="mb-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-white/75">
        {t.items.map((it) => <li key={it}>{it}</li>)}
      </ul>
      <Link
        to={langHref('/science/evidence/cold-exposure', lang)}
        className="text-sm text-amber-300 underline decoration-amber-300/40 underline-offset-2 hover:decoration-amber-300"
      >
        {t.link}
      </Link>
    </aside>
  )
}
