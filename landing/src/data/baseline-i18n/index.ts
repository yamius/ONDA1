/**
 * Baseline tool copy in all 12 site languages (en.json is the source). Same FIREWALL as
 * src/lib/baseline-copy.ts: every string shows or records, none judges the body.
 */
import type { Lang } from '../../i18n'
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

export type BaselineCopy = typeof en & { nights: Record<string, string> }

const ALL = { en, es, ru, uk, zh, de, fr, it, nl, ja, pl, pt } as unknown as Record<Lang, BaselineCopy>

export function baselineCopy(lang: Lang): BaselineCopy {
  return ALL[lang] ?? (en as BaselineCopy)
}

/** "{n} nights" in the right plural form for the language (CLDR categories). */
export function nightsIn(copy: BaselineCopy, lang: Lang, n: number): string {
  const cat = new Intl.PluralRules(lang).select(n)
  const tpl = copy.nights[cat] ?? copy.nights.other ?? copy.nights.one
  return tpl.replace('{n}', String(n))
}

export function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_m, k: string) => String(vars[k] ?? ''))
}
