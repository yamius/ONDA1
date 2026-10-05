import { StrictMode, type ComponentType, type ReactElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, matchRoutes, createRoutesFromElements } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import i18n, { langFromPath, SUPPORTED_LANGS, ensureNamespace } from './i18n'
import { loadArticle } from './lib/article-loader'
import { loadEntry } from './lib/content-loader'
import { loadSciencePage } from './lib/science-content'

// Sync language with URL before hydration so first paint matches the prerendered HTML
void i18n.changeLanguage(langFromPath(window.location.pathname))

// Preloadable lazy route. Unlike React.lazy — which ALWAYS throws a promise on
// its first synchronous render, even when the chunk is already cached — this
// renders the module SYNCHRONOUSLY once `preload()` has resolved. That is the
// whole point: before hydrateRoot we preload + await the route matched by the
// URL, so its component mounts on the first hydration pass without suspending.
// A suspending boundary at hydration would mismatch the prerendered HTML (React
// error #418): the SSR path (entry-server + renderToString) emits no Suspense
// boundary markers, so React cannot reconcile a client Suspense with server
// content and regenerates the whole tree. For client-side navigation the route
// still suspends the first time; react-router v7 wraps navigations in
// startTransition, so React keeps the current page on screen until it resolves.
type Preloadable = ComponentType & { preload: () => Promise<ComponentType> }

function makeLazy(load: () => Promise<ComponentType>): Preloadable {
  let mod: ComponentType | null = null
  let promise: Promise<ComponentType> | null = null
  const preload = () => {
    if (mod) return Promise.resolve(mod)
    if (!promise) promise = load().then((c) => { mod = c; return c })
    return promise
  }
  const LazyPage = ((props: Record<string, unknown>) => {
    if (!mod) throw preload()
    const Comp = mod
    return <Comp {...props} />
  }) as Preloadable
  LazyPage.preload = preload
  return LazyPage
}

// Plain lazy route (namespace already in the eager bundle, e.g. 'home').
function lazy(load: () => Promise<{ default: ComponentType }>): Preloadable {
  return makeLazy(() => load().then((m) => m.default))
}

// Lazy route whose loader also fetches its i18n namespace(s) for the active
// language. Only the 'home' namespace ships eagerly; every other namespace is
// fetched on demand here, so the page never renders before its translations.
function lazyNs(ns: string | string[], load: () => Promise<{ default: ComponentType }>): Preloadable {
  const list = Array.isArray(ns) ? ns : [ns]
  return makeLazy(() => {
    const lang = langFromPath(window.location.pathname)
    return Promise.all([load(), ...list.map((n) => ensureNamespace(lang, n))]).then(([m]) => m.default)
  })
}

