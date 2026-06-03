/**
 * SSR entry point for prerender. Uses StaticRouter instead of BrowserRouter.
 * All imports are static — renderToString does not support React.lazy.
 */
import { StaticRouter, Routes, Route, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import i18n, { langFromPath, SUPPORTED_LANGS, type Lang } from './i18n'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { GlossaryPage } from './pages/GlossaryPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { ContactPage } from './pages/ContactPage'
import { TheStackPage } from './pages/TheStackPage'
import { SitemapPage } from './pages/SitemapPage'
import { GlossaryTermPage } from './pages/GlossaryTermPage'
import { ArticlePage } from './pages/ArticlePage'
import { MdArticlePage } from './pages/MdArticlePage'
import { PartPage } from './pages/PartPage'
import { LevelPage } from './pages/LevelPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { InnerSpectrumPage } from './pages/InnerSpectrumPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { BioPage } from './pages/BioPage'
import { BioMetricPage } from './pages/BioMetricPage'
import { TopicsPage } from './pages/TopicsPage'
import { TopicPage } from './pages/TopicPage'
import { ResearchPage } from './pages/ResearchPage'
import { ToolsPage } from './pages/ToolsPage'
import { HrvInterpreterPage } from './pages/HrvInterpreterPage'
import { CaffeineCalculatorPage } from './pages/CaffeineCalculatorPage'
import { SleepDebtCalculatorPage } from './pages/SleepDebtCalculatorPage'
import { Zone2CalculatorPage } from './pages/Zone2CalculatorPage'
import { ChronotypeQuizPage } from './pages/ChronotypeQuizPage'
import { ProteinCalculatorPage } from './pages/ProteinCalculatorPage'
import { Vo2maxCalculatorPage } from './pages/Vo2maxCalculatorPage'
import { TdeeCalculatorPage } from './pages/TdeeCalculatorPage'
import { WaterIntakeCalculatorPage } from './pages/WaterIntakeCalculatorPage'
import { AlcoholClearanceCalculatorPage } from './pages/AlcoholClearanceCalculatorPage'
import { FastingCalculatorPage } from './pages/FastingCalculatorPage'
import { JetlagPlannerPage } from './pages/JetlagPlannerPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { ReviewMethodologyPage } from './pages/ReviewMethodologyPage'
import { ReviewPage } from './pages/ReviewPage'
import { ReviewCategoryPage } from './pages/ReviewCategoryPage'
import { HeadToHeadPage } from './pages/HeadToHeadPage'
import { CATEGORY_URL_SLUG_SET } from './data/reviews'
import { ComparisonPage } from './pages/ComparisonPage'
import { getArticleBySlug } from './data/articles'

// NOTE: the heavy/lazy i18n namespaces (glossary, articles, reviews + the
// localised light namespaces) are NOT statically imported here — that would
// be impossible to keep out of the bundle. The prerender script registers
// every locale bundle on the shared i18n instance before calling createApp
// (see registerAllLocales in scripts/prerender.ts). The client loads each
// namespace on demand via ensureNamespace() in i18n.ts.

function ArticlesSlugRouter() {
  const { slug } = useParams<{ slug: string }>()
  const staticArticle = slug ? getArticleBySlug(slug) : undefined
  if (staticArticle) return <ArticlePage />
  return <MdArticlePage />
}

/**
 * /reviews/:slug serves both individual product reviews and per-category
 * landing pages. A handful of slugs (hrv-trackers, cgm, eeg-headsets, …)
 * are reserved as category URLs; everything else is an individual review.
 * The set comes from the reviews data module so the two stay in lockstep.
 */
function ReviewsSlugRouter() {
  const { slug } = useParams<{ slug: string }>()
  if (slug && CATEGORY_URL_SLUG_SET.has(slug)) return <ReviewCategoryPage />
  return <ReviewPage />
}

export function createApp(location: string, lang?: Lang) {
  // Synchronously set the i18n language before render so renderToString sees translated strings.
  const resolved = lang ?? langFromPath(location)
  if (i18n.language !== resolved) {
    void i18n.changeLanguage(resolved)
  }
  return (
    <StaticRouter location={location}>
      <Routes>
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
          <Route path="/topics"         element={<TopicsPage />} />
          <Route path="/topics/:slug"   element={<TopicPage />} />
          {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
            <Route key={`bm-${l}`} path={`/${l}/bio/:metric`} element={<BioMetricPage />} />
          ))}
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
    </StaticRouter>
  )
}
