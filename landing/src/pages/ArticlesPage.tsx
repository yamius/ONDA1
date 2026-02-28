import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { articles } from '../data/articles'

interface MdArticle {
  slug: string
  filename: string
  title: string
  content: string
}

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/og-preview.png`

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

const ARTICLES_TITLE = 'Articles | ONDA Life — Biohacking & Neuroscience'
const ARTICLES_DESC =
  'Deep-dive articles on vagal tone, nervous system optimization, and consciousness architecture. Science-backed guides for your biocomputer upgrade.'

export function ArticlesPage() {
  const [mdArticles, setMdArticles] = useState<MdArticle[]>([])

  useEffect(() => {
    fetch('/api/md-articles')
      .then(r => r.json())
      .then(setMdArticles)
      .catch(() => {})
  }, [])

  useEffect(() => {
    document.title = ARTICLES_TITLE
    setMeta('description', ARTICLES_DESC)
    setMeta('og:title', ARTICLES_TITLE, true)
    setMeta('og:description', ARTICLES_DESC, true)
    setMeta('og:url', `${SITE_URL}/articles`, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', ARTICLES_TITLE, true)
    setMeta('twitter:description', ARTICLES_DESC, true)
    setMeta('twitter:image', OG_IMAGE, true)
    return () => {
      document.title = 'ONDA Life — Biohacking App & Systematic Consciousness OS'
      setMeta('description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.')
      setMeta('og:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('og:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('twitter:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 pt-20 pb-16 md:px-6">
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">
          Home
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          Articles
        </span>
      </nav>
      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ DEEP DIVES ]
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">
        Articles
      </h1>
      <p className="mb-12 max-w-2xl font-mono text-sm text-white/40">
        Science-backed guides for nervous system optimization. From vagal tone to consciousness architecture.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          ...articles.map((a) => ({ ...a, path: `/articles/${a.slug}` })),
          ...mdArticles.map((a) => ({
            slug: a.slug,
            title: a.title,
            description: a.content
              .split('\n')
              .filter((l) => l.trim() && !/^\[/.test(l.trim()))
              .slice(0, 3)
              .join(' ')
              .slice(0, 180) + '…',
            category: 'Biological Software',
            path: `/articles/telegram/${a.slug}`,
          })),
        ].map((article) => (
          <Link
            key={article.path}
            to={article.path}
            className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/10"
            data-testid={article.path.startsWith('/articles/telegram/') ? `card-md-article-${article.slug}` : undefined}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/30">
                {article.category}
              </span>
              <span className="font-mono text-xs text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                →
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">
              {article.title}
            </h3>
            <p className="font-mono text-xs leading-relaxed text-white/40">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
