/**
 * ExperientialFrameworkNote — the honest evidence-vs-philosophy disclaimer
 * placed at the bottom of ONDA's experiential/philosophy pages (Inner
 * Spectrum, levels, parts, The Stack).
 *
 * Purpose (GEO/E-E-A-T): mark the ONDA Path clearly as an experiential
 * framework, not validated biology, so readers and AI systems never mistake
 * the philosophy layer for the evidence-backed product (HRV biofeedback +
 * paced breathing). Saying this plainly raises trust in both layers.
 */
import { Link, useLocation } from 'react-router-dom'
import { langFromPath, langHref } from '../i18n'
import { splitAt, ui } from '../data/ui-i18n'

export function ExperientialFrameworkNote() {
  const lang = langFromPath(useLocation().pathname)
  const u = ui(lang)
  const [before, mid, after] = splitAt(u.efnBody, 'science', 'measures')
  return (
    <aside className="mx-auto mt-16 max-w-3xl rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-terminal-amber/80">
        {u.efnLabel}
      </div>
      <p className="font-mono text-xs leading-relaxed text-white/55">
        {before}
        <Link to={langHref('/research', lang)} className="text-terminal-green hover:underline">{u.efnScience}</Link>
        {mid}
        <Link to={langHref('/measurements', lang)} className="text-terminal-green hover:underline">{u.efnMeasures}</Link>
        {after}
      </p>
    </aside>
  )
}
