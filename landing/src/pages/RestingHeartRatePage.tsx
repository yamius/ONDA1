import { Fragment, useEffect, useMemo, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import { RHR_BANDS, RHR_SOURCES, interpretRhr, type RhrResult, type RhrSex } from '../data/resting-hr'
import { rhrToolCopy, fill, type RhrToolCopy } from '../data/rhr-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

const TIER_COLOR: Record<string, string> = {
  veryLow: 'text-terminal-cyan',
  low: 'text-terminal-green',
  typical: 'text-terminal-green',
  higher: 'text-amber-400',
  high: 'text-red-400',
}


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

export function RestingHeartRatePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: RhrToolCopy = rhrToolCopy(lang)

  const [sex, setSex] = useState<RhrSex>('male')
  const [age, setAge] = useState('')
  const [rhr, setRhr] = useState('')

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const result: RhrResult | null = useMemo(() => {
    const a = parseInt(age, 10)
    const r = parseFloat(rhr.replace(',', '.'))
    if (!a || a < 18 || a > 120 || !r || r < 30 || r > 150) return null
    return interpretRhr(a, r, sex)
  }, [age, rhr, sex])

  const sexWord = sex === 'male' ? c.result.sexMen : c.result.sexWomen
  const hub = lang === 'en' ? '/tools' : `/${lang}/tools`

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

      <img
        src="/images/tools/resting-heart-rate.png"
        alt={c.imageAlt}
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      {/* Calculator */}
      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <fieldset className="mb-4">
          <legend className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">{c.sex.label}</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {(['male', 'female'] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={sex === s}
                onClick={() => setSex(s)}
                className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                  sex === s
                    ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green'
                    : 'border-white/15 text-white/60 hover:border-white/30'
                }`}
              >
                {s === 'male' ? c.sex.male : c.sex.female}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.age.label}</span>
            <input
              type="number" inputMode="numeric" min={18} max={120} placeholder={c.age.placeholder}
              value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.value.label}</span>
            <input
              type="text" inputMode="decimal" placeholder={c.value.placeholder}
              value={rhr} onChange={(e) => setRhr(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/40">
          <span className="text-white/55">{c.source.label}:</span> {c.source.hint}
        </p>

        {result && (
          <div className="mt-6" aria-live="polite">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <span className={`text-2xl font-bold ${TIER_COLOR[result.tier]}`}>{c.tiers[result.tier]}</span>
              <span className="font-mono text-sm text-white/50">
                {fill(c.result.percentile, { p: 100 - result.percentile, sex: sexWord, band: result.band.label })}
              </span>
            </div>
            <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-terminal-green to-amber-400 transition-all"
                style={{ width: `${result.barPct}%` }}
              />
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/60">
              {fill(c.summaries[result.tier], { v: rhr.replace(',', '.'), sexWord, band: result.band.label, median: result.band.p50 })}
            </p>
            {result.flag && (
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-amber-300/80">{c.flags[result.flag]}</p>
            )}
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/40">{c.wearableNote}</p>
          </div>
        )}
        {!result && (age || rhr) && <p className="mt-4 font-mono text-xs text-white/40">{c.invalid}</p>}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'rhr', lang)} variant="tool" lang={lang} />

      <NormsTable c={c} sex="male" title={c.tables.menTitle} />
      <NormsTable c={c} sex="female" title={c.tables.womenTitle} />

      {c.sections.map((s) => (
        <section key={s.h2} className="mb-10">
          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{s.h2}</h2>
          <p className="text-sm leading-relaxed text-white/70">
            <Rich text={s.body} lang={lang} />
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
        sources={RHR_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/articles/resting-heart-rate-by-age', lang)} className="text-terminal-green hover:underline">{c.related.article}</Link>
        {' · '}
        <Link to={langHref('/tools/hrv', lang)} className="text-terminal-green hover:underline">{c.related.hrv}</Link>
        {' · '}
        <Link to={langHref('/tools/camera-heart-rate', lang)} className="text-terminal-green hover:underline">{c.related.camera}</Link>
        {' · '}
        <Link to={langHref('/tools/zone-2', lang)} className="text-terminal-green hover:underline">{c.related.zone2}</Link>
      </div>
    </main>
  )
}

function NormsTable({ c, sex, title }: { c: RhrToolCopy; sex: RhrSex; title: string }) {
  return (
    <section className="mb-10">
      <h2 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
      <p className="mb-3 font-mono text-[11px] text-white/40">{c.tables.caption}</p>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th scope="col" className="px-3 py-2 text-left">{c.tables.age}</th>
              <th scope="col" className="px-3 py-2 text-right">{c.tables.p10}</th>
              <th scope="col" className="px-3 py-2 text-right">{c.tables.p25}</th>
              <th scope="col" className="px-3 py-2 text-right">{c.tables.p50}</th>
              <th scope="col" className="px-3 py-2 text-right">{c.tables.p75}</th>
              <th scope="col" className="px-3 py-2 text-right">{c.tables.p90}</th>
            </tr>
          </thead>
          <tbody>
            {RHR_BANDS[sex].map((b) => (
              <tr key={b.label} className="border-b border-white/5 text-white/70">
                <th scope="row" className="px-3 py-2 text-left font-semibold text-white/90">{b.label}</th>
                <td className="px-3 py-2 text-right">{b.p10}</td>
                <td className="px-3 py-2 text-right">{b.p25}</td>
                <td className="px-3 py-2 text-right text-terminal-cyan">{b.p50}</td>
                <td className="px-3 py-2 text-right">{b.p75}</td>
                <td className="px-3 py-2 text-right text-amber-400">{b.p90}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
