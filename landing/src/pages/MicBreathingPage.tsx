import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { MIC_FAQ, MIC_SOURCES, MIC_METHODOLOGY, TARGET_BPM } from '../data/mic-breathing'
import { SourcesSection } from '../components/SourcesSection'

type Phase = 'idle' | 'listening' | 'error'
const WARMUP_MS = 6000

interface Sample { t: number; v: number }

/** Estimate breaths/min from the smoothed RMS envelope via autocorrelation. */
function computeRate(samples: Sample[]): { ok: boolean; bpm: number } {
  if (samples.length < 150) return { ok: false, bpm: 0 }
  const t0 = samples[0].t
  const t1 = samples[samples.length - 1].t
  const dur = (t1 - t0) / 1000
  if (dur < 12) return { ok: false, bpm: 0 }
  const fs = 10
  const n = Math.floor(dur * fs)
  if (n < 60) return { ok: false, bpm: 0 }
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
  // Detrend with a slow moving average (~4s) to remove drift.
  const w = Math.round(fs * 4)
  const d = new Array<number>(n)
  for (let i = 0; i < n; i++) {
    let s = 0, c = 0
    for (let k = -w; k <= w; k++) { const idx = i + k; if (idx >= 0 && idx < n) { s += sig[idx]; c++ } }
    d[i] = sig[i] - s / c
  }
  let denom = 0
  for (let i = 0; i < n; i++) denom += d[i] * d[i]
  if (denom <= 0) return { ok: false, bpm: 0 }
  const minLag = Math.round(fs * 1.8) // ~33 breaths/min
  const maxLag = Math.round(fs * 12) // 5 breaths/min
  let bestLag = -1, best = -Infinity
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0
    for (let i = 0; i < n - lag; i++) s += d[i] * d[i + lag]
    const norm = s / denom
    if (norm > best) { best = norm; bestLag = lag }
  }
  if (bestLag < 0) return { ok: false, bpm: 0 }
  const bpm = Math.round((60 * fs) / bestLag)
  return { ok: best > 0.25 && bpm >= 4 && bpm <= 40, bpm }
}

