/**
 * Единый источник маршрутов для роутера и prerender.
 * При добавлении новой страницы: добавь сюда path и component, prerender подхватит автоматически.
 */
import type { ComponentType } from 'react'
import { HomePage } from '../pages/HomePage'
import { AboutPage } from '../pages/AboutPage'
import { GlossaryPage } from '../pages/GlossaryPage'
import { ArticlesPage } from '../pages/ArticlesPage'
import { ContactPage } from '../pages/ContactPage'
import { TheStackPage } from '../pages/TheStackPage'
import { glossaryTerms } from '../data/glossary'
import { articles } from '../data/articles'
import { parts } from '../pages/PartPage'
import { levelsData } from '../data/levels'

/** Статические маршруты (без параметров в path) */
export const staticRoutes: { path: string; component: ComponentType }[] = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/glossary', component: GlossaryPage },
  { path: '/articles', component: ArticlesPage },
  { path: '/contact', component: ContactPage },
  { path: '/the-stack', component: TheStackPage },
]

/** Все маршруты для prerender — генерируется автоматически из данных */
export function getPrerenderRoutes(): string[] {
  return [
    ...staticRoutes.map((r) => r.path),
    ...glossaryTerms.map((t) => `/glossary/${t.slug}`),
    ...articles.map((a) => `/articles/${a.slug}`),
    ...Object.keys(parts).map((s) => `/part/${s}`),
    ...Object.keys(levelsData).map((n) => `/level/${n}`),
  ]
}
