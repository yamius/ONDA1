/**
 * Wim Hof breathing timer (/tools/wim-hof) copy in all 12 site languages. One JSON per
 * language with identical keys (en.json is the source). Used by the page, the
 * embed widget and meta-inject (title, FAQPage + WebApplication JSON-LD), so
 * the rendered text and the structured data never drift apart.
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

export type WhmToolCopy = typeof en

export const WHM_TOOL_I18N: Record<Lang, WhmToolCopy> = { en, es, ru, uk, zh, de, fr, it, nl, ja, pl, pt }

/** Base path of the calculator; published in every language. */
export const WHM_TOOL_PATH = '/tools/wim-hof'

export function whmToolCopy(lang: Lang): WhmToolCopy {
  return WHM_TOOL_I18N[lang] ?? en
}

export { fill } from '../hrv-tool-i18n'
