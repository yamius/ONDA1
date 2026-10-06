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
import { langHref, type Lang } from '../i18n'

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

/** "The science behind this topic" — links to /science pages per cornerstone.
 *  Labels are the science page titles in that language; paths are bare EN
 *  /science/... paths localized by langHref. */
const SCIENCE: Record<'en' | 'ru' | 'es', { heading: string; items: Record<Cornerstone, { href: string; label: string }[]> }> = {
  "en": {
    "heading": "The science behind this topic",
    "items": {
      "hrv-biofeedback": [
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "HRV Biofeedback: What the Evidence Shows"
        },
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "How Breathing Changes HRV — and Why Slow Breathing Raises It"
        },
        {
          "href": "/science/concepts/heart-rate-variability",
          "label": "Heart Rate Variability: What It Is, What It Reflects, What It Isn't"
        },
        {
          "href": "/science/evidence/slow-breathing",
          "label": "Slow Breathing: What the Evidence Shows"
        }
      ],
      "resonance-breathing": [
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "How Breathing Changes HRV — and Why Slow Breathing Raises It"
        },
        {
          "href": "/science/concepts/respiratory-sinus-arrhythmia",
          "label": "Respiratory Sinus Arrhythmia: How Breathing Shapes Your Heart Rhythm"
        },
        {
          "href": "/science/evidence/slow-breathing",
          "label": "Slow Breathing: What the Evidence Shows"
        },
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "HRV Biofeedback: What the Evidence Shows"
        }
      ],
      "hrv-vs-coherence": [
        {
          "href": "/science/concepts/heart-rate-variability",
          "label": "Heart Rate Variability: What It Is, What It Reflects, What It Isn't"
        },
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "How Breathing Changes HRV — and Why Slow Breathing Raises It"
        },
        {
          "href": "/science/mechanisms/heart-brain-interaction",
          "label": "Heart–Brain Interaction: How the Heart and Brain Talk to Each Other"
        },
        {
          "href": "/science/concepts/interpreting-hrv",
          "label": "What a Single HRV Value Can and Can't Tell You"
        }
      ],
      "apple-watch-hrv-biofeedback": [
        {
          "href": "/science/measurements/heart-rate-variability",
          "label": "Can You Trust HRV From a Smartwatch or Ring?"
        },
        {
          "href": "/science/concepts/sdnn",
          "label": "SDNN — What This HRV Metric Measures, and What It Doesn't"
        },
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "HRV Biofeedback: What the Evidence Shows"
        },
        {
          "href": "/science/measurements/onda-method",
          "label": "How ONDA Measures and Interprets Your Body's Signals"
        }
      ]
    }
  },
  "ru": {
    "heading": "Научная основа темы",
    "items": {
      "hrv-biofeedback": [
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "HRV-биофидбек: что показывают исследования"
        },
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "Как дыхание меняет HRV — и почему медленное дыхание его повышает"
        },
        {
          "href": "/science/concepts/heart-rate-variability",
          "label": "Вариабельность сердечного ритма: что это, что она отражает и чем не является"
        },
        {
          "href": "/science/evidence/slow-breathing",
          "label": "Медленное дыхание: что показывают исследования"
        }
      ],
      "resonance-breathing": [
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "Как дыхание меняет HRV — и почему медленное дыхание его повышает"
        },
        {
          "href": "/science/concepts/respiratory-sinus-arrhythmia",
          "label": "Дыхательная синусовая аритмия: как дыхание формирует ритм сердца"
        },
        {
          "href": "/science/evidence/slow-breathing",
          "label": "Медленное дыхание: что показывают исследования"
        },
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "HRV-биофидбек: что показывают исследования"
        }
      ],
      "hrv-vs-coherence": [
        {
          "href": "/science/concepts/heart-rate-variability",
          "label": "Вариабельность сердечного ритма: что это, что она отражает и чем не является"
        },
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "Как дыхание меняет HRV — и почему медленное дыхание его повышает"
        },
        {
          "href": "/science/mechanisms/heart-brain-interaction",
          "label": "Взаимодействие сердца и мозга: как они общаются друг с другом"
        },
        {
          "href": "/science/concepts/interpreting-hrv",
          "label": "Что одно значение HRV может и чего не может сказать"
        }
      ],
      "apple-watch-hrv-biofeedback": [
        {
          "href": "/science/measurements/heart-rate-variability",
          "label": "Можно ли доверять HRV со смарт-часов или кольца?"
        },
        {
          "href": "/science/concepts/sdnn",
          "label": "SDNN: что измеряет этот показатель HRV, а что — нет"
        },
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "HRV-биофидбек: что показывают исследования"
        },
        {
          "href": "/science/measurements/onda-method",
          "label": "Как ONDA измеряет и интерпретирует сигналы вашего тела"
        }
      ]
    }
  },
  "es": {
    "heading": "La ciencia detrás de este tema",
    "items": {
      "hrv-biofeedback": [
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "Biofeedback de HRV: qué muestra la evidencia"
        },
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "Cómo la respiración cambia la HRV y por qué la respiración lenta la aumenta"
        },
        {
          "href": "/science/concepts/heart-rate-variability",
          "label": "Variabilidad de la frecuencia cardíaca: qué es, qué refleja y qué no es"
        },
        {
          "href": "/science/evidence/slow-breathing",
          "label": "Respiración lenta: qué muestra la evidencia"
        }
      ],
      "resonance-breathing": [
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "Cómo la respiración cambia la HRV y por qué la respiración lenta la aumenta"
        },
        {
          "href": "/science/concepts/respiratory-sinus-arrhythmia",
          "label": "Arritmia sinusal respiratoria: cómo la respiración moldea el ritmo cardíaco"
        },
        {
          "href": "/science/evidence/slow-breathing",
          "label": "Respiración lenta: qué muestra la evidencia"
        },
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "Biofeedback de HRV: qué muestra la evidencia"
        }
      ],
      "hrv-vs-coherence": [
        {
          "href": "/science/concepts/heart-rate-variability",
          "label": "Variabilidad de la frecuencia cardíaca: qué es, qué refleja y qué no es"
        },
        {
          "href": "/science/mechanisms/breathing-and-hrv",
          "label": "Cómo la respiración cambia la HRV y por qué la respiración lenta la aumenta"
        },
        {
          "href": "/science/mechanisms/heart-brain-interaction",
          "label": "Interacción corazón-cerebro: cómo se comunican el corazón y el cerebro"
        },
        {
          "href": "/science/concepts/interpreting-hrv",
          "label": "Lo que un solo valor de HRV puede y no puede decirte"
        }
      ],
      "apple-watch-hrv-biofeedback": [
        {
          "href": "/science/measurements/heart-rate-variability",
          "label": "¿Puedes fiarte de la HRV de un reloj o un anillo inteligente?"
        },
        {
          "href": "/science/concepts/sdnn",
          "label": "SDNN: qué mide esta métrica de HRV y qué no"
        },
        {
          "href": "/science/evidence/hrv-biofeedback",
          "label": "Biofeedback de HRV: qué muestra la evidencia"
        },
        {
          "href": "/science/measurements/onda-method",
          "label": "Cómo mide e interpreta ONDA las señales de tu cuerpo"
        }
      ]
    }
  }
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
  const key = lang === 'ru' || lang === 'es' ? lang : 'en'
  const copy = COPY[key]
  const science = SCIENCE[key]
  return (
    <>
    <section className="mt-16 border-t border-white/10 pt-10">
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{science.heading}</h2>
      <ul className="space-y-2 text-sm">
        {science.items[current as Cornerstone]?.map((l) => (
          <li key={l.href}>
            <Link to={langHref(l.href, key as Lang)} className="text-terminal-green/80 hover:text-terminal-green hover:underline">
              {l.label} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
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
    </>
  )
}
