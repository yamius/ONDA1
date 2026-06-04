import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  SLEEP_NEED_BANDS,
  SLEEP_DEBT_FAQ,
  SLEEP_DEBT_SOURCES,
  SLEEP_DEBT_METHODOLOGY,
  sleepNeedForAge,
  computeSleepDebt,
  type SleepDebtResult,
} from '../data/sleep-debt'
import { SourcesSection } from '../components/SourcesSection'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const TIER_COLOR: Record<string, string> = {
  none: 'text-terminal-green',
  mild: 'text-terminal-cyan',
  moderate: 'text-amber-400',
  high: 'text-red-400',
}

export function SleepDebtCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [age, setAge] = useState('35')
  const [need, setNeed] = useState('8')
  const [nights, setNights] = useState<string[]>(['7', '6.5', '7', '6', '5.5', '8', '7.5'])

  useEffect(() => {
    document.title = 'Sleep Debt Calculator — Are You Sleep Deprived? | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  // When age changes, snap the need default to the band midpoint (user can still override).
  const band = useMemo(() => sleepNeedForAge(parseInt(age, 10) || 35), [age])
  useEffect(() => {
    setNeed(String((band.low + band.high) / 2))
  }, [band])

  const result: SleepDebtResult | null = useMemo(() => {
    const n = parseFloat(need)
    if (!n || n < 4 || n > 12) return null
    const got = nights.map((x) => parseFloat(x)).filter((x) => !isNaN(x))
    if (got.length === 0) return null
    return computeSleepDebt(n, got)
  }, [need, nights])

  function setNight(i: number, v: string) {
    setNights((prev) => prev.map((x, j) => (j === i ? v : x)))
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Sleep Debt</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Sleep Debt Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Enter how many hours you slept each of the last 7 nights to see your accumulated
        sleep debt against your age-based need — and how to repay it.
      </p>

      <img
        src="/images/tools/sleep-debt.png"
        alt="Sleep Debt Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Age</span>
            <input
              type="number" inputMode="numeric" min={14} max={100} value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">
              Nightly need (h) · {band.label} → {band.low}–{band.high}
            </span>
            <input
              type="number" inputMode="decimal" min={4} max={12} step={0.5} value={need}
              onChange={(e) => setNeed(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Hours slept — last 7 nights</span>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((d, i) => (
            <label key={d} className="block text-center">
              <span className="mb-1 block font-mono text-[10px] text-white/30">{d}</span>
              <input
                type="number" inputMode="decimal" min={0} max={16} step={0.5} value={nights[i]}
                onChange={(e) => setNight(i, e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-1 py-2 text-center font-mono text-sm text-white outline-none focus:border-terminal-green/60"
              />
            </label>
          ))}
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <span className={`text-2xl font-bold ${TIER_COLOR[result.tier]}`}>{result.tierLabel}</span>
              <span className="font-mono text-sm text-white/50">{result.debtHours.toFixed(1)} h debt · 7 nights</span>
            </div>
            {/* Per-night bars: shortfall vs need */}
            <div className="mb-4 flex items-end gap-1.5" style={{ height: 80 }}>
              {nights.map((x, i) => {
                const got = parseFloat(x) || 0
                const n = parseFloat(need) || 8
                const pct = Math.min(100, (got / n) * 100)
                const short = got < n
                return (
                  <div key={i} className="flex flex-1 flex-col items-center justify-end">
                    <div className="w-full overflow-hidden rounded-t bg-white/10" style={{ height: 64 }}>
                      <div
                        className={`w-full ${short ? 'bg-amber-400/70' : 'bg-terminal-green/70'}`}
                        style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                      />
                    </div>
                    <span className="mt-1 font-mono text-[9px] text-white/30">{DAYS[i][0]}</span>
                  </div>
                )
              })}
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/60">{result.summary}</p>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter your need (4–12 h) and at least one night.</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical advice. Sleep need is individual and the 7-night
        window reflects recent, practically-repayable debt — not lifetime deprivation.
        Consistent sleep and wake times matter as much as total hours.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Stop guessing your hours</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life tracks your actual sleep and recovery automatically — your real debt,
          updated every morning, with a plan to repay it.
        </p>
        <a
          href={appStoreUrl('tool_sleepdebt')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Recommended sleep by age</h2>
      <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-3 py-2 text-left">Age</th>
              <th className="px-3 py-2 text-right">Recommended nightly sleep</th>
            </tr>
          </thead>
          <tbody>
            {SLEEP_NEED_BANDS.map((b) => (
              <tr key={b.label} className="border-b border-white/5 text-white/70">
                <td className="px-3 py-2 text-left font-semibold text-white/90">{b.label}</td>
                <td className="px-3 py-2 text-right text-terminal-green">{b.low}–{b.high} h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SourcesSection methodology={SLEEP_DEBT_METHODOLOGY} sources={SLEEP_DEBT_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {SLEEP_DEBT_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/how-much-sleep-do-you-need`} className="text-terminal-green hover:underline">How much sleep you need</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/caffeine`} className="text-terminal-green hover:underline">Caffeine cut-off</Link>
        {' · '}
        <Link to={`${langPrefix}/reviews/sleep-apps`} className="text-terminal-green hover:underline">Best sleep apps (2026)</Link>
      </div>
    </main>
  )
}
