import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  CAFFEINE_DRINKS,
  CAFFEINE_FAQ,
  caffeineCutoff,
  parseTime,
  DEFAULT_HALF_LIFE_H,
  type CaffeineResult,
} from '../data/caffeine-norms'

const METABOLISM = [
  { id: 'fast', label: 'Fast (smoker)', hl: 4 },
  { id: 'normal', label: 'Typical', hl: DEFAULT_HALF_LIFE_H },
  { id: 'slow', label: 'Slow / sensitive', hl: 8.5 },
] as const

export function CaffeineCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [bedtime, setBedtime] = useState('23:00')
  const [drinkId, setDrinkId] = useState('coffee')
  const [metab, setMetab] = useState<'fast' | 'normal' | 'slow'>('normal')

  useEffect(() => {
    document.title = 'Caffeine Cut-Off Calculator — Last Coffee Before Bed | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const drink = CAFFEINE_DRINKS.find((d) => d.id === drinkId) ?? CAFFEINE_DRINKS[1]
  const halfLife = METABOLISM.find((m) => m.id === metab)!.hl

  const result: CaffeineResult | null = useMemo(() => {
    const bed = parseTime(bedtime)
    if (bed === null) return null
    return caffeineCutoff(drink.mg, bed, halfLife)
  }, [bedtime, drink.mg, halfLife])

  const maxMg = result ? result.curve[0].mg : 1

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Caffeine Cut-Off</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Caffeine Cut-Off Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Pick your drink and bedtime to find the latest you can have caffeine without
        leaving enough in your system to disrupt sleep — based on its ~5.5-hour half-life.
      </p>

      <img
        src="/images/tools/caffeine.png"
        alt="Caffeine Cut-Off Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Your bedtime</span>
            <input
              type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Drink</span>
            <select
              value={drinkId} onChange={(e) => setDrinkId(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white outline-none focus:border-terminal-green/60"
            >
              {CAFFEINE_DRINKS.map((d) => (
                <option key={d.id} value={d.id}>{d.name} — {d.mg} mg</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Your metabolism</span>
          <div className="flex gap-2">
            {METABOLISM.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetab(m.id)}
                className={`flex-1 rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                  metab === m.id
                    ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green'
                    : 'border-white/15 text-white/50 hover:border-white/30'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Have your last {drink.name.toLowerCase()} by</div>
            <div className="mb-4 text-4xl font-bold text-terminal-green">{result.cutoffTime}</div>
            <p className="mb-4 font-mono text-xs leading-relaxed text-white/60">
              {result.hoursBeforeBed < 0.25
                ? `A ${drink.mg} mg dose is already below the ~50 mg sleep threshold — timing is not critical for this drink.`
                : `That's about ${result.hoursBeforeBed.toFixed(1)} h before your ${bedtime} bedtime. Have it later and more than ~50 mg is still circulating when you try to sleep.`}
            </p>
            {/* Decay curve */}
            <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/40">Caffeine remaining after your dose</div>
            <div className="flex items-end gap-1" style={{ height: 90 }}>
              {result.curve.map((p) => (
                <div key={p.h} className="flex flex-1 flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-terminal-cyan/40 to-terminal-green/70"
                    style={{ height: `${Math.max(2, (p.mg / maxMg) * 70)}px` }}
                    title={`${p.h}h: ${p.mg} mg`}
                  />
                  <span className="mt-1 font-mono text-[9px] text-white/30">{p.h}h</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter a valid bedtime (HH:MM).</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical advice. Caffeine half-life varies widely between
        people (≈4 h for smokers, 8–10 h+ in pregnancy or on oral contraceptives). Drink mg
        values are typical averages — actual content varies by brand, roast and serving size.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">See how caffeine timing actually affects your sleep</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life tracks your overnight sleep and HRV — so you can test your own caffeine
          cut-off against real recovery data, not just a formula.
        </p>
        <a
          href={appStoreUrl('tool_caffeine')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Caffeine in common drinks</h2>
      <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-3 py-2 text-left">Drink</th>
              <th className="px-3 py-2 text-left">Serving</th>
              <th className="px-3 py-2 text-right">Caffeine</th>
            </tr>
          </thead>
          <tbody>
            {CAFFEINE_DRINKS.map((d) => (
              <tr key={d.id} className="border-b border-white/5 text-white/70">
                <td className="px-3 py-2 text-left font-semibold text-white/90">{d.name}</td>
                <td className="px-3 py-2 text-left text-white/40">{d.note}</td>
                <td className="px-3 py-2 text-right text-terminal-green">{d.mg} mg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {CAFFEINE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/caffeine-half-life-sleep-pressure`} className="text-terminal-green hover:underline">Caffeine, sleep & half-life</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
        {' · '}
        <Link to={`${langPrefix}/reviews/sleep-apps`} className="text-terminal-green hover:underline">Best sleep apps (2026)</Link>
      </div>
    </main>
  )
}
