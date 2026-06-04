import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  NS_QUESTIONS,
  NS_FAQ,
  NS_SOURCES,
  NS_METHODOLOGY,
  scoreNervousSystem,
} from '../data/nervous-system-state'
import { SourcesSection } from '../components/SourcesSection'

const STATE_COLOR: Record<string, string> = {
  regulated: 'text-terminal-green',
  activated: 'text-amber-400',
  shutdown: 'text-terminal-cyan',
}

export function NervousSystemStatePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [answers, setAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    document.title = 'Nervous System Quiz — Are You in Fight-or-Flight? | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === NS_QUESTIONS.length
  const result = useMemo(() => (complete ? scoreNervousSystem(answers) : null), [answers, complete])

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
        <span className="text-terminal-green/70" aria-current="page">Nervous System State</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Nervous System State Quiz</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Are you stuck in fight-or-flight, shut down, or regulated? Eight quick questions read your
        current autonomic state and give you the right protocol to shift it.
      </p>

      <img
        src="/images/tools/nervous-system.png"
        alt="Nervous system state quiz — fight-or-flight vs shutdown vs regulated, with a vagal regulation protocol, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ Educational self-awareness tool, <strong>not a diagnosis</strong>. The "vagal states" model
          is a useful lens, not settled science. A persistent shutdown pattern, low mood or hopelessness
          is a reason to talk to a doctor or therapist.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green transition-all"
          style={{ width: `${(answeredCount / NS_QUESTIONS.length) * 100}%` }} />
      </div>

      {/* Questions */}
      <div className="mb-8 space-y-5">
        {NS_QUESTIONS.map((question, qi) => (
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
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">Your current state</div>
          <div className={`mb-1 text-3xl font-bold ${STATE_COLOR[result.profile.state]}`}>{result.profile.name}</div>
          <div className="mb-3 font-mono text-sm text-white/50">{result.profile.tagline}</div>
          <div className="mb-4 flex gap-4 font-mono text-[11px] text-white/45">
            <span>Fight-or-flight: <span className="text-amber-400">{result.sympPercent}%</span></span>
            <span>Shutdown: <span className="text-terminal-cyan">{result.dorsalPercent}%</span></span>
          </div>
          <p className="mb-5 font-mono text-xs leading-relaxed text-white/70">{result.profile.description}</p>

          <div className="mb-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
            {result.profile.protocol.map((p) => (
              <div key={p.label} className="bg-[#0a1018] px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{p.label}</div>
                <div className="font-mono text-sm text-white/90">{p.value}</div>
              </div>
            ))}
          </div>

          <button onClick={reset} className="font-mono text-xs text-white/40 underline hover:text-white/60">Retake quiz</button>
        </div>
      )}
      {!complete && answeredCount > 0 && (
        <p className="mb-6 font-mono text-xs text-white/40">
          {NS_QUESTIONS.length - answeredCount} question{NS_QUESTIONS.length - answeredCount === 1 ? '' : 's'} to go.
        </p>
      )}

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational self-awareness tool, not a diagnosis or medical advice. The three-state model
        draws on polyvagal theory (debated in its specifics); the protocols rest on well-supported
        findings about vagal tone and slow breathing. Persistent shutdown or low mood warrants
        professional support.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">See your state in real time</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          A quiz is a snapshot. ONDA Life reads your live HRV — a direct window on vagal tone — so you
          can watch yourself shift out of fight-or-flight as you breathe, and catch dysregulation early.
        </p>
        <a href={appStoreUrl('tool_nervous')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={NS_METHODOLOGY} sources={NS_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {NS_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/vagus-nerve-exercises`} className="text-terminal-green hover:underline">Vagus nerve exercises</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/breathing`} className="text-terminal-green hover:underline">Breathing pacer</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/burnout`} className="text-terminal-green hover:underline">Burnout test</Link>
      </div>
    </main>
  )
}
