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
const PPG_WINDOW = PPG_FPS * 10  // 10-second buffer
const MIN_DIST = Math.round(PPG_FPS * 0.4)  // 150 BPM max

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

function computeMetrics(redBuf: number[]): Partial<BiometricState> {
  if (redBuf.length < PPG_FPS * 5) return {}

  const avg = movingAvg(redBuf, PPG_FPS * 2)
  const detrended = redBuf.map((v, i) => v - avg[i])
  const peaks = detectPeaks(detrended)
  if (peaks.length < 3) return {}

  const rrIntervals: number[] = []
  for (let i = 1; i < peaks.length; i++)
    rrIntervals.push((peaks[i] - peaks[i - 1]) / PPG_FPS * 1000)

  const validRR = rrIntervals.filter(r => r > 400 && r < 1500)
  if (validRR.length < 2) return {}

  const meanRR = validRR.reduce((s, r) => s + r, 0) / validRR.length
  const bpm = Math.round(60000 / meanRR)
  if (bpm < 40 || bpm > 180) return {}

  const hrv = Math.round(
    Math.sqrt(validRR.map((r, i, a) => i ? (r - a[i-1]) ** 2 : 0)
      .slice(1).reduce((s, v) => s + v, 0) / (validRR.length - 1))
  )

  const sdRR = Math.sqrt(
    validRR.map(r => (r - meanRR) ** 2).reduce((s, v) => s + v, 0) / validRR.length
  )
  const csi = parseFloat((sdRR / meanRR).toFixed(3))

  // Breathing rate from envelope of detrended signal (low-pass ~0.5 Hz)
  const envelope = movingAvg(detrended.map(Math.abs), PPG_FPS)
  const envPeaks = detectPeaks(envelope)
  let br: number | null = null
  if (envPeaks.length >= 2) {
    const envMeanInterval = envPeaks.slice(1).map((p, i) => p - envPeaks[i])
      .reduce((s, v) => s + v, 0) / (envPeaks.length - 1) / PPG_FPS
    const brRaw = Math.round(60 / envMeanInterval)
    if (brRaw >= 6 && brRaw <= 40) br = brRaw
  }

  // HR trend — linear regression slope over last N BPM estimates
  // (simplified: use difference of first/last RR)
  const hrTrend = parseFloat(((validRR[validRR.length - 1] - validRR[0]) / validRR.length / 10).toFixed(3))

  // HR acceleration — second derivative approximation
  const rrDiff = validRR.slice(1).map((r, i) => r - validRR[i])
  const hrAccel = parseFloat((rrDiff.slice(1).reduce((s, v) => s + v, 0) / Math.max(1, rrDiff.length) / 100).toFixed(3))

  // Recovery Rate — how quickly HR returns toward baseline
  const bpmValues = validRR.map(r => Math.round(60000 / r))
  const bpmMean = bpmValues.reduce((s, v) => s + v, 0) / bpmValues.length
  const bpmMax = Math.max(...bpmValues)
  const recoveryRate = bpmMax > bpmMean
    ? parseFloat(((bpmMax - bpmValues[bpmValues.length - 1]) / (bpmMax - bpmMean) * 100).toFixed(0))
    : null

  // Stress proxy: CSI relative measure → 0-100%
  const stress = Math.min(100, Math.round(csi * 300))
  // Energy proxy: HRV relative measure → 0-100%
  const energy = Math.min(100, Math.round((hrv / 80) * 100))

  // Emotional scores (0-100)
  const alarm = Math.min(100, Math.round(stress * 0.7 + (br !== null ? Math.max(0, br - 15) * 3 : 0)))
  const relaxation = Math.min(100, Math.round((1 - csi) * 50 + energy * 0.3))
  const focus = Math.min(100, Math.round(energy * 0.5 + (100 - stress) * 0.5))
  const excitement = Math.min(100, Math.round((bpm - 60) * 1.5 + (br !== null ? br * 0.5 : 0)))
  const fatigue = Math.min(100, Math.round((1 - energy / 100) * 60 + stress * 0.2))
  const flow = Math.min(100, Math.round(focus * 0.6 + relaxation * 0.4))

  return {
    bpm: String(bpm),
    br: br !== null ? String(br) : null,
    hrv: String(hrv),
    csi: String(csi),
    recoveryRate: recoveryRate !== null ? String(recoveryRate) : '0',
    hrTrend: String(hrTrend),
    hrAccel: String(hrAccel),
    stress: String(stress),
    energy: String(energy),
    alarm: String(alarm),
    relaxation: String(relaxation),
    focus: String(focus),
    excitement: String(Math.max(0, excitement)),
    fatigue: String(fatigue),
    flow: String(flow),
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
  const [countdown, setCountdown] = useState(0)
  const [cameraColor, setCameraColor] = useState<string>('rgb(220,220,220)')
  const [cameraError, setCameraError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rafRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const ppgBuffer = useRef<number[]>([])
  const secondsLeft = useRef(45)

  useEffect(() => {
    document.title = 'Bio OS — Live Biometrics | ONDA Life'
    return () => stopAll()
  }, [])

  function stopAll() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    rafRef.current = null
    timerRef.current = null
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

    // Sample center 32×32 region
    const cx = Math.floor(canvas.width / 2)
    const cy = Math.floor(canvas.height / 2)
    const size = Math.min(32, cx, cy)
    const imageData = ctx.getImageData(cx - size, cy - size, size * 2, size * 2)
    const pixels = imageData.data

    let r = 0, g = 0, b = 0, count = 0
    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i]; g += pixels[i + 1]; b += pixels[i + 2]; count++
    }
    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)

    setCameraColor(`rgb(${r},${g},${b})`)

    // PPG: red channel
    ppgBuffer.current.push(r)
    if (ppgBuffer.current.length > PPG_WINDOW)
      ppgBuffer.current.shift()

    if (ppgBuffer.current.length >= PPG_FPS * 5) {
      const computed = computeMetrics([...ppgBuffer.current])
      if (Object.keys(computed).length > 0)
        setMetrics(prev => ({ ...prev, ...computed }))
    }

    rafRef.current = requestAnimationFrame(processFrame)
  }, [])

  async function handleStart() {
    if (measuring) return
    setCameraError(null)
    ppgBuffer.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Try to enable torch if available
      const track = stream.getVideoTracks()[0]
      if (track && 'applyConstraints' in track) {
        try {
          await track.applyConstraints({ advanced: [{ torch: true } as MediaTrackConstraintSet] })
        } catch { /* torch not supported */ }
      }
    } catch (e) {
      setCameraError('Camera access denied. Please allow camera in browser settings.')
      return
    }

    setMeasuring(true)
    secondsLeft.current = 45
    setCountdown(45)
    setMetrics(emptyMetrics)

    timerRef.current = setInterval(() => {
      secondsLeft.current -= 1
      setCountdown(secondsLeft.current)
      if (secondsLeft.current <= 0) {
        stopAll()
        setMeasuring(false)
      }
    }, 1000)

    rafRef.current = requestAnimationFrame(processFrame)
  }

  function handleStop() {
    stopAll()
    setMeasuring(false)
    setCountdown(0)
    setCameraColor('rgb(220,220,220)')
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg,#1a0a2e 0%,#0d0620 50%,#12082a 100%)' }}>
      {/* Hidden video + canvas for processing */}
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

        {/* Camera button + preview indicator */}
        <div className="mb-8 flex flex-col items-center gap-3">
          {measuring ? (
            <>
              <button
                onClick={handleStop}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full ring-2 ring-cyan-400/60 bg-[#1e1540] shadow-[0_0_40px_rgba(6,182,212,0.2)] active:scale-95 transition-all"
              >
                <span className="font-mono text-4xl font-bold text-cyan-400">{countdown}</span>
                <span className="text-[10px] text-white/30">tap to stop</span>
              </button>

              {/* Camera preview circle */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="h-10 w-10 rounded-full ring-1 ring-white/20 shadow-lg transition-colors duration-300"
                  style={{ backgroundColor: cameraColor }}
                />
                <p className="text-[10px] text-white/30">
                  {(() => {
                    const rgb = cameraColor.match(/\d+/g)?.map(Number) ?? [220, 220, 220]
                    const brightness = (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114)
                    return brightness > 100
                      ? 'Place finger on camera →'
                      : '✓ Finger detected'
                  })()}
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleStart}
                className="flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-full ring-1 ring-white/15 bg-[#1e1540] transition-all hover:ring-cyan-400/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)] active:scale-95"
              >
                <span className="text-2xl">📷</span>
                <span className="text-xs font-semibold text-white/50">Measure</span>
              </button>
              <p className="text-xs text-white/25">Back camera · 45 sec · cover lens with finger</p>
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
            {measuring ? 'Collecting signal...' : 'Real-time metrics. Calibrating baseline...'}
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
