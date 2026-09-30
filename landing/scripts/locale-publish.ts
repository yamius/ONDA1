/**
 * ONE list of localized releases for every content collection — the place to
 * publish a finished translation. Each entry makes /<lang>/<collection path>/<slug>
 * a prerendered page (route, hreflang, sitemap, coverage) on/after `publishOn`.
 *
 *   articles    → /<lang>/articles/<slug>
 *   reviews     → /<lang>/reviews/<slug>
 *   comparisons → /<lang>/reviews/compare/<slug>
 *   h2h         → /<lang>/reviews/vs/<slug>
 *   glossary    → /<lang>/glossary/<slug>
 *
 * The translation itself must already be in public/locales/<lang>/*.json
 * (scripts/i18n-import.ts adds it AND the entries here). The older schedules in
 * prerender-routes.ts (article drips, review category pilots) keep working; this
 * list only adds to them.
 */
export type PublishCollection = 'articles' | 'reviews' | 'comparisons' | 'h2h' | 'glossary'
export interface PublishEntry {
  collection: PublishCollection
  lang: string
  slug: string
  /** YYYY-MM-DD (UTC build date gate) */
  publishOn: string
}

const ALL = ['es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt']
const everywhere = (collection: PublishCollection, slug: string, publishOn: string, langs = ALL): PublishEntry[] =>
  langs.map((lang) => ({ collection, lang, slug, publishOn }))

export const LOCALE_PUBLISH: PublishEntry[] = [
  // Resona Health VIBE — top GSC query + most AI-Overview-cited page.
  ...everywhere('reviews', 'resona-health-vibe', '2026-09-28'),
  // Hottest comparison (GSC clicks). ES was already live via the h2h rollout.
  ...everywhere('h2h', 'apple-watch-series-12-vs-whoop-5-0', '2026-09-28', ALL.filter((l) => l !== 'es')),
  ...everywhere('articles', 'energy-sensor-leptin', '2026-09-29', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'metabolic-flexibility-dual-fuel-system', '2026-09-29', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'dopamine-architecture-mastering-desire', '2026-09-29', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'nightly-flush-glymphatic-neural-cache', '2026-09-29', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'vagus-nerve-exercises', '2026-09-29', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'co2-tolerance-expanding-oxygen-limit', '2026-09-29', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
]
