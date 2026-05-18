import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// Only the 'home' namespace is statically imported — it is the one namespace
// the eager entry chunk needs (Layout nav + the homepage). Every other
// namespace (about, bio, level, part, glossary, articles, reviews, …) is left
// out of the bundle and loaded on demand via ensureNamespace() below, gated
// through the lazy route factory in main.tsx. The SSR/prerender path registers
// all of them from disk before rendering (see scripts/prerender.ts).
import en from '../public/locales/en/home.json'
import es from '../public/locales/es/home.json'
import ru from '../public/locales/ru/home.json'
import uk from '../public/locales/uk/home.json'
import zh from '../public/locales/zh/home.json'

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

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    resources: {
      en: { home: en },
      es: { home: es },
      ru: { home: ru },
      uk: { home: uk },
      zh: { home: zh },
    },
    ns: ['home', 'about', 'inner-spectrum', 'bio', 'bio-metric', 'level', 'part', 'contact', 'sitemap', 'privacy', 'terms', 'glossary', 'articles', 'reviews'],
    defaultNS: 'home',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initImmediate: false,
  })
}

export function isLang(s: string | undefined | null): s is Lang {
  return !!s && (SUPPORTED_LANGS as readonly string[]).includes(s)
}

/**
 * On-demand loader for any i18n namespace not in the eager bundle.
 * Dynamically imports the locale JSON — Vite emits one cacheable chunk per
 * file — and registers it with i18next. Loads the requested language plus the
 * 'en' fallback. Cached so each language/namespace is fetched at most once.
 *
 * The client calls this from the lazy route factory (main.tsx) so the page
 * component never renders before its translations are present — no hydration
 * mismatch, no flash of translation keys. The SSR path does not use this:
 * scripts/prerender.ts registers every bundle from disk before rendering.
 */
const _nsCache = new Map<string, Promise<void>>()
export function ensureNamespace(lng: Lang, ns: string): Promise<void> {
  const langs: Lang[] = lng === 'en' ? ['en'] : [lng, 'en']
  return Promise.all(
    langs.map((l) => {
      const key = `${l}:${ns}`
      let p = _nsCache.get(key)
      if (!p) {
        p = import(`../public/locales/${l}/${ns}.json`)
          .then((m: { default: Record<string, unknown> }) => {
            i18n.addResourceBundle(l, ns, m.default, true, true)
          })
          .catch(() => {
            /* missing locale file — i18next falls back to the 'en' bundle */
          })
        _nsCache.set(key, p)
      }
      return p
    }),
  ).then(() => undefined)
}

// When the user switches language, re-fetch every heavy namespace that has
// already been loaded so the new language is populated for SPA navigation.
i18n.on('languageChanged', (lng: string) => {
  if (!isLang(lng)) return
  const loaded = new Set<string>()
  for (const key of _nsCache.keys()) loaded.add(key.split(':')[1])
  loaded.forEach((ns) => void ensureNamespace(lng, ns))
})

/** Extract language from a path like /ru, /ru/about, / → 'en'. */
export function langFromPath(pathname: string): Lang {
  const seg = pathname.split('/').filter(Boolean)[0]
  return isLang(seg) ? seg : 'en'
}

/** Build the URL for the home page in a given language. EN is the bare root. */
export function homePathFor(lang: Lang): string {
  return lang === 'en' ? '/' : `/${lang}`
}

/** Routes that have no per-language variant — never prefix these. */
const NON_LOCALIZED_PREFIXES = ['/the-stack', '/topics']

/**
 * Prefix an internal path with the active language so navigation keeps the
 * user in their chosen language. EN returns the path unchanged (bare root);
 * already-prefixed paths and non-localized routes (/the-stack, /topics) are
 * returned as-is. Idempotent — safe to apply more than once.
 *
 * Every internal <Link to> / markdown link rendered inside the app must run
 * through this, otherwise a bare "/articles/x" silently drops a /ru/ user
 * back to the English version of the site.
 */
export function langHref(path: string, lang: Lang): string {
  if (lang === 'en' || !path.startsWith('/')) return path
  const first = path.split('/').filter(Boolean)[0]
  if (isLang(first)) return path
  if (NON_LOCALIZED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))) return path
  return `/${lang}${path}`
}

/**
 * Pages that exist in every language. Keys are EN base paths, values are i18n
 * namespaces. Add a new entry here + matching JSON files + meta override in
 * prerender.ts to localize another page.
 */
export const LOCALIZED_PAGES: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/articles': 'articles',
  '/bio': 'bio',
  '/contact': 'contact',
  '/inner-spectrum': 'inner-spectrum',
  '/privacy': 'privacy',
  '/sitemap': 'sitemap',
  '/terms': 'terms',
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

  // Part detail page: preserve slug across language switches.
  const partMatch = basePath.match(/^\/part\/([^/]+)$/)
  if (partMatch) {
    return lang === 'en' ? `/part/${partMatch[1]}` : `/${lang}/part/${partMatch[1]}`
  }

  // Article detail page: preserve slug across language switches.
  const articleMatch = basePath.match(/^\/articles\/([^/]+)$/)
  if (articleMatch) {
    return lang === 'en' ? `/articles/${articleMatch[1]}` : `/${lang}/articles/${articleMatch[1]}`
  }

  // Glossary detail page: preserve slug across language switches.
  const glossaryMatch = basePath.match(/^\/glossary\/([^/]+)$/)
  if (glossaryMatch) {
    return lang === 'en' ? `/glossary/${glossaryMatch[1]}` : `/${lang}/glossary/${glossaryMatch[1]}`
  }

  // Pages with /:lang/ variants but no per-slug data — keep the user in their
  // language. Without this, switching to e.g. "UK" from /glossary would dump
  // the user back on /glossary (EN) since localizedPathFor's default branch
  // strips the lang prefix.
  // Only /glossary still rides this shim — its localized index is gated
  // behind the glossary rollout, so it is not in LOCALIZED_PAGES. Everything
  // else (/articles, /contact, /sitemap, /privacy, /terms…) is handled by the
  // LOCALIZED_BASE_PATHS branch below.
  const flatLocalized = ['/glossary']
  if (flatLocalized.includes(basePath)) {
    return lang === 'en' ? basePath : `/${lang}${basePath}`
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

export default i18n
