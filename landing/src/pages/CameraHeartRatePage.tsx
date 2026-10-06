import { Fragment, useEffect, useRef, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import { CAMERA_HR_SOURCES } from '../data/camera-heart-rate'
import { camToolCopy } from '../data/cam-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

type Phase = 'idle' | 'measuring' | 'done' | 'error'
const DURATION_MS = 30000
const WARMUP_MS = 4000

interface Sample { t: number; v: number }

/** Estimate BPM from a red-channel time series via autocorrelation. */
function computeBpm(samples: Sample[]): { ok: boolean; bpm: number; quality: number } {
  if (samples.length < 120) return { ok: false, bpm: 0, quality: 0 }
  const t0 = samples[0].t
  const t1 = samples[samples.length - 1].t
  const dur = (t1 - t0) / 1000
  if (dur < 8) return { ok: false, bpm: 0, quality: 0 }
  const fs = 30
  const n = Math.floor(dur * fs)
  const sig = new Array<number>(n)
  let j = 0
  for (let i = 0; i < n; i++) {
    const tt = t0 + (i / fs) * 1000
    while (j < samples.length - 1 && samples[j + 1].t < tt) j++
    const a = samples[j]
    const b = samples[Math.min(j + 1, samples.length - 1)]
    const span = b.t - a.t || 1
    const frac = Math.max(0, Math.min(1, (tt - a.t) / span))
    sig[i] = a.v + (b.v - a.v) * frac
  }
  // Detrend: subtract a moving average (~0.8s window).
  const w = Math.round(fs * 0.8)
  const d = new Array<number>(n)
  for (let i = 0; i < n; i++) {
    let s = 0, c = 0
    for (let k = -w; k <= w; k++) {
      const idx = i + k
      if (idx >= 0 && idx < n) { s += sig[idx]; c++ }
    }
    d[i] = sig[i] - s / c
  }
  let denom = 0
  for (let i = 0; i < n; i++) denom += d[i] * d[i]
  if (denom <= 0) return { ok: false, bpm: 0, quality: 0 }
  const minLag = Math.round(fs * 0.34) // ~176 bpm
  const maxLag = Math.round(fs * 1.5) // 40 bpm
  let bestLag = -1, best = -Infinity
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0
    for (let i = 0; i < n - lag; i++) s += d[i] * d[i + lag]
    const norm = s / denom
    if (norm > best) { best = norm; bestLag = lag }
  }
  if (bestLag < 0) return { ok: false, bpm: 0, quality: 0 }
  const bpm = Math.round((60 * fs) / bestLag)
  const ok = best > 0.3 && bpm >= 40 && bpm <= 200
  return { ok, bpm, quality: best }
}

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

