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
import { ARTICLE_QUEUE_ENTRIES } from './article-release-queue'

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
  ...everywhere('articles', 'chm-continuous-hormone-monitoring', '2026-09-30', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'neural-bridge-alpha-flow-gateway', '2026-09-30', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'nervous-system-ping-latency', '2026-09-30', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'nervous-system-ping-latency', '2026-09-30', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'molecular-psychology-hormonal-firmware', '2026-09-30', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'system-stability-serotonin', '2026-09-30', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'neural-optimizer-estrogen', '2026-09-30', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'endocrine-social-drive-oxytocin-testosterone', '2026-09-30', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'resona-health-vibe', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'ultrahuman-m1', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'apple-watch-series-12-vs-oura-ring-4', '2026-10-01', ["de","fr","it","ja","nl","pl","pt","uk","zh"]),
  ...everywhere('h2h', 'whoop-5-0-vs-garmin-venu-4', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('comparisons', 'best-eeg-headsets-2026', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'platinumled-biomax-600', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'stelo', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'levels', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'lingo', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'healthy-wave-multi-wave', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'prana-breath', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'chilipad-cube', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'inergize-cold-tub', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('comparisons', 'best-massage-guns-2026', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'ultrahuman-ring-air', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'oura-ring-4', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'penguin-chillers', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'clearlight-sanctuary-2', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'joovv-solo-3-vs-mito-red-mitopro-1500-vs-platinumled-biomax-600', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'platinumled-biomax-600', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'hypervolt-3-pro', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'neurosity-crown', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'magnawave-mini', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'almost-heaven-salem', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('comparisons', 'best-vagus-nerve-stimulators-2026', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('reviews', 'kineon-move-plus', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'healthy-minds-program-vs-waking-up', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'hooga-hg500-vs-bon-charge-red-light-panel-vs-infraredi-pro-1500', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('comparisons', 'best-breathwork-apps-2026', '2026-10-01', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'apple-watch-series-12-vs-whoop-5-0', '2026-10-02', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'whoop-5-0-vs-garmin-venu-4', '2026-10-02', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'whoop-5-0-vs-polar-h10', '2026-10-02', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'oura-ring-4-vs-whoop-5-0-vs-garmin-venu-4', '2026-10-02', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'calm-vs-insight-timer', '2026-10-02', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'vipassana-meditation-attention-brain', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'eating-late-heart-rate-sleep', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'cognitive-shuffling', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'how-to-lower-cortisol', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'nicotine-vaping-hrv-heart-rate', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'amazfit-helio-ring-vs-ringconn-gen-2', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'breathwrk-vs-othership-vs-wim-hof-method-app', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'apple-watch-series-11-vs-fitbit-charge-6', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'healthy-wave-multi-wave-vs-qi-coil', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'ringconn-gen-2-vs-ultrahuman-ring-air', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'world-mental-health-day-2026-lived-experience', '2026-10-03', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'muse-s-athena-vs-neurosity-crown', '2026-10-04', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'resona-health-vibe-vs-higherdose-pemf-mat', '2026-10-04', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'omnilux-contour-face-vs-higherdose-red-light-face-mask', '2026-10-04', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'medito-vs-insight-timer', '2026-10-04', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('h2h', 'medito-vs-headspace', '2026-10-04', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  ...everywhere('articles', 'why-is-my-apple-watch-hrv-low', '2026-10-04', ["de","es","fr","it","ja","nl","pl","pt","ru","uk","zh"]),
  // Breathing-aid reviews, round-up and duels (translated 2026-10-07): 10 then 8, two days apart.
  ...everywhere('reviews', 'ayo-sleep-tape', '2026-10-08'),
  ...everywhere('reviews', 'dream-recovery-mouth-tape', '2026-10-08'),
  ...everywhere('reviews', 'hostage-tape', '2026-10-08'),
  ...everywhere('reviews', 'nexcare-surgical-tape', '2026-10-08'),
  ...everywhere('reviews', 'sleep-strips-by-sleepright', '2026-10-08'),
  ...everywhere('reviews', 'somnifit-sleep-strips', '2026-10-08'),
  ...everywhere('reviews', 'somnifix', '2026-10-08'),
  ...everywhere('reviews', 'the-tape-co', '2026-10-08'),
  ...everywhere('reviews', 'breathe-right-original', '2026-10-08'),
  ...everywhere('reviews', 'intake-breathing', '2026-10-08'),
  ...everywhere('reviews', 'mute-nasal-dilator', '2026-10-10'),
  ...everywhere('comparisons', 'best-mouth-tape-nasal-breathing-2026', '2026-10-10'),
  ...everywhere('h2h', 'hostage-tape-vs-dream-recovery-mouth-tape', '2026-10-10'),
  ...everywhere('h2h', 'hostage-tape-vs-somnifix', '2026-10-10'),
  ...everywhere('h2h', 'hostage-tape-vs-intake-breathing', '2026-10-10'),
  ...everywhere('h2h', 'hostage-tape-vs-somnifix-vs-intake-breathing', '2026-10-10'),
  ...everywhere('h2h', 'intake-breathing-vs-breathe-right-original', '2026-10-10'),
  ...everywhere('h2h', 'intake-breathing-vs-mute-nasal-dilator', '2026-10-10'),
  // Article release queue: waiting translations, 10 per language every 2 days (scripts/article-release-queue.ts).
  ...ARTICLE_QUEUE_ENTRIES,
]
