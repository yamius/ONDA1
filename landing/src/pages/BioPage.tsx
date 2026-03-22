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

function val(v: MetricValue, suffix = '') {
  return v !== null ? `${v}${suffix}` : '--'
}

function MainCard({
  icon, label, value, suffix, color,
}: { icon: string; label: string; value: MetricValue; suffix?: string; color: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border bg-[#0e1020] p-5 ${color}`}>
      <span className="text-2xl">{icon}</span>
      <span className="text-3xl font-bold tracking-tight text-white">
        {val(value, suffix)}
      </span>
      <span className="text-xs uppercase tracking-widest text-white/40">{label}</span>
    </div>
  )
}

function AdvancedRow({ label, desc, value }: { label: string; desc?: string; value: MetricValue }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-white/30">{desc}</p>}
      </div>
      <span className="ml-4 text-sm font-semibold text-cyan-400">{val(value)}</span>
    </div>
  )
}

export function BioPage() {
  const [metrics] = useState<BiometricState>(empty)
  const [measuring, setMeasuring] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    document.title = 'Bio OS — Live Biometrics | ONDA Life'
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
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
    <div className="min-h-screen bg-[#050a0f] text-white">
      <div className="mx-auto max-w-lg px-4 py-10 md:py-16">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 font-mono text-3xl font-bold md:text-4xl">
            <span className="text-cyan-400">Bio</span>
            <span className="text-green-400"> OS</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/50">
            Real-time biometric analysis — no wearable required.
            <br />Place your finger on the camera to begin.
          </p>
        </div>

        {/* Camera start button */}
        <div className="mb-10 flex flex-col items-center gap-3">
          {measuring ? (
            <>
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-cyan-400/60 bg-[#0e1020] shadow-[0_0_40px_rgba(6,182,212,0.25)]">
                <span className="font-mono text-4xl font-bold text-cyan-400">{countdown}</span>
              </div>
              <p className="text-xs text-white/40">Keep your finger on the camera</p>
            </>
          ) : (
            <>
              <button
                onClick={handleStart}
                className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-full border-2 border-white/10 bg-[#0e1020] transition-all hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] active:scale-95"
              >
                <span className="text-3xl">📷</span>
                <span className="text-xs font-semibold text-white/60">Measure</span>
              </button>
              <p className="text-xs text-white/30">
                Camera access required · 45 seconds
              </p>
            </>
          )}
        </div>

        {/* 4 main cards */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          <MainCard
            icon="❤️"
            label="BPM"
            value={metrics.bpm}
            color="border-rose-500/20"
          />
          <MainCard
            icon="🌬️"
            label="/min"
            value={metrics.br}
            color="border-blue-400/20"
          />
          <MainCard
            icon="⚡"
            label="Stress"
            value={metrics.stress}
            suffix="%"
            color="border-orange-400/20"
          />
          <MainCard
            icon="🔋"
            label="Energy"
            value={metrics.energy}
            suffix="%"
            color="border-yellow-400/20"
          />
        </div>

        {/* Advanced Physiological Metrics */}
        <div className="mb-6 rounded-2xl border border-white/8 bg-[#0e1020] p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
            Advanced Physiological Metrics
          </h2>
          <AdvancedRow
            label="HRV surrogate"
            desc="HR variability over time"
            value={metrics.hrv}
          />
          <AdvancedRow
            label="Cardiac Stability Index"
            desc="How evenly the heart beats"
            value={metrics.csi}
          />
          <AdvancedRow
            label="Recovery Rate"
            desc="HR normalization speed after stress"
            value={metrics.recoveryRate}
          />
          <AdvancedRow
            label="HR Trend Slope"
            value={metrics.hrTrend}
          />
          <AdvancedRow
            label="HR Acceleration"
            value={metrics.hrAccel}
          />
        </div>

        {/* Emotional State Metrics */}
        <div className="mb-10 rounded-2xl border border-white/8 bg-[#0e1020] p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
            Emotional State Metrics
          </h2>
          <AdvancedRow label="Alarm / Anxiety" value={metrics.alarm} />
          <AdvancedRow label="Relaxation / Calmness" value={metrics.relaxation} />
          <AdvancedRow label="Focus / Concentration" value={metrics.focus} />
          <AdvancedRow label="Excitement" value={metrics.excitement} />
          <AdvancedRow label="Fatigue" value={metrics.fatigue} />
          <AdvancedRow label="Flow" value={metrics.flow} />
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-cyan-500/20 bg-[#0e1020] p-6 text-center">
          <p className="mb-1 text-sm font-semibold text-white/80">
            Want 24/7 monitoring?
          </p>
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
