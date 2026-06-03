import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'

interface ToolEntry {
  slug: string
  name: string
  blurb: string
  live: boolean
}

const TOOLS: ToolEntry[] = [
  {
    slug: 'hrv',
    name: 'HRV Interpreter',
    blurb: 'Enter your age and resting HRV (RMSSD) to see where it lands against population norms — and what moves it.',
    live: true,
  },
  {
    slug: 'caffeine',
    name: 'Caffeine Cut-Off Calculator',
    blurb: 'Find the latest you can have your last coffee before bed without leaving sleep-disrupting caffeine in your system.',
    live: true,
  },
  {
    slug: 'sleep-debt',
    name: 'Sleep Debt Calculator',
    blurb: 'Add up your last 7 nights to see your accumulated sleep deficit against your age-based need — and how to repay it.',
    live: true,
  },
  {
    slug: 'zone-2',
    name: 'Zone 2 Heart Rate Calculator',
    blurb: 'Find your aerobic-base (Zone 2) heart rate and all 5 training zones from your age — using the accurate Tanaka formula.',
    live: true,
  },
  {
    slug: 'chronotype',
    name: 'Chronotype Quiz',
    blurb: 'Six questions to find your body-clock type — morning, intermediate or evening — with a personalised daily-timing protocol.',
    live: true,
  },
  {
    slug: 'protein',
    name: 'Protein Intake Calculator',
    blurb: 'Get your daily protein target in grams from your bodyweight and goal — based on ISSN/ACSM guidelines — plus a per-meal split.',
    live: true,
  },
  {
    slug: 'vo2max',
    name: 'VO₂max Estimator',
    blurb: 'Estimate your cardiorespiratory fitness from your resting and max heart rate, and see where it ranks against age- and sex-based norms.',
    live: true,
  },
  {
    slug: 'tdee',
    name: 'TDEE Calculator',
    blurb: 'Find your total daily calorie burn with the Mifflin–St Jeor equation, plus a calorie target and macro split for your goal.',
    live: true,
  },
  {
    slug: 'water',
    name: 'Water Intake Calculator',
    blurb: 'Estimate your daily water target from bodyweight, with adjustments for exercise, hot weather and high caffeine or alcohol intake.',
    live: true,
  },
  {
    slug: 'alcohol',
    name: 'Alcohol Clearance Calculator',
    blurb: 'Estimate your blood-alcohol level and how long until it clears, with the Widmark equation — and why drinks cost you a night of recovery.',
    live: true,
  },
  {
    slug: 'fasting',
    name: 'Intermittent Fasting Calculator',
    blurb: 'Pick a protocol (16:8, 18:6, 20:4, OMAD) and first-meal time to get your eating and fasting windows, plus a metabolic-phase timeline.',
    live: true,
  },
]

export function ToolsPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  useEffect(() => {
    document.title = 'Biohacking Tools & Calculators | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Tools</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Biohacking Tools</h1>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        Free interactive calculators for the metrics that matter — read your numbers
        against the evidence, then track them automatically in ONDA Life.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {TOOLS.map((t) => (
          <Link
            key={t.slug}
            to={`${langPrefix}/tools/${t.slug}`}
            className="block rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-terminal-green/40 hover:bg-terminal-green/5"
          >
            <div className="mb-1 flex items-center gap-3">
              <span className="font-semibold text-white/90">{t.name}</span>
              <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-2 py-0.5 font-mono text-[10px] text-terminal-green/80">live</span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/50">{t.blurb}</p>
          </Link>
        ))}
      </div>

    </main>
  )
}
