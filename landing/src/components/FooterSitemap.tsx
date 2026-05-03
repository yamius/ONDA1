/**
 * Footer sitemap link — links to the dedicated /sitemap page.
 */
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'

export function FooterSitemap() {
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  return (
    <div className="mt-8 flex justify-center">
      <Link
        to={`${langPrefix}/sitemap`}
        className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 border-b border-dotted border-white/10 pb-0.5"
      >
        Site map
      </Link>
    </div>
  )
}
