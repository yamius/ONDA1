import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { TOPICS } from '../data/topics'
import { articles } from '../data/articles'

const SITE_URL = 'https://onda-life.com'
const TITLE = 'Topic Hubs | ONDA Life'
const DESC =
  'Curated topic hubs across HRV training, vagus nerve, circadian rhythm, dopamine architecture, breathwork, metabolic flexibility, glymphatic clearance, neuroplasticity, mitochondria, and cold exposure.'

function articleCount(slugs: string[]): number {
  const have = new Set(articles.map((a) => a.slug))
  return slugs.filter((s) => have.has(s)).length
}

export function TopicsPage() {
  useEffect(() => {
    document.title = TITLE
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.name = name
        document.head.appendChild(el)
      }
      el.content = content
    }
    setMeta('description', DESC)
  }, [])

  return (
    <main className="min-h-screen bg-[#050a0f] text-white" data-testid="page-topics">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <nav className="text-xs uppercase tracking-widest text-cyan-400/70 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-cyan-300" data-testid="link-breadcrumb-home">
            ONDA Life
          </Link>
          <span className="mx-2 text-white/30">/</span>
          <span>Topics</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" data-testid="text-page-title">
          Topic Hubs
        </h1>
        <p className="text-lg text-white/70 mb-12 max-w-3xl">
          Every ONDA Life article slots into a curated topic cluster. Each
          hub is the canonical entry point to the protocols, glossary entries,
          and supporting research for one engineering surface of the human
          biocomputer.
        </p>

        <ul className="grid gap-6 sm:grid-cols-2">
          {TOPICS.map((t) => {
            const count = articleCount(t.articleSlugs)
            return (
              <li key={t.slug}>
                <Link
                  to={`/topics/${t.slug}`}
                  className="block h-full rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:bg-white/[0.04] hover:border-cyan-400/40"
                  data-testid={`link-topic-${t.slug}`}
                >
                  <h2 className="text-xl font-semibold text-cyan-200 mb-2" data-testid={`text-topic-title-${t.slug}`}>
                    {t.title}
                  </h2>
                  <p className="text-sm text-white/60 mb-3 leading-relaxed">{t.description}</p>
                  <span className="text-xs text-cyan-400/80" data-testid={`text-topic-count-${t.slug}`}>
                    {count} article{count === 1 ? '' : 's'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        <p className="mt-16 text-xs text-white/40">
          Source of truth: <code className="text-white/60">src/data/topics.ts</code>.
          Machine-readable index: <a href={`${SITE_URL}/llms.txt`} className="underline hover:text-white/80">/llms.txt</a>.
        </p>
      </div>
    </main>
  )
}
