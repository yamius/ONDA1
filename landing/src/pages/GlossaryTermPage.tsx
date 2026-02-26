import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import { getTermBySlug, glossaryTerms } from '../data/glossary'
import { injectGlossaryLinks } from '../utils/glossaryLinks'

const SITE_URL = 'https://ondalife.replit.app'
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

export function GlossaryTermPage() {
  const { slug } = useParams<{ slug: string }>()
  const term = slug ? getTermBySlug(slug) : undefined

  useEffect(() => {
    if (!term) return
    const title = `${term.title} | ONDA Life Glossary`
    const url = `${SITE_URL}/glossary/${term.slug}`
    document.title = title
    setMeta('description', term.shortDescription)
    setMeta('og:title', title, true)
    setMeta('og:description', term.shortDescription, true)
    setMeta('og:url', url, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('og:type', 'article', true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', term.shortDescription, true)
    setMeta('twitter:image', OG_IMAGE, true)
    return () => {
      document.title = 'ONDA Life — Biohacking App & Systematic Consciousness OS'
      setMeta('description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.')
      setMeta('og:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('og:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('og:type', 'website', true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('twitter:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
  }, [term])

  if (!term) {
    return <Navigate to="/glossary" replace />
  }

  const relatedTerms = term.relatedSlugs
    ? term.relatedSlugs
        .map((s) => glossaryTerms.find((t) => t.slug === s))
        .filter((t): t is NonNullable<typeof t> => t != null)
        .slice(0, 5)
    : glossaryTerms
        .filter((t) => t.slug !== term.slug && t.category === term.category)
        .slice(0, 5)

  return (
    <div className="mx-auto max-w-3xl px-4 pt-20 pb-16 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">
          Home
        </Link>
        <span>/</span>
        <Link to="/glossary" className="transition-colors hover:text-white/50">
          Glossary
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{term.title}</span>
      </nav>

      {/* Category badge */}
      <div className="mb-4">
        <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-3 py-1 font-mono text-[10px] tracking-wider text-terminal-green">
          {term.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {term.title}
      </h1>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/50">
        {term.shortDescription}
      </p>

      {/* Markdown content */}
      <article className="prose-onda">
        <Markdown
          components={{
            h2: ({ children }) => (
              <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-3 mt-8 text-lg font-semibold text-white/90">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 font-mono text-sm leading-relaxed text-white/50">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 space-y-2 pl-4">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 space-y-2 pl-4 list-decimal">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="font-mono text-sm leading-relaxed text-white/50">
                <span className="text-terminal-green/40 mr-1">•</span>
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-white/80">{children}</strong>
            ),
            table: ({ children }) => (
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b border-white/10">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 text-left font-semibold text-white/60">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-t border-white/5 px-3 py-2 text-white/40">
                {children}
              </td>
            ),
            code: ({ children }) => (
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-terminal-green">
                {children}
              </code>
            ),
            a: ({ href, children }) => {
              const isExternal = href?.startsWith('http')
              const className =
                'text-terminal-cyan underline decoration-terminal-cyan/30 underline-offset-2 transition-colors hover:text-terminal-cyan/80 hover:decoration-terminal-cyan/50'
              if (href && !isExternal && href.startsWith('/')) {
                return (
                  <Link to={href} className={className}>
                    {children}
                  </Link>
                )
              }
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={className}
                >
                  {children}
                </a>
              )
            },
          }}
        >
          {injectGlossaryLinks(term.content, term.slug)}
        </Markdown>
      </article>

      {/* Related terms */}
      {relatedTerms.length > 0 && (
        <div className="mt-16 border-t border-white/5 pt-10">
          <h3 className="mb-6 font-mono text-xs tracking-widest text-white/30">
            RELATED TERMS
          </h3>
          <div className="grid gap-3">
            {relatedTerms.map((related) => (
              <Link
                key={related.slug}
                to={`/glossary/${related.slug}`}
                className="glass-card group flex items-center justify-between rounded-lg p-4 transition-all hover:border-terminal-green/10"
              >
                <div>
                  <h4 className="font-semibold transition-colors group-hover:text-terminal-green">
                    {related.title}
                  </h4>
                  <p className="mt-1 font-mono text-xs text-white/30">
                    {related.shortDescription.slice(0, 80)}...
                  </p>
                </div>
                <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to glossary */}
      <div className="mt-12">
        <Link
          to="/glossary"
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← Back to Glossary
        </Link>
      </div>
    </div>
  )
}
