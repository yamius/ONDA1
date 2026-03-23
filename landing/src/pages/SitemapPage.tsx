import { Link } from 'react-router-dom'
import { articles } from '../data/articles'
import { glossaryTerms } from '../data/glossary'
import { parts } from './PartPage'
import { levelsData } from '../data/levels'
import { useEffect } from 'react'

const SITE_URL = 'https://onda-life.com'

const MAIN_LINKS = [
  { to: '/', label: 'Home — ONDA Life biohacking OS' },
  { to: '/about', label: 'About ONDA Life' },
  { to: '/articles', label: 'Articles on biohacking and human optimization' },
  { to: '/glossary', label: 'Glossary of biohacking and neuroscience terms' },
  { to: '/the-stack', label: 'The Stack — protocol system' },
  { to: '/contact', label: 'Contacts — reach ONDA Life team' },
  { to: '/bio', label: 'Bio OS — live biometrics measurement' },
]

export function SitemapPage() {
  useEffect(() => {
    document.title = 'Sitemap — ONDA Life'
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.content = content
    }
    const setOg = (prop: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
      el.content = content
    }
    setMeta('description', 'Full sitemap of ONDA Life — all articles, glossary terms, levels, parts and main pages.')
    setMeta('robots', 'index, follow')
    setOg('og:title', 'Sitemap — ONDA Life')
    setOg('og:description', 'Full sitemap of ONDA Life — all articles, glossary terms, levels, parts and main pages.')
    setOg('og:url', `${SITE_URL}/sitemap`)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = `${SITE_URL}/sitemap`
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
      <h1 className="mb-2 font-mono text-2xl font-bold text-cyan-400 md:text-3xl">Site Map</h1>
      <p className="mb-12 text-sm text-white/40">All pages on onda-life.com</p>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

        {/* Column 1: Main + Glossary below */}
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">Main</h2>
            <ul className="space-y-2">
              {MAIN_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">Glossary</h2>
            <ul className="space-y-2">
              {glossaryTerms.map((t) => (
                <li key={t.slug}>
                  <Link to={`/glossary/${t.slug}`} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Column 2: Articles */}
        <section>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">Articles</h2>
          <ul className="space-y-2">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link to={`/articles/${a.slug}`} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Column 3: Levels & Parts */}
        <section>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">Levels & Parts</h2>
          <ul className="space-y-2">
            {Object.entries(levelsData).map(([num, level]) => (
              <li key={num}>
                <Link to={`/level/${num}`} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                  Level {num} — {level.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2">
            {Object.entries(parts).map(([slug, part]) => (
              <li key={slug}>
                <Link to={`/part/${slug}`} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                  {part.title} {part.titleHighlight}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Column 4: Bio OS */}
        <section>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">Bio OS</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/bio" className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                Bio OS — real-time biometrics
              </Link>
            </li>
            <li className="mt-3 text-xs text-white/25 leading-relaxed">
              Measure heart rate, HRV, stress, energy and breathing rate directly from your camera — no wearable required.
            </li>
          </ul>
        </section>

      </div>
    </div>
  )
}
