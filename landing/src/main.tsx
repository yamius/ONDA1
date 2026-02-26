import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import { GlossaryTermPage } from './pages/GlossaryTermPage'
import { PartPage } from './pages/PartPage'
import { LevelPage } from './pages/LevelPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { staticRoutes } from './config/routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </StrictMode>,
)
