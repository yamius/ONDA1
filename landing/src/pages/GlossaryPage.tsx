import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { glossaryTerms } from '../data/glossary'
import {
  CATEGORY_DESCRIPTIONS,
  FEATURED_TERM_SLUGS,
  GLOSSARY_CATEGORIES,
} from '../data/glossary-categories'

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

const GLOSSARY_TITLE = 'Biohacking & Neuroscience Glossary | ONDA Life Knowledge Base'
const GLOSSARY_DESC =
  'Explore 100+ key terms in molecular psychology, neurophysiology, and consciousness architecture. Your comprehensive guide to the ONDA Life system.'

export function GlossaryPage() {
  useEffect(() => {
    document.title = GLOSSARY_TITLE
    setMeta('description', GLOSSARY_DESC)
    setMeta('og:title', GLOSSARY_TITLE, true)
    setMeta('og:description', GLOSSARY_DESC, true)
    setMeta('og:url', `${SITE_URL}/glossary`, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', GLOSSARY_TITLE, true)
    setMeta('twitter:description', GLOSSARY_DESC, true)
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

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = glossaryTerms.filter((term) => {
    const matchesSearch =
      !search ||
      term.title.toLowerCase().includes(search.toLowerCase()) ||
      term.shortDescription.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || term.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="mx-auto max-w-5xl px-4 pt-20 pb-16 md:px-6">
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">
          Home
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          Glossary
        </span>
      </nav>
      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ KNOWLEDGE BASE ]
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">
        Glossary
      </h1>
      <p className="mb-12 max-w-2xl font-mono text-sm text-white/40">
        Key concepts, terms, and scientific foundations behind the ONDA Life system.
        From molecular psychology to consciousness architecture.
      </p>

      {/* Featured Terms */}
      <div className="mb-12">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ FEATURED TERMS ]
        </h2>
        <div className="flex flex-wrap gap-3">
          {FEATURED_TERM_SLUGS.map((slug) => {
            const term = glossaryTerms.find((t) => t.slug === slug)
            if (!term) return null
            return (
              <Link
                key={slug}
                to={`/glossary/${slug}`}
                className="rounded-lg border border-white/10 px-4 py-1.5 font-mono text-xs text-white/40 transition-all hover:border-white/20 hover:text-white/60"
              >
                {term.title}
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
            placeholder="search terms..."
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
            All ({glossaryTerms.length})
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
            to={`/glossary/${term.slug}`}
            className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/10"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/30">
                {term.category}
              </span>
              <span className="font-mono text-xs text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                →
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">
              {term.title}
            </h3>
            <p className="font-mono text-xs leading-relaxed text-white/40">
              {term.shortDescription}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-mono text-sm text-white/30">
            No terms found. Try a different search.
          </p>
        </div>
      )}
    </div>
  )
}
