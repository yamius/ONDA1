import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getTermBySlug } from '../data/glossary'
import { langFromPath } from '../i18n'

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
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => description && setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Link to={`${langPrefix}/glossary/${slug}`} className={className}>
        {label}
      </Link>
      {show && description && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-md -translate-x-1/2 rounded-lg border border-terminal-cyan/30 bg-black/95 px-3 py-2 font-mono text-xs leading-relaxed text-white/80 shadow-xl">
          {description}
        </div>
      )}
    </span>
  )
}
