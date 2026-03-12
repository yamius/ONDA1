/**
 * Footer sitemap link — links to the dedicated /sitemap page.
 */
import { Link } from 'react-router-dom'

export function FooterSitemap() {
  return (
    <div className="mt-8 flex justify-center">
      <Link
        to="/sitemap"
        className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 border-b border-dotted border-white/10 pb-0.5"
      >
        Site map
      </Link>
    </div>
  )
}
