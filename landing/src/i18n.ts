import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const SUPPORTED_LANGS = ['en', 'es', 'ru', 'uk', 'zh'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
  ru: 'RU',
  uk: 'UK',
  zh: 'ZH',
}

/** OpenGraph locale codes (BCP-47 with underscore). Used in og:locale meta tags. */
export const OG_LOCALES: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_ES',
  ru: 'ru_RU',
  uk: 'uk_UA',
  zh: 'zh_CN',
}

export const I18N_NAMESPACES = [
  'home', 'about', 'inner-spectrum', 'bio', 'bio-metric', 'level', 'part',
  'contact', 'sitemap', 'privacy', 'terms', 'glossary', 'articles', 'topics',
] as const

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    // Resources are loaded lazily via loadLocale() (client) or i18n-server.ts (SSR/prerender).
    resources: {},
    ns: I18N_NAMESPACES as unknown as string[],
    defaultNS: 'home',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initImmediate: false,
  })
}

/**
 * Lazy per-language locale loader. Fetches JSONs straight from the public
 * folder over HTTP/2 (the server already caches /locales/* with sensible
 * revalidation headers — see server.js Stage 5). Only the active language
 * is fetched on first paint; other languages download on language switch.
 *
 * SSR (entry-server.tsx via tsx) sidesteps this entirely by importing
 * `i18n-server.ts`, which statically pre-loads every language at build time.
 */
const loadingPromises = new Map<Lang, Promise<void>>()

export function loadLocale(lang: Lang): Promise<void> {
  if (loadingPromises.has(lang)) return loadingPromises.get(lang)!
  // Already-loaded check (SSR may have pre-populated resources).
  if (i18n.hasResourceBundle(lang, 'home')) {
    const resolved = Promise.resolve()
    loadingPromises.set(lang, resolved)
    return resolved
  }
  // No-op outside the browser (e.g. tsx scripts evaluating this module).
  if (typeof fetch !== 'function') {
    const resolved = Promise.resolve()
    loadingPromises.set(lang, resolved)
    return resolved
  }
  const p = Promise.all(
    (I18N_NAMESPACES as readonly string[]).map(async (ns) => {
      try {
        const res = await fetch(`/locales/${lang}/${ns}.json`)
        if (!res.ok) return
        const data = await res.json()
        i18n.addResourceBundle(lang, ns, data, true, true)
      } catch {
        // Network failures degrade to fallback language — never throw.
      }
    }),
  ).then(() => {})
  loadingPromises.set(lang, p)
  return p
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
  '/topics': 'topics',
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
 */
export function localizedPathFor(pathname: string, lang: Lang): string {
  const basePath = stripLangPrefix(pathname)

  const metricMatch = basePath.match(/^\/bio\/([^/]+)$/)
  if (metricMatch) {
    return lang === 'en' ? `/bio/${metricMatch[1]}` : `/${lang}/bio/${metricMatch[1]}`
  }

  const levelMatch = basePath.match(/^\/level\/(\d+)$/)
  if (levelMatch) {
    return lang === 'en' ? `/level/${levelMatch[1]}` : `/${lang}/level/${levelMatch[1]}`
  }

  const partMatch = basePath.match(/^\/part\/([^/]+)$/)
  if (partMatch) {
    return lang === 'en' ? `/part/${partMatch[1]}` : `/${lang}/part/${partMatch[1]}`
  }

  const articleMatch = basePath.match(/^\/articles\/([^/]+)$/)
  if (articleMatch) {
    return lang === 'en' ? `/articles/${articleMatch[1]}` : `/${lang}/articles/${articleMatch[1]}`
  }

  const glossaryMatch = basePath.match(/^\/glossary\/([^/]+)$/)
  if (glossaryMatch) {
    return lang === 'en' ? `/glossary/${glossaryMatch[1]}` : `/${lang}/glossary/${glossaryMatch[1]}`
  }

  const topicMatch = basePath.match(/^\/topics\/([^/]+)$/)
  if (topicMatch) {
    return lang === 'en' ? `/topics/${topicMatch[1]}` : `/${lang}/topics/${topicMatch[1]}`
  }

  const flatLocalized = ['/glossary', '/articles', '/contact', '/sitemap', '/privacy', '/terms']
  if (flatLocalized.includes(basePath)) {
    return lang === 'en' ? basePath : `/${lang}${basePath}`
  }

  if (LOCALIZED_BASE_PATHS.includes(basePath)) {
    if (lang === 'en') return basePath
    return basePath === '/' ? `/${lang}` : `/${lang}${basePath}`
  }

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

/** Build the localized URL for a part page. */
export function partPathFor(slug: string, lang: Lang): string {
  return lang === 'en' ? `/part/${slug}` : `/${lang}/part/${slug}`
}

/** All variants of /part/:slug — one per (slug, lang). */
export function partRouteVariants(slugs: string[]): string[] {
  const out: string[] = []
  for (const slug of slugs) {
    for (const lang of SUPPORTED_LANGS) {
      out.push(partPathFor(slug, lang))
    }
  }
  return out
}

/** Parse a part URL — returns { lang, slug } or null. */
export function parsePartRoute(route: string): { lang: Lang; slug: string } | null {
  const m = route.match(/^(?:\/(en|es|ru|uk|zh))?\/part\/([^/]+)$/)
  if (!m) return null
  const lang = (m[1] as Lang | undefined) ?? 'en'
  return { lang, slug: m[2] }
}

/** Build the localized URL for a topic detail page. */
export function topicPathFor(slug: string, lang: Lang): string {
  return lang === 'en' ? `/topics/${slug}` : `/${lang}/topics/${slug}`
}

/** All variants of /topics/:slug — one per (slug, lang). */
export function topicRouteVariants(slugs: string[]): string[] {
  const out: string[] = []
  for (const slug of slugs) {
    for (const lang of SUPPORTED_LANGS) {
      out.push(topicPathFor(slug, lang))
    }
  }
  return out
}

/** Parse a topic detail URL — returns { lang, slug } or null. */
export function parseTopicRoute(route: string): { lang: Lang; slug: string } | null {
  const m = route.match(/^(?:\/(en|es|ru|uk|zh))?\/topics\/([^/]+)$/)
  if (!m) return null
  const lang = (m[1] as Lang | undefined) ?? 'en'
  return { lang, slug: m[2] }
}

export default i18n
