/**
 * /tools/vibration-breathing — "Relax / Wake up" breathing by touch (task 104).
 *
 * Finger on the screen → vibration fades in and follows the rhythm; finger off →
 * it fades out and the controls come back, the session keeps running until
 * Finish. Vibration via navigator.vibrate (feature-detected, never UA-sniffed).
 * Without it: visual pulses + optional soft Web Audio tick (sound OFF by default).
 * Rings converge on the finger (or the centre) — calmer & brighter on the inhale.
 * prefers-reduced-motion: rings don't move, only brightness + phase text change.
 * Desktop: hold the mouse button or the space bar instead of a finger.
 *
 * Static SEO (title, description, FAQPage, WebApplication) is emitted by
 * scripts/meta-inject.ts — renderToString never runs the effects here.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppStoreCTA from '../components/AppStoreCTA'
import { langFromPath, langHref } from '../i18n'
import { storeCt } from '../lib/storeCt'
import { gtmToolEvent } from '../lib/gtm'
import {
  MODES, MAX_CONTINUOUS_MS, FADE_IN_MS, FADE_OUT_MS,
  VIBRATION_FAQ, nextPulse, type BreathMode,
} from '../data/vibration-breathing'

type View = 'choose' | 'session' | 'paused' | 'final'
type Feeling = 'better' | 'same' | 'worse'

const CT = storeCt('tool', 'vibration-breathing') // tool_vibration_breathing
const TOOL_NAME = 'vibration_breathing'

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function'
}
function vibrate(p: number | number[]): void {
  try { navigator.vibrate(p) } catch { /* blocked */ }
}

