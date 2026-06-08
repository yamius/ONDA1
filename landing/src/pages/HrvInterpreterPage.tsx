import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath, langHref } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { HRV_AGE_BANDS, HRV_FAQ, HRV_SOURCES, HRV_METHODOLOGY, interpretHrv, type HrvResult } from '../data/hrv-norms'
import { SourcesSection } from '../components/SourcesSection'

const TIER_COLOR: Record<string, string> = {
  low: 'text-red-400',
  below: 'text-amber-400',
  average: 'text-terminal-cyan',
  above: 'text-terminal-green',
  excellent: 'text-terminal-green',
}

export function HrvInterpreterPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [age, setAge] = useState('')
  const [hrv, setHrv] = useState('')

  useEffect(() => {
    document.title = 'Good HRV by Age — Free Interpreter & Chart | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: HrvResult | null = useMemo(() => {
    const a = parseInt(age, 10)
    const h = parseFloat(hrv)
    if (!a || !h || a < 18 || a > 120 || h <= 0 || h > 300) return null
    return interpretHrv(a, h)
  }, [age, hrv])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">HRV Interpreter</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
        HRV Interpreter
      </h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Enter your age and resting/overnight HRV (RMSSD in milliseconds, the number
        most rings and straps report) to see where it lands against population norms
        for your age — and what actually moves it.
      </p>

      {/* Calculator */}
      <img
        src="/images/tools/hrv.png"
        alt="HRV Interpreter — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Age</span>
            <input
              type="number" inputMode="numeric" min={18} max={120} placeholder="e.g. 34"
              value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">HRV — RMSSD (ms)</span>
            <input
              type="number" inputMode="decimal" min={1} max={300} placeholder="e.g. 55"
              value={hrv} onChange={(e) => setHrv(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <span className={`text-2xl font-bold ${TIER_COLOR[result.tier]}`}>{result.tierLabel}</span>
              <span className="font-mono text-sm text-white/50">~{result.percentile}th percentile · age {result.band.label}</span>
            </div>
            <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green transition-all"
                style={{ width: `${result.barPct}%` }}
              />
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/60">{result.summary}</p>
          </div>
        )}
        {!result && (age || hrv) && (
          <p className="mt-4 font-mono text-xs text-white/40">Enter a valid age (18–120) and RMSSD in ms (1–300).</p>
        )}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical advice. Population percentiles are approximate
        (synthesised from published normative HRV data). Your own multi-week trend and
        baseline matter far more than a single reading or a population comparison. RMSSD
        varies night to night with sleep, alcohol, illness and training load.
      </p>

      {/* App CTA */}
      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Track your HRV automatically every night</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life reads your overnight HRV, builds your personal baseline, and turns
          the number into a recovery protocol — no manual entry.
        </p>
        <a
          href={appStoreUrl('tool_hrv')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      {/* Reference table — rankable "good HRV by age" content */}
      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">
        HRV (RMSSD) by age — reference table
      </h2>
      <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-3 py-2 text-left">Age</th>
              <th className="px-3 py-2 text-right">Low (p10)</th>
              <th className="px-3 py-2 text-right">Below (p25)</th>
              <th className="px-3 py-2 text-right">Median (p50)</th>
              <th className="px-3 py-2 text-right">Above (p75)</th>
              <th className="px-3 py-2 text-right">Excellent (p90)</th>
            </tr>
          </thead>
          <tbody>
            {HRV_AGE_BANDS.map((b) => (
              <tr key={b.label} className="border-b border-white/5 text-white/70">
                <td className="px-3 py-2 text-left font-semibold text-white/90">{b.label}</td>
                <td className="px-3 py-2 text-right">{b.p10}</td>
                <td className="px-3 py-2 text-right">{b.p25}</td>
                <td className="px-3 py-2 text-right text-terminal-cyan">{b.p50}</td>
                <td className="px-3 py-2 text-right">{b.p75}</td>
                <td className="px-3 py-2 text-right text-terminal-green">{b.p90}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sources & methodology — defends the numbers against "source?" */}
      <SourcesSection methodology={HRV_METHODOLOGY} sources={HRV_SOURCES} />

      {/* FAQ — mirrors the FAQPage JSON-LD injected at build */}
      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">
        Common questions
      </h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {HRV_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      {/* Embeddable widget — free backlinks. The snippet's attribution <a> sits
          OUTSIDE the iframe (in the host page) so it counts as a real link. */}
      <EmbedHrvBlock />

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/hrv-different-every-device`} className="text-terminal-green hover:underline">Why your HRV differs on every device</Link>
        {' · '}
        Related: <Link to={langHref(`/reviews/hrv-trackers`, lang)} className="text-terminal-green hover:underline">Best HRV trackers (2026)</Link>
        {' · '}
        <Link to={`${langPrefix}/glossary/heart-rate-variability`} className="text-terminal-green hover:underline">What is HRV?</Link>
      </div>
    </main>
  )
}

const EMBED_SNIPPET = `<iframe src="https://onda-life.com/embed/hrv" width="100%" height="440" style="border:0;max-width:440px" title="HRV Interpreter — ONDA Life" loading="lazy"></iframe>
<p style="font:12px sans-serif"><a href="https://onda-life.com/tools/hrv">HRV Interpreter</a> by <a href="https://onda-life.com">ONDA Life</a></p>`

function EmbedHrvBlock() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    try {
      navigator.clipboard?.writeText(EMBED_SNIPPET)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="mb-10 rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-2 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Embed this calculator</h2>
      <p className="mb-3 font-mono text-xs leading-relaxed text-white/50">
        Free to embed on your site or blog — paste this snippet (it includes a credit link to ONDA Life):
      </p>
      <textarea
        readOnly
        rows={4}
        value={EMBED_SNIPPET}
        onFocus={(e) => e.currentTarget.select()}
        className="mb-3 w-full resize-none rounded-lg border border-white/15 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/70 outline-none focus:border-terminal-green/50"
      />
      <button
        onClick={copy}
        className="rounded-lg border border-terminal-green/40 px-4 py-2 font-mono text-xs text-terminal-green transition-colors hover:bg-terminal-green/10"
      >
        {copied ? '✓ Copied' : 'Copy embed code'}
      </button>
    </div>
  )
}
