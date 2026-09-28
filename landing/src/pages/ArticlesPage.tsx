import { useEffect, useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/articles'
import { ARTICLE_TOPIC_HUBS } from '../data/article-topics'
import { hubAvailable, localizedArticlesForTopic, unhubbedLocalizedArticles } from '../data/article-topic-listing'
import { LOCALIZED_COVERAGE } from '../data/localized-coverage.generated'
import { libraryCopy, articlesCount } from '../data/library-i18n'
import { OptimizedImage } from '../components/OptimizedImage'
import { API_ENABLED } from '../config/features'
import { langFromPath, homePathFor, langHref } from '../i18n'
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

// Sections that exist only in some languages — link to EN elsewhere (no /<lang> 404s).
const SECTION_LANGS: Record<string, readonly string[]> = {
  '/measurements': ['es', 'ru'],
  '/research': [],
  '/topics': ['es', 'ru'],
  '/reviews': ['es', 'ru', 'uk'],
  '/glossary': ['es'],
}
function sectionHref(path: string, lang: ReturnType<typeof langFromPath>): string {
  return lang === 'en' || !SECTION_LANGS[path]?.includes(lang) ? path : `/${lang}${path}`
}

export function ArticlesPage() {
  const { t } = useTranslation('articles')
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const [mdArticles, setMdArticles] = useState<MdArticle[]>([])
  // Seed the filter from ?q= so the SearchAction target (/articles?q=...) and
  // any shared search URLs land on a pre-filtered list.
  const [search, setSearch] = useState(
    () => new URLSearchParams(location.search).get('q') ?? '',
  )
  // activeCategory remains as harmless state for now (read by matchesCategory
  // below) — kept null. Category chips were replaced by topic-hub links.
  const [activeCategory] = useState<string | null>(null)

  useEffect(() => {
    // Legacy Telegram-authored md articles come from the server API, which
    // doesn't exist on static hosting — skip the fetch (list stays the static
    // articles only). Re-enables with VITE_API_ENABLED=1 + the function.
    if (!API_ENABLED) return
    fetch('/api/md-articles')
      .then(r => r.json())
      .then(setMdArticles)
      .catch(() => {})
  }, [])

  const allArticles: ArticleCard[] = useMemo(() => [
    ...articles.filter((a) => lang === 'en' || LOCALIZED_COVERAGE[lang]?.articles.has(a.slug)).map((a) => ({
      slug: a.slug,
      title: t(`bodies.${a.slug}.title`, { defaultValue: a.title }) as string,
      description: t(`bodies.${a.slug}.description`, { defaultValue: a.description }) as string,
      category: a.category,
      path: langHref(`/articles/${a.slug}`, lang),
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
      path: langHref(`/articles/${a.slug}`, lang),
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

  const renderGrid = (items: ArticleCard[]) => (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((article) => (
        <Link
          key={article.path}
          to={article.path}
          className="glass-card group rounded-xl overflow-hidden transition-all hover:border-terminal-green/10"
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
            <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">
              {article.title}
            </h3>
            <p className="font-mono text-xs leading-relaxed text-white/40">{article.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )

  // ── ONDA Library — topic tiles → /<lang>/articles/topic/<topic> hubs ──────
  // Every language uses the same layout. A localized page shows only hubs with
  // enough translated articles (hubAvailable); translated articles from thinner
  // topics are listed below the tiles. A search query swaps the tiles for results.
  const copy = libraryCopy(lang)
  const ui = copy.ui
  const searching = search.trim().length > 0
  const hubs = ARTICLE_TOPIC_HUBS.filter((h) => hubAvailable(h.slug, lang))
  const extra = unhubbedLocalizedArticles(lang)
  const card = (a: (typeof articles)[number]): ArticleCard => ({
    slug: a.slug,
    title: t(`bodies.${a.slug}.title`, { defaultValue: a.title }) as string,
    description: t(`bodies.${a.slug}.description`, { defaultValue: a.description }) as string,
    category: a.category,
    path: langHref(`/articles/${a.slug}`, lang),
    image: a.image,
  })
  const [aboutBefore, aboutMid, aboutAfter] = ui.aboutP2.split(/\{measurements\}|\{research\}/)
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="transition-colors hover:text-white/50">{ui.home}</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{ui.library}</span>
      </nav>
      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">{ui.badge}</div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">{ui.h1}</h1>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-white/60">{ui.subtitle}</p>

      <div className="mb-10">
        <div className="relative">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-sm text-terminal-green/40">{'>'}</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 pl-8 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-terminal-green/30"
          />
        </div>
      </div>

      {searching ? (
        <section aria-label="Search results">
          {renderGrid(filtered)}
          {filtered.length === 0 && (
            <p className="py-20 text-center font-mono text-sm text-white/30">{t('noResults')}</p>
          )}
        </section>
      ) : (
        <>
          <section aria-label="Topics">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hubs.map((hub) => {
                const hc = copy.hubs[hub.slug]
                const cover = articles.find((a) => a.slug === hub.startHere)
                const count = localizedArticlesForTopic(hub.slug, lang).length
                const img = hub.image ?? cover?.image
                return (
                  <Link
                    key={hub.slug}
                    to={langHref(`/articles/topic/${hub.slug}`, lang)}
                    className="glass-card group flex flex-col overflow-hidden rounded-xl transition-all hover:border-terminal-green/20"
                  >
                    {img && (
                      <div className="aspect-video w-full overflow-hidden border-b border-white/5">
                        <OptimizedImage
                          src={img}
                          alt={hc?.imageAlt || hc?.name || hub.name}
                          loading="lazy"
                          width={640}
                          height={360}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">
                        {hc?.name ?? hub.name}
                      </h2>
                      <p className="mb-4 flex-1 font-mono text-xs leading-relaxed text-white/45">{hc?.tile ?? hub.tile}</p>
                      <span className="font-mono text-[11px] tracking-wider text-terminal-green/60">
                        {articlesCount(copy, lang, count)} →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {extra.length > 0 && (
            <section className="mt-14" aria-labelledby="more-guides">
              <h2 id="more-guides" className="mb-5 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">
                {ui.moreGuides} ({extra.length})
              </h2>
              {renderGrid(extra.map(card))}
            </section>
          )}
        </>
      )}

      <nav className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-6" aria-label="More">
        {lang !== 'en' && (
          <Link to="/articles" hrefLang="en" className="rounded-lg border border-white/10 px-4 py-1.5 font-mono text-xs text-white/50 transition-all hover:border-white/20 hover:text-white/70">
            {ui.englishLibrary}
          </Link>
        )}
        <Link to={sectionHref('/reviews', lang)} className="rounded-lg border border-white/10 px-4 py-1.5 font-mono text-xs text-white/50 transition-all hover:border-white/20 hover:text-white/70">
          {ui.reviews}
        </Link>
        <Link to={sectionHref('/glossary', lang)} className="rounded-lg border border-white/10 px-4 py-1.5 font-mono text-xs text-white/50 transition-all hover:border-white/20 hover:text-white/70">
          {ui.glossary}
        </Link>
        <Link to={sectionHref('/topics', lang)} className="rounded-lg border border-white/10 px-4 py-1.5 font-mono text-xs text-white/35 transition-all hover:border-white/20 hover:text-white/60">
          {ui.topicClusters}
        </Link>
      </nav>

      <section className="mt-14 border-t border-white/10 pt-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{ui.aboutH2}</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/60">
          <p>{ui.aboutP1}</p>
          <p>
            {aboutBefore}
            <Link to={sectionHref('/measurements', lang)} className="text-terminal-green hover:underline">{ui.measurementsLink}</Link>
            {aboutMid}
            <Link to={sectionHref('/research', lang)} className="text-terminal-green hover:underline">{ui.researchLink}</Link>
            {aboutAfter}
          </p>
        </div>
      </section>
    </div>
  )
}
