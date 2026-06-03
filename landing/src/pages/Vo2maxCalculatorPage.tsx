import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { VO2MAX_FAQ, estimateVo2max, classifyVo2max, type Sex, type Vo2Result } from '../data/vo2max'

const CAT_COLOR: Record<string, string> = {
  poor: 'text-red-400',
  fair: 'text-amber-400',
  good: 'text-terminal-green',
  excellent: 'text-terminal-cyan',
  superior: 'text-terminal-cyan',
}

export function Vo2maxCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [age, setAge] = useState('35')
  const [sex, setSex] = useState<Sex>('male')
  const [restHr, setRestHr] = useState('60')
  const [maxHr, setMaxHr] = useState('')

  useEffect(() => {
    document.title = 'VO₂max Estimator — Free Calculator by Heart Rate | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const ageNum = parseInt(age, 10)
  const estMaxHr = useMemo(() => {
    if (!ageNum || ageNum < 10 || ageNum > 100) return 0
    // Tanaka: 208 − 0.7 × age
    return Math.round(208 - 0.7 * ageNum)
  }, [ageNum])

  const effectiveMaxHr = maxHr.trim() ? parseInt(maxHr, 10) : estMaxHr

  const result: Vo2Result | null = useMemo(() => {
    const rest = parseInt(restHr, 10)
    if (!ageNum || ageNum < 18 || ageNum > 100) return null
    if (!rest || rest < 30 || rest > 120) return null
    if (!effectiveMaxHr || effectiveMaxHr < 120 || effectiveMaxHr > 220) return null
    if (effectiveMaxHr <= rest) return null
    const vo2 = estimateVo2max(effectiveMaxHr, rest)
    return classifyVo2max(vo2, ageNum, sex)
  }, [ageNum, restHr, effectiveMaxHr, sex])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">VO₂max</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">VO₂max Estimator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Estimate your cardiorespiratory fitness from your resting and max heart rate — using the
        Uth–Sørensen formula — and see where it lands against age- and sex-based norms.
      </p>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Age</span>
            <input
              type="number" inputMode="numeric" min={18} max={100} value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Sex</span>
            <div className="flex overflow-hidden rounded-lg border border-white/15">
              {(['male', 'female'] as const).map((s) => (
                <button
                  key={s} onClick={() => setSex(s)}
                  className={`flex-1 px-3 py-3 font-mono text-sm capitalize transition-colors ${sex === s ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Resting heart rate (bpm)</span>
            <input
              type="number" inputMode="numeric" min={30} max={120} value={restHr}
              onChange={(e) => setRestHr(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">
              Max heart rate (bpm) <span className="text-white/30">— optional</span>
            </span>
            <input
              type="number" inputMode="numeric" min={120} max={220} value={maxHr}
              onChange={(e) => setMaxHr(e.target.value)}
              placeholder={estMaxHr ? `≈ ${estMaxHr} (estimated)` : 'estimated from age'}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none placeholder:text-white/25 focus:border-terminal-green/60"
            />
          </label>
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Estimated VO₂max</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">
              {result.vo2max} <span className="text-xl text-white/40">ml/kg/min</span>
            </div>
            <div className={`mb-3 font-mono text-sm font-semibold ${CAT_COLOR[result.category]}`}>
              {result.categoryLabel} · {sex === 'male' ? 'men' : 'women'} aged {result.ageBand}
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/60">{result.summary}</p>
            {!maxHr.trim() && (
              <p className="mt-3 font-mono text-[11px] text-white/40">
                Max HR estimated as {estMaxHr} bpm (Tanaka: 208 − 0.7 × age). Enter your true max HR above for a sharper number.
              </p>
            )}
          </div>
        )}
        {!result && (
          <p className="mt-4 font-mono text-xs text-white/40">
            Enter age (18–100), resting HR (30–120) and, optionally, a measured max HR. Max HR must exceed resting HR.
          </p>
        )}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not a clinical measurement. The Uth–Sørensen formula approximates a
        lab VO₂max to within roughly ±10–15%. Accuracy hinges on a true max HR and a resting HR
        measured first thing in the morning. For a precise value, use a lab test or a maximal field
        test (Cooper 12-minute run).
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Track your fitness trend</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life turns markers like VO₂max, HRV and resting heart rate into a single readiness
          picture — so you can see whether your training is actually moving the needle.
        </p>
        <a
          href={appStoreUrl('tool_vo2max')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {VO2MAX_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/zone-2`} className="text-terminal-green hover:underline">Zone 2 heart rate</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
      </div>
    </main>
  )
}
