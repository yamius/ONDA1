/**
 * "Related explainers" block for the cornerstone cluster (HRV biofeedback,
 * resonance breathing, HRV vs coherence, Apple Watch HRV). Rendered at the
 * foot of each cornerstone page, linking to the other three — a complete
 * internal-link mesh so every cornerstone gets sibling inbound links and the
 * topic cluster reads as one authority hub. EN-only (these pages are EN-only).
 */
import { Link } from 'react-router-dom'

const CORNERSTONES = [
  { slug: 'hrv-biofeedback', label: 'HRV biofeedback', blurb: 'What it is, how the loop works, the evidence.' },
  { slug: 'resonance-breathing', label: 'Resonance breathing', blurb: 'Why ~6 breaths a minute maximises HRV.' },
  { slug: 'hrv-vs-coherence', label: 'HRV vs coherence', blurb: 'The raw variation vs how smooth it is.' },
  { slug: 'apple-watch-hrv-biofeedback', label: 'HRV biofeedback on Apple Watch', blurb: 'What the Watch measures, and the live loop.' },
] as const

export function CornerstoneRelated({ current }: { current: string }) {
  const others = CORNERSTONES.filter((c) => c.slug !== current)
  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Related explainers</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {others.map((c) => (
          <Link
            key={c.slug}
            to={`/${c.slug}`}
            className="block rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-terminal-green/40 hover:bg-terminal-green/5"
          >
            <div className="font-semibold text-white/90">{c.label}</div>
            <p className="mt-1 font-mono text-xs leading-relaxed text-white/50">{c.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
