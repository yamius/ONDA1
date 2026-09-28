/**
 * "Also in: Español · Русский · …" — plain crawlable links to the other language
 * versions of the current page (only those that are actually built, via langHref).
 * Gives localized pages real body inbound links — without it a translation that has
 * no localized hub/category page links to it is reachable only via hreflang
 * (roadmap 8.8: orphans).
 */
import { Link, useLocation } from 'react-router-dom'
import { SUPPORTED_LANGS, langFromPath, langHref, stripLangPrefix, type Lang } from '../i18n'

const NATIVE: Record<Lang, string> = {
  en: 'English', es: 'Español', ru: 'Русский', uk: 'Українська', zh: '中文', de: 'Deutsch',
  fr: 'Français', it: 'Italiano', nl: 'Nederlands', ja: '日本語', pl: 'Polski', pt: 'Português',
}

export function OtherLanguages({ className = '' }: { className?: string }) {
  const { pathname } = useLocation()
  const current = langFromPath(pathname)
  const base = stripLangPrefix(pathname)
  const others = SUPPORTED_LANGS.filter((l) => l !== current).filter((l) => l === 'en' || langHref(base, l) !== base)
  if (others.length === 0) return null
  return (
    <nav aria-label="Other languages" className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-white/35 ${className}`}>
      <span aria-hidden>🌐</span>
      {others.map((l) => (
        <Link key={l} to={l === 'en' ? base : langHref(base, l)} hrefLang={l} lang={l} className="transition-colors hover:text-terminal-green">
          {NATIVE[l]}
        </Link>
      ))}
    </nav>
  )
}
