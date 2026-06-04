import { StrictMode, lazy, Suspense, type ComponentType } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import i18n, { langFromPath, SUPPORTED_LANGS, ensureNamespace } from './i18n'

// Sync language with URL before hydration so first paint matches the prerendered HTML
void i18n.changeLanguage(langFromPath(window.location.pathname))

// Lazy route whose factory also loads its i18n namespace for the active
// language before the component mounts. Only the 'home' namespace ships in
// the eager bundle; every other namespace is fetched on demand here. React
// keeps the prerendered HTML behind <Suspense> until both the page chunk and
// the namespace resolve, so the page never renders before its translations
// are present — no hydration mismatch, no flash of translation keys.
function lazyNs(ns: string | string[], load: () => Promise<{ default: ComponentType }>) {
  const list = Array.isArray(ns) ? ns : [ns]
  return lazy(() => {
    const lang = langFromPath(window.location.pathname)
    return Promise.all([load(), ...list.map((n) => ensureNamespace(lang, n))]).then(([m]) => m)
  })
}

const HomePage           = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const AboutPage          = lazyNs('about', () => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const GlossaryPage       = lazyNs('glossary', () => import('./pages/GlossaryPage').then(m => ({ default: m.GlossaryPage })))
const ArticlesPage       = lazyNs('articles', () => import('./pages/ArticlesPage').then(m => ({ default: m.ArticlesPage })))
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
const TopicsPage         = lazy(() => import('./pages/TopicsPage').then(m => ({ default: m.TopicsPage })))
const TopicPage          = lazy(() => import('./pages/TopicPage').then(m => ({ default: m.TopicPage })))
const ArticlesSlugRouter = lazyNs(['articles', 'glossary'], () => import('./components/ArticlesSlugRouter'))
const ResearchPage          = lazy(() => import('./pages/ResearchPage').then(m => ({ default: m.ResearchPage })))
const ToolsPage             = lazy(() => import('./pages/ToolsPage').then(m => ({ default: m.ToolsPage })))
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

const app = (
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-[#050a0f]" />}>
        <Routes>
          {/* Bare embeddable widgets — no Layout chrome (iframe-friendly). */}
          <Route path="/embed/hrv" element={<HrvEmbedPage />} />
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
            <Route path="/bio"            element={<BioPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`bio-${l}`} path={`/${l}/bio`} element={<BioPage />} />
            ))}
            <Route path="/bio/:metric"    element={<BioMetricPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`bm-${l}`} path={`/${l}/bio/:metric`} element={<BioMetricPage />} />
            ))}
            <Route path="/topics"         element={<TopicsPage />} />
            <Route path="/topics/:slug"   element={<TopicPage />} />
            <Route path="/research"              element={<ResearchPage />} />
            <Route path="/tools"                 element={<ToolsPage />} />
            <Route path="/tools/hrv"             element={<HrvInterpreterPage />} />
            <Route path="/tools/caffeine"        element={<CaffeineCalculatorPage />} />
            <Route path="/tools/sleep-debt"      element={<SleepDebtCalculatorPage />} />
            <Route path="/tools/zone-2"          element={<Zone2CalculatorPage />} />
            <Route path="/tools/chronotype"      element={<ChronotypeQuizPage />} />
            <Route path="/tools/protein"         element={<ProteinCalculatorPage />} />
            <Route path="/tools/vo2max"          element={<Vo2maxCalculatorPage />} />
            <Route path="/tools/tdee"            element={<TdeeCalculatorPage />} />
            <Route path="/tools/water"           element={<WaterIntakeCalculatorPage />} />
            <Route path="/tools/alcohol"         element={<AlcoholClearanceCalculatorPage />} />
            <Route path="/tools/fasting"         element={<FastingCalculatorPage />} />
            <Route path="/tools/jet-lag"         element={<JetlagPlannerPage />} />
            <Route path="/tools/one-rep-max"     element={<OneRepMaxCalculatorPage />} />
            <Route path="/tools/body-fat"        element={<BodyFatCalculatorPage />} />
            <Route path="/tools/sleep-cycle"     element={<SleepCycleCalculatorPage />} />
            <Route path="/tools/cognitive-shuffle" element={<CognitiveShufflePage />} />
            <Route path="/tools/breathing"       element={<BreathingPacerPage />} />
            <Route path="/tools/resonance-breathing" element={<ResonanceBreathingPage />} />
            <Route path="/tools/dopamine-detox"  element={<DopamineResetPage />} />
            <Route path="/tools/biological-age"  element={<BiologicalAgeCalculatorPage />} />
            <Route path="/tools/digital-detox"   element={<DigitalDetoxPage />} />
            <Route path="/tools/burnout"         element={<BurnoutAssessmentPage />} />
            <Route path="/tools/nervous-system"  element={<NervousSystemStatePage />} />
            <Route path="/tools/wim-hof"         element={<WimHofPage />} />
            <Route path="/tools/brain-fog"       element={<BrainFogQuizPage />} />
            <Route path="/tools/resting-heart-rate" element={<RestingHeartRatePage />} />
            <Route path="/tools/recovery-score"  element={<RecoveryScorePage />} />
            <Route path="/tools/camera-heart-rate" element={<CameraHeartRatePage />} />
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
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
)

const container = document.getElementById('root')!
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
