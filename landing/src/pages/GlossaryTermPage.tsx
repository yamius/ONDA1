import { useParams, Link, Navigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import { getTermBySlug, glossaryTerms } from '../data/glossary'

export function GlossaryTermPage() {
  const { slug } = useParams<{ slug: string }>()
  const term = slug ? getTermBySlug(slug) : undefined

  if (!term) {
    return <Navigate to="/glossary" replace />
  }

  const relatedTerms = glossaryTerms
    .filter((t) => t.slug !== term.slug && t.category === term.category)
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-3xl px-4 pt-20 pb-16 md:px-6">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30">
        <Link to="/" className="transition-colors hover:text-white/50">
          home
        </Link>
        <span>/</span>
        <Link to="/glossary" className="transition-colors hover:text-white/50">
          glossary
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60">{term.slug}</span>
      </div>

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
          }}
        >
          {term.content}
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