export function VibrationBreathingPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)

  const [view, setView] = useState<View>('choose')
  const [mode, setMode] = useState<BreathMode>('relax')
  const [vibSupported, setVibSupported] = useState<boolean | null>(null)
  const [touching, setTouching] = useState(false)
  const [phaseIn, setPhaseIn] = useState(true)
  const [soundOn, setSoundOn] = useState(false)
  const [feeling, setFeeling] = useState<Feeling | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const touchingRef = useRef(false)
  const posRef = useRef<{ x: number; y: number } | null>(null)
  const drawPosRef = useRef<{ x: number; y: number } | null>(null)
  const gainRef = useRef(0)
  const sessionStartRef = useRef(0)
  const touchedMsRef = useRef(0)
  const contStartRef = useRef(0)
  const nextPulseAtRef = useRef(0)
  const flashRef = useRef(0)
  const lastFrameRef = useRef(0)
  const vibratingRef = useRef(false)
  const viewRef = useRef<View>('choose')
  const modeRef = useRef<BreathMode>('relax')
  const soundRef = useRef(false)
  const audioRef = useRef<AudioContext | null>(null)
  const reducedRef = useRef(false)
  const phaseInRef = useRef(true)
  const keyHeldRef = useRef(false)

  useEffect(() => {
    document.title = 'Vibration Breathing — Relax or Wake Up by Touch | ONDA Life'
    setVibSupported(canVibrate())
    try { reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { /* old browser */ }
    // utm_source=meta → open straight on the mode picker (direct loads are flagged before paint by
    // the inline script prerender.ts adds; this covers SPA navigation). CSS only — the DOM is the same.
    const el = document.documentElement
    if (/(^|[?&])utm_source=meta(&|$)/i.test(window.location.search)) el.classList.add('vb-ad')
    return () => el.classList.remove('vb-ad')
  }, [])

  useEffect(() => { viewRef.current = view }, [view])
  useEffect(() => { soundRef.current = soundOn }, [soundOn])

  // Full-screen session: lock page scroll underneath.
  useEffect(() => {
    if (view === 'choose') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [view])

  const setTouch = useCallback((on: boolean, pos?: { x: number; y: number } | null) => {
    if (on && viewRef.current !== 'session') return
    if (pos !== undefined) posRef.current = pos
    if (touchingRef.current === on) return
    touchingRef.current = on
    if (on) contStartRef.current = performance.now()
    setTouching(on)
  }, [])

  const tick = useCallback((freq: number, g: number) => {
    const ctx = audioRef.current
    if (!ctx) return
    try {
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const peak = 0.015 + 0.05 * g
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.2)
    } catch { /* audio blocked */ }
  }, [])

  // Main loop: phase clock, gain fade, pulse scheduler, canvas.
  useEffect(() => {
    if (view !== 'session' && view !== 'paused') return
    const canvas = canvasRef.current
    const vib = canVibrate()

    const frame = (now: number) => {
      const dt = lastFrameRef.current ? Math.min(100, now - lastFrameRef.current) : 16
      lastFrameRef.current = now
      const spec = MODES[modeRef.current]
      const live = viewRef.current === 'session'

      if (live && touchingRef.current) {
        touchedMsRef.current += dt
        if (now - contStartRef.current >= MAX_CONTINUOUS_MS) {
          touchingRef.current = false
          setTouching(false)
          setView('paused')
        }
      }

      // Gain fades → expressed as pulse length/density (web can't set amplitude).
      const target = live && touchingRef.current ? 1 : 0
      const g0 = gainRef.current
      gainRef.current = target > g0 ? Math.min(1, g0 + dt / FADE_IN_MS) : Math.max(0, g0 - dt / FADE_OUT_MS)
      const g = gainRef.current

      const cycle = spec.inhaleMs + spec.exhaleMs
      const tc = (now - sessionStartRef.current) % cycle
      const inhale = tc < spec.inhaleMs
      const progress = inhale ? tc / spec.inhaleMs : (tc - spec.inhaleMs) / spec.exhaleMs
      if (inhale !== phaseInRef.current) { phaseInRef.current = inhale; setPhaseIn(inhale) }

      if (g > 0.03) {
        if (now >= nextPulseAtRef.current) {
          const [p, gap] = nextPulse(inhale ? 'in' : 'out', progress, g)
          if (vib) { vibrate(p); vibratingRef.current = true }
          else if (soundRef.current) tick(spec.toneHz * (inhale ? 1 : 0.75), g)
          flashRef.current = Math.min(1, 0.35 + 0.65 * g)
          nextPulseAtRef.current = now + p + gap
        }
      } else if (vibratingRef.current) {
        vibrate(0)
        vibratingRef.current = false
      }
      flashRef.current = Math.max(0, flashRef.current - dt / 260)

      if (canvas) draw(canvas, now, spec.rgb, inhale, progress, g, modeRef.current)
      rafRef.current = requestAnimationFrame(frame)
    }

    const draw = (
      c: HTMLCanvasElement, now: number, rgb: [number, number, number],
      inhale: boolean, progress: number, g: number, m: BreathMode,
    ) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = c.clientWidth, h = c.clientHeight
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr); c.height = Math.round(h * dpr)
      }
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const want = touchingRef.current && posRef.current ? posRef.current : { x: w / 2, y: h * 0.48 }
      const cur = drawPosRef.current ?? want
      const lerp = reducedRef.current ? 1 : 0.18
      drawPosRef.current = { x: cur.x + (want.x - cur.x) * lerp, y: cur.y + (want.y - cur.y) * lerp }
      const { x, y } = drawPosRef.current
      const [r, gg, b] = rgb
      const ease = 0.5 - 0.5 * Math.cos(Math.PI * progress)
      const breath = inhale ? ease : 1 - ease // 0 = empty, 1 = full
      const intensity = (inhale ? 0.95 : 0.6) * (0.45 + 0.55 * g)
      const maxR = Math.hypot(Math.max(x, w - x), Math.max(y, h - y))
      const N = 7

      // background glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, maxR * 0.7)
      glow.addColorStop(0, `rgba(${r},${gg},${b},${0.10 + 0.12 * breath * intensity})`)
      glow.addColorStop(1, `rgba(${r},${gg},${b},0)`)
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      const period = m === 'relax' ? (inhale ? 2600 : 3600) : (inhale ? 1300 : 1700)
      for (let k = 0; k < N; k++) {
        const f = reducedRef.current ? (k + 0.5) / N : ((now / period) + k / N) % 1
        const rad = Math.max(2, maxR * 0.85 * (1 - f))
        const a = reducedRef.current
          ? (0.12 + 0.5 * breath) * intensity * (0.4 + 0.6 * f)
          : Math.sin(Math.PI * f) * intensity * 0.7
        ctx.beginPath()
        ctx.arc(x, y, rad, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${gg},${b},${a.toFixed(3)})`
        ctx.lineWidth = 1.5 + 2.5 * f
        ctx.shadowColor = `rgba(${r},${gg},${b},0.8)`
        ctx.shadowBlur = 12
        ctx.stroke()
      }
      ctx.shadowBlur = 0

      // the point: grows on the inhale, shrinks on the exhale (static size if reduced motion)
      const dotR = reducedRef.current ? 16 : 10 + 22 * breath
      const flash = flashRef.current
      const core = ctx.createRadialGradient(x, y, 0, x, y, dotR * (1.8 + flash))
      core.addColorStop(0, `rgba(255,255,255,${0.55 + 0.4 * flash})`)
      core.addColorStop(0.35, `rgba(${r},${gg},${b},${0.55 + 0.35 * breath})`)
      core.addColorStop(1, `rgba(${r},${gg},${b},0)`)
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(x, y, dotR * (1.8 + flash), 0, Math.PI * 2)
      ctx.fill()
    }

    lastFrameRef.current = 0
    rafRef.current = requestAnimationFrame(frame)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }, [view, tick])

  // Keyboard: space bar = "finger" while held.
  useEffect(() => {
    if (view !== 'session') return
    const down = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return
      e.preventDefault()
      if (e.repeat || keyHeldRef.current) return
      keyHeldRef.current = true
      setTouch(true, null)
    }
    const up = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return
      if (!keyHeldRef.current) return
      keyHeldRef.current = false
      setTouch(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [view, setTouch])

  // Stop vibration on unmount / tab hide.
  useEffect(() => {
    const onHide = () => { if (document.hidden) { setTouch(false); if (canVibrate()) vibrate(0) } }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      if (canVibrate()) vibrate(0)
      try { audioRef.current?.close() } catch { /* noop */ }
    }
  }, [setTouch])

  function start(m: BreathMode) {
    modeRef.current = m
    setMode(m)
    sessionStartRef.current = performance.now()
    touchedMsRef.current = 0
    gainRef.current = 0
    nextPulseAtRef.current = 0
    drawPosRef.current = null
    setFeeling(null)
    setView('session')
    gtmToolEvent('tool_start', { tool_name: TOOL_NAME, mode: m, vibration_supported: canVibrate() ? 'true' : 'false' })
  }

  function finish() {
    setTouch(false)
    gainRef.current = 0
    if (canVibrate()) vibrate(0)
    gtmToolEvent('tool_complete', {
      tool_name: TOOL_NAME,
      mode: modeRef.current,
      duration: String(Math.round(touchedMsRef.current / 1000)),
    })
    setView('final')
  }

  function toggleSound() {
    const next = !soundOn
    if (next && !audioRef.current) {
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioRef.current = new AC()
      } catch { /* no audio */ }
    }
    try { void audioRef.current?.resume() } catch { /* noop */ }
    setSoundOn(next)
  }

  function sendFeeling(f: Feeling) {
    if (feeling) return
    setFeeling(f)
    gtmToolEvent('tool_feedback', { tool_name: TOOL_NAME, mode: modeRef.current, feeling: f })
  }

  const spec = MODES[mode]
  const accent = mode === 'relax' ? 'text-amber-300' : 'text-violet-300'
  const ctrlHidden = touching ? 'pointer-events-none opacity-0' : 'opacity-100'

  const stageHandlers = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* noop */ }
      const rect = e.currentTarget.getBoundingClientRect()
      setTouch(true, { x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      if (!touchingRef.current || keyHeldRef.current) return
      const rect = e.currentTarget.getBoundingClientRect()
      posRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    },
    onPointerUp: () => setTouch(false),
    onPointerCancel: () => setTouch(false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  }
  const stop = (e: React.PointerEvent) => e.stopPropagation()

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <style>{'.vb-ad .vb-seo-intro{display:none}.vb-ad .vb-choose{margin-top:-1.5rem}'}</style>
      {/* SEO block — hidden (CSS, before first paint) for paid traffic with utm_source=meta,
          see the inline script in index.html. Static HTML/canonical stay the same for everyone. */}
      <div className="vb-seo-intro">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={langHref('/', lang)} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={langHref('/tools', lang)} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Vibration Breathing</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Vibration Breathing</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Vibration Breathing is a free browser tool that sets your breathing rhythm by touch: rest a finger on the
        screen and your phone vibrates — a quickening series of short taps as you breathe in, long slow pulses as you
        breathe out. Relax runs 4 seconds in / 6 seconds out; Wake up runs 3 seconds in / 2 seconds out.
      </p>
      </div>

      {/* Mode picker — the tool starts on Relax / Wake up */}
      <section
        aria-labelledby="vb-choose"
        className="vb-choose mb-8 flex min-h-[70svh] flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-black/40 to-black/10 px-5 py-10 text-center"
      >
        <h2 id="vb-choose" className="mb-8 text-2xl font-semibold text-white/90">What do you need right now?</h2>
        <div className="flex w-full max-w-sm flex-col gap-4">
          <button
            type="button"
            onClick={() => start('relax')}
            className="rounded-2xl border border-amber-300/50 bg-amber-300/10 px-6 py-6 text-2xl font-semibold text-amber-200 shadow-[0_0_40px_rgba(255,190,80,0.15)] transition-colors hover:bg-amber-300/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Relax
            <span className="mt-1 block font-mono text-xs font-normal text-amber-200/60">in 4 s · out 6 s</span>
          </button>
          <button
            type="button"
            onClick={() => start('wake')}
            className="rounded-2xl border border-violet-400/50 bg-violet-500/10 px-6 py-6 text-2xl font-semibold text-violet-200 shadow-[0_0_40px_rgba(120,92,255,0.18)] transition-colors hover:bg-violet-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            Wake up
            <span className="mt-1 block font-mono text-xs font-normal text-violet-200/60">in 3 s · out 2 s</span>
          </button>
        </div>
        {vibSupported === false && (
          <p className="mt-6 max-w-sm font-mono text-[11px] leading-relaxed text-white/40">
            This browser can’t vibrate, so the rhythm comes as light pulses — with an optional soft sound.
          </p>
        )}
      </section>

      {/* Full-screen session */}
      {(view === 'session' || view === 'paused') && (
        <div
          role="application"
          aria-label={`${spec.label} breathing. Hold a finger, the mouse button or the space bar to feel the rhythm.`}
          className="fixed inset-0 z-[100] select-none bg-[#05060a]"
          style={{ touchAction: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' } as React.CSSProperties}
          {...stageHandlers}
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

          {/* phase text: always visible (works without motion, vibration or sound) */}
          <div className="pointer-events-none absolute inset-x-0 top-[62%] text-center" aria-live="polite">
            <p className={`text-xl font-light tracking-wide ${accent}`}>{phaseIn ? 'Breathe in' : 'Breathe out'}</p>
          </div>

          <div className={`absolute inset-x-0 top-0 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-center transition-opacity duration-500 ${ctrlHidden}`}>
            <p className={`mb-1 font-mono text-xs uppercase tracking-widest ${accent}`}>{spec.label}</p>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/75">
              Rest your finger on the screen and follow the vibration. For the best effect, breathe along with it.
            </p>
            {vibSupported === false && (
              <p className="mx-auto mt-2 max-w-sm font-mono text-[11px] text-white/40">
                No vibration in this browser — follow the light. On a computer, hold the mouse button or the space bar.
              </p>
            )}
          </div>

          <div className={`absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-opacity duration-500 ${ctrlHidden}`}>
            {vibSupported === false && (
              <button
                type="button"
                onPointerDown={stop}
                onClick={toggleSound}
                aria-pressed={soundOn}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-3 font-mono text-xs text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {soundOn ? '🔊 Sound on' : '🔇 Sound off'}
              </button>
            )}
            <button
              type="button"
              onPointerDown={stop}
              onClick={finish}
              className="rounded-full border border-white/25 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Finish
            </button>
          </div>

          {view === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-6" onPointerDown={stop}>
              <div className="w-full max-w-xs rounded-2xl border border-white/15 bg-[#0b0d14] p-6 text-center">
                <p className="mb-2 text-xl font-semibold text-white">Continue?</p>
                <p className="mb-5 font-mono text-xs text-white/50">You’ve been at it for 20 minutes.</p>
                <div className="flex flex-col gap-3">
                  <button type="button" autoFocus onClick={() => setView('session')} className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15">
                    Continue
                  </button>
                  <button type="button" onClick={finish} className="rounded-full px-6 py-2 font-mono text-xs text-white/60 hover:text-white">
                    Finish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Final screen */}
      {view === 'final' && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#05060a] px-5 py-10" role="dialog" aria-modal="true" aria-labelledby="vb-final">
          <div className="mx-auto max-w-2xl text-center">
            <p className={`mb-2 font-mono text-xs uppercase tracking-widest ${accent}`}>{spec.label} · done</p>
            <h2 id="vb-final" className="mb-6 text-2xl font-semibold text-white">How do you feel?</h2>
            {!feeling ? (
              <div className="mx-auto mb-8 grid max-w-md grid-cols-3 gap-3">
                {([['better', 'Better'], ['same', 'About the same'], ['worse', 'Worse']] as [Feeling, string][]).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => sendFeeling(k)}
                    className="rounded-xl border border-white/15 bg-white/5 px-2 py-4 text-sm text-white/85 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mb-8 font-mono text-sm text-white/60">Thanks — noted.</p>
            )}
            <div className="text-left">
              <AppStoreCTA ct={CT} variant="general" lang={lang} />
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" onClick={() => start(mode)} className="rounded-full border border-white/20 px-5 py-2 font-mono text-xs text-white/80 hover:bg-white/10">
                Again
              </button>
              <button type="button" onClick={() => setView('choose')} className="rounded-full px-5 py-2 font-mono text-xs text-white/60 hover:text-white">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        A simple breathing-rhythm guide, not a medical device. Nothing is measured, recorded or uploaded. Vibration
        needs a browser that supports it (most Android phones); Safari on iPhone and desktop browsers use light pulses
        and an optional sound instead.
      </p>

      <AppStoreCTA ct={CT} variant="general" lang={lang} />

      <h2 className="mb-4 mt-10 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {VIBRATION_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={langHref('/tools/breathing', lang)} className="text-terminal-green hover:underline">Breathing pacer</Link>
        {' · '}
        <Link to={langHref('/tools/breathing-rate', lang)} className="text-terminal-green hover:underline">Breathing rate monitor</Link>
      </div>
    </main>
  )
}
