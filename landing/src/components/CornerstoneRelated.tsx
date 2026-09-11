/**
 * "Related explainers" block for the cornerstone cluster (HRV biofeedback,
 * resonance breathing, HRV vs coherence, Apple Watch HRV). Rendered at the
 * foot of each cornerstone page, linking to the other three — a complete
 * internal-link mesh so every cornerstone gets sibling inbound links and the
 * topic cluster reads as one authority hub.
 *
 * lang-aware: links to a localized sibling only when that sibling is itself
 * localized (LOCALIZED set); otherwise it links to the EN page (which always
 * exists), so a /ru page never points at a /ru sibling that doesn't exist yet.
 */
import { Link } from 'react-router-dom'

const CORNERSTONES = [
  { slug: 'hrv-biofeedback', label: 'HRV biofeedback', blurb: 'What it is, how the loop works, the evidence.' },
  { slug: 'resonance-breathing', label: 'Resonance breathing', blurb: 'Why ~6 breaths a minute maximises HRV.' },
  { slug: 'hrv-vs-coherence', label: 'HRV vs coherence', blurb: 'The raw variation vs how smooth it is.' },
  { slug: 'apple-watch-hrv-biofeedback', label: 'HRV biofeedback on Apple Watch', blurb: 'What the Watch measures, and the live loop.' },
] as const

/** Cornerstone slugs that have ru/es localized routes. Add a slug here when it
 *  is localized so the mesh can link within-language. */
const LOCALIZED = new Set<string>(['hrv-biofeedback', 'resonance-breathing'])

function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
}

export function CornerstoneRelated({ current, lang = 'en' }: { current: string; lang?: string }) {
  const others = CORNERSTONES.filter((c) => c.slug !== current)
  const prefix = prefixFor(lang)
  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Related explainers</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {others.map((c) => {
          const to = prefix && LOCALIZED.has(c.slug) ? `${prefix}/${c.slug}` : `/${c.slug}`
          return (
            <Link
              key={c.slug}
              to={to}
              className="block rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-terminal-green/40 hover:bg-terminal-green/5"
            >
              <div className="font-semibold text-white/90">{c.label}</div>
              <p className="mt-1 font-mono text-xs leading-relaxed text-white/50">{c.blurb}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
