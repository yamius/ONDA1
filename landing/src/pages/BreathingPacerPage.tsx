import { Fragment, useEffect, useRef, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import { BREATHING_PATTERNS, BREATHING_SOURCES, type BreathingPattern, type PhaseKind } from '../data/breathing'
import { breathToolCopy, fill, type BreathToolCopy } from '../data/breath-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

const IDLE_SCALE = 0.42
const DURATIONS = [1, 3, 5, 10, 0] as const // minutes; 0 = unlimited

/** Render inline markdown links ([text](/path)) as router links. */
function Rich({ text, lang }: { text: string; lang: Lang }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!m) return <Fragment key={i}>{p}</Fragment>
        return (
          <Link key={i} to={langHref(m[2], lang)} className="text-terminal-green hover:underline">
            {m[1]}
          </Link>
        )
      })}
    </>
  )
}

/** Soft audio cue per phase: rising tone for inhale, falling for exhale, short tick for hold. */
function useCues() {
  const ctxRef = useRef<AudioContext | null>(null)
  const ensure = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AC) ctxRef.current = new AC()
    }
    if (ctxRef.current?.state === 'suspended') void ctxRef.current.resume()
    return ctxRef.current
  }
  const play = (kind: PhaseKind) => {
    const ctx = ctxRef.current
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    const [f0, f1, dur] =
      kind === 'in' ? [330, 440, 0.45] : kind === 'topup' ? [440, 523, 0.25] : kind === 'out' ? [440, 294, 0.6] : [392, 392, 0.12]
    osc.frequency.setValueAtTime(f0, t)
    osc.frequency.linearRampToValueAtTime(f1, t + dur)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }
  useEffect(() => () => void ctxRef.current?.close(), [])
  return { ensure, play }
}

