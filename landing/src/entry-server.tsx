/**
 * SSR entry point for prerender. Uses StaticRouter instead of BrowserRouter.
 * Exports the app for a given location.
 */
import { StrictMode } from 'react'
import { StaticRouter, Routes, Route, useParams } from 'react-router-dom'
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

export function createApp(location: string) {
  return (
    <StrictMode>
      <StaticRouter location={location}>
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
      </StaticRouter>
    </StrictMode>
  )
}
