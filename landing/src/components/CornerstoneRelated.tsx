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

const CORNERSTONES = ['hrv-biofeedback', 'resonance-breathing', 'hrv-vs-coherence', 'apple-watch-hrv-biofeedback'] as const
type Cornerstone = (typeof CORNERSTONES)[number]

/** Copy per language (these pages exist in en/ru/es). */
const COPY: Record<'en' | 'ru' | 'es', { heading: string; items: Record<Cornerstone, { label: string; blurb: string }> }> = {
  en: {
    heading: 'Related explainers',
    items: {
      'hrv-biofeedback': { label: 'HRV biofeedback', blurb: 'What it is, how the loop works, the evidence.' },
      'resonance-breathing': { label: 'Resonance breathing', blurb: 'Why ~6 breaths a minute maximises HRV.' },
      'hrv-vs-coherence': { label: 'HRV vs coherence', blurb: 'The raw variation vs how smooth it is.' },
      'apple-watch-hrv-biofeedback': { label: 'HRV biofeedback on Apple Watch', blurb: 'What the Watch measures, and the live loop.' },
    },
  },
  ru: {
    heading: 'Связанные материалы',
    items: {
      'hrv-biofeedback': { label: 'Биофидбек ВСР', blurb: 'Что это такое, как работает петля обратной связи и что говорят исследования.' },
      'resonance-breathing': { label: 'Резонансное дыхание', blurb: 'Почему около 6 вдохов в минуту максимально повышают ВСР.' },
      'hrv-vs-coherence': { label: 'ВСР и когерентность', blurb: 'Сама вариабельность — и насколько она плавная.' },
      'apple-watch-hrv-biofeedback': { label: 'Биофидбек ВСР на Apple Watch', blurb: 'Что измеряют часы и как работает живая обратная связь.' },
    },
  },
  es: {
    heading: 'Explicaciones relacionadas',
    items: {
      'hrv-biofeedback': { label: 'Biofeedback de VFC', blurb: 'Qué es, cómo funciona el circuito y qué dice la evidencia.' },
      'resonance-breathing': { label: 'Respiración de resonancia', blurb: 'Por qué unas 6 respiraciones por minuto maximizan la VFC.' },
      'hrv-vs-coherence': { label: 'VFC frente a coherencia', blurb: 'La variación en bruto frente a lo regular que es.' },
      'apple-watch-hrv-biofeedback': { label: 'Biofeedback de VFC en Apple Watch', blurb: 'Qué mide el reloj y cómo funciona el circuito en vivo.' },
    },
  },
}

/** Cornerstone slugs that have ru/es localized routes. Add a slug here when it
 *  is localized so the mesh can link within-language. */
const LOCALIZED = new Set<string>(['hrv-biofeedback', 'resonance-breathing', 'hrv-vs-coherence', 'apple-watch-hrv-biofeedback'])

function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
}

export function CornerstoneRelated({ current, lang = 'en' }: { current: string; lang?: string }) {
  const others = CORNERSTONES.filter((c) => c !== current)
  const prefix = prefixFor(lang)
  const copy = COPY[lang === 'ru' || lang === 'es' ? lang : 'en']
  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{copy.heading}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {others.map((c) => {
          const to = prefix && LOCALIZED.has(c) ? `${prefix}/${c}` : `/${c}`
          return (
            <Link
              key={c}
              to={to}
              className="block rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-terminal-green/40 hover:bg-terminal-green/5"
            >
              <div className="font-semibold text-white/90">{copy.items[c].label}</div>
              <p className="mt-1 font-mono text-xs leading-relaxed text-white/50">{copy.items[c].blurb}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
