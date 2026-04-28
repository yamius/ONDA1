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
import { getArticleBySlug } from './data/articles'

function ArticlesSlugRouter() {
  const { slug } = useParams<{ slug: string }>()
  const staticArticle = slug ? getArticleBySlug(slug) : undefined
  if (staticArticle) return <ArticlePage />
  return <MdArticlePage />
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
          <Route path="/contact"     element={<ContactPage />} />
          <Route path="/the-stack"   element={<TheStackPage />} />
          <Route path="/sitemap"     element={<SitemapPage />} />
          <Route path="/glossary/:slug"  element={<GlossaryTermPage />} />
          <Route path="/articles/:slug"  element={<ArticlesSlugRouter />} />
          <Route path="/part/:slug"      element={<PartPage />} />
          <Route path="/level/:number"   element={<LevelPage />} />
          <Route path="/inner-spectrum" element={<InnerSpectrumPage />} />
          {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
            <Route key={`is-${l}`} path={`/${l}/inner-spectrum`} element={<InnerSpectrumPage />} />
          ))}
          <Route path="/privacy"        element={<PrivacyPage />} />
          <Route path="/terms"          element={<TermsPage />} />
          <Route path="/bio"            element={<BioPage />} />
          {SUPPORTED_LANGS.filter(l => l !== 'en').map(l => (
            <Route key={`bio-${l}`} path={`/${l}/bio`} element={<BioPage />} />
          ))}
          <Route path="/bio/:metric"    element={<BioMetricPage />} />
          <Route path="*"               element={<NotFoundPage />} />
        </Route>
      </Routes>
    </StaticRouter>
  )
}
