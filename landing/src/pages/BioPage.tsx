import { useCallback, useEffect, useRef, useState } from 'react'

type MetricValue = string | null

interface BiometricState {
  bpm: MetricValue
  br: MetricValue
  stress: MetricValue
  energy: MetricValue
  hrv: MetricValue
  csi: MetricValue
  recoveryRate: MetricValue
  hrTrend: MetricValue
  hrAccel: MetricValue
  alarm: MetricValue
  relaxation: MetricValue
  focus: MetricValue
  excitement: MetricValue
  fatigue: MetricValue
  flow: MetricValue
}

const emptyMetrics: BiometricState = {
  bpm: null, br: null, stress: null, energy: null,
  hrv: null, csi: null, recoveryRate: null, hrTrend: null, hrAccel: null,
  alarm: null, relaxation: null, focus: null, excitement: null, fatigue: null, flow: null,
}

function fmt(v: MetricValue, suffix = '') {
  return v !== null ? `${v}${suffix}` : '--'
}

// ─── PPG processing ──────────────────────────────────────────────────────────

const PPG_FPS = 30
const PPG_WINDOW = PPG_FPS * 15   // 15-second buffer for stability
const MIN_DIST = Math.round(PPG_FPS * 0.4)  // 150 BPM max

// EMA alpha — lower = smoother but slower to react
const EMA_ALPHA = 0.15

function movingAvg(arr: number[], win: number): number[] {
  return arr.map((_, i) => {
    const slice = arr.slice(Math.max(0, i - win), i + 1)
    return slice.reduce((s, x) => s + x, 0) / slice.length
  })
}

function detectPeaks(signal: number[]): number[] {
  const peaks: number[] = []
  for (let i = 1; i < signal.length - 1; i++) {
    if (signal[i] > signal[i - 1] && signal[i] > signal[i + 1]) {
      if (!peaks.length || i - peaks[peaks.length - 1] >= MIN_DIST)
        peaks.push(i)
    }
  }
  return peaks
}

// Returns raw (unsmoothed) numeric metric values
function computeRaw(redBuf: number[]): Record<string, number> | null {
  if (redBuf.length < PPG_FPS * 6) return null

  const avg = movingAvg(redBuf, PPG_FPS * 2)
  const detrended = redBuf.map((v, i) => v - avg[i])
  const peaks = detectPeaks(detrended)
  if (peaks.length < 4) return null

  const rrIntervals: number[] = []
  for (let i = 1; i < peaks.length; i++)
    rrIntervals.push((peaks[i] - peaks[i - 1]) / PPG_FPS * 1000)

  const validRR = rrIntervals.filter(r => r > 400 && r < 1500)
  if (validRR.length < 3) return null

  const meanRR = validRR.reduce((s, r) => s + r, 0) / validRR.length
  const bpm = 60000 / meanRR
  if (bpm < 40 || bpm > 180) return null

  // RMSSD — standard HRV metric
  const rmssd = Math.sqrt(
    validRR.map((r, i, a) => i ? (r - a[i - 1]) ** 2 : 0)
      .slice(1).reduce((s, v) => s + v, 0) / (validRR.length - 1)
  )

  // SDNN / CSI
  const sdRR = Math.sqrt(
    validRR.map(r => (r - meanRR) ** 2).reduce((s, v) => s + v, 0) / validRR.length
  )
  const csi = sdRR / meanRR

  // Breathing rate from envelope
  const envelope = movingAvg(detrended.map(v => Math.abs(v)), PPG_FPS)
  const envPeaks = detectPeaks(envelope)
  let br = 0
  if (envPeaks.length >= 3) {
    const intervals = envPeaks.slice(1).map((p, i) => (p - envPeaks[i]) / PPG_FPS)
    const meanInterval = intervals.reduce((s, v) => s + v, 0) / intervals.length
    const brRaw = 60 / meanInterval
    if (brRaw >= 6 && brRaw <= 40) br = brRaw
  }

  // HR trend: slope via simple linear regression on RR intervals
  const n = validRR.length
  const xMean = (n - 1) / 2
  const slope = validRR.reduce((s, r, i) => s + (i - xMean) * (r - meanRR), 0) /
    validRR.reduce((s, _, i) => s + (i - xMean) ** 2, 0)
  const hrTrend = -slope / 100  // positive = HR rising

  // HR acceleration (second derivative)
  const diffs = validRR.slice(1).map((r, i) => r - validRR[i])
  const hrAccel = diffs.length > 1
    ? diffs.slice(1).reduce((s, v) => s + v, 0) / (diffs.length - 1) / 100
    : 0

  // Recovery Rate
  const bpmValues = validRR.map(r => 60000 / r)
  const bpmMean = bpmValues.reduce((s, v) => s + v, 0) / bpmValues.length
  const bpmMax = Math.max(...bpmValues)
  const recoveryRate = bpmMax > bpmMean + 2
    ? (bpmMax - bpmValues[bpmValues.length - 1]) / (bpmMax - bpmMean) * 100
    : 0

  // Derived scores 0-100
  // stress: CSI normalized so typical camera CSI ~0.30 → ~40%
  const stress = Math.min(100, Math.max(0, csi * 130))
  // energy: inverse of HR elevation above resting + inverse CSI
  const energy = Math.min(100, Math.max(10,
    90 - Math.max(0, bpm - 75) * 1.5 - csi * 80
  ))

  const alarm = Math.min(100, Math.max(0, stress * 0.7 + Math.max(0, br - 15) * 3))
  const relaxation = Math.min(100, Math.max(0, (1 - Math.min(1, csi * 1.5)) * 60 + energy * 0.2))
  const focus = Math.min(100, Math.max(0, energy * 0.5 + (100 - stress) * 0.5))
  const excitement = Math.min(100, Math.max(0, (bpm - 60) * 1.5 + br * 0.5))
  const fatigue = Math.min(100, Math.max(0, (1 - energy / 100) * 60 + stress * 0.2))
  const flow = Math.min(100, Math.max(0, focus * 0.6 + relaxation * 0.4))

  return {
    bpm, br, hrv: rmssd, csi, recoveryRate, hrTrend, hrAccel,
    stress, energy, alarm, relaxation, focus, excitement, fatigue, flow,
  }
}