const HomePage           = lazyNs('articles', () => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const AboutPage          = lazyNs('about', () => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const GlossaryPage       = lazyNs('glossary', () => import('./pages/GlossaryPage').then(m => ({ default: m.GlossaryPage })))
const ArticlesPage       = lazyNs('articles', () => import('./pages/ArticlesPage').then(m => ({ default: m.ArticlesPage })))
const ArticleTopicHubPage = lazyNs('articles', () => import('./pages/ArticleTopicHubPage').then(m => ({ default: m.ArticleTopicHubPage })))
const ContactPage        = lazyNs('contact', () => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })))
const TheStackPage       = lazyNs('articles', () => import('./pages/TheStackPage').then(m => ({ default: m.TheStackPage })))
const SitemapPage        = lazyNs('sitemap', () => import('./pages/SitemapPage').then(m => ({ default: m.SitemapPage })))
const GlossaryTermPage   = lazyNs('glossary', () => import('./pages/GlossaryTermPage').then(m => ({ default: m.GlossaryTermPage })))
const PartPage           = lazyNs('part', () => import('./pages/PartPage').then(m => ({ default: m.PartPage })))
const LevelPage          = lazyNs('level', () => import('./pages/LevelPage').then(m => ({ default: m.LevelPage })))
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))
const InnerSpectrumPage  = lazyNs('inner-spectrum', () => import('./pages/InnerSpectrumPage').then(m => ({ default: m.InnerSpectrumPage })))
const PrivacyPage        = lazyNs('privacy', () => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })))
const TermsPage          = lazyNs('terms', () => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })))
const BioPage            = lazyNs('bio', () => import('./pages/BioPage').then(m => ({ default: m.BioPage })))
const BioMetricPage      = lazyNs('bio-metric', () => import('./pages/BioMetricPage').then(m => ({ default: m.BioMetricPage })))
const EmotonPage         = lazyNs('emoton', () => import('./pages/EmotonPage').then(m => ({ default: m.EmotonPage })))
const ArticlesSlugRouter = lazyNs(['articles', 'glossary-light'], () => import('./components/ArticlesSlugRouter'))
const ResearchPage          = lazy(() => import('./pages/ResearchPage').then(m => ({ default: m.ResearchPage })))
const SciencePage           = lazy(() => import('./pages/SciencePage').then(m => ({ default: m.SciencePage })))
const AiAppsPage            = lazy(() => import('./pages/AiAppsPage').then(m => ({ default: m.AiAppsPage })))
const MeasurementsPage      = lazy(() => import('./pages/MeasurementsPage').then(m => ({ default: m.MeasurementsPage })))
const HowItWorksPage        = lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })))
const ProductPage           = lazy(() => import('./pages/ProductPage').then(m => ({ default: m.ProductPage })))
const FaqPage               = lazy(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })))
const FounderPage           = lazy(() => import('./pages/FounderPage').then(m => ({ default: m.FounderPage })))
const HrvBiofeedbackPage    = lazy(() => import('./pages/HrvBiofeedbackPage').then(m => ({ default: m.HrvBiofeedbackPage })))
const ResonanceBreathingGuidePage = lazy(() => import('./pages/ResonanceBreathingGuidePage').then(m => ({ default: m.ResonanceBreathingGuidePage })))
const HrvVsCoherencePage    = lazy(() => import('./pages/HrvVsCoherencePage').then(m => ({ default: m.HrvVsCoherencePage })))
const AppleWatchHrvBiofeedbackPage = lazy(() => import('./pages/AppleWatchHrvBiofeedbackPage').then(m => ({ default: m.AppleWatchHrvBiofeedbackPage })))
const OndaComparePage       = lazy(() => import('./pages/OndaComparePage').then(m => ({ default: m.OndaComparePage })))
const CompareSlugRouter     = lazy(() => import('./components/CompareSlugRouter').then(m => ({ default: m.CompareSlugRouter })))
const ToolsPage             = lazy(() => import('./pages/ToolsPage').then(m => ({ default: m.ToolsPage })))
const BaselinePage          = lazy(() => import('./pages/BaselinePage').then(m => ({ default: m.BaselinePage })))
const HrvInterpreterPage    = lazy(() => import('./pages/HrvInterpreterPage').then(m => ({ default: m.HrvInterpreterPage })))
const CaffeineCalculatorPage = lazy(() => import('./pages/CaffeineCalculatorPage').then(m => ({ default: m.CaffeineCalculatorPage })))
const SleepDebtCalculatorPage = lazy(() => import('./pages/SleepDebtCalculatorPage').then(m => ({ default: m.SleepDebtCalculatorPage })))
const Zone2CalculatorPage   = lazy(() => import('./pages/Zone2CalculatorPage').then(m => ({ default: m.Zone2CalculatorPage })))
const ChronotypeQuizPage    = lazy(() => import('./pages/ChronotypeQuizPage').then(m => ({ default: m.ChronotypeQuizPage })))
const ProteinCalculatorPage = lazy(() => import('./pages/ProteinCalculatorPage').then(m => ({ default: m.ProteinCalculatorPage })))
const Vo2maxCalculatorPage = lazy(() => import('./pages/Vo2maxCalculatorPage').then(m => ({ default: m.Vo2maxCalculatorPage })))
const TdeeCalculatorPage = lazy(() => import('./pages/TdeeCalculatorPage').then(m => ({ default: m.TdeeCalculatorPage })))
const WaterIntakeCalculatorPage = lazy(() => import('./pages/WaterIntakeCalculatorPage').then(m => ({ default: m.WaterIntakeCalculatorPage })))
const AlcoholClearanceCalculatorPage = lazy(() => import('./pages/AlcoholClearanceCalculatorPage').then(m => ({ default: m.AlcoholClearanceCalculatorPage })))
const FastingCalculatorPage = lazy(() => import('./pages/FastingCalculatorPage').then(m => ({ default: m.FastingCalculatorPage })))
const JetlagPlannerPage = lazy(() => import('./pages/JetlagPlannerPage').then(m => ({ default: m.JetlagPlannerPage })))
const OneRepMaxCalculatorPage = lazy(() => import('./pages/OneRepMaxCalculatorPage').then(m => ({ default: m.OneRepMaxCalculatorPage })))
const BodyFatCalculatorPage = lazy(() => import('./pages/BodyFatCalculatorPage').then(m => ({ default: m.BodyFatCalculatorPage })))
const SleepCycleCalculatorPage = lazy(() => import('./pages/SleepCycleCalculatorPage').then(m => ({ default: m.SleepCycleCalculatorPage })))
const CognitiveShufflePage = lazy(() => import('./pages/CognitiveShufflePage').then(m => ({ default: m.CognitiveShufflePage })))
const BreathingPacerPage = lazy(() => import('./pages/BreathingPacerPage').then(m => ({ default: m.BreathingPacerPage })))
const ResonanceBreathingPage = lazy(() => import('./pages/ResonanceBreathingPage').then(m => ({ default: m.ResonanceBreathingPage })))
const DopamineResetPage = lazy(() => import('./pages/DopamineResetPage').then(m => ({ default: m.DopamineResetPage })))
const BiologicalAgeCalculatorPage = lazy(() => import('./pages/BiologicalAgeCalculatorPage').then(m => ({ default: m.BiologicalAgeCalculatorPage })))
const DigitalDetoxPage = lazy(() => import('./pages/DigitalDetoxPage').then(m => ({ default: m.DigitalDetoxPage })))
const BurnoutAssessmentPage = lazy(() => import('./pages/BurnoutAssessmentPage').then(m => ({ default: m.BurnoutAssessmentPage })))
const NervousSystemStatePage = lazy(() => import('./pages/NervousSystemStatePage').then(m => ({ default: m.NervousSystemStatePage })))
const WimHofPage = lazy(() => import('./pages/WimHofPage').then(m => ({ default: m.WimHofPage })))
const BrainFogQuizPage = lazy(() => import('./pages/BrainFogQuizPage').then(m => ({ default: m.BrainFogQuizPage })))
const RestingHeartRatePage = lazy(() => import('./pages/RestingHeartRatePage').then(m => ({ default: m.RestingHeartRatePage })))
const RecoveryScorePage = lazy(() => import('./pages/RecoveryScorePage').then(m => ({ default: m.RecoveryScorePage })))
const CameraHeartRatePage = lazy(() => import('./pages/CameraHeartRatePage').then(m => ({ default: m.CameraHeartRatePage })))
const MicBreathingPage = lazy(() => import('./pages/MicBreathingPage').then(m => ({ default: m.MicBreathingPage })))
const BreathHeartBiofeedbackPage = lazy(() => import('./pages/BreathHeartBiofeedbackPage').then(m => ({ default: m.BreathHeartBiofeedbackPage })))
const HrvEmbedPage = lazy(() => import('./pages/HrvEmbedPage').then(m => ({ default: m.HrvEmbedPage })))
const ReviewsPage           = lazyNs('reviews', () => import('./pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })))
const ReviewMethodologyPage = lazyNs('reviews', () => import('./pages/ReviewMethodologyPage').then(m => ({ default: m.ReviewMethodologyPage })))
const ReviewsSlugRouter     = lazyNs('reviews', () => import('./components/ReviewsSlugRouter'))
const ComparisonPage        = lazyNs('reviews', () => import('./pages/ComparisonPage').then(m => ({ default: m.ComparisonPage })))
const HeadToHeadPage        = lazyNs('reviews', () => import('./pages/HeadToHeadPage').then(m => ({ default: m.HeadToHeadPage })))

// Single source of truth for the route tree — rendered by <Routes> AND fed to
// matchRoutes() below to discover which route(s) the URL resolves to, so the
// preload list can never drift from what actually renders.
const routeElements = (
  <>
          {/* Bare embeddable widgets — no Layout chrome (iframe-friendly). */}
          <Route path="/embed/hrv" element={<HrvEmbedPage />} />
          {/* Baseline reads a person's own Health figures from the URL fragment, so it MUST carry no
              third-party script: it lives outside Layout (no Reddit route tracker) and prerender.ts
              strips the pixel/GTM from its HTML. See BaselinePage + scripts/prerender.ts. */}
          <Route path="/tools/baseline" element={<BaselinePage />} />
          <Route path="/es/tools/baseline" element={<BaselinePage />} />
          <Route path="/ru/tools/baseline" element={<BaselinePage />} />
          <Route path="/uk/tools/baseline" element={<BaselinePage />} />
          <Route path="/zh/tools/baseline" element={<BaselinePage />} />
          <Route path="/de/tools/baseline" element={<BaselinePage />} />
          <Route path="/fr/tools/baseline" element={<BaselinePage />} />
          <Route path="/it/tools/baseline" element={<BaselinePage />} />
          <Route path="/nl/tools/baseline" element={<BaselinePage />} />
          <Route path="/ja/tools/baseline" element={<BaselinePage />} />
          <Route path="/pl/tools/baseline" element={<BaselinePage />} />
          <Route path="/pt/tools/baseline" element={<BaselinePage />} />
          <Route element={<Layout />}>
            <Route path="/"            element={<HomePage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`home-${l}`} path={`/${l}`} element={<HomePage />} />
            ))}
            <Route path="/about"       element={<AboutPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`about-${l}`} path={`/${l}/about`} element={<AboutPage />} />
            ))}
            <Route path="/glossary"    element={<GlossaryPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`glossary-${l}`} path={`/${l}/glossary`} element={<GlossaryPage />} />
            ))}
            <Route path="/articles"    element={<ArticlesPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`articles-${l}`} path={`/${l}/articles`} element={<ArticlesPage />} />
            ))}
            <Route path="/contact"     element={<ContactPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`contact-${l}`} path={`/${l}/contact`} element={<ContactPage />} />
            ))}
            <Route path="/the-stack"   element={<TheStackPage />} />
            <Route path="/sitemap"     element={<SitemapPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`sitemap-${l}`} path={`/${l}/sitemap`} element={<SitemapPage />} />
            ))}
            <Route path="/glossary/:slug"  element={<GlossaryTermPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`gloss-${l}`} path={`/${l}/glossary/:slug`} element={<GlossaryTermPage />} />
            ))}
            {/* ONDA Library topic hubs (all languages; a localized hub 404s when it has too few
                translated articles). More specific than /articles/:slug, so article URLs are unaffected. */}
            <Route path="/articles/topic/:topic" element={<ArticleTopicHubPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`topic-${l}`} path={`/${l}/articles/topic/:topic`} element={<ArticleTopicHubPage />} />
            ))}
            <Route path="/articles/:slug"  element={<ArticlesSlugRouter />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`art-${l}`} path={`/${l}/articles/:slug`} element={<ArticlesSlugRouter />} />
            ))}
            <Route path="/part/:slug"      element={<PartPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`pt-${l}`} path={`/${l}/part/:slug`} element={<PartPage />} />
            ))}
            <Route path="/level/:number"   element={<LevelPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`lvl-${l}`} path={`/${l}/level/:number`} element={<LevelPage />} />
            ))}
            <Route path="/inner-spectrum" element={<InnerSpectrumPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`is-${l}`} path={`/${l}/inner-spectrum`} element={<InnerSpectrumPage />} />
            ))}
            <Route path="/privacy"        element={<PrivacyPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`priv-${l}`} path={`/${l}/privacy`} element={<PrivacyPage />} />
            ))}
            <Route path="/terms"          element={<TermsPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`terms-${l}`} path={`/${l}/terms`} element={<TermsPage />} />
            ))}
            <Route path="/emoton"         element={<EmotonPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`emoton-${l}`} path={`/${l}/emoton`} element={<EmotonPage />} />
            ))}
            <Route path="/bio"            element={<BioPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`bio-${l}`} path={`/${l}/bio`} element={<BioPage />} />
            ))}
            <Route path="/bio/:metric"    element={<BioMetricPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`bm-${l}`} path={`/${l}/bio/:metric`} element={<BioMetricPage />} />
            ))}
            <Route path="/research"              element={<ResearchPage />} />
            <Route path="/science"               element={<SciencePage />} />
            <Route path="/science/:kind"         element={<SciencePage />} />
            <Route path="/science/:kind/:slug"   element={<SciencePage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => [
              <Route key={`sci-${l}`} path={`/${l}/science`} element={<SciencePage />} />,
              <Route key={`scik-${l}`} path={`/${l}/science/:kind`} element={<SciencePage />} />,
              <Route key={`scip-${l}`} path={`/${l}/science/:kind/:slug`} element={<SciencePage />} />,
            ])}
            <Route path="/ai-apps"               element={<AiAppsPage />} />
            <Route path="/measurements"          element={<MeasurementsPage />} />
            <Route path="/ru/measurements"       element={<MeasurementsPage />} />
            <Route path="/es/measurements"       element={<MeasurementsPage />} />
            <Route path="/how-it-works"          element={<HowItWorksPage />} />
            <Route path="/ru/how-it-works"       element={<HowItWorksPage />} />
            <Route path="/es/how-it-works"       element={<HowItWorksPage />} />
            <Route path="/product"               element={<ProductPage />} />
            <Route path="/ru/product"            element={<ProductPage />} />
            <Route path="/es/product"            element={<ProductPage />} />
            <Route path="/faq"                   element={<FaqPage />} />
            <Route path="/ru/faq"                element={<FaqPage />} />
            <Route path="/es/faq"                element={<FaqPage />} />
            <Route path="/people/yakiv-bilenko"  element={<FounderPage />} />
            <Route path="/ru/people/yakiv-bilenko" element={<FounderPage />} />
            <Route path="/es/people/yakiv-bilenko" element={<FounderPage />} />
            <Route path="/hrv-biofeedback"       element={<HrvBiofeedbackPage />} />
            <Route path="/ru/hrv-biofeedback"    element={<HrvBiofeedbackPage />} />
            <Route path="/es/hrv-biofeedback"    element={<HrvBiofeedbackPage />} />
            <Route path="/resonance-breathing"   element={<ResonanceBreathingGuidePage />} />
            <Route path="/ru/resonance-breathing" element={<ResonanceBreathingGuidePage />} />
            <Route path="/es/resonance-breathing" element={<ResonanceBreathingGuidePage />} />
            <Route path="/hrv-vs-coherence"      element={<HrvVsCoherencePage />} />
            <Route path="/ru/hrv-vs-coherence"   element={<HrvVsCoherencePage />} />
            <Route path="/es/hrv-vs-coherence"   element={<HrvVsCoherencePage />} />
            <Route path="/apple-watch-hrv-biofeedback" element={<AppleWatchHrvBiofeedbackPage />} />
            <Route path="/ru/apple-watch-hrv-biofeedback" element={<AppleWatchHrvBiofeedbackPage />} />
            <Route path="/es/apple-watch-hrv-biofeedback" element={<AppleWatchHrvBiofeedbackPage />} />
            <Route path="/compare"               element={<OndaComparePage />} />
            <Route path="/ru/compare"            element={<OndaComparePage />} />
            <Route path="/es/compare"            element={<OndaComparePage />} />
            <Route path="/compare/:slug"         element={<CompareSlugRouter />} />
            <Route path="/tools"                 element={<ToolsPage />} />
            <Route path="/ru/tools"              element={<ToolsPage />} />
            <Route path="/uk/tools" element={<ToolsPage />} />
            <Route path="/zh/tools" element={<ToolsPage />} />
            <Route path="/de/tools" element={<ToolsPage />} />
            <Route path="/fr/tools" element={<ToolsPage />} />
            <Route path="/it/tools" element={<ToolsPage />} />
            <Route path="/nl/tools" element={<ToolsPage />} />
            <Route path="/ja/tools" element={<ToolsPage />} />
            <Route path="/pl/tools" element={<ToolsPage />} />
            <Route path="/pt/tools" element={<ToolsPage />} />
            <Route path="/es/tools"              element={<ToolsPage />} />
            <Route path="/tools/hrv"             element={<HrvInterpreterPage />} />
            <Route path="/es/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/ru/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/uk/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/zh/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/de/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/fr/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/it/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/nl/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/ja/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/pl/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/pt/tools/hrv" element={<HrvInterpreterPage />} />
            <Route path="/tools/caffeine"        element={<CaffeineCalculatorPage />} />
            <Route path="/es/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/ru/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/uk/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/zh/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/de/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/fr/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/it/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/nl/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/ja/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/pl/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/pt/tools/caffeine" element={<CaffeineCalculatorPage />} />
            <Route path="/tools/sleep-debt"      element={<SleepDebtCalculatorPage />} />
            <Route path="/tools/zone-2"          element={<Zone2CalculatorPage />} />
            <Route path="/tools/chronotype"      element={<ChronotypeQuizPage />} />
            <Route path="/es/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/ru/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/uk/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/zh/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/de/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/fr/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/it/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/nl/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/ja/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/pl/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/pt/tools/chronotype" element={<ChronotypeQuizPage />} />
            <Route path="/tools/protein"         element={<ProteinCalculatorPage />} />
            <Route path="/tools/vo2max"          element={<Vo2maxCalculatorPage />} />
            <Route path="/tools/tdee"            element={<TdeeCalculatorPage />} />
            <Route path="/tools/water"           element={<WaterIntakeCalculatorPage />} />
            <Route path="/tools/alcohol"         element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/es/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/ru/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/uk/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/zh/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/de/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/fr/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/it/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/nl/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/ja/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/pl/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/pt/tools/alcohol" element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/tools/fasting"         element={<FastingCalculatorPage />} />
            <Route path="/tools/jet-lag"         element={<JetlagPlannerPage />} />
            <Route path="/tools/one-rep-max"     element={<OneRepMaxCalculatorPage />} />
            <Route path="/tools/body-fat"        element={<BodyFatCalculatorPage />} />
            <Route path="/tools/sleep-cycle"     element={<SleepCycleCalculatorPage />} />
            <Route path="/es/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/ru/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/uk/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/zh/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/de/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/fr/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/it/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/nl/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/ja/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/pl/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/pt/tools/sleep-cycle" element={<SleepCycleCalculatorPage />} />
            <Route path="/tools/cognitive-shuffle" element={<CognitiveShufflePage />} />
            <Route path="/tools/breathing"       element={<BreathingPacerPage />} />
            <Route path="/es/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/ru/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/uk/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/zh/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/de/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/fr/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/it/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/nl/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/ja/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/pl/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/pt/tools/breathing" element={<BreathingPacerPage />} />
            <Route path="/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/es/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/ru/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/uk/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/zh/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/de/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/fr/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/it/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/nl/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/ja/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/pl/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/pt/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/tools/dopamine-detox"  element={<DopamineResetPage />} />
            <Route path="/tools/biological-age"  element={<BiologicalAgeCalculatorPage />} />
            <Route path="/es/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/ru/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/uk/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/zh/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/de/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/fr/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/it/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/nl/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/ja/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/pl/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/pt/tools/biological-age" element={<BiologicalAgeCalculatorPage />} />
            <Route path="/tools/digital-detox"   element={<DigitalDetoxPage />} />
            <Route path="/tools/burnout"         element={<BurnoutAssessmentPage />} />
            <Route path="/tools/nervous-system"  element={<NervousSystemStatePage />} />
            <Route path="/tools/wim-hof"         element={<WimHofPage />} />
            <Route path="/es/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/ru/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/uk/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/zh/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/de/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/fr/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/it/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/nl/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/ja/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/pl/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/pt/tools/wim-hof" element={<WimHofPage />} />
            <Route path="/tools/brain-fog"       element={<BrainFogQuizPage />} />
            <Route path="/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/es/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/ru/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/uk/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/zh/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/de/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/fr/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/it/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/nl/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/ja/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/pl/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/pt/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/tools/recovery-score"  element={<RecoveryScorePage />} />
            <Route path="/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/es/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/ru/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/uk/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/zh/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/de/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/fr/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/it/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/nl/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/ja/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/pl/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/pt/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
            <Route path="/tools/breathing-rate"  element={<MicBreathingPage />} />
            <Route path="/tools/breath-heart-biofeedback" element={<BreathHeartBiofeedbackPage />} />
            <Route path="/reviews"               element={<ReviewsPage />} />
            <Route path="/reviews/methodology"   element={<ReviewMethodologyPage />} />
            <Route path="/reviews/compare/:slug" element={<ComparisonPage />} />
            <Route path="/reviews/vs/:slug"      element={<HeadToHeadPage />} />
            <Route path="/reviews/:slug"         element={<ReviewsSlugRouter />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`reviews-${l}`} path={`/${l}/reviews`} element={<ReviewsPage />} />
            ))}
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`rev-method-${l}`} path={`/${l}/reviews/methodology`} element={<ReviewMethodologyPage />} />
            ))}
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`rev-cmp-${l}`} path={`/${l}/reviews/compare/:slug`} element={<ComparisonPage />} />
            ))}
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`rev-vs-${l}`} path={`/${l}/reviews/vs/:slug`} element={<HeadToHeadPage />} />
            ))}
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`rev-${l}`} path={`/${l}/reviews/:slug`} element={<ReviewsSlugRouter />} />
            ))}
            <Route path="*"               element={<NotFoundPage />} />
          </Route>
  </>
)

