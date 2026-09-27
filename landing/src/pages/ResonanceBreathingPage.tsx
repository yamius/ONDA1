import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import { RESONANCE_RATES, RESONANCE_SOURCES, rateToPacing, estimateResonanceRate } from '../data/resonance-breathing'
import { resoToolCopy, fill, type ResoToolCopy } from '../data/reso-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'
import { useBreathCues } from '../lib/breathCues'

const IDLE_SCALE = 0.42
const FULL = 1
const DURATIONS = [2, 5, 10, 20, 0] as const // minutes; 0 = unlimited

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

export function ResonanceBreathingPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: ResoToolCopy = resoToolCopy(lang)
  const fmt = (n: number) => n.toLocaleString(lang, { maximumFractionDigits: 2 })

  const [bpm, setBpm] = useState<number>(5.5)
  const [height, setHeight] = useState('')
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [phase, setPhase] = useState<0 | 1 | null>(null)
  const [scale, setScale] = useState(IDLE_SCALE)
  const [transitionMs, setTransitionMs] = useState(600)
  const [minutes, setMinutes] = useState<number>(5)
  const [sound, setSound] = useState(true)
  const [remainingSec, setRemainingSec] = useState(0)

  const phaseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tick = useRef<ReturnType<typeof setInterval> | null>(null)
  const bpmRef = useRef(bpm)
  bpmRef.current = bpm
  const soundRef = useRef(sound)
  soundRef.current = sound
  const endAtRef = useRef(0)
  const cues = useBreathCues()

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const pacing = useMemo(() => rateToPacing(bpm), [bpm])
  const estimate = useMemo(() => estimateResonanceRate(parseFloat(height)), [height])

  const clearTimers = () => {
    if (phaseTimeout.current) clearTimeout(phaseTimeout.current)
    if (tick.current) clearInterval(tick.current)
    phaseTimeout.current = null
    tick.current = null
  }

  const reset = (done: boolean) => {
    clearTimers()
    setRunning(false)
    setFinished(done)
    setPhase(null)
    setTransitionMs(600)
    setScale(IDLE_SCALE)
  }

  // phase 0 = inhale (scale up), 1 = exhale (scale down)
  const runPhase = (p: 0 | 1) => {
    // Finish after a completed exhale once the session time is up.
    if (p === 0 && endAtRef.current && Date.now() >= endAtRef.current) return reset(true)
    const half = rateToPacing(bpmRef.current).halfSec
    setTransitionMs(half * 1000)
    setPhase(p)
    setScale(p === 0 ? FULL : IDLE_SCALE)
    if (soundRef.current) cues.play(p === 0 ? 'in' : 'out')
    phaseTimeout.current = setTimeout(() => runPhase(p === 0 ? 1 : 0), half * 1000)
  }

  const start = () => {
    clearTimers()
    if (soundRef.current) cues.ensure()
    setFinished(false)
    endAtRef.current = minutes > 0 ? Date.now() + minutes * 60_000 : 0
    setRemainingSec(minutes * 60)
    tick.current = setInterval(() => {
      if (endAtRef.current) setRemainingSec(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)))
    }, 500)
    setRunning(true)
    runPhase(0)
  }

  useEffect(() => () => clearTimers(), [])

  const hub = (['ru', 'es'] as Lang[]).includes(lang) ? `/${lang}/tools` : '/tools'
  const label = running && phase !== null ? (phase === 0 ? c.ui.in : c.ui.out) : finished ? '✓' : c.ui.press

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

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-8">
        <div className="mb-5 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.height}</span>
            <input
              type="text" inputMode="numeric" value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={c.ui.heightPh}
              className="w-40 rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none placeholder:text-white/25 focus:border-terminal-green/60"
            />
          </label>
          {estimate && (
            <button
              type="button" onClick={() => setBpm(estimate.bpm)}
              className="rounded-lg border border-terminal-cyan/40 px-3 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
            >
              {fill(c.ui.estimate, { band: c.bands[estimate.band], bpm: fmt(estimate.bpm) })}
            </button>
          )}
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.rate}</span>
        <div className="mb-6 flex flex-wrap gap-2" role="radiogroup">
          {RESONANCE_RATES.map((r) => (
            <button
              key={r} type="button" role="radio" aria-checked={bpm === r} onClick={() => setBpm(r)}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${bpm === r ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {fill(c.ui.perMin, { n: fmt(r) })}
            </button>
          ))}
        </div>

        {/* Breathing circle */}
        <div className="relative mx-auto mb-5 flex h-64 w-64 items-center justify-center" aria-live="polite">
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
            <div className={`text-xl font-semibold ${running ? 'text-terminal-green' : 'text-white/50'}`}>{label}</div>
            <div className="mt-1 font-mono text-xs text-white/40">{fill(c.ui.pacing, { s: fmt(pacing.halfSec) })}</div>
          </div>
        </div>

        {finished && !running && <p className="mb-4 text-center font-mono text-xs text-terminal-green">{c.ui.done}</p>}

        <div className="mb-5 flex flex-wrap items-center justify-center gap-4">
          {!running ? (
            <button type="button" onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20">
              {finished ? `↻ ${c.ui.again}` : c.ui.start}
            </button>
          ) : (
            <button type="button" onClick={() => reset(false)} className="rounded-lg border border-white/20 bg-white/5 px-8 py-3 font-mono text-sm font-semibold text-white/80 transition-colors hover:bg-white/10">{c.ui.stop}</button>
          )}
          {running && minutes > 0 && (
            <span className="font-mono text-xs text-white/45">
              {fill(c.ui.remaining, { m: Math.floor(remainingSec / 60), s: String(remainingSec % 60).padStart(2, '0') })}
            </span>
          )}
        </div>

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
        </div>
      </div>

      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{c.stepsTitle}</h2>
      <ol className="mb-10 space-y-2 text-sm leading-relaxed text-white/70">
        {c.steps.map((st, i) => (
          <li key={i}><span className="text-terminal-green">{i + 1}.</span> {st}</li>
        ))}
      </ol>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.safety}</p>

      <p className="mb-3 text-sm text-white/70">{c.cta}</p>
      <AppStoreCTA ct={storeCt('tool', 'resonance', lang)} variant="general" lang={lang} />

      {c.sections.map((sec) => (
        <section key={sec.h2} className="mb-10">
          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{sec.h2}</h2>
          <p className="text-sm leading-relaxed text-white/70">
            <Rich text={sec.body} lang={lang} />
          </p>
        </section>
      ))}

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
        sources={RESONANCE_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/tools/breathing', lang)} className="text-terminal-green hover:underline">{c.related.timer}</Link>
        {' · '}
        <Link to={langHref('/tools/hrv', lang)} className="text-terminal-green hover:underline">{c.related.hrv}</Link>
        {' · '}
        <Link to={langHref('/articles/coherent-breathing-guide', lang)} className="text-terminal-green hover:underline">{c.related.guide}</Link>
      </div>
    </main>
  )
}
