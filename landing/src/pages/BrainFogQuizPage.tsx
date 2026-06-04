import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  FOG_QUESTIONS,
  FOG_FAQ,
  FOG_SOURCES,
  FOG_METHODOLOGY,
  scoreBrainFog,
} from '../data/brain-fog'
import { SourcesSection } from '../components/SourcesSection'

export function BrainFogQuizPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [answers, setAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    document.title = "Brain Fog Quiz — Why Can't You Focus? | ONDA Life"
    window.scrollTo({ top: 0 })
  }, [])

  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === FOG_QUESTIONS.length
  const result = useMemo(() => (complete ? scoreBrainFog(answers) : null), [answers, complete])

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
        <span className="text-terminal-green/70" aria-current="page">Brain Fog</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Brain Fog Quiz</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Can’t think straight? Eight questions pinpoint which common, fixable factors — sleep, stress,
        overstimulation or lifestyle — are most likely fogging your focus, each with a targeted fix.
      </p>

      <img
        src="/images/tools/brain-fog.png"
        alt="Brain fog quiz — find which factors (sleep, stress, overstimulation, lifestyle) are clouding your focus, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ "Brain fog" is a symptom, <strong>not a diagnosis</strong>. This is an educational
          self-check of lifestyle factors. Persistent, severe or worsening symptoms deserve a medical
          work-up (thyroid, anaemia, depression and post-viral causes all exist).
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green transition-all"
          style={{ width: `${(answeredCount / FOG_QUESTIONS.length) * 100}%` }} />
      </div>

      {/* Questions */}
      <div className="mb-8 space-y-5">
        {FOG_QUESTIONS.map((question, qi) => (
          <div key={question.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 font-semibold text-white/90">
              <span className="mr-2 font-mono text-terminal-cyan/70">{qi + 1}.</span>{question.q}
            </p>
            <div className="flex flex-wrap gap-2">
              {question.options.map((opt) => {
                const selected = answers[question.id] === opt.points
                return (
                  <button key={opt.label} onClick={() => choose(question.id, opt.points)}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${selected ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>
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
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">
            {result.topDrivers.length ? 'Your likely brain-fog drivers' : 'Few fog drivers flagged'}
          </div>
          <div className="mb-4 text-3xl font-bold text-terminal-green">{result.overallPercent}% <span className="text-lg text-white/40">overall load</span></div>

          {/* domain bars */}
          <div className="mb-5 space-y-2">
            {result.scores.map((s) => (
              <div key={s.domain}>
                <div className="mb-1 flex justify-between font-mono text-[11px] text-white/50">
                  <span>{s.info.name}</span><span>{s.percent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${s.percent >= 40 ? 'bg-amber-400' : 'bg-terminal-green/50'}`} style={{ width: `${Math.max(3, s.percent)}%` }} />
                </div>
              </div>
            ))}
          </div>

          {result.topDrivers.length === 0 && (
            <p className="font-mono text-xs leading-relaxed text-white/60">Few lifestyle fog-drivers flagged. If you still feel foggy, look at sleep quality and consider a medical check — the quiz can’t see everything.</p>
          )}

          {result.topDrivers.map((s) => (
            <div key={s.domain} className="mb-3 rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="mb-1 font-semibold text-white/90">{s.info.name} <span className="font-mono text-[11px] text-amber-400">{s.percent}%</span></div>
              <p className="mb-2 font-mono text-[11px] leading-relaxed text-white/50">{s.info.summary}</p>
              <ul className="mb-2 space-y-1">
                {s.info.protocol.map((p) => (
                  <li key={p} className="font-mono text-xs text-white/70">— {p}</li>
                ))}
              </ul>
              <div className="font-mono text-[11px] text-white/40">
                Tools:{' '}
                {s.info.tools.map((t, i) => (
                  <span key={t.slug}>
                    {i > 0 && ' · '}
                    <Link to={`${langPrefix}/tools/${t.slug}`} className="text-terminal-green hover:underline">{t.label}</Link>
                  </span>
                ))}
              </div>
            </div>
          ))}

          <button onClick={reset} className="mt-1 font-mono text-xs text-white/40 underline hover:text-white/60">Retake quiz</button>
        </div>
      )}
      {!complete && answeredCount > 0 && (
        <p className="mb-6 font-mono text-xs text-white/40">{FOG_QUESTIONS.length - answeredCount} question{FOG_QUESTIONS.length - answeredCount === 1 ? '' : 's'} to go.</p>
      )}

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational self-check, not a diagnosis. It estimates which modifiable factors may be clouding
        your focus; it can’t detect medical causes. Persistent or worsening cognitive symptoms warrant
        a doctor’s assessment.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Clear the fog at the source</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life connects sleep, stress and recovery into one picture — so you can see which lever
          actually clears your head and track it improving, calmly.
        </p>
        <a href={appStoreUrl('tool_brainfog')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={FOG_METHODOLOGY} sources={FOG_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {FOG_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/how-to-get-rid-of-brain-fog`} className="text-terminal-green hover:underline">How to get rid of brain fog</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/dopamine-detox`} className="text-terminal-green hover:underline">Dopamine reset</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/nervous-system`} className="text-terminal-green hover:underline">Nervous system state</Link>
      </div>
    </main>
  )
}