export function BreathingPacerPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: BreathToolCopy = breathToolCopy(lang)

  const [pattern, setPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0])
  const [minutes, setMinutes] = useState<number>(3)
  const [sound, setSound] = useState(true)
  const [vibrate, setVibrate] = useState(false)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [label, setLabel] = useState(c.ui.press)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [remainingSec, setRemainingSec] = useState(0)
  const [scale, setScale] = useState(IDLE_SCALE)
  const [transitionMs, setTransitionMs] = useState(600)
  const [cycles, setCycles] = useState(0)
  const [canVibrate, setCanVibrate] = useState(false)

  const phaseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tick = useRef<ReturnType<typeof setInterval> | null>(null)
  const patternRef = useRef(pattern)
  patternRef.current = pattern
  const endAtRef = useRef(0)
  const soundRef = useRef(sound)
  soundRef.current = sound
  const vibRef = useRef(vibrate)
  vibRef.current = vibrate
  const cyclesRef = useRef(0)
  const timerRef = useRef<HTMLDivElement>(null)
  const cues = useCues()

  useEffect(() => {
    document.title = c.meta.title
    // Deep link: /tools/breathing?p=478 preselects a technique.
    const p = new URLSearchParams(window.location.search).get('p')
    const found = BREATHING_PATTERNS.find((x) => x.id === p)
    if (found) setPattern(found)
    setCanVibrate(typeof navigator !== 'undefined' && 'vibrate' in navigator)
    if (!window.location.hash) window.scrollTo({ top: 0 })
  }, [c])

  useEffect(() => {
    if (!running) setLabel(c.ui.press)
  }, [c, running])

  const clearTimers = () => {
    if (phaseTimeout.current) clearTimeout(phaseTimeout.current)
    if (tick.current) clearInterval(tick.current)
    phaseTimeout.current = null
    tick.current = null
  }

  const finish = () => {
    clearTimers()
    setRunning(false)
    setFinished(true)
    setSecondsLeft(0)
    setTransitionMs(600)
    setScale(IDLE_SCALE)
  }

  const runPhase = (idx: number) => {
    const phases = patternRef.current.phases
    const phase = phases[idx]
    setLabel(c.phases[phase.kind])
    setTransitionMs(phase.seconds * 1000)
    setScale(phase.scale)
    if (soundRef.current) cues.play(phase.kind)
    if (vibRef.current && typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(phase.kind === 'hold' ? 30 : 70)

    const phaseEnd = Date.now() + phase.seconds * 1000
    setSecondsLeft(Math.ceil(phase.seconds))
    if (tick.current) clearInterval(tick.current)
    tick.current = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((phaseEnd - Date.now()) / 1000)))
      if (endAtRef.current) setRemainingSec(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)))
    }, 200)

    phaseTimeout.current = setTimeout(() => {
      const next = (idx + 1) % phases.length
      if (next === 0) {
        cyclesRef.current += 1
        setCycles(cyclesRef.current)
        // End only on a completed breath, so a session never stops mid-exhale.
        if (endAtRef.current && Date.now() >= endAtRef.current) return finish()
      }
      runPhase(next)
    }, phase.seconds * 1000)
  }

  const start = () => {
    clearTimers()
    if (soundRef.current) cues.ensure()
    cyclesRef.current = 0
    setCycles(0)
    setFinished(false)
    endAtRef.current = minutes > 0 ? Date.now() + minutes * 60_000 : 0
    setRemainingSec(minutes * 60)
    setRunning(true)
    runPhase(0)
  }

  const stop = () => {
    clearTimers()
    setRunning(false)
    setSecondsLeft(0)
    setTransitionMs(600)
    setScale(IDLE_SCALE)
  }

  const selectPattern = (p: BreathingPattern) => {
    setPattern(p)
    setFinished(false)
    if (running) {
      clearTimers()
      patternRef.current = p
      cyclesRef.current = 0
      setCycles(0)
      runPhase(0)
    }
  }

  useEffect(() => () => clearTimers(), [])

  const hub = (['ru', 'es'] as Lang[]).includes(lang) ? `/${lang}/tools` : '/tools'
  const mm = Math.floor(remainingSec / 60)
  const ss = String(remainingSec % 60).padStart(2, '0')

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="hover:text-terminal-green">{c.breadcrumb.home}</Link>
        <span>/</span>
        <Link to={hub} className="hover:text-terminal-green">{c.breadcrumb.tools}</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">{c.breadcrumb.current}</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{c.h1}</h1>
      <p className="mb-8 text-base leading-relaxed text-white/70">{c.capsule}</p>

      <div id="timer" ref={timerRef} className="mb-6 scroll-mt-20 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-8">
        <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">{c.ui.technique}</div>
        <div className="mb-3 flex flex-wrap justify-center gap-2" role="radiogroup">
          {BREATHING_PATTERNS.map((p) => (
            <button
              key={p.id} type="button" role="radio" aria-checked={pattern.id === p.id} onClick={() => selectPattern(p)}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${pattern.id === p.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {c.patterns[p.id].name}
            </button>
          ))}
        </div>
        <p className="mb-6 text-center font-mono text-[11px] text-white/45">{c.patterns[pattern.id].tagline}</p>

        {/* Breathing circle */}
        <div className="relative mx-auto mb-6 flex h-64 w-64 items-center justify-center" aria-live="polite">
          <div
            className="absolute inset-0 m-auto h-64 w-64 rounded-full border border-terminal-cyan/30 bg-gradient-to-br from-terminal-cyan/10 to-terminal-green/10"
            style={{
              transform: `scale(${scale})`,
              transitionProperty: 'transform',
              transitionDuration: `${transitionMs}ms`,
              transitionTimingFunction: 'ease-in-out',
            }}
          />
          <div className="relative z-10 px-6 text-center">
            <div className={`text-xl font-semibold ${running ? 'text-terminal-green' : 'text-white/50'}`}>
              {finished && !running ? '✓' : label}
            </div>
            {running && secondsLeft > 0 && <div className="mt-1 text-4xl font-bold text-white/85">{secondsLeft}</div>}
          </div>
        </div>

        {finished && !running && (
          <p className="mb-5 text-center font-mono text-xs text-terminal-green">{fill(c.ui.done, { n: cycles })}</p>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-center gap-4">
          {!running ? (
            <button
              type="button" onClick={start}
              className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20"
            >
              {finished ? `↻ ${c.ui.again}` : c.ui.start}
            </button>
          ) : (
            <button
              type="button" onClick={stop}
              className="rounded-lg border border-white/20 bg-white/5 px-8 py-3 font-mono text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              {c.ui.stop}
            </button>
          )}
          {running && (
            <span className="font-mono text-xs text-white/45">
              {fill(c.ui.cycles, { n: cycles })}
              {minutes > 0 && <> · {fill(c.ui.remaining, { m: mm, s: ss })}</>}
            </span>
          )}
        </div>

        {/* Session options */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">{c.ui.duration}</span>
            {DURATIONS.map((d) => (
              <button
                key={d} type="button" aria-pressed={minutes === d} onClick={() => setMinutes(d)} disabled={running}
                className={`rounded-md border px-2 py-1 font-mono text-[11px] transition-colors disabled:opacity-50 ${minutes === d ? 'border-terminal-green/60 text-terminal-green' : 'border-white/15 text-white/55'}`}
              >
                {d === 0 ? c.ui.unlimited : fill(c.ui.minutes, { n: d })}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-white/60">
            <input type="checkbox" checked={sound} onChange={(e) => { setSound(e.target.checked); if (e.target.checked) cues.ensure() }} className="accent-emerald-400" />
            {c.ui.sound}
          </label>
          {canVibrate && (
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-white/60">
              <input type="checkbox" checked={vibrate} onChange={(e) => setVibrate(e.target.checked)} className="accent-emerald-400" />
              {c.ui.vibration}
            </label>
          )}
        </div>
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.safety}</p>

      <p className="mb-3 text-sm text-white/70">{c.cta}</p>
      <AppStoreCTA ct={storeCt('tool', 'breathing', lang)} variant="general" lang={lang} />

      {/* One self-contained block per technique; each can launch its preset. */}
      {c.sections.map((sec) => {
        const p = BREATHING_PATTERNS.find((x) => x.id === sec.pattern)
        return (
          <section key={sec.h2} id={`p-${sec.pattern}`} className="mb-10 scroll-mt-20">
            <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{sec.h2}</h2>
            <p className="mb-3 text-sm leading-relaxed text-white/70">
              <Rich text={sec.body} lang={lang} />
            </p>
            {p && (
              <a
                href={`?p=${p.id}#timer`}
                onClick={(e) => {
                  e.preventDefault()
                  selectPattern(p)
                  window.history.replaceState(null, '', `?p=${p.id}#timer`)
                  timerRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="font-mono text-xs text-terminal-green hover:underline"
              >
                {c.ui.startThis}
              </a>
            )}
          </section>
        )
      })}

      {/* FAQ — mirrors the FAQPage JSON-LD injected at build */}
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{c.faqTitle}</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {c.faq.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <SourcesSection
        heading={c.sourcesTitle}
        methodology={c.methodology}
        sources={BREATHING_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/tools/resonance-breathing', lang)} className="text-terminal-green hover:underline">{c.related.resonance}</Link>
        {' · '}
        <Link to={langHref('/tools/hrv', lang)} className="text-terminal-green hover:underline">{c.related.hrv}</Link>
        {' · '}
        <Link to={langHref('/articles/box-breathing-how-it-works', lang)} className="text-terminal-green hover:underline">{c.related.box}</Link>
        {' · '}
        <Link to={langHref('/articles/physiological-sigh', lang)} className="text-terminal-green hover:underline">{c.related.sigh}</Link>
      </div>
    </main>
  )
}