// NOTE: no top-level <Suspense> boundary here — deliberately. The prerender
// (entry-server + renderToString) emits NO Suspense boundary markers, so React
// 19 cannot hydrate a client <Suspense> against that HTML: it discards the
// prerendered tree and regenerates it on the client (React #418 — the "loads
// on retry" flash). Instead we preload the URL's matched route below so nothing
// suspends on the first paint, and rely on react-router v7's built-in
// startTransition for later navigations: a route chunk that suspends mid-nav
// keeps the current page on screen until it resolves (verified — no fallback
// flash, no warning), which is better UX than the old blank dark fallback.
const app = (
  <StrictMode>
    <BrowserRouter>
      <Routes>{routeElements}</Routes>
    </BrowserRouter>
  </StrictMode>
)

// Preload the chunk(s) + i18n namespace(s) for the route the URL resolves to,
// so its component renders synchronously on the first paint (hydrate OR fresh
// render). matchRoutes reads the SAME element tree <Routes> renders, so the
// preload target can never drift from what actually mounts.
const container = document.getElementById('root')!
const matched = matchRoutes(createRoutesFromElements(routeElements), window.location.pathname) ?? []
const preloads: Promise<unknown>[] = matched
  .map((m) => (m.route.element as ReactElement | undefined)?.type)
  .filter((t): t is Preloadable => typeof t === 'function' && 'preload' in (t as object))
  .map((t) => t.preload())
