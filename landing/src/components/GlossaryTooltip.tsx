import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getTermBySlug } from '../data/glossary'

interface GlossaryTooltipProps {
  label: string
  slug: string
  className?: string
}

/**
 * Link to glossary term with hover tooltip showing shortDescription.
 * Improves engagement and SEO behavioral factors.
 */
export function GlossaryTooltip({ label, slug, className }: GlossaryTooltipProps) {
  const [show, setShow] = useState(false)
  const term = getTermBySlug(slug)
  const description = term?.shortDescription ?? null

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => description && setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Link to={`/glossary/${slug}`} className={className}>
        {label}
      </Link>
      {show && description && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 max-w-xs -translate-x-1/2 rounded-lg border border-terminal-cyan/30 bg-black/95 px-3 py-2 font-mono text-xs leading-relaxed text-white/80 shadow-xl">
          {description}
        </div>
      )}
    </span>
  )
}