// Apply EMA: smoothed = alpha * raw + (1-alpha) * prev
function applyEMA(
  raw: Record<string, number>,
  prev: Record<string, number>,
  alpha: number,
): Record<string, number> {
  const out: Record<string, number> = { ...prev }
  for (const key of Object.keys(raw)) {
    const r = raw[key]
    out[key] = prev[key] !== undefined ? alpha * r + (1 - alpha) * prev[key] : r
  }
  return out
}

function smoothedToState(s: Record<string, number>): Partial<BiometricState> {
  const r = (k: string, d = 0) =>
    s[k] !== undefined ? String(Math.round(s[k] * (10 ** d)) / (10 ** d)) : null

  return {
    bpm: r('bpm'),
    br: s['br'] > 0 ? r('br') : null,
    hrv: r('hrv'),
    csi: s['csi'] !== undefined ? String(Math.round(s['csi'] * 1000) / 1000) : null,
    recoveryRate: r('recoveryRate'),
    hrTrend: s['hrTrend'] !== undefined ? String(Math.round(s['hrTrend'] * 1000) / 1000) : null,
    hrAccel: s['hrAccel'] !== undefined ? String(Math.round(s['hrAccel'] * 1000) / 1000) : null,
    stress: r('stress'),
    energy: r('energy'),
    alarm: r('alarm'),
    relaxation: r('relaxation'),
    focus: r('focus'),
    excitement: r('excitement'),
    fatigue: r('fatigue'),
    flow: r('flow'),
  }
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#e05060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
function WindIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#5090e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  )
}
function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#e08030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}
function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#e0b030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MainCard({ icon, label, value, suffix }: {
  icon: React.ReactNode; label: string; value: MetricValue; suffix?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#1e1540] py-4 px-5 ring-2 ring-white/20">
      {icon}
      <span className="text-2xl font-bold tracking-tight text-white">{fmt(value, suffix)}</span>
      <span className="text-xs tracking-widest text-white/40 uppercase">{label}</span>
    </div>
  )
}

