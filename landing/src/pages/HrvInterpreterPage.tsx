import { Fragment, useEffect, useMemo, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import { HRV_SOURCES, bandsFor, interpretHrv, type HrvMetric, type HrvResult } from '../data/hrv-norms'
import { hrvToolCopy, fill, HRV_TOOL_PATH, type HrvToolCopy } from '../data/hrv-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'
import { ordinal } from '../utils/ordinal'

const TIER_COLOR: Record<string, string> = {
  low: 'text-red-400',
  below: 'text-amber-400',
  average: 'text-terminal-cyan',
  above: 'text-terminal-green',
  excellent: 'text-terminal-green',
}

/** Languages with a localized /tools hub; others link to the EN hub. */
const TOOLS_HUB_LANGS: readonly Lang[] = ['ru', 'es']

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

export function HrvInterpreterPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: HrvToolCopy = hrvToolCopy(lang)

  const [metric, setMetric] = useState<HrvMetric>('rmssd')
  const [age, setAge] = useState('')
  const [hrv, setHrv] = useState('')

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const result: HrvResult | null = useMemo(() => {
    const a = parseInt(age, 10)
    const h = parseFloat(hrv.replace(',', '.'))
    if (!a || !h || a < 18 || a > 120 || h <= 0 || h > 300) return null
    return interpretHrv(a, h, metric)
  }, [age, hrv, metric])

  const percentileText = result
    ? fill(c.result.percentile, { p: lang === 'en' ? ordinal(result.percentile).replace(/^~/, '') : result.percentile })
    : ''
  const hub = TOOLS_HUB_LANGS.includes(lang) ? `/${lang}/tools` : '/tools'

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
        src="/images/tools/hrv.png"
        alt={c.imageAlt}
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      {/* Calculator */}
      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <fieldset className="mb-4">
          <legend className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">{c.metric.label}</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
            {(['rmssd', 'sdnn'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={metric === m}
                onClick={() => setMetric(m)}
                className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${
                  metric === m
                    ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green'
                    : 'border-white/15 text-white/60 hover:border-white/30'
                }`}
              >
                {m === 'rmssd' ? c.metric.rmssd : c.metric.sdnn}
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-white/40">
            {metric === 'rmssd' ? c.metric.hintRmssd : c.metric.hintSdnn}
          </p>
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
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">
              {metric === 'rmssd' ? c.value.labelRmssd : c.value.labelSdnn}
            </span>
            <input
              type="text" inputMode="decimal" placeholder={c.value.placeholder}
              value={hrv} onChange={(e) => setHrv(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        {result && (
          <div className="mt-6" aria-live="polite">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <span className={`text-2xl font-bold ${TIER_COLOR[result.tier]}`}>{c.tiers[result.tier]}</span>
              <span className="font-mono text-sm text-white/50">
                {percentileText} · {fill(c.result.band, { band: result.band.label })}
              </span>
            </div>
            <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-terminal-cyan to-terminal-green transition-all"
                style={{ width: `${result.barPct}%` }}
              />
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/60">
              {fill(c.summaries[result.tier], { v: hrv.replace(',', '.'), band: result.band.label, median: result.band.p50 })}
            </p>
            {metric === 'sdnn' && (
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-amber-300/70">{c.sdnnNote}</p>
            )}
          </div>
        )}
        {!result && (age || hrv) && (
          <p className="mt-4 font-mono text-xs text-white/40">{c.invalid}</p>
        )}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'hrv', lang)} variant="tool" lang={lang} />

      {/* Reference tables — RMSSD (rings/straps) and SDNN (Apple Watch) */}
      <NormsTable c={c} metric="rmssd" title={c.tables.rmssdTitle} caption={c.tables.rmssdCaption} />
      <NormsTable c={c} metric="sdnn" title={c.tables.sdnnTitle} caption={c.tables.sdnnCaption} />

      {/* Answer blocks for neighbouring queries — each self-contained */}
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
        methodology={`${c.methodologyRmssd} ${c.methodologySdnn}`}
        sources={HRV_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <EmbedHrvBlock c={c} lang={lang} />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/articles/normal-hrv-by-age', lang)} className="text-terminal-green hover:underline">{c.related.normal}</Link>
        {' · '}
        <Link to={langHref('/articles/hrv-different-every-device', lang)} className="text-terminal-green hover:underline">{c.related.device}</Link>
        {' · '}
        <Link to={langHref('/articles/how-to-raise-hrv-naturally', lang)} className="text-terminal-green hover:underline">{c.related.raise}</Link>
        {' · '}
        <Link to={langHref('/articles/resting-heart-rate-by-age', lang)} className="text-terminal-green hover:underline">{c.related.rhr}</Link>
        {' · '}
        <Link to={langHref('/reviews/hrv-trackers', lang)} className="text-terminal-green hover:underline">{c.related.trackers}</Link>
      </div>
    </main>
  )
}

function NormsTable({ c, metric, title, caption }: { c: HrvToolCopy; metric: HrvMetric; title: string; caption: string }) {
  return (
    <section className="mb-10">
      <h2 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
      <p className="mb-3 font-mono text-[11px] text-white/40">{caption}</p>
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
            {bandsFor(metric).map((b) => (
              <tr key={b.label} className="border-b border-white/5 text-white/70">
                <th scope="row" className="px-3 py-2 text-left font-semibold text-white/90">{b.label}</th>
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
    </section>
  )
}

function EmbedHrvBlock({ c, lang }: { c: HrvToolCopy; lang: Lang }) {
  const [copied, setCopied] = useState<'js' | 'iframe' | null>(null)
  const q = lang === 'en' ? '' : `?lang=${lang}`
  const pageUrl = `https://onda-life.com${lang === 'en' ? '' : `/${lang}`}${HRV_TOOL_PATH}`
  // Recommended: the dependency-free JS widget renders inline (light DOM), so the
  // credit is a real link on the host page. Open source: github.com/yamius/onda-hrv-widget.
  const snippet = `<div data-onda-hrv${lang === 'en' ? '' : ` data-lang="${lang}"`}></div>
<script src="https://onda-life.com/embed/onda-hrv-widget.js" defer></script>`
  // Alternative: iframe (isolated). The credit <p> below it sits in the host page.
  const iframe = `<iframe src="https://onda-life.com/embed/hrv${q}" width="100%" height="440" style="border:0;max-width:440px" title="${c.meta.appName} — ONDA Life" loading="lazy"></iframe>
<p style="font:12px sans-serif"><a href="${pageUrl}">${c.meta.appName}</a> — <a href="https://onda-life.com">ONDA Life</a></p>`
  const copy = (which: 'js' | 'iframe') => {
    try {
      navigator.clipboard?.writeText(which === 'js' ? snippet : iframe)
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="mb-10 rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-2 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">{c.embed.title}</h2>
      <p className="mb-3 font-mono text-xs leading-relaxed text-white/50">
        {c.embed.text}{' '}
        <a href="https://github.com/yamius/onda-hrv-widget" target="_blank" rel="noopener" className="text-terminal-green hover:underline">GitHub</a>
      </p>
      <textarea
        readOnly
        rows={2}
        value={snippet}
        onFocus={(e) => e.currentTarget.select()}
        className="mb-3 w-full resize-none rounded-lg border border-white/15 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/70 outline-none focus:border-terminal-green/50"
      />
      <button
        onClick={() => copy('js')}
        className="rounded-lg border border-terminal-green/40 px-4 py-2 font-mono text-xs text-terminal-green transition-colors hover:bg-terminal-green/10"
      >
        {copied === 'js' ? c.embed.copied : c.embed.copy}
      </button>

      <details className="mt-4">
        <summary className="cursor-pointer font-mono text-[11px] text-white/40 hover:text-white/60">{c.embed.iframeSummary}</summary>
        <textarea
          readOnly
          rows={4}
          value={iframe}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-3 mb-3 w-full resize-none rounded-lg border border-white/15 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/60 outline-none focus:border-terminal-green/50"
        />
        <button
          onClick={() => copy('iframe')}
          className="rounded-lg border border-white/20 px-4 py-2 font-mono text-xs text-white/60 transition-colors hover:bg-white/5"
        >
          {copied === 'iframe' ? c.embed.copied : c.embed.copyIframe}
        </button>
      </details>
    </div>
  )
}
