/**
 * "The science behind this topic" — links from an article to ONDA Science pages
 * (map: src/data/science-crosslinks.ts; titles: src/generated/science-link-titles.ts).
 * Rendered server-side with the article, so the links are in the static HTML.
 * A page's localized title + /<lang>/ link is used only when that translation is published;
 * otherwise the EN page and title.
 */
import { Link } from 'react-router-dom'
import { langHref, type Lang } from '../i18n'
import { ARTICLE_SCIENCE_LINKS, GLOSSARY_SCIENCE_LINKS } from '../data/science-crosslinks'
import { SCIENCE_LINK_TITLES } from '../generated/science-link-titles'

const HEADING: Record<string, string> = {
  en: 'THE SCIENCE BEHIND THIS TOPIC',
  ru: 'НАУЧНАЯ ОСНОВА ТЕМЫ',
  uk: 'НАУКОВА ОСНОВА ТЕМИ',
  es: 'LA CIENCIA DETRÁS DE ESTE TEMA',
  de: 'DIE WISSENSCHAFT HINTER DIESEM THEMA',
  fr: 'LA SCIENCE DERRIÈRE CE SUJET',
  it: 'LA SCIENZA DIETRO QUESTO TEMA',
  pt: 'A CIÊNCIA POR TRÁS DESTE TEMA',
  nl: 'DE WETENSCHAP ACHTER DIT ONDERWERP',
  pl: 'NAUKA STOJĄCA ZA TYM TEMATEM',
  ja: 'このテーマの科学的根拠',
  zh: '这个主题背后的科学',
}

export function ArticleScienceLinks({ slug, lang }: { slug: string; lang: Lang }) {
  return <ScienceLinksBlock keys={ARTICLE_SCIENCE_LINKS[slug]} lang={lang} />
}

export function GlossaryScienceLinks({ slug, lang }: { slug: string; lang: Lang }) {
  return <ScienceLinksBlock keys={GLOSSARY_SCIENCE_LINKS[slug]} lang={lang} />
}

function ScienceLinksBlock({ keys, lang }: { keys: readonly string[] | undefined; lang: Lang }) {
  if (!keys?.length) return null
  const items = keys
    .map((k) => {
      const t = SCIENCE_LINK_TITLES[k]
      if (!t) return null
      const local = t[lang]
      return { key: k, label: local ?? t.en, href: local ? langHref(`/science/${k}`, lang) : `/science/${k}` }
    })
    .filter((x): x is { key: string; label: string; href: string } => !!x && !!x.label)
  if (!items.length) return null
  return (
    <div className="mt-16 border-t border-white/5 pt-10">
      <h3 className="mb-6 font-mono text-xs tracking-widest text-white/30">{HEADING[lang] ?? HEADING.en}</h3>
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((it) => (
          <li key={it.key}>
            <Link
              to={it.href}
              className="glass-card block rounded-xl p-4 text-sm font-semibold text-white/80 transition-colors hover:text-terminal-green"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
