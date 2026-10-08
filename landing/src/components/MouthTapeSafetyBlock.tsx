import { Link } from 'react-router-dom'
import { langHref, type Lang } from '../i18n'
import { MOUTH_TAPE_SAFETY } from '../data/mouth-tape-safety-i18n'

/** Review category that gets the block (criteria.ts). */
export const MOUTH_TAPE_SAFETY_CATEGORY = 'breathing-aid'

/** Nasal dilators: shown the dilator variant (no tape-only bullets). */
export const NASAL_DILATOR_SLUGS = new Set([
  'intake-breathing',
  'breathe-right-original',
  'mute-nasal-dilator',
])

/** 'dilator' only if every product on the page is a dilator; otherwise the full tape variant. */
export function mouthTapeSafetyVariant(slugs: string[]): 'tape' | 'dilator' {
  return slugs.length > 0 && slugs.every((s) => NASAL_DILATOR_SLUGS.has(s)) ? 'dilator' : 'tape'
}

/** "Safety first" warning for mouth-tape / nasal-dilator pages. Pure render (prerender-safe). */
export default function MouthTapeSafetyBlock({ lang, variant = 'tape' }: { lang: Lang; variant?: 'tape' | 'dilator' }) {
  const t = MOUTH_TAPE_SAFETY[lang] ?? MOUTH_TAPE_SAFETY.en
  const items = variant === 'dilator'
    ? [t.apnea, t.stop]
    : [t.nose, t.apnea, t.alcohol, t.children, t.sick, t.stop]
  return (
    <aside
      role="note"
      data-block="mouth-tape-safety"
      data-variant={variant}
      className="not-prose mb-8 rounded-xl border border-amber-400/40 bg-amber-400/[0.06] p-5"
    >
      <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-amber-300">⚠ {t.title}</h2>
      <ul className="mb-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-white/75">
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
      <Link
        to={langHref('/science/evidence/nasal-breathing', lang)}
        className="text-sm text-amber-300 underline decoration-amber-300/40 underline-offset-2 hover:decoration-amber-300"
      >
        {t.link}
      </Link>
    </aside>
  )
}
