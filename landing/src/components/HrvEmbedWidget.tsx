import { useEffect, useMemo, useState } from 'react'
import { interpretHrv, interpretHrvBoth, type HrvSexChoice, type HrvResult } from '../data/hrv-norms'
import { hrvToolCopy, fill, HRV_TOOL_PATH } from '../data/hrv-tool-i18n'
import { isLang, type Lang } from '../i18n'

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
  const [sex, setSex] = useState<HrvSexChoice>('female')
  // ?lang=xx picks the copy (read after mount — the prerendered shell is EN).
  const [lang, setLang] = useState<Lang>('en')
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q && isLang(q)) setLang(q)
  }, [])
  const c = hrvToolCopy(lang)

  const result: HrvResult | null = useMemo(() => {
    const a = parseInt(age, 10)
    const r = parseInt(rmssd, 10)
    if (!a || a < 18 || a > 100 || !r || r < 1 || r > 250) return null
    return sex === 'unspecified' ? null : interpretHrv(a, r, sex)
  }, [age, rmssd, sex])
  const both = useMemo(() => {
    const a = parseInt(age, 10)
    const r = parseInt(rmssd, 10)
    if (sex !== 'unspecified' || !a || a < 18 || a > 100 || !r || r < 1 || r > 250) return null
    return interpretHrvBoth(a, r)
  }, [age, rmssd, sex])

  const verdictColor =
    result?.verdict === 'lower' ? 'text-amber-400' : result?.verdict === 'higher' ? 'text-terminal-green' : 'text-terminal-cyan'

  return (
    <div className="mx-auto max-w-[420px] rounded-xl border border-white/10 bg-[#0a1018] p-5 font-sans text-white">
      <div className="mb-3 font-mono text-xs uppercase tracking-widest text-terminal-cyan/80">{c.h1}</div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {(['female', 'male', 'unspecified'] as const).map((s) => (
          <button key={s} type="button" onClick={() => setSex(s)} aria-pressed={sex === s}
            className={`rounded-md border px-2 py-1.5 font-mono text-[10px] ${sex === s ? 'border-terminal-green/60 text-terminal-green' : 'border-white/15 text-white/50'}`}>
            {s === 'female' ? c.sex.female : s === 'male' ? c.sex.male : c.sex.unspecified}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/50">{c.age.label}</span>
          <input type="number" inputMode="numeric" min={18} max={100} value={age} onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 font-mono text-base text-white outline-none focus:border-terminal-green/60" />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/50">{c.value.label}</span>
          <input type="number" inputMode="numeric" min={1} max={250} value={rmssd} onChange={(e) => setRmssd(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 font-mono text-base text-white outline-none focus:border-terminal-green/60" />
        </label>
      </div>

      {(result && !result.verdict) || (both && !both.female.verdict) ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="mb-2 font-mono text-[10px] leading-relaxed text-white/70">{c.result.noCompare}</p>
          {(result ? [result] : both ? [both.female, both.male] : []).map((r) => (
            <p key={r.sex} className="mb-2 font-mono text-[10px] leading-relaxed text-white/55">
              {fill(c.result.infoOnly, {
                sex: r.sex === 'female' ? c.result.sexFemale : c.result.sexMale,
                band: r.point.label,
                p25: r.ref.p25,
                p75: r.ref.p75,
                p50: r.ref.p50,
              })}
            </p>
          ))}
          <p className="font-mono text-[10px] leading-relaxed text-white/45">{c.deviceNote}</p>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/45">{c.disclaimerLine}</p>
        </div>
      ) : result && result.verdict ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className={`text-base font-bold ${verdictColor}`}>{c.verdicts[result.verdict]}</div>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/55">
            {fill(c.result.compared, {
              sex: result.sex === 'female' ? c.result.sexFemale : c.result.sexMale,
              band: result.point.label,
              p25: result.ref.p25,
              p75: result.ref.p75,
              p50: result.ref.p50,
            })}
          </p>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/45">{c.disclaimerLine}</p>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/45">{c.deviceNote}</p>
        </div>
      ) : both ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          {(['female', 'male'] as const).map((s) => (
            <p key={s} className="mb-2 font-mono text-[10px] leading-relaxed text-white/70">
              {fill(c.result.comparedPosition, {
                sex: s === 'female' ? c.result.sexFemale : c.result.sexMale,
                band: both[s].point.label,
                position: c.result.position[both[s].verdict!],
                p25: both[s].ref.p25,
                p75: both[s].ref.p75,
                p50: both[s].ref.p50,
              })}
            </p>
          ))}
          <p className="font-mono text-[10px] leading-relaxed text-white/45">{c.disclaimerLine}</p>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/45">{c.deviceNote}</p>
        </div>
      ) : (
        <p className="font-mono text-[11px] text-white/40">{c.invalid}</p>
      )}

      <div className="mt-4 text-center">
        <a href={`${SITE}${lang === 'en' ? '' : `/${lang}`}${HRV_TOOL_PATH}?utm_source=embed&utm_medium=widget`} target="_blank" rel="noopener"
          className="font-mono text-[10px] text-white/40 transition-colors hover:text-terminal-green">
          Powered by <span className="text-terminal-green">ONDA</span> <span className="text-terminal-cyan">Life</span> · {c.meta.appName} →
        </a>
      </div>
    </div>
  )
}
