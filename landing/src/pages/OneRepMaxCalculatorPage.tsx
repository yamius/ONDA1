import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  ONE_REP_MAX_FAQ,
  ONE_REP_MAX_SOURCES,
  ONE_REP_MAX_METHODOLOGY,
  computeOneRepMax,
  type OrmResult,
} from '../data/one-rep-max'
import { SourcesSection } from '../components/SourcesSection'

export function OneRepMaxCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [weight, setWeight] = useState('100')
  const [reps, setReps] = useState('5')

  useEffect(() => {
    document.title = 'One-Rep Max Calculator — Estimate Your 1RM | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: OrmResult | null = useMemo(() => {
    const w = parseFloat(weight)
    const r = parseInt(reps, 10)
    if (!w || w <= 0 || !r || r < 1 || r > 15) return null
    const step = unit === 'kg' ? 2.5 : 5
    return computeOneRepMax(w, r, step)
  }, [weight, reps, unit])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">One-Rep Max</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">One-Rep Max Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Estimate your one-rep max (1RM) from a hard set using the Epley and Brzycki equations —
        plus a load table for programming your training percentages.
      </p>

      <img
        src="/images/tools/one-rep-max.png"
        alt="One-Rep Max Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Weight lifted</span>
            <div className="flex gap-2">
              <input
                type="number" inputMode="decimal" min={1} value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
              />
              <div className="flex overflow-hidden rounded-lg border border-white/15">
                {(['kg', 'lb'] as const).map((u) => (
                  <button
                    key={u} onClick={() => setUnit(u)}
                    className={`px-3 font-mono text-sm transition-colors ${unit === u ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Reps performed</span>
            <input
              type="number" inputMode="numeric" min={1} max={15} value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Estimated 1RM</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">{result.average} <span className="text-xl text-white/40">{unit}</span></div>
            <p className="mb-4 font-mono text-xs text-white/50">
              Epley {result.epley} {unit} · Brzycki {result.brzycki} {unit}
            </p>
            {parseInt(reps, 10) > 10 && (
              <p className="mb-2 font-mono text-[11px] text-amber-200/70">
                Note: estimates from sets above ~10 reps are approximate — use a heavier set of ≤6 reps for accuracy.
              </p>
            )}
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter a weight and reps (1–15). Use a hard set of ≤6 reps for best accuracy.</p>}
      </div>

      {result && (
        <>
          <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Training loads from your 1RM</h2>
          <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="px-3 py-2 text-left">% of 1RM</th>
                  <th className="px-3 py-2 text-right">Load ({unit})</th>
                  <th className="px-3 py-2 text-right">≈ Reps</th>
                </tr>
              </thead>
              <tbody>
                {result.table.map((row) => (
                  <tr key={row.pct} className="border-b border-white/5 text-white/70">
                    <td className="px-3 py-2 text-left font-semibold text-white/90">{row.pct}%</td>
                    <td className="px-3 py-2 text-right text-terminal-green">{row.weight}</td>
                    <td className="px-3 py-2 text-right">{row.reps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not coaching or medical advice. Prediction equations are most accurate
        for sets of ~6 reps or fewer and approximate beyond ~10–12. Loads are rounded to the nearest
        2.5 kg / 5 lb; autoregulate with RPE/RIR rather than chasing an exact number, and warm up
        thoroughly before heavy work.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Train with your recovery, not against it</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life connects your strength work to sleep, HRV and readiness — so you push when your
          body can handle it and back off when it can’t.
        </p>
        <a
          href={appStoreUrl('tool_1rm')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={ONE_REP_MAX_METHODOLOGY} sources={ONE_REP_MAX_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {ONE_REP_MAX_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/protein`} className="text-terminal-green hover:underline">Protein target</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/zone-2`} className="text-terminal-green hover:underline">Zone 2 heart rate</Link>
      </div>
    </main>
  )
}
