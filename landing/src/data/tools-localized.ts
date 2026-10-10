/**
 * Localized card text for the /tools hub: the 11 calculators published in all
 * 12 languages reuse their own page copy (name = appName, blurb = meta
 * description). Other tools fall back to the English card from tools.ts.
 */
import type { Lang } from '../i18n'
import { hrvToolCopy } from './hrv-tool-i18n'
import { rhrToolCopy } from './rhr-tool-i18n'
import { alcToolCopy } from './alc-tool-i18n'
import { camToolCopy } from './cam-tool-i18n'
import { breathToolCopy } from './breath-tool-i18n'
import { bioToolCopy } from './bioage-tool-i18n'
import { resoToolCopy } from './reso-tool-i18n'
import { whmToolCopy } from './whm-tool-i18n'
import { sleepToolCopy } from './sleep-tool-i18n'
import { caffToolCopy } from './caff-tool-i18n'
import { chronoToolCopy } from './chrono-tool-i18n'
import emotonCard from './emoton-tool-card.json'

type Meta = { meta: { appName: string; description: string } }
const COPY: Record<string, (l: Lang) => Meta> = {
  hrv: hrvToolCopy,
  'resting-heart-rate': rhrToolCopy,
  alcohol: alcToolCopy,
  'camera-heart-rate': camToolCopy,
  breathing: breathToolCopy,
  'biological-age': bioToolCopy,
  'resonance-breathing': resoToolCopy,
  'wim-hof': whmToolCopy,
  'sleep-cycle': sleepToolCopy,
  caffeine: caffToolCopy,
  chronotype: chronoToolCopy,
}

/** Localized {name, blurb} for a tool card, or null when the tool is English-only. */
export function localizedToolCard(slug: string, lang: Lang): { name: string; blurb: string } | null {
  if (lang === 'en') return null
  if (slug === 'emoton') return (emotonCard as Record<string, { name: string; blurb: string }>)[lang] ?? null
  const get = COPY[slug]
  if (!get) return null
  const c = get(lang)
  return { name: c.meta.appName, blurb: c.meta.description }
}

export const LOCALIZED_TOOL_SLUGS: readonly string[] = [...Object.keys(COPY), 'emoton']