function MetricRow({ label, desc, value, suffix }: {
  label: string; desc?: string; value: MetricValue; suffix?: string
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#1e1540] px-4 py-3">
      <div className="mr-4">
        <p className="text-sm font-semibold text-white leading-snug">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-white/40 leading-snug">{desc}</p>}
      </div>
      <span className="shrink-0 text-base font-bold text-white">{fmt(value, suffix)}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-center text-base font-semibold text-white">{children}</h2>
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function BioPage() {
  const [metrics, setMetrics] = useState<BiometricState>(emptyMetrics)
  const [measuring, setMeasuring] = useState(false)
  const [cameraColor, setCameraColor] = useState<string>('rgb(220,220,220)')
  const [cameraError, setCameraError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const ppgBuffer = useRef<number[]>([])
  const smoothedRef = useRef<Record<string, number>>({})
  const frameCountRef = useRef(0)
  const fingerOnRef = useRef(false)
  const fingerOffFrames = useRef(0)
  // Update display every N frames (~2 seconds at 30fps)
  const UPDATE_EVERY = 60
  // Clear buffer if finger absent for this many frames (~1.5s)
  const FINGER_OFF_RESET = 45

  useEffect(() => {
    document.title = 'Bio OS — Live Biometrics | ONDA Life'
    return () => stopAll()
  }, [])

  function stopAll() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    rafRef.current = null
    streamRef.current = null
  }

  const processFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(processFrame)
      return
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    canvas.width = video.videoWidth || 64
    canvas.height = video.videoHeight || 64
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Sample center 48×48 region
    const cx = Math.floor(canvas.width / 2)
    const cy = Math.floor(canvas.height / 2)
    const size = Math.min(24, cx, cy)
    const imageData = ctx.getImageData(cx - size, cy - size, size * 2, size * 2)
    const pixels = imageData.data

    let r = 0, g = 0, b = 0, count = 0
    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i]; g += pixels[i + 1]; b += pixels[i + 2]; count++
    }
    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)

    // Detect finger: dark center = finger covering lens
    const brightness = r * 0.299 + g * 0.587 + b * 0.114
    const isFingerOn = brightness < 90

    // Camera preview color update (throttled to ~10fps)
    if (frameCountRef.current % 3 === 0) {
      setCameraColor(`rgb(${r},${g},${b})`)
    }

    if (isFingerOn) {
      fingerOffFrames.current = 0
      fingerOnRef.current = true
      // Add to PPG buffer only when finger is on
      ppgBuffer.current.push(r)
      if (ppgBuffer.current.length > PPG_WINDOW) ppgBuffer.current.shift()
    } else {
      fingerOffFrames.current++
      fingerOnRef.current = false
      // If finger absent long enough, reset buffer so stale data doesn't pollute
      if (fingerOffFrames.current >= FINGER_OFF_RESET) {
        ppgBuffer.current = []
        fingerOffFrames.current = 0
      }
    }

    frameCountRef.current++

    // Compute & smooth metrics every UPDATE_EVERY frames — ONLY when finger is on
    if (fingerOnRef.current && frameCountRef.current % UPDATE_EVERY === 0) {
      const raw = computeRaw([...ppgBuffer.current])
      if (raw) {
        smoothedRef.current = applyEMA(raw, smoothedRef.current, EMA_ALPHA)
        setMetrics(prev => ({ ...prev, ...smoothedToState(smoothedRef.current) }))
      }
    }

    rafRef.current = requestAnimationFrame(processFrame)
  }, [])

  async function handleStart() {
    if (measuring) return
    setCameraError(null)
    ppgBuffer.current = []
    smoothedRef.current = {}
    frameCountRef.current = 0

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      // Torch
      const track = stream.getVideoTracks()[0]
      try {
        await track.applyConstraints({ advanced: [{ torch: true } as MediaTrackConstraintSet] })
      } catch { /* not supported */ }
    } catch {
      setCameraError('Camera access denied. Please allow camera in browser settings.')
      return
    }

    setMeasuring(true)
    setMetrics(emptyMetrics)
    rafRef.current = requestAnimationFrame(processFrame)
  }

  function handleStop() {
    stopAll()
    setMeasuring(false)
    setCameraColor('rgb(220,220,220)')
  }

  const brightness = (() => {
    const rgb = cameraColor.match(/\d+/g)?.map(Number) ?? [220, 220, 220]
    return rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114
  })()
  const fingerOn = measuring && brightness < 90

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg,#1a0a2e 0%,#0d0620 50%,#12082a 100%)' }}>
      <video ref={videoRef} playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      <div className="mx-auto max-w-lg px-4 py-10 md:py-14">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-mono text-3xl font-bold md:text-4xl">
            <span className="text-cyan-400">Bio</span>
            <span className="text-green-400"> OS</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/40">
            Real-time biometric analysis — no wearable required.<br />
            Place your finger on the back camera to begin.
          </p>
        </div>

        {/* Camera button + preview dot */}
        <div className="mb-8 flex flex-col items-center gap-3">
          {measuring ? (
            <>
              <button
                onClick={handleStop}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full ring-2 ring-cyan-400/50 bg-[#1e1540] shadow-[0_0_36px_rgba(6,182,212,0.18)] active:scale-95 transition-all"
              >
                {/* Pulsing dot */}
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
                </span>
                <span className="text-[11px] text-white/40 mt-1">tap to stop</span>
              </button>

              {/* Camera preview circle */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="h-10 w-10 rounded-full ring-2 ring-white/15 shadow-lg transition-colors duration-500"
                  style={{ backgroundColor: cameraColor }}
                />
                <p className={`text-[10px] transition-colors duration-300 ${fingerOn ? 'text-green-400' : 'text-white/30'}`}>
                  {fingerOn ? '✓ Finger detected — measuring' : 'Place finger on camera →'}
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleStart}
                className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-full ring-1 ring-white/15 bg-[#1e1540] transition-all hover:ring-cyan-400/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)] active:scale-95"
              >
                <span className="text-[11px] font-semibold text-white/50 text-center leading-tight">tap to<br/>start</span>
              </button>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-xs text-white/25">Back camera · cover lens with finger</p>
                <p className="text-xs text-white/20">Hold camera facing a light source</p>
              </div>
            </>
          )}
          {cameraError && (
            <p className="mt-1 text-center text-xs text-red-400">{cameraError}</p>
          )}
        </div>

        {/* 4 main cards */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          <MainCard icon={<HeartIcon />} label="BPM" value={metrics.bpm} />
          <MainCard icon={<WindIcon />} label="/min" value={metrics.br} />
          <MainCard icon={<ActivityIcon />} label="Stress" value={metrics.stress} suffix="%" />
          <MainCard icon={<ZapIcon />} label="Energy" value={metrics.energy} suffix="%" />
        </div>

        {/* Advanced Physiological Metrics */}
        <div className="mb-3">
          <SectionTitle>Advanced Physiological Metrics</SectionTitle>
          <div className="flex flex-col gap-2">
            <MetricRow label="HRV surrogate" desc="HR variability over time" value={metrics.hrv} />
            <MetricRow label="Cardiac Stability Index" desc="how evenly the heart beats" value={metrics.csi} />
            <MetricRow label="Recovery Rate" desc="HR normalization speed after stress" value={metrics.recoveryRate} />
            <MetricRow label="HR trend slope" desc="trend over 30-60s" value={metrics.hrTrend} />
            <MetricRow label="HR Acceleration" desc="how fast HR rises" value={metrics.hrAccel} />
          </div>
        </div>

        {/* Emotional State Metrics */}
        <div className="mb-3">
          <SectionTitle>Emotional State Metrics</SectionTitle>
          <div className="flex flex-col gap-2">
            <MetricRow label="Alarm / Anxiety" desc="HR rise + BR rise" value={metrics.alarm} />
            <MetricRow label="Relaxation / Calmness" desc="low HR + stable BR" value={metrics.relaxation} />
            <MetricRow label="Focus / Concentration" desc="average HR + low variability" value={metrics.focus} />
            <MetricRow label="Excitement" desc="HR↑↑ sharp moment" value={metrics.excitement} />
            <MetricRow label="Fatigue" desc="HR above baseline, BR↓, energy↓" value={metrics.fatigue} />
            <MetricRow label="Flow" desc="HR slightly above baseline, stable BR" value={metrics.flow} />
          </div>
          <p className="mt-4 text-center text-xs text-white/30">
            {measuring
              ? (fingerOn ? 'Measuring... results update every ~2s' : 'Waiting for signal...')
              : 'Real-time metrics. Calibrating baseline...'}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl ring-1 ring-cyan-500/20 bg-[#1e1540] p-6 text-center">
          <p className="mb-1 text-sm font-semibold text-white/80">Want 24/7 monitoring?</p>
          <p className="mb-4 text-xs text-white/40">
            Connect a Bluetooth tracker for continuous precise biofeedback.
          </p>
          <a
            href="/#download"
            className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-6 py-2.5 text-sm font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600"
          >
            Download ONDA Life
          </a>
        </div>

      </div>
    </div>
  )
}
