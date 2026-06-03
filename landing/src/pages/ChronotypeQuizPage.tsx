import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  CHRONOTYPE_QUESTIONS,
  CHRONOTYPE_PROFILES,
  CHRONOTYPE_FAQ,
  scoreToChronotype,
} from '../data/chronotype-quiz'

export function ChronotypeQuizPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  // answers[questionId] = chosen option points
  const [answers, setAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    document.title = "What's Your Chronotype? Free Quiz (Lion, Bear, Wolf) | ONDA Life"
    window.scrollTo({ top: 0 })
  }, [])

  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === CHRONOTYPE_QUESTIONS.length

  const profile = useMemo(() => {
    if (!complete) return null
    const total = Object.values(answers).reduce((a, b) => a + b, 0)
    return CHRONOTYPE_PROFILES[scoreToChronotype(total)]
  }, [answers, complete])

  function choose(qid: string, points: number) {
    setAnswers((prev) => ({ ...prev, [qid]: points }))
  }
  function reset() {
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
        <span className="text-terminal-green/70" aria-current="page">Chronotype Quiz</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">What's Your Chronotype?</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Six quick questions to find your natural body-clock type — morning, intermediate
        or evening — and a personalised daily-timing protocol for when to work, train,
        cut caffeine and sleep.
      </p>

      <img
        src="/images/tools/chronotype.png"
        alt="Chronotype Quiz — free body-clock quiz from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      {/* Progress */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green transition-all"
          style={{ width: `${(answeredCount / CHRONOTYPE_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="mb-8 space-y-5">
        {CHRONOTYPE_QUESTIONS.map((question, qi) => (
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
                      selected
                        ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green'
                        : 'border-white/15 text-white/60 hover:border-white/30'
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
      {profile && (
        <div className="mb-6 rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-5 md:p-6">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">Your chronotype</div>
          <div className="mb-1 text-3xl font-bold text-terminal-green">{profile.name}</div>
          <div className="mb-4 font-mono text-sm text-white/50">{profile.animal} · {profile.tagline}</div>
          <p className="mb-5 font-mono text-xs leading-relaxed text-white/70">{profile.description}</p>

          <div className="mb-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
            {profile.protocol.map((p) => (
              <div key={p.label} className="bg-[#0a1018] px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{p.label}</div>
                <div className="font-mono text-sm text-white/90">{p.value}</div>
              </div>
            ))}
          </div>

          <button onClick={reset} className="font-mono text-xs text-white/40 underline hover:text-white/60">
            Retake quiz
          </button>
        </div>
      )}
      {!complete && answeredCount > 0 && (
        <p className="mb-6 font-mono text-xs text-white/40">
          {CHRONOTYPE_QUESTIONS.length - answeredCount} question{CHRONOTYPE_QUESTIONS.length - answeredCount === 1 ? '' : 's'} to go.
        </p>
      )}

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational, not medical advice. Based on the validated Morningness–Eveningness
        questionnaire, condensed. Chronotype is a spectrum that shifts with age and can be
        partially trained with light timing.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Run your day on your real body clock</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life tracks your sleep, HRV and energy through the day — so you can see your
          chronotype in your own data and time deep work, training and wind-down to it.
        </p>
        <a
          href={appStoreUrl('tool_chronotype')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {CHRONOTYPE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/sleep-debt`} className="text-terminal-green hover:underline">Sleep debt calculator</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/caffeine`} className="text-terminal-green hover:underline">Caffeine cut-off</Link>
      </div>
    </main>
  )
}
