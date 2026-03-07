/**
 * Ensures path has no trailing slash. Avoids 301 redirects when user clicks.
 * Use for all Link to= and <a href=> in navigation.
 */
export function normalizePath(path: string): string {
  if (!path || path === '/') return path
  return path.replace(/\/+$/, '') || '/'
}
