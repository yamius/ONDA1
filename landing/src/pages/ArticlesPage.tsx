import { useEffect, useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/articles'
import { FEATURED_ARTICLE_SLUGS, ARTICLE_CATEGORIES } from '../data/articles-categories'
import { OptimizedImage } from '../components/OptimizedImage'
import { langFromPath, homePathFor } from '../i18n'
import { syncOgLocale } from '../utils/ogLocale'
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
  image?: string
  isMd?: boolean
}

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

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

export function ArticlesPage() {
  const { t } = useTranslation('articles')
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
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
      title: t(`bodies.${a.slug}.title`, { defaultValue: a.title }) as string,
      description: t(`bodies.${a.slug}.description`, { defaultValue: a.description }) as string,
      category: a.category,
      path: `${langPrefix}/articles/${a.slug}`,
      image: a.image,
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
      path: `${langPrefix}/articles/${a.slug}`,
      isMd: true as const,
    })),
  ], [mdArticles, langPrefix, t])

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
    const title = t('meta.title')
    const desc = t('meta.description')
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:url', `${SITE_URL}${langPrefix}/articles`, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)
    syncOgLocale(lang)
  }, [t, langPrefix])

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="transition-colors hover:text-white/50">
          {t('breadcrumb.home')}
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          {t('breadcrumb.current')}
        </span>
      </nav>
      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        {t('badge')}
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">
        {t('h1')}
      </h1>
      <p className="mb-12 max-w-2xl font-mono text-sm text-white/40">
        {t('subtitle')}
      </p>

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
            placeholder={t('searchPlaceholder')}
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
            {t('allLabel')} ({allArticles.length})
          </button>
          {ARTICLE_CATEGORIES.map((cat) => {
            const count = allArticles.filter((a) => a.category === cat).length
            if (count === 0) return null
            const label = t(`categories.${cat}`, { defaultValue: cat }) as string
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
                {label} ({count})
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
            className="glass-card group rounded-xl overflow-hidden transition-all hover:border-terminal-green/10"
            data-testid={'isMd' in article && article.isMd ? `card-md-article-${article.slug}` : undefined}
          >
            {article.image && (
              <div className="aspect-video w-full overflow-hidden border-b border-white/5">
                <OptimizedImage
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/30">
                  {t(`categories.${article.category}`, { defaultValue: article.category }) as string}
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
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-mono text-sm text-white/30">
            {t('noResults')}
          </p>
        </div>
      )}

      {/* Featured Articles */}
      <div className="mt-16">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('featuredHeader')}
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
    </div>
  )
}
