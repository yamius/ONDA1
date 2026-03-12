import { StrictMode, lazy, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'

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
const ArticlesSlugRouter = lazy(() => import('./components/ArticlesSlugRouter'))

const app = (
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-[#050a0f]" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"            element={<HomePage />} />
            <Route path="/about"       element={<AboutPage />} />
            <Route path="/glossary"    element={<GlossaryPage />} />
            <Route path="/articles"    element={<ArticlesPage />} />
            <Route path="/contact"     element={<ContactPage />} />
            <Route path="/the-stack"   element={<TheStackPage />} />
            <Route path="/sitemap"     element={<SitemapPage />} />
            <Route path="/glossary/:slug"  element={<GlossaryTermPage />} />
            <Route path="/articles/:slug"  element={<ArticlesSlugRouter />} />
            <Route path="/part/:slug"      element={<PartPage />} />
            <Route path="/level/:number"   element={<LevelPage />} />
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
