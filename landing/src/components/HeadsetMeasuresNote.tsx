import { Link } from 'react-router-dom'
import { langHref, type Lang } from '../i18n'
import { HEADSET_MEASURES } from '../data/headset-measures-i18n'

/** Neutral "What a headset measures" note for EEG / fNIRS / neurofeedback pages. Pure render (prerender-safe). */
export default function HeadsetMeasuresNote({ lang }: { lang: Lang }) {
  const t = HEADSET_MEASURES[lang] ?? HEADSET_MEASURES.en
  return (
    <aside
      role="note"
      data-block="headset-measures"
      className="not-prose mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5"
    >
      <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-white/70">ⓘ {t.title}</h2>
      <ul className="mb-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-white/75">
        {t.items.map((it) => (
          <li key={it.lead}>
            <strong className="font-semibold text-white/90">{it.lead}</strong> {it.text}
          </li>
        ))}
      </ul>
      <Link
        to={langHref('/science/evidence/eeg-neurofeedback', lang)}
        className="text-sm text-white/80 underline decoration-white/30 underline-offset-2 hover:decoration-white/70"
      >
        {t.link}
      </Link>
    </aside>
  )
}
