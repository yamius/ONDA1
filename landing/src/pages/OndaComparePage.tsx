/**
 * /compare — hub for ONDA Life's own "ONDA vs <competitor>" comparisons.
 * Localized to ru + es (pilot): framing prose, matrix headings/legend and the
 * capability-axis row labels. Competitor names, category labels and round-up /
 * head-to-head titles + verdicts stay English — same content as the EN-only
 * /compare/<slug> detail pages the cards link to. Cross-links go through
 * langHref (localized where a route exists, EN otherwise). CollectionPage
 * JSON-LD + the hreflang cluster are emitted statically by meta-inject/prerender.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ONDA_VS, CAPABILITIES, ONDA_CAPS, type Cap } from '../data/onda-vs'
import { ONDA_ROUNDUPS } from '../data/onda-roundups'
import { langFromPath, langHref } from '../i18n'
import { COMPARE_I18N, type CompareCopy } from '../data/compare-i18n'

const CAP_GLYPH: Record<Cap, string> = { yes: '✓', limited: '~', no: '—' }
const CAP_CLASS: Record<Cap, string> = {
  yes: 'text-terminal-green',
  limited: 'text-amber-300',
  no: 'text-white/25',
}

const SITE_URL = 'https://onda-life.com'

/** English copy — the built-in default; ru/es overlay from COMPARE_I18N. */
const EN_COPY: CompareCopy = {
  metaTitle: 'ONDA vs Oura, WHOOP, Headspace, Calm & more — Compared | ONDA Life',
  metaDescription:
    'How ONDA Life’s HRV biofeedback compares to Oura, WHOOP, Headspace, Calm, Breathwrk and Elite HRV — objective capability tables and who each is best for.',
  kicker: '[ COMPARE ]',
  h1: 'ONDA vs the alternatives.',
  intro:
    'How ONDA’s real-time HRV biofeedback stacks up against the apps and wearables people cross-shop. These are ONDA’s own comparisons, kept objective — the same capability rows for every one — with an honest “best for” on each side.',
  matrixHeading: 'Capabilities at a glance',
  matrixIntro: 'ONDA and the apps people cross-shop, on the same axes.',
  yesWord: 'yes',
  limitedWord: 'limited',
  noWord: 'no',
  capabilityColHeader: 'Capability',
  matrixFootPre: 'This is ONDA’s own comparison. Tap any competitor for the full head-to-head, and see ',
  measuresLink: 'what ONDA measures',
  matrixFootPost: '.',
  axisLabels: {}, // EN falls back to the raw CAPABILITIES string
  topPicksHeading: 'Top picks by category',
  headToHeadHeading: 'Head-to-head',
  howHeading: 'How we compare',
  howP1:
    'These are ONDA’s own comparisons, so we hold them to a stricter rule than a typical “vs” page: every competitor is scored on the same capability rows, from public information and hands-on use, and each head-to-head carries an honest “best for” on both sides — including the cases where a rival is the better pick. ONDA is a real-time HRV biofeedback and guided-breathing app; when what you actually want is passive overnight tracking from a ring or band, we say so.',
  howP2a: 'Because we can’t be neutral about our own product, we keep our self-comparisons here at ',
  compareLinkText: '/compare',
  howP2b: ' and out of the independent ',
  reviewsLink: 'reviews',
  howP2c: ', which are scored against a ',
  rubricLink: 'public rubric',
  howP2d: ' that ONDA is deliberately left out of. For the underlying detail, see ',
  howP2e: ' and the ',
  evidenceLink: 'evidence',
  howP2f: ' it builds on.',
}

