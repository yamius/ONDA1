import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import { GlossaryTermPage } from './pages/GlossaryTermPage'
import { ArticlePage } from './pages/ArticlePage'
import { MdArticlePage } from './pages/MdArticlePage'
import { PartPage } from './pages/PartPage'
import { LevelPage } from './pages/LevelPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { staticRoutes } from './config/routes'
import { getArticleBySlug } from './data/articles'

function ArticlesSlugRouter() {
  const { slug } = useParams<{ slug: string }>()
  const staticArticle = slug ? getArticleBySlug(slug) : undefined
  if (staticArticle) return <ArticlePage />
  return <MdArticlePage />
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {staticRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={<r.component />} />
          ))}
          <Route path="/glossary/:slug" element={<GlossaryTermPage />} />
          <Route path="/articles/:slug" element={<ArticlesSlugRouter />} />
          <Route path="/part/:slug" element={<PartPage />} />
          <Route path="/level/:number" element={<LevelPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

const container = document.getElementById('root')!
// Hydrate prerendered HTML to avoid flicker; fallback to render for empty root (e.g. 404 SPA fallback)
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
