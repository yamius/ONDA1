const ASSET_CACHE = 'onda-assets-v1'
const HTML_CACHE  = 'onda-html-v1'

// Install: activate immediately, no pre-caching needed (Vite assets load on demand)
self.addEventListener('install', () => self.skipWaiting())

// Activate: remove old caches from previous versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== ASSET_CACHE && k !== HTML_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests from our own origin
  if (request.method !== 'GET') return
  if (url.origin !== self.location.origin) return

  // Hashed static assets (JS chunks, CSS, fonts, images) → cache-first
  // Vite adds content hash to filenames, so stale content is impossible
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/images/') ||
    /\.(webp|png|jpg|jpeg|svg|ico|woff2|woff)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, ASSET_CACHE))
    return
  }

  // HTML navigation → stale-while-revalidate
  // User sees cached page instantly; fresh version fetched in background for next visit
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request, HTML_CACHE))
    return
  }
})

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch (e) {
    return cached || new Response('Offline', { status: 503 })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => null)
  return cached || await fetchPromise
}