function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function OndaComparePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const copy = lang === 'ru' || lang === 'es' ? COMPARE_I18N[lang] : EN_COPY
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/compare`

  useEffect(() => {
    document.title = copy.metaTitle
    setMeta('description', copy.metaDescription)
    setMeta('og:title', copy.metaTitle, true)
    setMeta('og:description', copy.metaDescription, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', copy.metaTitle, true)
    setMeta('twitter:description', copy.metaDescription, true)
    // CollectionPage JSON-LD and hreflang cluster are emitted statically by
    // prerender/meta-inject (prerender skips useEffect).
  }, [copy, pageUrl])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">{copy.kicker}</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{copy.h1}</h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">{copy.intro}</p>
      </header>

      {/* Capability matrix — ONDA and every competitor on the same axes, at a
          glance. Reuses the onda-vs data so it can't drift. */}
      <section className="mt-12">
        <h2 className="mb-1 text-xl font-bold tracking-tight md:text-2xl">{copy.matrixHeading}</h2>
        <p className="mb-4 font-mono text-xs text-white/45">
          {copy.matrixIntro}{' '}
          <span className="text-terminal-green">✓</span> {copy.yesWord} ·{' '}
          <span className="text-amber-300">~</span> {copy.limitedWord} ·{' '}
          <span className="text-white/30">—</span> {copy.noWord}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 font-mono text-[11px] uppercase tracking-wider text-white/50">
                <th className="py-3 pr-4 font-medium">{copy.capabilityColHeader}</th>
                <th className="px-2 py-3 text-center text-terminal-green">ONDA</th>
                {ONDA_VS.map((e) => (
                  <th key={e.slug} className="px-2 py-3 text-center font-medium text-white/60">
                    <Link to={`/compare/${e.slug}`} className="hover:text-terminal-green">
                      {e.competitorName}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map((cap) => (
                <tr key={cap} className="border-b border-white/10">
                  <td className="min-w-[220px] py-3 pr-4 align-top text-white/75">{copy.axisLabels[cap] ?? cap}</td>
                  <td className={`px-2 py-3 text-center font-mono ${CAP_CLASS[ONDA_CAPS[cap]]}`}>
                    {CAP_GLYPH[ONDA_CAPS[cap]]}
                  </td>
                  {ONDA_VS.map((e) => (
                    <td key={e.slug} className={`px-2 py-3 text-center font-mono ${CAP_CLASS[e.them[cap]]}`}>
                      {CAP_GLYPH[e.them[cap]]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/40">
          {copy.matrixFootPre}
          <Link to={langHref('/measurements', lang)} className="text-terminal-green hover:underline">{copy.measuresLink}</Link>
          {copy.matrixFootPost}
        </p>
      </section>

      {/* Top-X guides */}
      <h2 className="mt-12 mb-4 text-xl font-bold tracking-tight md:text-2xl">{copy.topPicksHeading}</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {ONDA_ROUNDUPS.map((r) => (
          <li key={r.slug}>
            <Link
              to={`/compare/${r.slug}`}
              className="block h-full rounded-lg border border-terminal-green/25 bg-terminal-green/5 p-5 transition-colors hover:border-terminal-green/50"
            >
              <div className="mb-1 text-lg font-bold text-white">{r.title}</div>
              <p className="font-mono text-xs leading-relaxed text-white/60 line-clamp-3">{r.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 mb-4 text-xl font-bold tracking-tight md:text-2xl">{copy.headToHeadHeading}</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {ONDA_VS.map((e) => (
          <li key={e.slug}>
            <Link
              to={`/compare/${e.slug}`}
              className="block h-full rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-terminal-green/40 hover:bg-terminal-green/5"
            >
              <div className="mb-1 text-lg font-bold text-white">{e.title}</div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-white/40">
                {e.category}
              </div>
              <p className="font-mono text-xs leading-relaxed text-white/60 line-clamp-3">{e.verdict}</p>
            </Link>
          </li>
        ))}
      </ul>

      {/* ── How we compare — methodology + honesty note ──────────────────── */}
      <section className="mt-16 border-t border-white/10 pt-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{copy.howHeading}</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/65">
          <p>{copy.howP1}</p>
          <p>
            {copy.howP2a}
            <Link to={langHref('/compare', lang)} className="text-terminal-green hover:underline">{copy.compareLinkText}</Link>
            {copy.howP2b}
            <Link to={langHref('/reviews', lang)} className="text-terminal-green hover:underline">{copy.reviewsLink}</Link>
            {copy.howP2c}
            <Link to={langHref('/reviews/methodology', lang)} className="text-terminal-green hover:underline">{copy.rubricLink}</Link>
            {copy.howP2d}
            <Link to={langHref('/measurements', lang)} className="text-terminal-green hover:underline">{copy.measuresLink}</Link>
            {copy.howP2e}
            <Link to={langHref('/research', lang)} className="text-terminal-green hover:underline">{copy.evidenceLink}</Link>
            {copy.howP2f}
          </p>
        </div>
      </section>
    </main>
  )
}
