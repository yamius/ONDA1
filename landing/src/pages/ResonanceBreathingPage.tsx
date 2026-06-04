import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  RESONANCE_RATES,
  RESONANCE_FAQ,
  RESONANCE_SOURCES,
  RESONANCE_METHODOLOGY,
  rateToPacing,
  estimateResonanceRate,
} from '../data/resonance-breathing'
import { SourcesSection } from '../components/SourcesSection'

const IDLE_SCALE = 0.42
const FULL = 1

export function ResonanceBreathingPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [bpm, setBpm] = useState<number>(5.5)
  const [height, setHeight] = useState('')
  const [running, setRunning] = useState(false)
  const [label, setLabel] = useState('Press start')
  const [scale, setScale] = useState(IDLE_SCALE)
  const [transitionMs, setTransitionMs] = useState(600)

  const phaseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bpmRef = useRef(bpm)
  bpmRef.current = bpm

  useEffect(() => {
    document.title = 'Resonance Breathing: Find Your Rate (HRV) | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const pacing = useMemo(() => rateToPacing(bpm), [bpm])
  const estimate = useMemo(() => estimateResonanceRate(parseFloat(height)), [height])

  const clearTimer = () => {
    if (phaseTimeout.current) clearTimeout(phaseTimeout.current)
    phaseTimeout.current = null
  }

  // phase 0 = inhale (scale up), 1 = exhale (scale down)
  const runPhase = (phase: 0 | 1) => {
    const half = rateToPacing(bpmRef.current).halfSec
    setTransitionMs(half * 1000)
    setLabel(phase === 0 ? 'Breathe in' : 'Breathe out')
    setScale(phase === 0 ? FULL : IDLE_SCALE)
    phaseTimeout.current = setTimeout(() => runPhase(phase === 0 ? 1 : 0), half * 1000)
  }

  const start = () => {
    clearTimer()
    setRunning(true)
    runPhase(0)
  }

  const stop = () => {
    clearTimer()
    setRunning(false)
    setLabel('Press start')
    setTransitionMs(600)
    setScale(IDLE_SCALE)
  }

  useEffect(() => () => clearTimer(), [])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Resonance Breathing</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Resonance Breathing Rate Finder</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Find the slow breathing rate where your heart-rate variability peaks — your personal
        resonance frequency (~4.5–6.5 breaths/min) — then pace it with the circle below.
      </p>

      <img
        src="/images/tools/resonance-breathing.png"
        alt="Resonance breathing rate finder — coherent breathing pacer to maximise HRV, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-8">
        {/* Optional height-based starting estimate */}
        <div className="mb-5 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Height (cm) — optional</span>
            <input
              type="number" inputMode="numeric" min={120} max={230} value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 178"
              className="w-40 rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none placeholder:text-white/25 focus:border-terminal-green/60"
            />
          </label>
          {estimate && (
            <button
              onClick={() => setBpm(estimate.bpm)}
              className="rounded-lg border border-terminal-cyan/40 px-3 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
            >
              Start estimate: {estimate.band} → use {estimate.bpm}/min
            </button>
          )}
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Breathing rate</span>
        <div className="mb-6 flex flex-wrap gap-2">
          {RESONANCE_RATES.map((r) => (
            <button
              key={r} onClick={() => setBpm(r)}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${bpm === r ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {r}/min
            </button>
          ))}
        </div>

        {/* Breathing circle */}
        <div className="relative mx-auto mb-5 flex h-64 w-64 items-center justify-center">
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
            <div className="mt-1 font-mono text-xs text-white/40">{pacing.halfSec}s in · {pacing.halfSec}s out</div>
          </div>
        </div>

        <div className="flex justify-center">
          {!running ? (
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20">► Start</button>
          ) : (
            <button onClick={stop} className="rounded-lg border border-white/20 bg-white/5 px-8 py-3 font-mono text-sm font-semibold text-white/80 transition-colors hover:bg-white/10">◼ Stop</button>
          )}
        </div>
      </div>

      <h2 className="mb-3 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Find your resonance rate</h2>
      <ol className="mb-12 space-y-2 font-mono text-xs leading-relaxed text-white/60">
        <li><span className="text-terminal-green">1.</span> Breathe at each rate (start 6.5/min) for ~2 minutes, equal in and out through the nose.</li>
        <li><span className="text-terminal-green">2.</span> Notice which rate feels smoothest and leaves you calmest — that's your candidate.</li>
        <li><span className="text-terminal-green">3.</span> Settle on one rate and practise 10–20 minutes daily.</li>
        <li><span className="text-terminal-green">4.</span> For the precise rate, measure which maximises your HRV oscillation — that needs a live HRV reading (the ONDA Life app does this for you).</li>
      </ol>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        The height-based number is a rough starting point, not your true resonance frequency —
        that is found by testing against live HRV. Educational tool, not a medical device. If you
        have a cardiovascular or respiratory condition, are pregnant, or feel light-headed, stop and
        breathe normally.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Find your exact rate with live HRV</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          Guessing by feel gets you close. ONDA Life reads your real-time HRV while you breathe and
          pinpoints the precise rate where your nervous system resonates — proper HRV biofeedback.
        </p>
        <a
          href={appStoreUrl('tool_resonance')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={RESONANCE_METHODOLOGY} sources={RESONANCE_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {RESONANCE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/coherent-breathing-guide`} className="text-terminal-green hover:underline">Coherent breathing explained</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/breathing`} className="text-terminal-green hover:underline">Breathing pacer</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
      </div>
    </main>
  )
}
