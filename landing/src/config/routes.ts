/**
 * Единый источник маршрутов для роутера и prerender.
 * При добавлении новой страницы: добавь сюда path и component, prerender подхватит автоматически.
 */
import type { ComponentType } from 'react'
import { HomePage } from '../pages/HomePage'
import { AboutPage } from '../pages/AboutPage'
import { GlossaryPage } from '../pages/GlossaryPage'
import { glossaryTerms } from '../data/glossary'
import { parts } from '../pages/PartPage'

/** Статические маршруты (без параметров в path) */
export const staticRoutes: { path: string; component: ComponentType }[] = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/glossary', component: GlossaryPage },
]

/** Все маршруты для prerender — генерируется автоматически из данных */
export function getPrerenderRoutes(): string[] {
  return [
    ...staticRoutes.map((r) => r.path),
    ...glossaryTerms.map((t) => `/glossary/${t.slug}`),
    ...Object.keys(parts).map((s) => `/part/${s}`),
  ]
}
