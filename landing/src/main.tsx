import { StrictMode, lazy, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import i18n, { langFromPath, SUPPORTED_LANGS } from './i18n'

// Sync language with URL before hydration so first paint matches the prerendered HTML
void i18n.changeLanguage(langFromPath(window.location.pathname))

const HomePage           = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const AboutPage          = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const GlossaryPage       = lazy(() => import('./pages/GlossaryPage').then(m => ({ default: m.GlossaryPage })))
const ArticlesPage       = lazy(() => import('./pages/ArticlesPage').then(m => ({ default: m.ArticlesPage })))
const ContactPage        = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })))
const TheStackPage       = lazy(() => import('./pages/TheStackPage').then(m => ({ default: m.TheStackPage })))
const SitemapPage        = lazy(() => import('./pages/SitemapPage').then(m => ({ default: m.SitemapPage })))
const GlossaryTermPage   = lazy(() => import('./pages/GlossaryTermPage').then(m => ({ default: m.GlossaryTermPage })))
const PartPage           = lazy(() => import('./pages/PartPage').then(m => ({ default: m.PartPage })))
const LevelPage          = lazy(() => import('./pages/LevelPage').then(m => ({ default: m.LevelPage })))
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))
const InnerSpectrumPage  = lazy(() => import('./pages/InnerSpectrumPage').then(m => ({ default: m.InnerSpectrumPage })))
const PrivacyPage        = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })))
const TermsPage          = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })))
const BioPage            = lazy(() => import('./pages/BioPage').then(m => ({ default: m.BioPage })))
const BioMetricPage      = lazy(() => import('./pages/BioMetricPage').then(m => ({ default: m.BioMetricPage })))
const TopicsPage         = lazy(() => import('./pages/TopicsPage').then(m => ({ default: m.TopicsPage })))
const TopicPage          = lazy(() => import('./pages/TopicPage').then(m => ({ default: m.TopicPage })))
const ArticlesSlugRouter = lazy(() => import('./components/ArticlesSlugRouter'))
const ReviewsPage           = lazy(() => import('./pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })))
const ReviewMethodologyPage = lazy(() => import('./pages/ReviewMethodologyPage').then(m => ({ default: m.ReviewMethodologyPage })))
const ReviewPage            = lazy(() => import('./pages/ReviewPage').then(m => ({ default: m.ReviewPage })))
const ComparisonPage        = lazy(() => import('./pages/ComparisonPage').then(m => ({ default: m.ComparisonPage })))

const app = (
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-[#050a0f]" />}>
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
            <Route path="/reviews"               element={<ReviewsPage />} />
            <Route path="/reviews/methodology"   element={<ReviewMethodologyPage />} />
            <Route path="/reviews/compare/:slug" element={<ComparisonPage />} />
            <Route path="/reviews/:slug"         element={<ReviewPage />} />
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
