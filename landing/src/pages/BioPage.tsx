import { useEffect, useRef, useState } from 'react'

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

const empty: BiometricState = {
  bpm: null, br: null, stress: null, energy: null,
  hrv: null, csi: null, recoveryRate: null, hrTrend: null, hrAccel: null,
  alarm: null, relaxation: null, focus: null, excitement: null, fatigue: null, flow: null,
}

function fmt(v: MetricValue, suffix = '') {
  return v !== null ? `${v}${suffix}` : '--'
}

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

function MainCard({ icon, label, value, suffix }: {
  icon: React.ReactNode; label: string; value: MetricValue; suffix?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#1e1540] py-4 px-5 ring-2 ring-white/20">
      {icon}
      <span className="text-2xl font-bold tracking-tight text-white">
        {fmt(value, suffix)}
      </span>
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
  return (
    <h2 className="mb-3 text-center text-base font-semibold text-white">
      {children}
    </h2>
  )
}

export function BioPage() {
  const [metrics] = useState<BiometricState>(empty)
  const [measuring, setMeasuring] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    document.title = 'Bio OS — Live Biometrics | ONDA Life'
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function handleStart() {
    if (measuring) return
    setMeasuring(true)
    setCountdown(45)
    const tick = (n: number) => {
      if (n <= 0) { setMeasuring(false); setCountdown(0); return }
      setCountdown(n)
      timerRef.current = setTimeout(() => tick(n - 1), 1000)
    }
    timerRef.current = setTimeout(() => tick(44), 1000)
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg, #1a0a2e 0%, #0d0620 50%, #12082a 100%)' }}>
      <div className="mx-auto max-w-lg px-4 py-10 md:py-14">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-mono text-3xl font-bold md:text-4xl">
            <span className="text-cyan-400">Bio</span>
            <span className="text-green-400"> OS</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/40">
            Real-time biometric analysis — no wearable required.
            <br />Place your finger on the camera to begin.
          </p>
        </div>

        {/* Camera button */}
        <div className="mb-8 flex flex-col items-center gap-3">
          {measuring ? (
            <>
              <div className="flex h-24 w-24 items-center justify-center rounded-full ring-2 ring-cyan-400/60 bg-[#1e1540] shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                <span className="font-mono text-4xl font-bold text-cyan-400">{countdown}</span>
              </div>
              <p className="text-xs text-white/40">Keep your finger on the camera</p>
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
              <p className="text-xs text-white/25">Camera access required · 45 sec</p>
            </>
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
            <MetricRow label="Fatigue / Fatigue" desc="HR above baseline, BR↓, energy↓" value={metrics.fatigue} />
            <MetricRow label="Flow" desc="HR slightly above baseline, stable BR" value={metrics.flow} />
          </div>
          <p className="mt-4 text-center text-xs text-white/30">
            Real-time metrics. Calibrating baseline...
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
