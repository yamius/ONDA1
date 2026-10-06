/**
 * ONDA Library (/articles + /articles/topic/<t>) copy in all 12 site languages.
 * en.json is the source (hub name/tile/intro mirror ARTICLE_TOPIC_HUBS).
 */
import type { Lang } from '../../i18n'
import type { WorldCountry } from '../article-topics'
import en from './en.json'
import es from './es.json'
import ru from './ru.json'
import uk from './uk.json'
import zh from './zh.json'
import de from './de.json'
import fr from './fr.json'
import it from './it.json'
import nl from './nl.json'
import ja from './ja.json'
import pl from './pl.json'
import pt from './pt.json'

export interface HubCopy {
  name: string
  tile: string
  intro: string
  imageAlt: string
}
export type LibraryCopy = {
  ui: typeof en.ui & { articlesFew?: string; articlesMany?: string }
  countries: Record<WorldCountry, string>
  hubs: Record<string, HubCopy>
  /** "The science behind this topic" links per hub slug (bare /science/... paths). */
  science?: Record<string, { href: string; label: string }[]>
}

const ALL = { en, es, ru, uk, zh, de, fr, it, nl, ja, pl, pt } as unknown as Record<Lang, LibraryCopy>

export function libraryCopy(lang: Lang): LibraryCopy {
  return ALL[lang] ?? (en as unknown as LibraryCopy)
}

export function fillLib(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_m, k: string) => String(vars[k] ?? ''))
}

/** "{n} articles" in the right plural form (CLDR categories). */
export function articlesCount(copy: LibraryCopy, lang: Lang, n: number): string {
  const cat = new Intl.PluralRules(lang).select(n)
  const ui = copy.ui
  const t =
    cat === 'one' ? ui.articlesOne : cat === 'few' ? ui.articlesFew ?? ui.articlesOther : cat === 'many' ? ui.articlesMany ?? ui.articlesOther : ui.articlesOther
  return fillLib(t, { n })
}
