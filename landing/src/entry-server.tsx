/**
 * SSR entry point for prerender. Uses StaticRouter instead of BrowserRouter.
 * Exports the app for a given location.
 */
import { StrictMode } from 'react'
import { StaticRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { GlossaryTermPage } from './pages/GlossaryTermPage'
import { PartPage } from './pages/PartPage'
import { LevelPage } from './pages/LevelPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { staticRoutes } from './config/routes'

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
            <Route path="/part/:slug" element={<PartPage />} />
            <Route path="/level/:number" element={<LevelPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </StaticRouter>
    </StrictMode>
  )
}
