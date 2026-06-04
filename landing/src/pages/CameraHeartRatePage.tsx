import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  CAMERA_HR_FAQ,
  CAMERA_HR_SOURCES,
  CAMERA_HR_METHODOLOGY,
} from '../data/camera-heart-rate'
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

export function CameraHeartRatePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

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
    document.title = 'Camera Heart Rate — Measure Pulse With Your Phone | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

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
          ? 'Camera permission was denied. Allow camera access and try again.'
          : 'Couldn’t start the camera. On a phone, make sure no other app is using it.',
      )
      setPhase('error')
    }
  }

  const reset = () => { stopAll(); setPhase('idle'); setProgress(0); setBpm(null); setLiveBpm(null); setWeak(false) }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Camera Heart Rate</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Camera Heart Rate</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Measure your pulse with just your phone — no wearable. Cover the rear camera and flash with a
        fingertip and watch your heartbeat appear in real time. A live taste of how ONDA reads your body.
      </p>

      <img
        src="/images/tools/camera-heart-rate.png"
        alt="Camera heart rate tool — measure your pulse with your phone camera using contact photoplethysmography, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ Rough, educational estimate — <strong>not a medical device</strong> and not a wearable’s
          accuracy. Works best on a phone (rear camera + flash). Everything is processed on your device;
          no video is recorded or uploaded.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 text-center md:p-8">
        {/* hidden capture elements */}
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={sampleCanvas} width={60} height={60} className="hidden" />

        {phase === 'idle' && (
          <div>
            <ol className="mx-auto mb-5 max-w-md space-y-1 text-left font-mono text-xs leading-relaxed text-white/60">
              <li><span className="text-terminal-green">1.</span> Use a phone. Tap start and allow camera access.</li>
              <li><span className="text-terminal-green">2.</span> Gently cover the <strong>rear camera + flash</strong> with your fingertip.</li>
              <li><span className="text-terminal-green">3.</span> Hold still for ~30 seconds while we read your pulse.</li>
            </ol>
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20">
              ♥ Start measurement
            </button>
          </div>
        )}

        {phase === 'measuring' && (
          <div>
            <canvas ref={waveCanvas} width={320} height={80} className="mx-auto mb-4 w-full max-w-sm rounded-lg border border-white/10 bg-black/30" />
            <div className="mb-2 text-4xl font-bold text-terminal-green">{liveBpm ?? '—'} <span className="text-lg text-white/40">bpm</span></div>
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mb-4 font-mono text-xs text-white/50">Keep your fingertip still over the camera &amp; flash…</p>
            <button onClick={reset} className="rounded-lg border border-white/20 bg-white/5 px-6 py-2 font-mono text-xs text-white/80 hover:bg-white/10">Cancel</button>
          </div>
        )}

        {phase === 'done' && (
          <div>
            {!weak && bpm ? (
              <>
                <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Estimated heart rate</div>
                <div className="mb-3 text-5xl font-bold text-terminal-green">{bpm} <span className="text-xl text-white/40">bpm</span></div>
                <p className="mb-4 font-mono text-xs leading-relaxed text-white/60">
                  A rough estimate from your fingertip. Curious if it’s normal? See{' '}
                  <Link to={`${langPrefix}/tools/resting-heart-rate`} className="text-terminal-green hover:underline">resting heart rate by age</Link>.
                </p>
              </>
            ) : (
              <p className="mb-4 font-mono text-xs leading-relaxed text-amber-300/80">
                Weak signal — we couldn’t read a clear pulse. Use a phone, cover the rear camera <em>and</em> flash fully but gently with your fingertip, and hold still. Try again.
              </p>
            )}
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-6 py-2 font-mono text-xs text-terminal-green hover:bg-terminal-green/20">Measure again</button>
          </div>
        )}

        {phase === 'error' && (
          <div>
            <p className="mb-4 font-mono text-xs leading-relaxed text-rose-300/80">{errorMsg}</p>
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-6 py-2 font-mono text-xs text-terminal-green hover:bg-terminal-green/20">Try again</button>
          </div>
        )}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical advice. Smartphone-camera heart rate varies with device,
        lighting, finger pressure and stillness, so use it as a ballpark and a demo — not for any
        health decision. Heart rate only (not HRV, which a camera can’t reliably capture). Camera
        frames are analysed live on your device and never stored or sent.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">This is the demo. The app is the real thing.</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          A 30-second camera reading is a taste. ONDA Life reads your heart rate and HRV continuously
          and turns them into a calm, trend-based picture of recovery — the accuracy a camera can’t give.
        </p>
        <a href={appStoreUrl('tool_camerahr')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={CAMERA_HR_METHODOLOGY} sources={CAMERA_HR_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {CAMERA_HR_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/resting-heart-rate`} className="text-terminal-green hover:underline">Resting heart rate by age</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
      </div>
    </main>
  )
}