export function MicBreathingPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [phase, setPhase] = useState<Phase>('idle')
  const [rate, setRate] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const ctxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const samplesRef = useRef<Sample[]>([])
  const startRef = useRef(0)
  const lastCalcRef = useRef(0)
  const waveCanvas = useRef<HTMLCanvasElement>(null)
  const bufRef = useRef<Float32Array | null>(null)

  useEffect(() => {
    document.title = 'Breathing Rate Monitor — Measure It With Your Mic | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const stopAll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null }
    if (ctxRef.current) { ctxRef.current.close().catch(() => {}); ctxRef.current = null }
  }
  useEffect(() => () => stopAll(), [])

  const drawWave = () => {
    const cv = waveCanvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const recent = samplesRef.current.slice(-200)
    ctx.clearRect(0, 0, cv.width, cv.height)
    if (recent.length < 4) return
    let min = Infinity, max = -Infinity
    for (const s of recent) { if (s.v < min) min = s.v; if (s.v > max) max = s.v }
    const range = max - min || 1
    ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = '#00d4ff'
    recent.forEach((s, i) => {
      const x = (i / (recent.length - 1)) * cv.width
      const y = cv.height - ((s.v - min) / range) * (cv.height - 8) - 4
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()
  }

  const loop = () => {
    const analyser = analyserRef.current
    const buf = bufRef.current
    if (analyser && buf) {
      analyser.getFloatTimeDomainData(buf as Parameters<AnalyserNode['getFloatTimeDomainData']>[0])
      let sum = 0
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i]
      const rms = Math.sqrt(sum / buf.length)
      const now = performance.now()
      const prev = samplesRef.current.length ? samplesRef.current[samplesRef.current.length - 1].v : rms
      const smoothed = prev * 0.85 + rms * 0.15 // ~envelope
      samplesRef.current.push({ t: now, v: smoothed })
      if (samplesRef.current.length > 4000) samplesRef.current.shift()
      drawWave()
      if (now - startRef.current > WARMUP_MS && now - lastCalcRef.current > 2500) {
        lastCalcRef.current = now
        const win = samplesRef.current.filter((s) => s.t > now - 30000)
        const res = computeRate(win)
        if (res.ok) setRate(res.bpm)
      }
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const start = async () => {
    setErrorMsg(''); setRate(null); samplesRef.current = []
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || !AC) {
      setErrorMsg('Your browser doesn’t support microphone access. Try a recent browser.')
      setPhase('error'); return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false })
      streamRef.current = stream
      const ctx = new AC()
      ctxRef.current = ctx
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      bufRef.current = new Float32Array(analyser.fftSize)
      src.connect(analyser)
      analyserRef.current = analyser
      startRef.current = performance.now()
      lastCalcRef.current = performance.now()
      setPhase('listening')
      rafRef.current = requestAnimationFrame(loop)
    } catch (err) {
      const name = (err as Error)?.name
      setErrorMsg(name === 'NotAllowedError' ? 'Microphone permission was denied. Allow it and try again.' : 'Couldn’t start the microphone.')
      setPhase('error')
    }
  }

  const stop = () => { stopAll(); setPhase('idle') }

  const rateColor = rate == null ? 'text-white/40' : rate <= 8 ? 'text-terminal-green' : rate <= 14 ? 'text-terminal-cyan' : 'text-amber-400'

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Breathing Rate</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Breathing Rate Monitor</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Measure your breathing rate with your phone’s mic — then watch it drop as you slow down toward
        the ~6 breaths-a-minute calm zone. A live taste of breath biofeedback, no wearable needed.
      </p>

      <img
        src="/images/tools/breathing-rate.png"
        alt="Breathing rate monitor — measure breaths per minute with your phone microphone and slow toward the 6/min HRV resonance zone, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ Rough biofeedback estimate, <strong>not a medical monitor</strong>. Needs audible breathing
          in a quiet room. All audio is processed on your device; nothing is recorded or uploaded.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 text-center md:p-8">
        {phase === 'idle' && (
          <div>
            <ol className="mx-auto mb-5 max-w-md space-y-1 text-left font-mono text-xs leading-relaxed text-white/60">
              <li><span className="text-terminal-green">1.</span> Find a quiet room and tap start (allow the mic).</li>
              <li><span className="text-terminal-green">2.</span> Breathe audibly — exhale through the mouth with a soft “haaa”.</li>
              <li><span className="text-terminal-green">3.</span> Watch your rate, then slow it toward {TARGET_BPM}/min.</li>
            </ol>
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20">
              ◓ Start listening
            </button>
          </div>
        )}

        {phase === 'listening' && (
          <div>
            <canvas ref={waveCanvas} width={320} height={80} className="mx-auto mb-4 w-full max-w-sm rounded-lg border border-white/10 bg-black/30" />
            <div className={`mb-1 text-5xl font-bold ${rateColor}`}>{rate ?? '…'} <span className="text-lg text-white/40">br/min</span></div>
            <p className="mb-4 font-mono text-xs text-white/50">
              {rate == null ? 'Listening — breathe audibly and steadily…' : rate <= 8 ? 'In the calm zone — lovely, hold it here.' : `Target ~${TARGET_BPM}/min — lengthen the exhale to slow down.`}
            </p>
            <button onClick={stop} className="rounded-lg border border-white/20 bg-white/5 px-6 py-2 font-mono text-xs text-white/80 hover:bg-white/10">◼ Stop</button>
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
        Educational biofeedback estimate, not a medical respiration monitor. It needs audible breathing
        in a quiet room and can be thrown off by background noise. A normal resting rate is ~12–20/min;
        slowing toward ~6/min is the HRV resonance zone. Audio is analysed live on-device and never stored.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Breath is the lever. The app is the dashboard.</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          This shows your breath rhythm. ONDA Life shows what it does to your nervous system — pacing
          breath against your live HRV so you can see yourself calm down in real time.
        </p>
        <a href={appStoreUrl('tool_breathingrate')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={MIC_METHODOLOGY} sources={MIC_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {MIC_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/breathing`} className="text-terminal-green hover:underline">Breathing pacer</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/camera-heart-rate`} className="text-terminal-green hover:underline">Camera heart rate</Link>
      </div>
    </main>
  )
}
