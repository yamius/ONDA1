import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  HRV_LEVELS,
  RHR_LEVELS,
  DEVICE_DECODER,
  RECOVERY_FAQ,
  RECOVERY_SOURCES,
  RECOVERY_METHODOLOGY,
  computeReadiness,
  type HrvLevel,
  type RhrLevel,
  type ReadinessResult,
} from '../data/recovery-score'
import { SourcesSection } from '../components/SourcesSection'

const BAND_COLOR: Record<string, string> = {
  go: 'text-terminal-green',
  moderate: 'text-amber-400',
  recover: 'text-red-400',
}

export function RecoveryScorePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [hrv, setHrv] = useState<HrvLevel>('normal')
  const [rhr, setRhr] = useState<RhrLevel>('normal')
  const [sleep, setSleep] = useState('7.5')
  const [sick, setSick] = useState(false)
  const [sore, setSore] = useState(false)
  const [stressed, setStressed] = useState(false)

  useEffect(() => {
    document.title = 'Recovery Score Explained — Whoop, Oura, Garmin | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: ReadinessResult | null = useMemo(
    () => computeReadiness({ hrv, rhr, sleepHours: parseFloat(sleep), sick, sore, stressed }),
    [hrv, rhr, sleep, sick, sore, stressed],
  )

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Recovery Score</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Recovery Score Explained</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        What your Whoop, Oura or Garmin "recovery" really measures — and a quick estimate of your own
        readiness from HRV, resting heart rate and sleep, with what to actually do today.
      </p>

      <img
        src="/images/tools/recovery-score.png"
        alt="Recovery and readiness score explained — what Whoop, Oura and Garmin measure from HRV, resting HR and sleep, by ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Overnight HRV vs your baseline</span>
        <div className="mb-4 flex flex-wrap gap-2">
          {HRV_LEVELS.map((o) => (
            <button key={o.id} onClick={() => setHrv(o.id)}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${hrv === o.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>{o.label}</button>
          ))}
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Resting heart rate vs your baseline</span>
        <div className="mb-4 flex flex-wrap gap-2">
          {RHR_LEVELS.map((o) => (
            <button key={o.id} onClick={() => setRhr(o.id)}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${rhr === o.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>{o.label}</button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Last night’s sleep (h)</span>
            <input type="number" inputMode="decimal" min={2} max={14} step={0.5} value={sleep} onChange={(e) => setSleep(e.target.value)}
              className="w-28 rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60" />
          </label>
          <div className="flex flex-wrap gap-2">
            {([['sick', sick, setSick, 'Feeling unwell'], ['sore', sore, setSore, 'Sore'], ['stressed', stressed, setStressed, 'High stress']] as const).map(([key, val, set, lbl]) => (
              <button key={key} onClick={() => set(!val)}
                className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${val ? 'border-amber-400/50 bg-amber-400/10 text-amber-300' : 'border-white/15 text-white/60 hover:border-white/30'}`}>
                {val ? '✓ ' : ''}{lbl}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-2">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Estimated readiness</div>
            <div className={`mb-1 text-4xl font-bold ${BAND_COLOR[result.band]}`}>{result.score}<span className="text-xl text-white/40">/100</span></div>
            <div className={`mb-3 font-mono text-sm font-semibold ${BAND_COLOR[result.band]}`}>{result.bandLabel}</div>
            <p className="mb-3 font-mono text-xs leading-relaxed text-white/70">{result.guidance}</p>
            <div className="flex flex-wrap gap-2">
              {result.drivers.filter((d) => d.delta !== 0).map((d) => (
                <span key={d.label} className={`rounded-md border px-2 py-1 font-mono text-[11px] ${d.delta < 0 ? 'border-amber-400/30 text-amber-300/80' : 'border-terminal-green/30 text-terminal-green/80'}`}>
                  {d.label} {d.delta > 0 ? '+' : ''}{d.delta}
                </span>
              ))}
            </div>
          </div>
        )}
        {!result && <p className="mt-2 font-mono text-xs text-white/40">Enter a valid sleep duration (2–14 h).</p>}
      </div>

      {/* Device decoder */}
      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">What each device’s score actually uses</h2>
      <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-3 py-2 text-left">Device</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Main inputs</th>
            </tr>
          </thead>
          <tbody>
            {DEVICE_DECODER.map((d) => (
              <tr key={d.device} className="border-b border-white/5 align-top text-white/70">
                <td className="px-3 py-2 text-left font-semibold text-white/90">{d.device}</td>
                <td className="px-3 py-2 text-left text-terminal-green">{d.scoreName}</td>
                <td className="px-3 py-2 text-left text-white/55">{d.inputs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical advice and not a substitute for any device. The signal is in
        the trend against your own baseline, not one day’s number — and a score is information to
        weigh, not an order. Persistent low recovery with symptoms warrants a doctor, not just a rest day.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Readiness, without the anxiety</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life turns HRV, resting HR and sleep into one calm readiness read — focused on your
          trend, not a daily score to chase. Recovery you can act on, not obsess over.
        </p>
        <a href={appStoreUrl('tool_recovery')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={RECOVERY_METHODOLOGY} sources={RECOVERY_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {RECOVERY_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/hrv-different-every-device`} className="text-terminal-green hover:underline">Why HRV differs on every device</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
      </div>
    </main>
  )
}
