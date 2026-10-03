import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LOCALIZED_COVERAGE } from './data/localized-coverage.generated'
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
import de from '../public/locales/de/home.json'
import fr from '../public/locales/fr/home.json'
import it from '../public/locales/it/home.json'
import nl from '../public/locales/nl/home.json'
import ja from '../public/locales/ja/home.json'
import pl from '../public/locales/pl/home.json'
import pt from '../public/locales/pt/home.json'

export const SUPPORTED_LANGS = ['en', 'es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
  ru: 'RU',
  uk: 'UK',
  zh: 'ZH',
  de: 'DE',
  fr: 'FR',
  it: 'IT',
  nl: 'NL',
  ja: 'JA',
  pl: 'PL',
  pt: 'PT',
}

/** OpenGraph locale codes (BCP-47 with underscore). Used in og:locale meta tags. */
export const OG_LOCALES: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_ES',
  ru: 'ru_RU',
  uk: 'uk_UA',
  zh: 'zh_CN',
  de: 'de_DE',
  fr: 'fr_FR',
  it: 'it_IT',
  nl: 'nl_NL',
  ja: 'ja_JP',
  pl: 'pl_PL',
  pt: 'pt_BR',
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
      de: { home: de },
      fr: { home: fr },
      it: { home: it },
      nl: { home: nl },
      ja: { home: ja },
      pl: { home: pl },
      pt: { home: pt },
    },
    ns: ['home', 'about', 'inner-spectrum', 'bio', 'bio-metric', 'level', 'part', 'contact', 'sitemap', 'privacy', 'terms', 'glossary', 'articles', 'reviews', 'emoton'],
    defaultNS: 'home',
    interpolation: { escapeValue: false },
    // bindI18nStore 'added': re-render when a lazily loaded namespace bundle
    // arrives (ensureNamespace → addResourceBundle). Without it, switching
    // language on an open page kept showing EN defaultValues until a reload.
    react: { useSuspense: false, bindI18n: 'languageChanged loaded', bindI18nStore: 'added' },
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
type JsonLoader = () => Promise<unknown>
let _loaders: { locale: Record<string, JsonLoader>; generated: Record<string, JsonLoader> } | null = null
// Explicit file lists so the FULL per-language articles.json (every body of a
// language) is never emitted as a browser chunk. Built lazily: this module is also
// imported by the Node prerender, where import.meta.glob does not exist and
// ensureNamespace is never called.
function loaders() {
  if (!_loaders) {
    _loaders = {
      // (A negated pattern applies to the whole list, so the tiny EN articles.json —
      // UI strings only, EN bodies live in src/data/articles — is its own glob.)
      locale: {
        ...import.meta.glob(['../public/locales/*/*.json', '!../public/locales/*/articles.json', '!../public/locales/*/reviews.json', '!../public/locales/*/glossary.json'], { import: 'default' }),
        ...import.meta.glob(['../public/locales/en/articles.json', '../public/locales/en/reviews.json', '../public/locales/en/glossary.json'], { import: 'default' }),
      },
      generated: import.meta.glob('./generated/i18n/*/*.json', { import: 'default' }),
    }
  }
  return _loaders
}
/**
 * Which file backs (language, namespace) in the browser:
 *  - 'articles' (non-EN): light index — titles/descriptions only; one article's full
 *    body is fetched on demand by src/lib/article-loader.ts.
 *  - 'glossary-light': the 'glossary' namespace with only title/shortDescription per
 *    term (article pages); glossary pages load the full 'glossary'.
 */
