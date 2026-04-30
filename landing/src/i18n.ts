import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../public/locales/en/home.json'
import es from '../public/locales/es/home.json'
import ru from '../public/locales/ru/home.json'
import uk from '../public/locales/uk/home.json'
import zh from '../public/locales/zh/home.json'
import enAbout from '../public/locales/en/about.json'
import esAbout from '../public/locales/es/about.json'
import ruAbout from '../public/locales/ru/about.json'
import ukAbout from '../public/locales/uk/about.json'
import zhAbout from '../public/locales/zh/about.json'
import enIs from '../public/locales/en/inner-spectrum.json'
import esIs from '../public/locales/es/inner-spectrum.json'
import ruIs from '../public/locales/ru/inner-spectrum.json'
import ukIs from '../public/locales/uk/inner-spectrum.json'
import zhIs from '../public/locales/zh/inner-spectrum.json'
import enBio from '../public/locales/en/bio.json'
import esBio from '../public/locales/es/bio.json'
import ruBio from '../public/locales/ru/bio.json'
import ukBio from '../public/locales/uk/bio.json'
import zhBio from '../public/locales/zh/bio.json'
import enBioMetric from '../public/locales/en/bio-metric.json'
import esBioMetric from '../public/locales/es/bio-metric.json'
import ruBioMetric from '../public/locales/ru/bio-metric.json'
import ukBioMetric from '../public/locales/uk/bio-metric.json'
import zhBioMetric from '../public/locales/zh/bio-metric.json'
import enLevel from '../public/locales/en/level.json'
import esLevel from '../public/locales/es/level.json'
import ruLevel from '../public/locales/ru/level.json'
import ukLevel from '../public/locales/uk/level.json'
import zhLevel from '../public/locales/zh/level.json'

export const SUPPORTED_LANGS = ['en', 'es', 'ru', 'uk', 'zh'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
  ru: 'RU',
  uk: 'UK',
  zh: 'ZH',
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    resources: {
      en: { home: en, about: enAbout, 'inner-spectrum': enIs, bio: enBio, 'bio-metric': enBioMetric, level: enLevel },
      es: { home: es, about: esAbout, 'inner-spectrum': esIs, bio: esBio, 'bio-metric': esBioMetric, level: esLevel },
      ru: { home: ru, about: ruAbout, 'inner-spectrum': ruIs, bio: ruBio, 'bio-metric': ruBioMetric, level: ruLevel },
      uk: { home: uk, about: ukAbout, 'inner-spectrum': ukIs, bio: ukBio, 'bio-metric': ukBioMetric, level: ukLevel },
      zh: { home: zh, about: zhAbout, 'inner-spectrum': zhIs, bio: zhBio, 'bio-metric': zhBioMetric, level: zhLevel },
    },
    ns: ['home', 'about', 'inner-spectrum', 'bio', 'bio-metric', 'level'],
    defaultNS: 'home',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initImmediate: false,
  })
}

export function isLang(s: string | undefined | null): s is Lang {
  return !!s && (SUPPORTED_LANGS as readonly string[]).includes(s)
}

/** Extract language from a path like /ru, /ru/about, / → 'en'. */
export function langFromPath(pathname: string): Lang {
  const seg = pathname.split('/').filter(Boolean)[0]
  return isLang(seg) ? seg : 'en'
}

/** Build the URL for the home page in a given language. EN is the bare root. */
export function homePathFor(lang: Lang): string {
  return lang === 'en' ? '/' : `/${lang}`
}

/**
 * Pages that exist in every language. Keys are EN base paths, values are i18n
 * namespaces. Add a new entry here + matching JSON files + meta override in
 * prerender.ts to localize another page.
 */
export const LOCALIZED_PAGES: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/bio': 'bio',
  '/inner-spectrum': 'inner-spectrum',
}

const LOCALIZED_BASE_PATHS = Object.keys(LOCALIZED_PAGES)

/**
 * Strip a leading language segment (/ru, /es...) from a path. Returns the EN
 * base path. e.g. "/ru/about" → "/about", "/ru" → "/", "/articles" → "/articles".
 */