// Article pages: also fetch this one article's body before hydrating, so the
// first render matches the prerendered HTML without suspending.
const articleMatch = window.location.pathname.match(/^\/(?:([a-z]{2})\/)?articles\/([^/]+)\/?$/)
if (articleMatch && articleMatch[2] !== 'topic') {
  preloads.push(loadArticle(articleMatch[2], langFromPath(window.location.pathname)))
}
// Review / comparison / head-to-head pages: same, one entry. (A category URL like
// /reviews/hrv-trackers just misses the body file — harmless, the page doesn't read it.)
const reviewMatch = window.location.pathname.match(/^\/(?:[a-z]{2}\/)?reviews\/(?:(compare|vs)\/)?([^/]+)\/?$/)
const termMatch = window.location.pathname.match(/^\/(?:[a-z]{2}\/)?glossary\/([^/]+)\/?$/)
// Science pages: the page's JSON (one language).
const scienceMatch = window.location.pathname.match(/^\/(?:([a-z]{2})\/)?science\/([a-z]+)\/([^/]+)\/?$/)
if (scienceMatch) preloads.push(loadSciencePage(scienceMatch[1] ?? 'en', scienceMatch[2], scienceMatch[3]))
if (termMatch) preloads.push(loadEntry('glossary', termMatch[1], langFromPath(window.location.pathname)))
if (reviewMatch && reviewMatch[2] !== 'methodology') {
  const collection = reviewMatch[1] === 'compare' ? 'comparisons' : reviewMatch[1] === 'vs' ? 'h2h' : 'reviews'
  preloads.push(loadEntry(collection, reviewMatch[2], langFromPath(window.location.pathname)))
}
void Promise.all(preloads)
  .catch(() => { /* a chunk/namespace that fails to preload still renders below (it just suspends once) */ })
  .then(() => {
    if (container.hasChildNodes()) hydrateRoot(container, app)
    else createRoot(container).render(app)
  })

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
