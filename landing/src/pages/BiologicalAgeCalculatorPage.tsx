import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  BIOAGE_ACTIVITY,
  BIOAGE_FAQ,
  BIOAGE_SOURCES,
  BIOAGE_METHODOLOGY,
  computeBioAge,
  type Smoking,
  type BioAgeResult,
} from '../data/biological-age'
import { SourcesSection } from '../components/SourcesSection'

export function BiologicalAgeCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [age, setAge] = useState('35')
  const [restingHr, setRestingHr] = useState('60')
  const [activityId, setActivityId] = useState('moderate')
  const [sleep, setSleep] = useState('7.5')
  const [smoking, setSmoking] = useState<Smoking>('never')

  useEffect(() => {
    document.title = 'Biological Age Calculator — How Old Is Your Body? | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: BioAgeResult | null = useMemo(
    () =>
      computeBioAge({
        chronAge: parseInt(age, 10),
        restingHr: parseInt(restingHr, 10),
        activityId,
        sleepHours: parseFloat(sleep),
        smoking,
      }),
    [age, restingHr, activityId, sleep, smoking],
  )

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Biological Age</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Biological Age Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Estimate your "fitness age" — how your everyday habits stack up against your real age —
        from your resting heart rate, activity, sleep and smoking. A motivational mirror, not a verdict.
      </p>

      <img
        src="/images/tools/biological-age.png"
        alt="Biological age calculator — a lifestyle 'fitness age' estimate from resting heart rate, activity, sleep and smoking, by ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ This is an educational "fitness age" estimate from lifestyle habits — <strong>not</strong> a
          real biological age, epigenetic clock or medical test (those need bloodwork or lab assays).
          Read it as motivation and direction, not a diagnosis or a reason to worry.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Your age</span>
            <input type="number" inputMode="numeric" min={18} max={100} value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60" />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Resting HR</span>
            <input type="number" inputMode="numeric" min={35} max={120} value={restingHr} onChange={(e) => setRestingHr(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60" />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Sleep (h/night)</span>
            <input type="number" inputMode="decimal" min={3} max={14} step={0.5} value={sleep} onChange={(e) => setSleep(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60" />
          </label>
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Activity level</span>
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BIOAGE_ACTIVITY.map((a) => (
            <button key={a.id} onClick={() => setActivityId(a.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${activityId === a.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>
              {a.label}
            </button>
          ))}
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Smoking</span>
        <div className="flex flex-wrap gap-2">
          {(['never', 'former', 'current'] as const).map((s) => (
            <button key={s} onClick={() => setSmoking(s)}
              className={`rounded-lg border px-4 py-2 font-mono text-xs capitalize transition-colors ${smoking === s ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>
              {s}
            </button>
          ))}
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Estimated fitness age</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">
              {result.bioAge} <span className="text-xl text-white/40">years</span>
            </div>
            <div className={`mb-3 font-mono text-sm font-semibold ${result.deltaYears <= 0 ? 'text-terminal-cyan' : 'text-amber-400'}`}>
              {result.deltaYears === 0 ? 'About the same as your age' : `${Math.abs(result.deltaYears)} years ${result.deltaYears < 0 ? 'younger' : 'older'} than your age`}
            </div>
            <p className="mb-4 font-mono text-xs leading-relaxed text-white/60">{result.summary}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {result.drivers.map((d) => (
                <div key={d.label} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-center">
                  <div className={`text-base font-bold ${d.years < 0 ? 'text-terminal-green' : d.years > 0 ? 'text-amber-400' : 'text-white/60'}`}>
                    {d.years > 0 ? '+' : ''}{d.years} y
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter your age (18–100), resting HR (35–120) and sleep (3–14 h).</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Adjustments are modest, capped and transparent — a four-question model can’t see your genetics
        or medical history. This is not a prediction of lifespan or a diagnosis. The value is the
        direction you can move it, not the exact number — and not anxiety over it.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Move the number, calmly</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          The inputs here — resting heart rate, fitness, sleep — are exactly what ONDA Life tracks over
          time. See them trend in the right direction instead of fixating on one daily figure.
        </p>
        <a href={appStoreUrl('tool_bioage')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={BIOAGE_METHODOLOGY} sources={BIOAGE_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {BIOAGE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/vo2max`} className="text-terminal-green hover:underline">VO₂max estimator</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
      </div>
    </main>
  )
}
