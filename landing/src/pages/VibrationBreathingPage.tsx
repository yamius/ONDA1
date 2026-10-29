/**
 * /tools/vibration-breathing — "Relax / Wake up" breathing by touch (task 104).
 *
 * Finger on the screen → vibration fades in and follows the rhythm; finger off →
 * it fades out and the controls come back, the session keeps running until
 * Finish. Vibration via navigator.vibrate (feature-detected, never UA-sniffed).
 * Without it (iOS Safari, desktop): SOUND is the main channel — a click-free Web Audio breath
 * wave (src/lib/breathSound.ts) that swells on the inhale and ebbs on the exhale, gated by the
 * same finger fade as vibration; ON by default there, mute button. Plus visual pulses.
 * Android (vibrate + touch): "Get ONDA for Android" → existing /api/waitlist (gated by VIBRATION_WAITLIST_ENABLED).
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
import { gtmToolEvent, gtmAndroidWaitlist } from '../lib/gtm'
import { BreathSound, unlockAudioSession, releaseAudioSession } from '../lib/breathSound'
import { VIBRATION_WAITLIST_ENABLED } from '../config/features'
import {
  MODES, MAX_CONTINUOUS_MS, FADE_IN_MS, FADE_OUT_MS,
  VIBRATION_FAQ, nextPulse, type BreathMode,
} from '../data/vibration-breathing'

type View = 'choose' | 'session' | 'paused' | 'final'
type Feeling = 'better' | 'same' | 'worse'

const CT = storeCt('tool', 'vibration-breathing') // tool_vibration_breathing
const TOOL_NAME = 'vibration_breathing'
const CT_SOURCE = 'vibration_tool'

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
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
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
  const audioRef = useRef<BreathSound | null>(null)
  const reducedRef = useRef(false)
  const phaseInRef = useRef(true)
  const keyHeldRef = useRef(false)

  useEffect(() => {
    document.title = 'Vibration Breathing — Relax or Wake Up by Touch | ONDA Life'
    setVibSupported(canVibrate())
    try { setIsTouchDevice(navigator.maxTouchPoints > 0 || 'ontouchstart' in window) } catch { /* noop */ }
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
          flashRef.current = Math.min(1, 0.35 + 0.65 * g)
          nextPulseAtRef.current = now + p + gap
        }
      } else if (vibratingRef.current) {
        vibrate(0)
        vibratingRef.current = false
      }
      flashRef.current = Math.max(0, flashRef.current - dt / 260)

      // Breath sound: swells on the inhale, ebbs on the exhale, × the finger fade g.
      const snd = audioRef.current
      if (snd) {
        const ease = 0.5 - 0.5 * Math.cos(Math.PI * progress)
        const breath = inhale ? ease : 1 - ease
        // Idle (no finger) = quiet breathing wave at ~40%; finger fades it up to full (g).
        snd.update(soundRef.current ? (0.4 + 0.6 * g) * (0.3 + 0.7 * breath) : 0, breath)
      }

      if (canvas) draw(canvas, now, spec.rgb, inhale, progress, g, modeRef.current)
      rafRef.current = requestAnimationFrame(frame)
    }

    const draw = (
      c: HTMLCanvasElement, _now: number, rgb: [number, number, number],
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
      const N = 3

      // background glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, maxR * 0.7)
      glow.addColorStop(0, `rgba(${r},${gg},${b},${0.10 + 0.12 * breath * intensity})`)
      glow.addColorStop(1, `rgba(${r},${gg},${b},0)`)
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      // Waves: few and slow. Inhale → rings CONVERGE on the point; exhale → they SPREAD out from it.
      // Each ring crosses the screen once per phase (Relax 4 s / 6 s, Wake 3 s / 2 s). The halo grows
      // wave by wave through the breath cycle and eases back down before the next cycle.
      const spec = MODES[m]
      const cycle = spec.inhaleMs + spec.exhaleMs
      const cycleP = inhale
        ? (progress * spec.inhaleMs) / cycle
        : (spec.inhaleMs + progress * spec.exhaleMs) / cycle
      const edge = Math.min(1, progress / 0.12, (1 - progress) / 0.12) // no pop at phase switch
      for (let k = 0; k < N; k++) {
        const f = reducedRef.current ? (k + 0.5) / N : (progress + k / N) % 1
        const rad = reducedRef.current
          ? Math.max(2, maxR * 0.85 * (1 - f))
          : Math.max(2, maxR * 0.85 * (inhale ? 1 - f : f))
        // when (in the cycle) this ring set off — later waves get a larger halo
        const born = Math.max(0, cycleP - (f * (inhale ? spec.inhaleMs : spec.exhaleMs)) / cycle)
        const haloP = born < 0.85 ? born / 0.85 : (1 - born) / 0.15
        const blur = reducedRef.current ? 12 : 6 + 26 * haloP
        const a = reducedRef.current
          ? (0.12 + 0.5 * breath) * intensity * (0.4 + 0.6 * f)
          : Math.sin(Math.PI * f) * intensity * 0.6 * edge
        ctx.beginPath()
        ctx.arc(x, y, rad, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${gg},${b},${a.toFixed(3)})`
        ctx.lineWidth = 2 + 2 * haloP
        ctx.shadowColor = `rgba(${r},${gg},${b},0.85)`
        ctx.shadowBlur = blur
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
  }, [view])

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
    const onHide = () => {
      if (document.hidden) { setTouch(false); if (canVibrate()) vibrate(0); audioRef.current?.suspend() }
      else audioRef.current?.resume()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      if (canVibrate()) vibrate(0)
      audioRef.current?.close(); audioRef.current = null
    }
  }, [setTouch])

  function start(m: BreathMode) {
    // Sound is created + resumed HERE, inside the click (user gesture) — required on iOS.
    // Default: ON where there is no vibration (sound is the main channel), OFF where it vibrates.
    // All synchronous — no await before resume(), or iOS won't unlock audio.
    const vib = canVibrate()
    if (!vib) unlockAudioSession() // iOS: play through the Silent switch
    try {
      audioRef.current?.close()
      audioRef.current = new BreathSound(m)
      audioRef.current.resume()
      if (/[?&]debug_audio=1/.test(window.location.search)) {
        (window as unknown as { __vbSound?: BreathSound }).__vbSound = audioRef.current
      }
    } catch { audioRef.current = null }
    const on = !vib && !!audioRef.current
    soundRef.current = on
    setSoundOn(on)
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
    audioRef.current?.close(); audioRef.current = null
    releaseAudioSession()
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
    if (next) unlockAudioSession()
    if (!audioRef.current) {
      try { audioRef.current = new BreathSound(modeRef.current) } catch { return }
    }
    audioRef.current.resume()
    soundRef.current = next
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
  // Android = feature detection (vibrate + touch), not UA. Gated by its own VIBRATION_WAITLIST_ENABLED (not the shared API_ENABLED), like the
  // existing <AndroidWaitlist>: without the /api/waitlist function the button is not rendered.
  const showAndroid = VIBRATION_WAITLIST_ENABLED && vibSupported === true && isTouchDevice
  const androidBtn = showAndroid && (
    <button
      type="button"
      onClick={() => { setWaitlistOpen(true); gtmAndroidWaitlist('android_waitlist_view', CT_SOURCE) }}
      className="mt-6 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-mono text-xs text-white/80 hover:bg-white/10"
    >
      Get ONDA for Android
    </button>
  )

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
            This browser can’t vibrate, so the rhythm comes as a soft sound wave and light — turn your sound on.
          </p>
        )}
        {androidBtn}
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
              {vibSupported === false
                ? 'Rest your finger on the screen and follow the sound. For the best effect, breathe along with it.'
                : 'Rest your finger on the screen and follow the vibration. For the best effect, breathe along with it.'}
            </p>
            {vibSupported === false && isTouchDevice && (
              <p className="mx-auto mt-2 max-w-sm font-mono text-[11px] text-white/55">
                Turn on sound or use headphones. This browser can’t vibrate — the rhythm comes as a soft sound wave and light.
              </p>
            )}
            {vibSupported === false && !isTouchDevice && (
              <p className="mx-auto mt-2 max-w-sm font-mono text-[11px] text-white/40">
                Hold the mouse button or the space bar and follow the sound and the light.
              </p>
            )}
          </div>

          <div className={`absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-opacity duration-500 ${ctrlHidden}`}>
            <button
              type="button"
              onPointerDown={stop}
              onClick={finish}
              className="rounded-full border border-white/25 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Finish
            </button>
          </div>

          {/* Sound/mute — always visible from the first second (not hidden while touching),
              big, in the thumb zone (bottom-left), clear of the rings' centre. */}
          <button
            type="button"
            onPointerDown={stop}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Mute sound' : 'Turn sound on'}
            className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/60 text-2xl text-white shadow-lg backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span aria-hidden="true">{soundOn ? '🔊' : '🔇'}</span>
          </button>

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
            {androidBtn}
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

      {waitlistOpen && <AndroidWaitlistForm onClose={() => setWaitlistOpen(false)} />}

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        A simple breathing-rhythm guide, not a medical device. Nothing is measured, recorded or uploaded. Vibration
        needs a browser that supports it (most Android phones); Safari on iPhone and desktop browsers use a soft sound
        wave and light instead.
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

/** Android waitlist form — reuses the existing waitlist mechanism (POST /api/waitlist →
 *  Supabase `waitlist` {email, platform, source}); no new table. `source` needs the column from
 *  supabase-waitlist-source.sql (the handler only writes it when present). Consent is required. */
function AndroidWaitlistForm({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  // Deliberately NOT a <form>: GTM's built-in form listeners (gtm.formInteract / gtm.formSubmit,
  // GA4 enhanced-measurement forms) attach the form DOM node to the dataLayer, which would put the
  // typed email into the dataLayer. A plain container + button keeps the email out of it entirely.
  async function submit() {
    const ei = emailRef.current, ci = consentRef.current
    if (!ei || !ci) return
    if (!ei.checkValidity()) { ei.reportValidity(); return }
    if (!ci.checked) { ci.reportValidity(); return }
    const email = ei.value.trim()
    setError(null); setState('sending')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform: 'android', source: CT_SOURCE }),
      })
      if (res.status === 409) { setState('done'); return } // already on the list
      if (!res.ok) { setError('Something went wrong. Please try again later.'); setState('idle'); return }
      gtmAndroidWaitlist('android_waitlist_submit', CT_SOURCE)
      setState('done')
    } catch { setError('Something went wrong. Please try again later.'); setState('idle') }
  }
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-4" role="dialog" aria-modal="true" aria-labelledby="vb-android" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b0d14] p-6" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 rounded p-1 text-white/50 hover:text-white">✕</button>
        {state !== 'done' ? (
          <div role="form" aria-labelledby="vb-android" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') { e.preventDefault(); void submit() } }}>
            <h2 id="vb-android" className="mb-2 text-xl font-semibold text-white">Get ONDA for Android</h2>
            <p className="mb-4 text-sm text-white/60">The Android app isn’t out yet. Leave your email and we’ll write once when it is.</p>
            <label className="mb-1 block font-mono text-[11px] text-white/50" htmlFor="vb-email">Email</label>
            <input id="vb-email" ref={emailRef} type="email" name="email" required autoComplete="email" disabled={state === 'sending'}
              className="mb-4 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/50" />
            <label className="mb-4 flex items-start gap-2 text-left text-xs leading-relaxed text-white/70">
              <input type="checkbox" ref={consentRef} name="consent" required className="mt-0.5 h-4 w-4 shrink-0" />
              <span>I agree that ONDA Life stores my email to tell me when the Android app is available. <a href="/privacy" target="_blank" rel="noopener" className="underline hover:text-white">Privacy Policy</a></span>
            </label>
            {error && <p className="mb-3 text-sm text-rose-400" role="alert">{error}</p>}
            <button type="button" onClick={() => void submit()} disabled={state === 'sending'} className="w-full rounded-full bg-white/90 py-3 text-sm font-semibold text-black hover:bg-white disabled:opacity-50">
              {state === 'sending' ? 'Sending…' : 'Notify me'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 id="vb-android" className="mb-2 text-xl font-semibold text-white">You’re on the list</h2>
            <p className="mb-5 text-sm text-white/60">We’ll email you when ONDA for Android is ready.</p>
            <button type="button" onClick={onClose} className="rounded-full border border-white/25 px-6 py-2 text-sm text-white">OK</button>
          </div>
        )}
      </div>
    </div>
  )
}
