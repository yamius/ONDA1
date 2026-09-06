import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { glossaryTerms, glossaryLayer } from '../data/glossary'
import {
  CATEGORY_DESCRIPTIONS,
  FEATURED_TERM_SLUGS,
  GLOSSARY_CATEGORIES,
} from '../data/glossary-categories'
import { langFromPath, homePathFor } from '../i18n'
import { syncOgLocale } from '../utils/ogLocale'
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

export function GlossaryPage() {
  const { t } = useTranslation('glossary')
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  useEffect(() => {
    const title = t('meta.title')
    const desc = t('meta.description')
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:url', `${SITE_URL}${langPrefix}/glossary`, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)
    syncOgLocale(lang)
  }, [t, langPrefix])

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const tField = (slug: string, key: string, fallback: string): string =>
    t(`bodies.${slug}.${key}`, { defaultValue: fallback }) as string

  const filtered = glossaryTerms.filter((term) => {
    const tTitle = tField(term.slug, 'title', term.title)
    const tShort = tField(term.slug, 'shortDescription', term.shortDescription)
    const matchesSearch =
      !search ||
      tTitle.toLowerCase().includes(search.toLowerCase()) ||
      tShort.toLowerCase().includes(search.toLowerCase()) ||
      term.title.toLowerCase().includes(search.toLowerCase()) ||
      term.shortDescription.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || term.category === activeCategory
    return matchesSearch && matchesCategory
  })

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

      {/* Featured Terms */}
      <div className="mb-12">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('featuredHeader')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {FEATURED_TERM_SLUGS.map((slug) => {
            const term = glossaryTerms.find((t) => t.slug === slug)
            if (!term) return null
            return (
              <Link
                key={slug}
                to={`${langPrefix}/glossary/${slug}`}
                className="rounded-lg border border-white/10 px-4 py-1.5 font-mono text-xs text-white/40 transition-all hover:border-white/20 hover:text-white/60"
              >
                {tField(term.slug, 'title', term.title)}
              </Link>
            )
          })}
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
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 pl-8 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-terminal-green/30"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-10">
        <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-lg border px-4 py-1.5 font-mono text-xs transition-all ${
              !activeCategory
                ? 'border-terminal-green/30 bg-terminal-green/10 text-terminal-green'
                : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
            }`}
          >
            {t('allLabel')} ({glossaryTerms.length})
          </button>
          {GLOSSARY_CATEGORIES.map((cat) => {
            const count = glossaryTerms.filter((t) => t.category === cat).length
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
        {activeCategory && CATEGORY_DESCRIPTIONS[activeCategory] && (
          <p className="font-mono text-sm leading-relaxed text-white/40">
            {CATEGORY_DESCRIPTIONS[activeCategory]}
          </p>
        )}
      </div>

      {/* Terms grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((term) => (
          <Link
            key={term.slug}
            to={`${langPrefix}/glossary/${term.slug}`}
            className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/10"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/30">
                  {term.category}
                </span>
                {glossaryLayer(term.slug) === 'onda' && (
                  <span
                    className="rounded-md border border-amber-300/25 bg-amber-300/5 px-2 py-0.5 font-mono text-[10px] text-amber-300/80"
                    title="ONDA Life's own terminology, not an established scientific term"
                  >
                    ONDA
                  </span>
                )}
              </span>
              <span className="font-mono text-xs text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                →
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">
              {tField(term.slug, 'title', term.title)}
            </h3>
            <p className="font-mono text-xs leading-relaxed text-white/40">
              {tField(term.slug, 'shortDescription', term.shortDescription)}
            </p>
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
    </div>
  )
}
