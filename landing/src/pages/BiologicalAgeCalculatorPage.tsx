import { Fragment, useEffect, useMemo, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import {
  BIOAGE_SOURCES,
  computeFitnessAge,
  type Duration,
  type FitnessAgeResult,
  type Freq,
  type Intensity,
  type Sex,
} from '../data/biological-age'
import { bioToolCopy, fill, type BioToolCopy } from '../data/bioage-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

/** Render inline markdown links ([text](/path)) as router links. */
function Rich({ text, lang }: { text: string; lang: Lang }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!m) return <Fragment key={i}>{p}</Fragment>
        return (
          <Link key={i} to={langHref(m[2], lang)} className="text-terminal-green hover:underline">
            {m[1]}
          </Link>
        )
      })}
    </>
  )
}

const num = (v: number, lang: Lang, d = 1) => v.toLocaleString(lang, { minimumFractionDigits: d, maximumFractionDigits: d })

function Choice<T extends string>({ label, value, options, labels, onChange }: {
  label: string
  value: T
  options: readonly T[]
  labels: Record<T, string>
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="mb-4">
      <legend className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">{label}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
        {options.map((o) => (
          <button
            key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)}
            className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${value === o ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
          >
            {labels[o]}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function BiologicalAgeCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: BioToolCopy = bioToolCopy(lang)

  const [sex, setSex] = useState<Sex>('male')
  const [age, setAge] = useState('40')
  const [waist, setWaist] = useState('90')
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const [rhr, setRhr] = useState('62')
  const [freq, setFreq] = useState<Freq>('twoThree')
  const [intensity, setIntensity] = useState<Intensity>('breathless')
  const [duration, setDuration] = useState<Duration>('m30')

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const result: FitnessAgeResult | null = useMemo(() => {
    const a = parseFloat(age.replace(',', '.'))
    const w = parseFloat(waist.replace(',', '.'))
    const r = parseFloat(rhr.replace(',', '.'))
    if (!a || a < 20 || a > 90 || !w || !r || r < 35 || r > 120) return null
    const cm = unit === 'cm' ? w : w * 2.54
    if (cm < 50 || cm > 160) return null
    return computeFitnessAge({ age: a, sex, waistCm: cm, restingHr: r, freq, intensity, duration })
  }, [age, waist, unit, rhr, sex, freq, intensity, duration])

  const hub = (['ru', 'es'] as Lang[]).includes(lang) ? `/${lang}/tools` : '/tools'
  const deltaText = result
    ? result.delta < 0 ? fill(c.result.younger, { n: -result.delta })
      : result.delta > 0 ? fill(c.result.older, { n: result.delta }) : c.result.same
    : ''
  const inputCls = 'w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60'

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="hover:text-terminal-green">{c.breadcrumb.home}</Link>
        <span>/</span>
        <Link to={hub} className="hover:text-terminal-green">{c.breadcrumb.tools}</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">{c.breadcrumb.current}</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{c.h1}</h1>
      <p className="mb-8 text-base leading-relaxed text-white/70">{c.capsule}</p>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <Choice label={c.form.sex} value={sex} options={['male', 'female'] as const} labels={{ male: c.form.male, female: c.form.female }} onChange={setSex} />

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.form.age}</span>
            <input type="text" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.form.waist}</span>
            <div className="flex gap-2">
              <input type="text" inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} className={inputCls} />
              <div className="flex overflow-hidden rounded-lg border border-white/15">
                {(['cm', 'in'] as const).map((u) => (
                  <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)}
                    className={`px-2 font-mono text-xs ${unit === u ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50'}`}>{u}</button>
                ))}
              </div>
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.form.rhr}</span>
            <input type="text" inputMode="numeric" value={rhr} onChange={(e) => setRhr(e.target.value)} className={inputCls} />
          </label>
        </div>
        <p className="mb-5 font-mono text-[11px] leading-relaxed text-white/40">{c.form.waistHint} {c.form.rhrHint}</p>

        <Choice label={c.form.freq} value={freq} options={['lt1', 'once', 'twoThree', 'daily'] as const} labels={c.freq} onChange={setFreq} />
        {freq !== 'lt1' && (
          <>
            <Choice label={c.form.intensity} value={intensity} options={['easy', 'breathless', 'exhaustion'] as const} labels={c.intensity} onChange={setIntensity} />
            <Choice label={c.form.duration} value={duration} options={['lt15', 'm15', 'm30', 'gt60'] as const} labels={c.duration} onChange={setDuration} />
          </>
        )}

        {result ? (
          <div className="mt-6" aria-live="polite">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">{c.result.title}</div>
            <div className="mb-1 text-5xl font-bold text-terminal-green">{fill(c.result.years, { n: result.fitnessAge })}</div>
            <p className={`mb-3 font-mono text-sm ${result.delta <= 0 ? 'text-terminal-cyan' : 'text-amber-300'}`}>{deltaText}</p>
            <p className="mb-3 font-mono text-xs leading-relaxed text-white/60">
              {fill(c.result.vo2, { v: num(result.vo2max, lang), pct: result.pctOfNorm, norm: num(result.normForAge, lang) })}
            </p>
            <p className="font-mono text-[11px] leading-relaxed text-white/40">{c.result.note}</p>
          </div>
        ) : (
          <p className="mt-4 font-mono text-xs text-white/40">{c.invalid}</p>
        )}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'bioage', lang)} variant="tool" lang={lang} />

      {c.sections.map((sec) => (
        <section key={sec.h2} className="mb-10">
          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{sec.h2}</h2>
          <p className="text-sm leading-relaxed text-white/70">
            <Rich text={sec.body} lang={lang} />
          </p>
        </section>
      ))}

      {/* FAQ — mirrors the FAQPage JSON-LD injected at build */}
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{c.faqTitle}</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {c.faq.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <SourcesSection
        heading={c.sourcesTitle}
        methodology={c.methodology}
        sources={BIOAGE_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/tools/vo2max', lang)} className="text-terminal-green hover:underline">{c.related.vo2}</Link>
        {' · '}
        <Link to={langHref('/tools/resting-heart-rate', lang)} className="text-terminal-green hover:underline">{c.related.rhr}</Link>
        {' · '}
        <Link to={langHref('/tools/zone-2', lang)} className="text-terminal-green hover:underline">{c.related.zone2}</Link>
        {' · '}
        <Link to={langHref('/tools/hrv', lang)} className="text-terminal-green hover:underline">{c.related.hrv}</Link>
      </div>
    </main>
  )
}
