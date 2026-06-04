import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  BREATHING_PATTERNS,
  BREATHING_FAQ,
  BREATHING_SOURCES,
  BREATHING_METHODOLOGY,
  type BreathingPattern,
} from '../data/breathing'
import { SourcesSection } from '../components/SourcesSection'

const IDLE_SCALE = 0.42

export function BreathingPacerPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [pattern, setPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0])
  const [running, setRunning] = useState(false)
  const [label, setLabel] = useState('Press start')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [scale, setScale] = useState(IDLE_SCALE)
  const [transitionMs, setTransitionMs] = useState(600)
  const [cycles, setCycles] = useState(0)

  const phaseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tick = useRef<ReturnType<typeof setInterval> | null>(null)
  const patternRef = useRef(pattern)
  patternRef.current = pattern

  useEffect(() => {
    document.title = 'Breathing Pacer — Box, 4-7-8 & Coherent Breathing | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const clearTimers = () => {
    if (phaseTimeout.current) clearTimeout(phaseTimeout.current)
    if (tick.current) clearInterval(tick.current)
    phaseTimeout.current = null
    tick.current = null
  }

  const runPhase = (idx: number) => {
    const phases = patternRef.current.phases
    const phase = phases[idx]
    setLabel(phase.label)
    setTransitionMs(phase.seconds * 1000)
    setScale(phase.scale)

    const endAt = Date.now() + phase.seconds * 1000
    setSecondsLeft(Math.ceil(phase.seconds))
    if (tick.current) clearInterval(tick.current)
    tick.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
      setSecondsLeft(remaining)
    }, 200)

    phaseTimeout.current = setTimeout(() => {
      const next = (idx + 1) % phases.length
      if (next === 0) setCycles((c) => c + 1)
      runPhase(next)
    }, phase.seconds * 1000)
  }

  const start = () => {
    clearTimers()
    setCycles(0)
    setRunning(true)
    runPhase(0)
  }

  const stop = () => {
    clearTimers()
    setRunning(false)
    setLabel('Press start')
    setSecondsLeft(0)
    setTransitionMs(600)
    setScale(IDLE_SCALE)
  }

  // Restart cleanly if the pattern changes mid-session.
  const selectPattern = (p: BreathingPattern) => {
    setPattern(p)
    if (running) {
      clearTimers()
      patternRef.current = p
      setCycles(0)
      runPhase(0)
    }
  }

  useEffect(() => () => clearTimers(), [])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Breathing Pacer</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Breathing Pacer</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Follow the circle to slow your breathing and down-shift your nervous system. Pick box, 4-7-8,
        coherent or extended-exhale — the same paced-breathing mechanic ONDA trains against live HRV.
      </p>

      <img
        src="/images/tools/breathing.png"
        alt="Breathing Pacer — free box, 4-7-8 and coherent breathing tool from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-8">
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {BREATHING_PATTERNS.map((p) => (
            <button
              key={p.id} onClick={() => selectPattern(p)}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${pattern.id === p.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <p className="mb-6 text-center font-mono text-[11px] text-white/40">{pattern.tagline}</p>

        {/* Breathing circle */}
        <div className="relative mx-auto mb-6 flex h-64 w-64 items-center justify-center">
          <div
            className="absolute inset-0 m-auto h-64 w-64 rounded-full border border-terminal-cyan/30 bg-gradient-to-br from-terminal-cyan/10 to-terminal-green/10"
            style={{
              transform: `scale(${scale})`,
              transitionProperty: 'transform',
              transitionDuration: `${transitionMs}ms`,
              transitionTimingFunction: 'ease-in-out',
            }}
          />
          <div className="relative z-10 text-center">
            <div className={`font-mono text-lg font-semibold ${running ? 'text-terminal-green' : 'text-white/50'}`}>{label}</div>
            {running && secondsLeft > 0 && <div className="mt-1 text-3xl font-bold text-white/80">{secondsLeft}</div>}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {!running ? (
            <button
              onClick={start}
              className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20"
            >
              ► Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="rounded-lg border border-white/20 bg-white/5 px-8 py-3 font-mono text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              ◼ Stop
            </button>
          )}
          {running && <span className="font-mono text-xs text-white/40">Cycles: <span className="text-terminal-green">{cycles}</span></span>}
        </div>
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Sit or lie comfortably and breathe through the nose where you can. Educational relaxation
        tool, not a medical device or a treatment for any condition. If you have a respiratory or
        cardiovascular condition, are pregnant, or feel light-headed, stop and breathe normally.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Breathe against your real-time HRV</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          This pacer is the web demo. In ONDA Life, the same breathing runs against your live heart-rate
          variability — so you can see your nervous system shift in real time and find the pace that
          calms <em>you</em> fastest.
        </p>
        <a
          href={appStoreUrl('tool_breathing')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={BREATHING_METHODOLOGY} sources={BREATHING_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {BREATHING_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/box-breathing-how-it-works`} className="text-terminal-green hover:underline">Box breathing explained</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/resonance-breathing`} className="text-terminal-green hover:underline">Resonance breathing</Link>
      </div>
    </main>
  )
}
