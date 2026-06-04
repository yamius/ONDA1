import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  WHM_DEFAULTS,
  WHM_ROUND_OPTIONS,
  WHM_BREATH_OPTIONS,
  WHM_HALF_MS,
  COLD_SAFETY,
  COLD_PROTOCOL,
  WHM_FAQ,
  WHM_SOURCES,
  WHM_METHODOLOGY,
} from '../data/wim-hof'
import { SourcesSection } from '../components/SourcesSection'

type Phase = 'idle' | 'breathing' | 'hold' | 'recovery' | 'done'
const FULL = 1
const EMPTY = 0.5

export function WimHofPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [rounds, setRounds] = useState<number>(WHM_DEFAULTS.rounds)
  const [breaths, setBreaths] = useState<number>(WHM_DEFAULTS.breaths)
  const [phase, setPhase] = useState<Phase>('idle')
  const [round, setRound] = useState(0)
  const [breathNo, setBreathNo] = useState(0)
  const [label, setLabel] = useState('Press start')
  const [scale, setScale] = useState(EMPTY)
  const [transMs, setTransMs] = useState(500)
  const [holdSec, setHoldSec] = useState(0)
  const [recoveryLeft, setRecoveryLeft] = useState(0)
  const [holds, setHolds] = useState<number[]>([])

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)
  const cfg = useRef({ rounds, breaths })
  cfg.current = { rounds, breaths }

  useEffect(() => {
    document.title = 'Wim Hof Breathing Timer + Cold Exposure Guide | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const clearAll = () => {
    if (timer.current) clearTimeout(timer.current)
    if (interval.current) clearInterval(interval.current)
    timer.current = null
    interval.current = null
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // --- breathing phase: toggle in/out for `breaths` full breaths ---
  const breatheToggle = (rnd: number, toggle: number) => {
    const total = cfg.current.breaths * 2
    if (toggle >= total) {
      startHold(rnd)
      return
    }
    const inhale = toggle % 2 === 0
    setScale(inhale ? FULL : EMPTY)
    setTransMs(WHM_HALF_MS)
    setLabel(inhale ? 'Breathe in' : 'Let go')
    if (inhale) setBreathNo(Math.floor(toggle / 2) + 1)
    timer.current = setTimeout(() => breatheToggle(rnd, toggle + 1), WHM_HALF_MS)
  }

  const startBreathing = (rnd: number) => {
    setPhase('breathing')
    setRound(rnd)
    setBreathNo(0)
    breatheToggle(rnd, 0)
  }

  // --- hold phase: exhale and hold empty, count up ---
  const startHold = (rnd: number) => {
    setPhase('hold')
    setRound(rnd)
    setScale(EMPTY)
    setTransMs(1500)
    setLabel('Exhale fully, then hold')
    let s = 0
    setHoldSec(0)
    interval.current = setInterval(() => {
      s += 1
      setHoldSec(s)
    }, 1000)
  }

  const endHold = () => {
    if (interval.current) clearInterval(interval.current)
    setHolds((h) => [...h, holdSec])
    startRecovery()
  }

  // --- recovery phase: big breath in, hold ~15s ---
  const startRecovery = () => {
    setPhase('recovery')
    setScale(FULL)
    setTransMs(1500)
    setLabel('Big breath in — hold')
    let left = WHM_DEFAULTS.recoverySec
    setRecoveryLeft(left)
    interval.current = setInterval(() => {
      left -= 1
      setRecoveryLeft(left)
      if (left <= 0) {
        if (interval.current) clearInterval(interval.current)
        nextRound()
      }
    }, 1000)
  }

  const nextRound = () => {
    const current = round
    if (current >= cfg.current.rounds) {
      setPhase('done')
      setLabel('Done')
      setScale(EMPTY)
      return
    }
    startBreathing(current + 1)
  }

  const start = () => {
    clearAll()
    setHolds([])
    startBreathing(1)
  }
  const stop = () => {
    clearAll()
    setPhase('idle')
    setLabel('Press start')
    setScale(EMPTY)
    setRound(0)
    setBreathNo(0)
    setHoldSec(0)
  }

  useEffect(() => () => clearAll(), [])

  const running = phase !== 'idle' && phase !== 'done'

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Wim Hof &amp; Cold</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Wim Hof Breathing Timer &amp; Cold Guide</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        A guided Wim Hof breathing timer — power breaths, breath-hold and recovery — plus a sane,
        safety-first cold-exposure protocol. Stress-resilience training, honestly framed.
      </p>

      <img
        src="/images/tools/wim-hof.png"
        alt="Wim Hof breathing timer and cold exposure protocol guide, safety-first, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/5 p-4">
        <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-red-300/90">⚠ Read before you start</p>
        <ul className="space-y-1.5">
          {COLD_SAFETY.map((s) => (
            <li key={s} className="font-mono text-[11px] leading-relaxed text-red-200/80">— {s}</li>
          ))}
        </ul>
      </div>

      {/* WHM timer */}
      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-8">
        {!running && phase !== 'done' && (
          <div className="mb-6 flex flex-wrap items-end justify-center gap-5">
            <div>
              <span className="mb-1 block text-center font-mono text-xs uppercase tracking-widest text-white/50">Rounds</span>
              <div className="flex gap-1">
                {WHM_ROUND_OPTIONS.map((r) => (
                  <button key={r} onClick={() => setRounds(r)}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${rounds === r ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>{r}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-1 block text-center font-mono text-xs uppercase tracking-widest text-white/50">Breaths / round</span>
              <div className="flex gap-1">
                {WHM_BREATH_OPTIONS.map((b) => (
                  <button key={b} onClick={() => setBreaths(b)}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${breaths === b ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>{b}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Circle */}
        <div className="relative mx-auto mb-5 flex h-60 w-60 items-center justify-center">
          <div className="absolute inset-0 m-auto h-60 w-60 rounded-full border border-terminal-cyan/30 bg-gradient-to-br from-terminal-cyan/10 to-terminal-green/10"
            style={{ transform: `scale(${scale})`, transitionProperty: 'transform', transitionDuration: `${transMs}ms`, transitionTimingFunction: 'ease-in-out' }} />
          <div className="relative z-10 text-center">
            <div className={`font-mono text-base font-semibold ${running ? 'text-terminal-green' : 'text-white/50'}`}>{label}</div>
            {phase === 'breathing' && <div className="mt-1 text-3xl font-bold text-white/80">{breathNo}</div>}
            {phase === 'hold' && <div className="mt-1 text-3xl font-bold text-white/80">{fmt(holdSec)}</div>}
            {phase === 'recovery' && <div className="mt-1 text-3xl font-bold text-white/80">{recoveryLeft}</div>}
            {running && <div className="mt-1 font-mono text-[11px] text-white/40">Round {round} / {rounds}</div>}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {phase === 'idle' && (
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20">► Start</button>
          )}
          {phase === 'hold' && (
            <button onClick={endHold} className="rounded-lg border border-terminal-cyan/50 bg-terminal-cyan/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-cyan transition-colors hover:bg-terminal-cyan/20">I need to breathe →</button>
          )}
          {running && phase !== 'hold' && (
            <button onClick={stop} className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-mono text-sm font-semibold text-white/80 transition-colors hover:bg-white/10">◼ Stop</button>
          )}
          {phase === 'done' && (
            <div className="text-center">
              <p className="mb-2 font-mono text-sm text-terminal-green">Session complete · {holds.length} round{holds.length === 1 ? '' : 's'}</p>
              {holds.length > 0 && <p className="mb-3 font-mono text-xs text-white/50">Holds: {holds.map(fmt).join(' · ')}</p>}
              <button onClick={stop} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-6 py-2 font-mono text-xs text-terminal-green hover:bg-terminal-green/20">Restart</button>
            </div>
          )}
        </div>
        <p className="mt-4 text-center font-mono text-[11px] text-white/30">Sit or lie down. Stop if you feel faint. Never do this in or near water.</p>
      </div>

      {/* Cold protocol */}
      <h2 className="mb-3 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Cold-exposure protocol</h2>
      <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
        {COLD_PROTOCOL.map((c) => (
          <div key={c.label} className="bg-[#0a1018] px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{c.label}</div>
            <div className="font-mono text-sm text-white/80">{c.value}</div>
          </div>
        ))}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational guide, not medical advice, and not a substitute for proper instruction. Benefits
        are real but often over-claimed; risks are real too. Respect the safety rules, progress
        slowly, and get medical clearance if you have any heart condition or are pregnant.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">See the resilience effect in your data</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          Breathwork and cold both shift your autonomic balance. ONDA Life tracks how they move your
          HRV and recovery over time — so you train resilience by signal, not hype.
        </p>
        <a href={appStoreUrl('tool_wimhof')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={WHM_METHODOLOGY} sources={WHM_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {WHM_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/breathing`} className="text-terminal-green hover:underline">Breathing pacer</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/nervous-system`} className="text-terminal-green hover:underline">Nervous system state</Link>
      </div>
    </main>
  )
}
