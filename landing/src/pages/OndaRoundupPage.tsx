/**
 * /compare/<roundup-slug> — ONDA Life's OWN ranked "top X" guide, on the
 * /compare side (never the independent /reviews system). Rendered via the
 * CompareSlugRouter dispatcher alongside the pairwise onda-vs pages.
 *
 * Honesty: a visible transparency banner says this is ONDA's own guide, ONDA
 * is ranked #1 only in categories where it genuinely leads, and the bottom
 * line states plainly what ONDA is NOT best at and who to buy instead.
 *
 * EN-only. Self-contained meta + ItemList + FAQPage JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getRoundup } from '../data/onda-roundups'
import { NotFoundPage } from './NotFoundPage'

const SITE_URL = 'https://onda-life.com'

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

function setOrCreateScript(id: string, json: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(json)
}

export function OndaRoundupPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const roundup = slug ? getRoundup(slug) : undefined

  useEffect(() => {
    if (!roundup) return
    const pageUrl = `${SITE_URL}/compare/${roundup.slug}`
    const title = `${roundup.title} (2026) | ONDA Life`
    const desc = roundup.description
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)

    setOrCreateScript('ld-roundup-itemlist', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${pageUrl}#list`,
      name: roundup.title,
      description: desc,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: roundup.entries.map((e) => ({
        '@type': 'ListItem',
        position: e.rank,
        name: e.name,
        url: e.href.startsWith('/') ? `${SITE_URL}${e.href}` : e.href,
      })),
    })
    setOrCreateScript('ld-roundup-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: roundup.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })

    return () => {
      for (const id of ['ld-roundup-itemlist', 'ld-roundup-faq']) {
        const el = document.getElementById(id)
        if (el) el.remove()
      }
    }
  }, [roundup, location])

  if (!roundup) return <NotFoundPage />

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/compare" className="transition-colors hover:text-white/50">Compare</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{roundup.title}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">[ TOP PICKS ]</div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">{roundup.title}</h1>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/55">{roundup.intro}</p>

      {/* Transparency banner */}
      <div className="mb-10 rounded-lg border border-white/10 bg-white/[0.02] p-4 font-mono text-xs leading-relaxed text-white/50">
        This is ONDA Life&rsquo;s own guide, and ONDA is one of the apps in it — so we rank it #1 only
        where it genuinely leads, name where each competitor wins, and say plainly below what ONDA is
        <em> not</em> best at.
      </div>

      {/* Ranked list */}
      <ol className="mb-10 space-y-4">
        {roundup.entries.map((e) => (
          <li
            key={e.rank}
            className={`rounded-xl border p-5 ${
              e.isOnda ? 'border-terminal-green/30 bg-terminal-green/5' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-mono text-lg font-bold text-terminal-green">#{e.rank}</span>
              <Link to={e.href} className="text-lg font-bold text-white hover:text-terminal-green">
                {e.name}
              </Link>
              {e.isOnda && (
                <span className="rounded border border-terminal-green/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-terminal-green">
                  Our app
                </span>
              )}
            </div>
            <div className="mb-2 font-mono text-xs uppercase tracking-wider text-white/40">{e.tag}</div>
            <p className="mb-3 font-mono text-sm leading-relaxed text-white/70">{e.blurb}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-green/70">Pros</div>
                <ul className="space-y-1 font-mono text-xs leading-relaxed text-white/65">
                  {e.pros.map((p) => (
                    <li key={p} className="flex gap-2"><span className="text-terminal-green">+</span><span>{p}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-300/80">Cons</div>
                <ul className="space-y-1 font-mono text-xs leading-relaxed text-white/55">
                  {e.cons.map((c) => (
                    <li key={c} className="flex gap-2"><span className="text-amber-300">−</span><span>{c}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Bottom line — the honest boundary */}
      <section className="mb-10 rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-widest text-terminal-green/80">THE BOTTOM LINE</p>
        <p className="text-sm leading-relaxed text-white/85">{roundup.bottomLine}</p>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">Questions</h2>
        <div className="space-y-6">
          {roundup.faq.map((f) => (
            <div key={f.q} className="border-b border-white/10 pb-6">
              <h3 className="mb-2 font-semibold text-white">{f.q}</h3>
              <p className="font-mono text-sm leading-relaxed text-white/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-links */}
      <section className="rounded-lg border border-white/10 bg-white/[0.02] p-6 font-mono text-sm leading-relaxed text-white/70">
        See exactly{' '}
        <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>,{' '}
        <Link to="/how-it-works" className="text-terminal-green hover:underline">how it works</Link>, and more head-to-heads on the{' '}
        <Link to="/compare" className="text-terminal-green hover:underline">compare hub</Link>.
      </section>
    </div>
  )
}