export function stripLangPrefix(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length > 0 && isLang(parts[0])) {
    const rest = '/' + parts.slice(1).join('/')
    return rest === '/' ? '/' : rest
  }
  return pathname
}

/**
 * Given the current pathname and a target language, return the URL the language
 * switcher should navigate to.
 *
 * - Pages localized into all 5 languages (home, about, bio, inner-spectrum):
 *   navigate to the localized variant.
 * - Metric detail routes (/bio/:metric): also localized → /:lang/bio/:metric.
 * - Pages still EN-only (Articles, Glossary, Contact, /part/, /level/, …):
 *   stay on the same URL rather than dumping the user to the home page. The
 *   page itself renders the only translation it has (EN), but the user keeps
 *   their context.
 */
export function localizedPathFor(pathname: string, lang: Lang): string {
  const basePath = stripLangPrefix(pathname)

  // Metric detail page: preserve the metric slug across language switches.
  const metricMatch = basePath.match(/^\/bio\/([^/]+)$/)
  if (metricMatch) {
    return lang === 'en' ? `/bio/${metricMatch[1]}` : `/${lang}/bio/${metricMatch[1]}`
  }

  // Level detail page: preserve level number across language switches.
  const levelMatch = basePath.match(/^\/level\/(\d+)$/)
  if (levelMatch) {
    return lang === 'en' ? `/level/${levelMatch[1]}` : `/${lang}/level/${levelMatch[1]}`
  }

  if (LOCALIZED_BASE_PATHS.includes(basePath)) {
    if (lang === 'en') return basePath
    return basePath === '/' ? `/${lang}` : `/${lang}${basePath}`
  }

  // Non-localized page (Articles, Glossary, etc) — keep the user on the same
  // URL. The base path is already EN-only since these pages have no /:lang/
  // variants registered.
  return basePath
}

/** All prerender route variants for localized pages: 4 base paths × 5 langs = 20. */
export function localizedRouteVariants(): string[] {
  const out: string[] = []
  for (const base of LOCALIZED_BASE_PATHS) {
    for (const lang of SUPPORTED_LANGS) {
      out.push(localizedPathFor(base, lang))
    }
  }
  return out
}

/** Build the localized URL for a metric detail page. */
export function metricPathFor(metricKey: string, lang: Lang): string {
  return lang === 'en' ? `/bio/${metricKey}` : `/${lang}/bio/${metricKey}`
}

/** All variants of /bio/:metric — one per (metric, lang). */
export function metricRouteVariants(metricKeys: string[]): string[] {
  const out: string[] = []
  for (const key of metricKeys) {
    for (const lang of SUPPORTED_LANGS) {
      out.push(metricPathFor(key, lang))
    }
  }
  return out
}

/** Parse a metric URL — returns { lang, metric } or null. */
export function parseMetricRoute(route: string): { lang: Lang; metric: string } | null {
  const m = route.match(/^(?:\/(en|es|ru|uk|zh))?\/bio\/([^/]+)$/)
  if (!m) return null
  const lang = (m[1] as Lang | undefined) ?? 'en'
  return { lang, metric: m[2] }
}

/** Build the localized URL for a level page. */
export function levelPathFor(levelNum: number, lang: Lang): string {
  return lang === 'en' ? `/level/${levelNum}` : `/${lang}/level/${levelNum}`
}

/** All variants of /level/:n — one per (level, lang). */
export function levelRouteVariants(levelNumbers: number[]): string[] {
  const out: string[] = []
  for (const n of levelNumbers) {
    for (const lang of SUPPORTED_LANGS) {
      out.push(levelPathFor(n, lang))
    }
  }
  return out
}

/** Parse a level URL — returns { lang, levelNum } or null. */
export function parseLevelRoute(route: string): { lang: Lang; levelNum: number } | null {
  const m = route.match(/^(?:\/(en|es|ru|uk|zh))?\/level\/(\d+)$/)
  if (!m) return null
  const lang = (m[1] as Lang | undefined) ?? 'en'
  return { lang, levelNum: parseInt(m[2], 10) }
}

export default i18n