function loaderFor(l: Lang, ns: string): JsonLoader | undefined {
  const { locale, generated } = loaders()
  const file = ns === 'glossary-light' ? 'glossary' : ns
  if (l !== 'en' && (file === 'articles' || file === 'reviews' || file === 'glossary')) {
    return generated[`./generated/i18n/${l}/${file}.json`]
  }
  return locale[`../public/locales/${l}/${file}.json`]
}
export function ensureNamespace(lng: Lang, ns: string): Promise<void> {
  const langs: Lang[] = lng === 'en' ? ['en'] : [lng, 'en']
  const target = ns === 'glossary-light' ? 'glossary' : ns
  return Promise.all(
    langs.map((l) => {
      const key = `${l}:${ns}`
      let p = _nsCache.get(key)
      if (!p) {
        const load = loaderFor(l, ns)
        p = (load ? load() : Promise.reject(new Error('no locale file')))
          .then((data) => {
            i18n.addResourceBundle(l, target, data as Record<string, unknown>, true, true)
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
  return lang === 'en' || ARTICLES_ONLY_LANGS.includes(lang) ? '/' : `/${lang}`
}

/**
 * Articles-first locales: only /<lang>/articles and translated
 * /<lang>/articles/<slug> pages exist. Home, about, bio, level, part, emoton…
 * are not published in these languages yet — no route, no hreflang, and every
 * link/switcher target falls back to the EN URL (never an EN body in a
 * foreign shell). Remove a language from here once its UI is translated.
 */
export const ARTICLES_ONLY_LANGS: readonly Lang[] = ['it', 'nl', 'ja', 'pl', 'pt']

/**
 * Routes that have no per-language variant — never prefix these. /tools and
 * /research are currently EN-only sections (no localized index is prerendered),
 * so langHref must keep links to them on the bare EN URL rather than emit a
 * /<lang>/... route that soft-404s. Revisit when either is localized.
 */

/**
 * Prefix an internal path with the active language so navigation keeps the
 * user in their chosen language. EN returns the path unchanged (bare root);
 * already-prefixed paths and non-localized routes (/the-stack) are
 * returned as-is. Idempotent — safe to apply more than once.
 *
 * Every internal <Link to> / markdown link rendered inside the app must run
 * through this, otherwise a bare "/articles/x" silently drops a /ru/ user
 * back to the English version of the site.
 */
/** Single tool pages published in EVERY language (not just the ru/es pilot). */
export const ALL_LANG_PAGES: readonly string[] = ['/tools', '/tools/hrv', '/tools/resting-heart-rate', '/tools/alcohol', '/tools/camera-heart-rate', '/tools/breathing', '/tools/biological-age', '/tools/resonance-breathing', '/tools/wim-hof', '/tools/sleep-cycle', '/tools/caffeine', '/tools/chronotype', '/tools/baseline']

export function langHref(path: string, lang: Lang): string {
  if (lang === 'en' || !path.startsWith('/')) return path
  // Keep ?query / #hash; decide on the bare path.
  const cut = path.search(/[?#]/)
  const bare = cut >= 0 ? path.slice(0, cut) : path
  const suffix = cut >= 0 ? path.slice(cut) : ''
  const base = bare.length > 1 ? bare.replace(/\/+$/, '') : '/'
  const parts = base.split('/').filter(Boolean)
  if (isLang(parts[0])) return path
  // Only link to /<lang>/… when that page is actually prerendered in this language
  // (build-time sets in localized-coverage.generated.ts); otherwise the EN URL.
  // A /<lang>/ URL that isn't built is served as the SPA shell with HTTP 200 —
  // a soft 404 for crawlers (roadmap 8.3/8.4).
  const cov = LOCALIZED_COVERAGE[lang]
  if (!cov) return path
  const localized = (ok: boolean) => (ok ? (base === '/' ? `/${lang}${suffix}` : `/${lang}${base}${suffix}`) : path)
  if (parts[0] === 'articles' && parts[1] === 'topic' && parts[2]) return localized(cov.hubs.has(parts[2]))
  if (parts[0] === 'articles' && parts[1]) return localized(cov.articles.has(parts[1]))
  if (parts[0] === 'glossary' && parts[1]) return localized(cov.glossary.has(parts[1]))
  if (parts[0] === 'reviews') return localized(cov.reviews.has(parts.slice(1).join('/')))
  return localized(cov.pages.has(base))
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
  '/emoton': 'emoton',
  '/inner-spectrum': 'inner-spectrum',
  '/privacy': 'privacy',
  '/sitemap': 'sitemap',
  '/terms': 'terms',
}

const LOCALIZED_BASE_PATHS = Object.keys(LOCALIZED_PAGES)

/**
 * Localized pages a language does NOT publish (yet) — no route, no hreflang
 * entry, and the language switcher keeps the EN URL. DE/FR terms stay EN until
 * a lawyer reviews them. /privacy is published in all 12 languages (owner
 * decision 2026-10-03; each translation states that the English version prevails).
 */
export const LANG_PAGE_EXCLUDE: Partial<Record<Lang, readonly string[]>> = {
  de: ['/terms'],
  fr: ['/terms'],
  ...Object.fromEntries(
    ARTICLES_ONLY_LANGS.map((l) => [l, LOCALIZED_BASE_PATHS.filter((b) => b !== '/articles' && b !== '/privacy')]),
  ),
}
/** Languages whose /part/:slug bodies are not translated yet — no route, and
 *  the language switcher keeps the EN URL (else a DE/FR shell wraps EN text). */
export const PART_UNTRANSLATED_LANGS: readonly Lang[] = ['de', 'fr', ...ARTICLES_ONLY_LANGS]
export function isPageLocalizedFor(basePath: string, lang: Lang): boolean {
  return !(LANG_PAGE_EXCLUDE[lang]?.includes(basePath) ?? false)
}

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
  if (lang === 'en') return basePath
  // Language switcher on a topic hub the target language doesn't have → its library.
  const hubMatch = basePath.match(/^\/articles\/topic\/([^/]+)$/)
  if (hubMatch && !LOCALIZED_COVERAGE[lang]?.hubs.has(hubMatch[1])) return langHref('/articles', lang)
  // Same rule as every link: /<lang>/… only when that page exists, else the EN URL.
  return langHref(basePath, lang)
}

/** All prerender route variants for localized pages: 4 base paths × 5 langs = 20. */
export function localizedRouteVariants(): string[] {
  const out: string[] = []
  for (const base of LOCALIZED_BASE_PATHS) {
    for (const lang of SUPPORTED_LANGS) {
      if (!isPageLocalizedFor(base, lang)) continue
      // Build the URL directly, not via langHref(): langHref consults the generated
      // coverage, which is itself derived from these routes — a page newly allowed
      // in LANG_PAGE_EXCLUDE could otherwise never get its first /<lang>/ route.
      out.push(lang === 'en' ? base : base === '/' ? `/${lang}` : `/${lang}${base}`)
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
      if (ARTICLES_ONLY_LANGS.includes(lang)) continue
      out.push(metricPathFor(key, lang))
    }
  }
  return out
}

/** Parse a metric URL — returns { lang, metric } or null. */
export function parseMetricRoute(route: string): { lang: Lang; metric: string } | null {
  const m = route.match(/^(?:\/(en|es|ru|uk|zh|de|fr|it|nl|ja|pl|pt))?\/bio\/([^/]+)$/)
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
      if (ARTICLES_ONLY_LANGS.includes(lang)) continue
      out.push(levelPathFor(n, lang))
    }
  }
  return out
}

/** Parse a level URL — returns { lang, levelNum } or null. */
export function parseLevelRoute(route: string): { lang: Lang; levelNum: number } | null {
  const m = route.match(/^(?:\/(en|es|ru|uk|zh|de|fr|it|nl|ja|pl|pt))?\/level\/(\d+)$/)
  if (!m) return null
  const lang = (m[1] as Lang | undefined) ?? 'en'
  return { lang, levelNum: parseInt(m[2], 10) }
}

/** Build the localized URL for a part page. */
export function partPathFor(slug: string, lang: Lang): string {
  return lang === 'en' || PART_UNTRANSLATED_LANGS.includes(lang) ? `/part/${slug}` : `/${lang}/part/${slug}`
}

/** All variants of /part/:slug — one per (slug, lang). */
export function partRouteVariants(slugs: string[]): string[] {
  const out: string[] = []
  for (const slug of slugs) {
    for (const lang of SUPPORTED_LANGS) {
      if (PART_UNTRANSLATED_LANGS.includes(lang)) continue
      out.push(partPathFor(slug, lang))
    }
  }
  return out
}

/** Parse a part URL — returns { lang, slug } or null. */
export function parsePartRoute(route: string): { lang: Lang; slug: string } | null {
  const m = route.match(/^(?:\/(en|es|ru|uk|zh|de|fr|it|nl|ja|pl|pt))?\/part\/([^/]+)$/)
  if (!m) return null
  const lang = (m[1] as Lang | undefined) ?? 'en'
  return { lang, slug: m[2] }
}

export default i18n
