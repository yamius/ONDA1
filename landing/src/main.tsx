import { StrictMode, lazy, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import i18n, { langFromPath, loadLocale, SUPPORTED_LANGS } from './i18n'

// Resolve language from URL up front so we know which locale chunk to fetch
// before React renders. We always need EN as the i18next fallback.
const initialLang = langFromPath(window.location.pathname)

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
const ArticlesSlugRouter = lazy(() => import('./components/ArticlesSlugRouter'))
const TopicsPage         = lazy(() => import('./pages/TopicsPage').then(m => ({ default: m.TopicsPage })))
const TopicPage          = lazy(() => import('./pages/TopicPage').then(m => ({ default: m.TopicPage })))
const LicensePage        = lazy(() => import('./pages/LicensePage').then(m => ({ default: m.LicensePage })))

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
            <Route path="/topics"          element={<TopicsPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`topics-${l}`} path={`/${l}/topics`} element={<TopicsPage />} />
            ))}
            <Route path="/topics/:slug"    element={<TopicPage />} />
            {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
              <Route key={`topic-${l}`} path={`/${l}/topics/:slug`} element={<TopicPage />} />
            ))}
            <Route path="/license"         element={<LicensePage />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
)

const container = document.getElementById('root')!

// Wait for the active locale (and EN fallback) before hydrating so the React
// tree's translated text matches the prerendered HTML byte-for-byte. Without
// this, react-i18next would emit translation keys instead of strings on first
// render and React would discard the SSR DOM with a hydration mismatch.
const localeReady = Promise.all(
  initialLang === 'en' ? [loadLocale('en')] : [loadLocale('en'), loadLocale(initialLang)],
).then(() => {
  if (i18n.language !== initialLang) void i18n.changeLanguage(initialLang)
})

void localeReady.then(() => {
  if (container.hasChildNodes()) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
})

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
