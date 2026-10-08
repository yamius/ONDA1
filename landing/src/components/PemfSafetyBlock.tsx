import { Link } from 'react-router-dom'
import { langHref, type Lang } from '../i18n'
import { PEMF_SAFETY } from '../data/pemf-safety-i18n'

/** "Safety first" warning for PEMF device pages (reviews, round-ups, duels). Pure render (prerender-safe). */
export default function PemfSafetyBlock({ lang }: { lang: Lang }) {
  const t = PEMF_SAFETY[lang] ?? PEMF_SAFETY.en
  return (
    <aside
      role="note"
      data-block="pemf-safety"
      className="not-prose mb-8 rounded-xl border border-amber-400/40 bg-amber-400/[0.06] p-5"
    >
      <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-amber-300">⚠ {t.title}</h2>
      <ul className="mb-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-white/75">
        {t.items.map((it) => (
          <li key={it.lead}>
            <strong className="font-semibold text-white/90">{it.lead}</strong> {it.text}
          </li>
        ))}
      </ul>
      <p className="mb-3 text-xs leading-relaxed text-white/55">{t.note}</p>
      <Link
        to={langHref('/science/evidence/pemf', lang)}
        className="text-sm text-amber-300 underline decoration-amber-300/40 underline-offset-2 hover:decoration-amber-300"
      >
        {t.link}
      </Link>
    </aside>
  )
}
