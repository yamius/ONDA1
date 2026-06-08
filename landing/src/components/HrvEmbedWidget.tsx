import { useMemo, useState } from 'react'
import { interpretHrv, type HrvResult } from '../data/hrv-norms'
import { ordinal } from '../utils/ordinal'

/**
 * Self-contained, iframe-friendly HRV interpreter widget.
 *
 * Rendered bare at /embed/hrv (outside Layout) so other sites can embed it.
 * Backlink value comes from the attribution <a> in the EMBED SNIPPET (host-page
 * HTML, outside the iframe) — see the "Embed" section on /tools/hrv. The
 * "Powered by ONDA Life" link here is for the in-frame user, not SEO.
 */
const SITE = 'https://onda-life.com'

export function HrvEmbedWidget() {
  const [age, setAge] = useState('35')
  const [rmssd, setRmssd] = useState('45')

  const result: HrvResult | null = useMemo(() => {
    const a = parseInt(age, 10)
    const r = parseInt(rmssd, 10)
    if (!a || a < 18 || a > 100 || !r || r < 1 || r > 250) return null
    return interpretHrv(a, r)
  }, [age, rmssd])

  const tierColor = (() => {
    switch (result?.tier) {
      case 'low': return 'text-red-400'
      case 'below': return 'text-amber-400'
      case 'average': return 'text-white/80'
      case 'above': return 'text-terminal-green'
      case 'excellent': return 'text-terminal-cyan'
      default: return 'text-white/60'
    }
  })()

  return (
    <div className="mx-auto max-w-[420px] rounded-xl border border-white/10 bg-[#0a1018] p-5 font-sans text-white">
      <div className="mb-3 font-mono text-xs uppercase tracking-widest text-terminal-cyan/80">HRV Interpreter</div>
      <p className="mb-4 font-mono text-[11px] leading-relaxed text-white/50">
        Enter your age and resting RMSSD to see where your HRV lands against population norms.
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/50">Age</span>
          <input type="number" inputMode="numeric" min={18} max={100} value={age} onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 font-mono text-base text-white outline-none focus:border-terminal-green/60" />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/50">RMSSD (ms)</span>
          <input type="number" inputMode="numeric" min={1} max={250} value={rmssd} onChange={(e) => setRmssd(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 font-mono text-base text-white outline-none focus:border-terminal-green/60" />
        </label>
      </div>

      {result ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-baseline justify-between">
            <span className={`text-lg font-bold ${tierColor}`}>{result.tierLabel}</span>
            <span className="font-mono text-xs text-white/50">~{ordinal(result.percentile)} pct · {result.band.label}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green" style={{ width: `${result.barPct}%` }} />
          </div>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/45">Median for your age ≈ {result.band.p50} ms. Educational, not medical advice.</p>
        </div>
      ) : (
        <p className="font-mono text-[11px] text-white/40">Enter age (18–100) and RMSSD (1–250 ms).</p>
      )}

      <div className="mt-4 text-center">
        <a href={`${SITE}/tools/hrv?utm_source=embed&utm_medium=widget`} target="_blank" rel="noopener"
          className="font-mono text-[10px] text-white/40 transition-colors hover:text-terminal-green">
          Powered by <span className="text-terminal-green">ONDA</span> <span className="text-terminal-cyan">Life</span> · HRV Interpreter →
        </a>
      </div>
    </div>
  )
}
