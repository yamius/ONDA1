import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { RHR_AGE_BANDS, RHR_FAQ, RHR_SOURCES, RHR_METHODOLOGY, interpretRhr, type RhrResult } from '../data/resting-hr'
import { SourcesSection } from '../components/SourcesSection'

const TIER_COLOR: Record<string, string> = {
  athlete: 'text-terminal-cyan',
  excellent: 'text-terminal-cyan',
  good: 'text-terminal-green',
  average: 'text-white/80',
  elevated: 'text-amber-400',
}

export function RestingHeartRatePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [age, setAge] = useState('35')
  const [rhr, setRhr] = useState('62')

  useEffect(() => {
    document.title = 'Resting Heart Rate by Age — Is Yours Normal? | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: RhrResult | null = useMemo(() => {
    const a = parseInt(age, 10)
    const r = parseInt(rhr, 10)
    if (!a || a < 18 || a > 100 || !r || r < 30 || r > 140) return null
    return interpretRhr(a, r)
  }, [age, rhr])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Resting Heart Rate</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Resting Heart Rate by Age</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Is your resting heart rate normal? Enter your age and resting pulse to see where it lands
        against fitness-based reference ranges — and what actually lowers it.
      </p>

      <img
        src="/images/tools/resting-heart-rate.png"
        alt="Resting heart rate by age chart — fitness reference ranges and what a normal resting pulse is, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Age</span>
            <input type="number" inputMode="numeric" min={18} max={100} value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60" />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Resting heart rate (bpm)</span>
            <input type="number" inputMode="numeric" min={30} max={140} value={rhr} onChange={(e) => setRhr(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60" />
          </label>
        </div>

        {result && (
          <div className="mt-4">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Your category ({result.band.label})</div>
            <div className={`mb-3 text-3xl font-bold ${TIER_COLOR[result.tier]}`}>{result.tierLabel}</div>
            <p className="font-mono text-xs leading-relaxed text-white/60">{result.summary}</p>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter age (18–100) and resting heart rate (30–140 bpm).</p>}
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Resting heart rate by age &amp; fitness (bpm)</h2>
      <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-3 py-2 text-left">Age</th>
              <th className="px-3 py-2 text-right text-terminal-cyan">Athlete</th>
              <th className="px-3 py-2 text-right">Excellent</th>
              <th className="px-3 py-2 text-right text-terminal-green">Good</th>
              <th className="px-3 py-2 text-right">Average</th>
              <th className="px-3 py-2 text-right text-amber-400">Above</th>
            </tr>
          </thead>
          <tbody>
            {RHR_AGE_BANDS.map((b) => (
              <tr key={b.label} className="border-b border-white/5 text-white/70">
                <td className="px-3 py-2 text-left font-semibold text-white/90">{b.label}</td>
                <td className="px-3 py-2 text-right">≤{b.athlete}</td>
                <td className="px-3 py-2 text-right">{b.athlete + 1}–{b.excellent}</td>
                <td className="px-3 py-2 text-right text-terminal-green">{b.excellent + 1}–{b.good}</td>
                <td className="px-3 py-2 text-right">{b.good + 1}–{b.average}</td>
                <td className="px-3 py-2 text-right text-amber-400">{b.average + 1}+</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Approximate fitness-based reference ranges; women average a few bpm higher and RHR is partly
        genetic. Educational, not a diagnosis — single readings swing with caffeine, stress, sleep and
        illness. See a doctor about a persistently high or very low rate, or any symptoms.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Your morning trend, not one number</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          A rising resting heart rate is one of the earliest signs you need recovery. ONDA Life tracks
          your morning RHR and HRV together — so you catch it before it costs you.
        </p>
        <a href={appStoreUrl('tool_rhr')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={RHR_METHODOLOGY} sources={RHR_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {RHR_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/zone-2`} className="text-terminal-green hover:underline">Zone 2 heart rate</Link>
      </div>
    </main>
  )
}
