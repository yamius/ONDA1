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
import { Link } from 'react-router-dom'

export function ExperientialFrameworkNote() {
  return (
    <aside className="mx-auto mt-16 max-w-3xl rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-terminal-amber/80">
        Experiential framework — not a medical claim
      </div>
      <p className="font-mono text-xs leading-relaxed text-white/55">
        The ONDA Path — its levels, stages and higher-state language — is an experiential
        framework: a practice and a way of describing subjective experience, not a hierarchy of
        clinically validated biological states. The evidence-backed part of ONDA is HRV biofeedback
        and paced breathing — see{' '}
        <Link to="/research" className="text-terminal-green hover:underline">the science behind ONDA</Link>{' '}
        and{' '}
        <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>.
      </p>
    </aside>
  )
}
