import { useEffect } from 'react'
import { HrvEmbedWidget } from '../components/HrvEmbedWidget'

/**
 * Bare host for the embeddable HRV widget at /embed/hrv — rendered OUTSIDE
 * Layout (no site header/footer/nav) so it sits cleanly inside an iframe on
 * other sites. noindex is set via meta-inject. The page is frameable
 * cross-origin via the /embed/* header exception in server.js.
 */
export function HrvEmbedPage() {
  useEffect(() => {
    document.title = 'HRV Interpreter — ONDA Life'
  }, [])
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-3">
      <HrvEmbedWidget />
    </div>
  )
}