export function CameraHeartRatePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c = camToolCopy(lang)
  const hub = lang === 'en' ? '/tools' : `/${lang}/tools`

  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState(0)
  const [liveBpm, setLiveBpm] = useState<number | null>(null)
  const [bpm, setBpm] = useState<number | null>(null)
  const [weak, setWeak] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const sampleCanvas = useRef<HTMLCanvasElement>(null)
  const waveCanvas = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const samplesRef = useRef<Sample[]>([])
  const startRef = useRef(0)
  const lastLiveRef = useRef(0)

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const stopAll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop())
      streamRef.current = null
    }
  }
  useEffect(() => () => stopAll(), [])

  const drawWave = () => {
    const cv = waveCanvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const recent = samplesRef.current.slice(-180)
    ctx.clearRect(0, 0, cv.width, cv.height)
    if (recent.length < 4) return
    let min = Infinity, max = -Infinity
    for (const s of recent) { if (s.v < min) min = s.v; if (s.v > max) max = s.v }
    const range = max - min || 1
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#4ade80'
    recent.forEach((s, i) => {
      const x = (i / (recent.length - 1)) * cv.width
      const y = cv.height - ((s.v - min) / range) * (cv.height - 8) - 4
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }

  const loop = () => {
    const video = videoRef.current
    const cv = sampleCanvas.current
    if (!video || !cv) return
    const ctx = cv.getContext('2d', { willReadFrequently: true } as CanvasRenderingContext2DSettings)
    if (ctx && video.readyState >= 2) {
      const size = 60
      const sx = (video.videoWidth - size) / 2
      const sy = (video.videoHeight - size) / 2
      try {
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)
        const data = ctx.getImageData(0, 0, size, size).data
        let r = 0
        for (let i = 0; i < data.length; i += 4) r += data[i]
        const mean = r / (data.length / 4)
        const now = performance.now()
        samplesRef.current.push({ t: now, v: mean })
        drawWave()
        const elapsed = now - startRef.current
        setProgress(Math.min(100, Math.round((elapsed / DURATION_MS) * 100)))
        if (elapsed > WARMUP_MS && now - lastLiveRef.current > 2000) {
          lastLiveRef.current = now
          const recent = samplesRef.current.filter((s) => s.t > now - 12000)
          const res = computeBpm(recent)
          if (res.ok) setLiveBpm(res.bpm)
        }
        if (elapsed >= DURATION_MS) { finish(); return }
      } catch {
        /* frame not ready */
      }
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const finish = () => {
    const usable = samplesRef.current.filter((s) => s.t > startRef.current + WARMUP_MS)
    const res = computeBpm(usable)
    stopAll()
    if (res.ok) { setBpm(res.bpm); setWeak(false) }
    else { setBpm(res.bpm || null); setWeak(true) }
    setPhase('done')
  }

  const start = async () => {
    setErrorMsg('')
    setBpm(null)
    setLiveBpm(null)
    setWeak(false)
    setProgress(0)
    samplesRef.current = []
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Your browser doesn’t support camera access. Try a recent mobile browser.')
      setPhase('error')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 320 }, height: { ideal: 240 } },
        audio: false,
      })
      streamRef.current = stream
      const track = stream.getVideoTracks()[0]
      try { await track.applyConstraints({ advanced: [{ torch: true } as MediaTrackConstraintSet] }) } catch { /* no torch */ }
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        video.setAttribute('playsinline', 'true')
        video.muted = true
        await video.play().catch(() => {})
      }
      startRef.current = performance.now()
      lastLiveRef.current = performance.now()
      setPhase('measuring')
      rafRef.current = requestAnimationFrame(loop)
    } catch (err) {
      const name = (err as Error)?.name
      setErrorMsg(
        name === 'NotAllowedError'
          ? c.ui.denied
          : c.ui.failed,
      )
      setPhase('error')
    }
  }

  const reset = () => { stopAll(); setPhase('idle'); setProgress(0); setBpm(null); setLiveBpm(null); setWeak(false) }

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

      <img
        src="/images/tools/camera-heart-rate.png"
        alt={c.imageAlt}
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">⚠ {c.warning}</p>
      </div>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 text-center md:p-8">
        {/* hidden capture elements */}
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={sampleCanvas} width={60} height={60} className="hidden" />

        {phase === 'idle' && (
          <div>
            <ol className="mx-auto mb-5 max-w-md space-y-1 text-left font-mono text-xs leading-relaxed text-white/60">
              {c.steps.map((st, i) => (
                <li key={i}><span className="text-terminal-green">{i + 1}.</span> {st}</li>
              ))}
            </ol>
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20">
              {c.ui.start}
            </button>
          </div>
        )}

        {phase === 'measuring' && (
          <div>
            <canvas ref={waveCanvas} width={320} height={80} className="mx-auto mb-4 w-full max-w-sm rounded-lg border border-white/10 bg-black/30" />
            <div className="mb-2 text-4xl font-bold text-terminal-green">{liveBpm ?? '—'} <span className="text-lg text-white/40">{c.ui.bpm}</span></div>
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mb-4 font-mono text-xs text-white/50">{c.ui.hold}</p>
            <button onClick={reset} className="rounded-lg border border-white/20 bg-white/5 px-6 py-2 font-mono text-xs text-white/80 hover:bg-white/10">{c.ui.cancel}</button>
          </div>
        )}

        {phase === 'done' && (
          <div>
            {!weak && bpm ? (
              <>
                <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.estimated}</div>
                <div className="mb-3 text-5xl font-bold text-terminal-green">{bpm} <span className="text-xl text-white/40">{c.ui.bpm}</span></div>
                <p className="mb-4 font-mono text-xs leading-relaxed text-white/60">
                  {c.ui.resultNote}{' '}
                  <Link to={langHref('/tools/resting-heart-rate', lang)} className="text-terminal-green hover:underline">{c.ui.resultLink}</Link>
                </p>
              </>
            ) : (
              <p className="mb-4 font-mono text-xs leading-relaxed text-amber-300/80">
                {c.ui.weak}
              </p>
            )}
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-6 py-2 font-mono text-xs text-terminal-green hover:bg-terminal-green/20">{c.ui.again}</button>
          </div>
        )}

        {phase === 'error' && (
          <div>
            <p className="mb-4 font-mono text-xs leading-relaxed text-rose-300/80">{errorMsg}</p>
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-6 py-2 font-mono text-xs text-terminal-green hover:bg-terminal-green/20">{c.ui.tryAgain}</button>
          </div>
        )}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'camerahr', lang)} variant="general" lang={lang} />

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
        sources={CAMERA_HR_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <p className="mb-4 font-mono text-xs leading-relaxed text-white/50"><Rich text={c.science} lang={lang} /></p>

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/tools/resting-heart-rate', lang)} className="text-terminal-green hover:underline">{c.related.rhr}</Link>
        {' · '}
        <Link to={langHref('/tools/hrv', lang)} className="text-terminal-green hover:underline">{c.related.hrv}</Link>
        {' · '}
        <Link to="/compare/best-hrv-biofeedback-apps" className="text-terminal-green hover:underline">{c.related.apps}</Link>
      </div>
    </main>
  )
}
