/**
 * Static route paths — single source of truth for prerender and router.
 * Components are imported lazily in main.tsx (client) and directly in entry-server.tsx (SSR build).
 */
export const staticPaths: string[] = [
  '/',
  '/about',
  '/glossary',
  '/articles',
  '/contact',
  '/the-stack',
  '/sitemap',
  '/inner-spectrum',
  '/privacy',
  '/terms',
]
