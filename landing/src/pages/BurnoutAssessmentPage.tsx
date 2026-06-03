import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  BURNOUT_QUESTIONS,
  BURNOUT_PROFILES,
  BURNOUT_FAQ,
  BURNOUT_SOURCES,
  BURNOUT_METHODOLOGY,
  scoreToBurnout,
} from '../data/burnout-assessment'
import { SourcesSection } from '../components/SourcesSection'

const TIER_COLOR: Record<string, string> = {
  low: 'text-terminal-green',
  building: 'text-terminal-cyan',
  high: 'text-amber-400',
  severe: 'text-red-400',
}

export function BurnoutAssessmentPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [answers, setAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    document.title = 'Burnout Test — Free Stress-Load Self-Assessment | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === BURNOUT_QUESTIONS.length

  const result = useMemo(() => {
    if (!complete) return null
    const total = Object.values(answers).reduce((a, b) => a + b, 0)
    const { tier, percent } = scoreToBurnout(total)
    return { profile: BURNOUT_PROFILES[tier], percent }
  }, [answers, complete])

  const choose = (qid: string, points: number) => setAnswers((prev) => ({ ...prev, [qid]: points }))
  const reset = () => {
    setAnswers({})
    window.scrollTo({ top: 0 })
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Burnout Test</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Burnout Self-Assessment</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Eight questions across the three burnout dimensions — exhaustion, detachment and reduced
        effectiveness — to gauge your current stress-load and get a recovery-focused next step.
      </p>

      <img
        src="/images/tools/burnout.png"
        alt="Burnout self-assessment — a stress-load check across exhaustion, cynicism and efficacy, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ This is an educational self-check, <strong>not a diagnosis</strong> — burnout is an
          occupational phenomenon (WHO ICD-11), not a clinical disorder. A high score means slow down
          and consider support, not a label. If you feel persistently low or unsafe, contact a doctor.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green transition-all"
          style={{ width: `${(answeredCount / BURNOUT_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="mb-8 space-y-5">
        {BURNOUT_QUESTIONS.map((question, qi) => (
          <div key={question.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 font-semibold text-white/90">
              <span className="mr-2 font-mono text-terminal-cyan/70">{qi + 1}.</span>{question.q}
            </p>
            <div className="flex flex-wrap gap-2">
              {question.options.map((opt) => {
                const selected = answers[question.id] === opt.points
                return (
                  <button
                    key={opt.label}
                    onClick={() => choose(question.id, opt.points)}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                      selected ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div className="mb-6 rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-5 md:p-6">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">Your stress-load</div>
          <div className={`mb-1 text-3xl font-bold ${TIER_COLOR[result.profile.tier]}`}>{result.profile.name} · {result.percent}%</div>
          <div className="mb-4 font-mono text-sm text-white/50">{result.profile.tagline}</div>
          <p className="mb-5 font-mono text-xs leading-relaxed text-white/70">{result.profile.description}</p>

          <div className="mb-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
            {result.profile.protocol.map((p) => (
              <div key={p.label} className="bg-[#0a1018] px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{p.label}</div>
                <div className="font-mono text-sm text-white/90">{p.value}</div>
              </div>
            ))}
          </div>

          <button onClick={reset} className="font-mono text-xs text-white/40 underline hover:text-white/60">
            Retake assessment
          </button>
        </div>
      )}
      {!complete && answeredCount > 0 && (
        <p className="mb-6 font-mono text-xs text-white/40">
          {BURNOUT_QUESTIONS.length - answeredCount} question{BURNOUT_QUESTIONS.length - answeredCount === 1 ? '' : 's'} to go.
        </p>
      )}

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational self-check, not a diagnostic instrument or medical advice. Inspired by the
        Maslach burnout dimensions and the Copenhagen Burnout Inventory. If high stress-load persists,
        or you feel persistently low, please talk to a doctor or mental-health professional.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Catch the slide early</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          Burnout creeps up slowly. ONDA Life tracks your HRV, sleep and stress trend over time — an
          early-warning signal that something’s draining you, long before a questionnaire would catch it.
        </p>
        <a
          href={appStoreUrl('tool_burnout')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={BURNOUT_METHODOLOGY} sources={BURNOUT_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {BURNOUT_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/breathing`} className="text-terminal-green hover:underline">Breathing pacer</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
      </div>
    </main>
  )
}
