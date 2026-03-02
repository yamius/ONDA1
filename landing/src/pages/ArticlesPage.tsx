import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { articles } from '../data/articles'
import { FEATURED_ARTICLE_SLUGS, ARTICLE_CATEGORIES } from '../data/articles-categories'

interface MdArticle {
  slug: string
  filename: string
  title: string
  content: string
}

interface ArticleCard {
  slug: string
  title: string
  description: string
  category: string
  path: string
  isMd?: boolean
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
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/md-articles')
      .then(r => r.json())
      .then(setMdArticles)
      .catch(() => {})
  }, [])

  const allArticles: ArticleCard[] = useMemo(() => [
    ...articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      category: a.category,
      path: `/articles/${a.slug}`,
    })),
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
      path: `/articles/${a.slug}`,
      isMd: true as const,
    })),
  ], [mdArticles])

  const filtered = useMemo(() => allArticles.filter((article) => {
    const matchesSearch =
      !search ||
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || article.category === activeCategory
    return matchesSearch && matchesCategory
  }), [allArticles, search, activeCategory])

  const featuredArticles = useMemo(
    () => FEATURED_ARTICLE_SLUGS
      .map((slug) => allArticles.find((a) => a.slug === slug))
      .filter((a): a is ArticleCard => !!a),
    [allArticles]
  )

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

      {/* Featured Articles */}
      <div className="mb-12">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ FEATURED ARTICLES ]
        </h2>
        <div className="flex flex-wrap gap-3">
          {featuredArticles.map((article) => (
            <Link
              key={article.slug}
              to={article.path}
              className="rounded-lg border border-white/10 px-4 py-1.5 font-mono text-xs text-white/40 transition-all hover:border-white/20 hover:text-white/60"
            >
              {article.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-sm text-terminal-green/40">
            {'>'}
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search articles..."
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 pl-8 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-terminal-green/30"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-lg border px-4 py-1.5 font-mono text-xs transition-all ${
              !activeCategory
                ? 'border-terminal-green/30 bg-terminal-green/10 text-terminal-green'
                : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
            }`}
          >
            All ({allArticles.length})
          </button>
          {ARTICLE_CATEGORIES.map((cat) => {
            const count = allArticles.filter((a) => a.category === cat).length
            if (count === 0) return null
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`rounded-lg border px-4 py-1.5 font-mono text-xs transition-all ${
                  activeCategory === cat
                    ? 'border-terminal-green/30 bg-terminal-green/10 text-terminal-green'
                    : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Articles grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((article) => (
          <Link
            key={article.path}
            to={article.path}
            className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/10"
            data-testid={'isMd' in article && article.isMd ? `card-md-article-${article.slug}` : undefined}
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

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-mono text-sm text-white/30">
            No articles found. Try a different search.
          </p>
        </div>
      )}
    </div>
  )
}
