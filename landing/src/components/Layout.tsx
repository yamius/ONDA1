import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

export function Layout() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-[#050a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050a0f]/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          {/* Logo + burger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-white/20 hover:text-white md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
            <Link to="/" className="font-mono text-lg font-bold" onClick={() => setMenuOpen(false)}>
              <span className="text-cyan-400">{'> ONDA'}</span>
              <span className="text-green-400"> LIFE</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/glossary"
              className={`rounded-lg border px-5 py-2 text-sm transition-all ${
                location.pathname.startsWith('/glossary')
                  ? 'border-cyan-500 text-cyan-300'
                  : 'border-cyan-500/30 text-cyan-400 hover:border-cyan-500 hover:text-cyan-300'
              }`}
            >
              Glossary
            </Link>
            <a
              href="#about"
              className="rounded-lg border border-cyan-500/30 px-5 py-2 text-sm text-cyan-400 transition-all hover:border-cyan-500 hover:text-cyan-300"
            >
              About
            </a>
            <a
              href="#download"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-5 py-2 text-sm font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600"
            >
              Download App
            </a>
          </div>

          {/* Mobile: Download App button always visible */}
          <a
            href="#download"
            className="shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-3 py-1.5 text-xs font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600 md:hidden"
          >
            Download
          </a>
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="fixed inset-0 top-[52px] z-40 bg-[#050a0f] md:hidden">
            <div className="flex flex-col px-6 pt-4">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                About
              </Link>
              <Link
                to="/glossary"
                onClick={() => setMenuOpen(false)}
                className={`border-b border-white/10 py-3 text-sm font-medium transition-colors hover:text-white ${
                  location.pathname.startsWith('/glossary') ? 'text-cyan-400' : 'text-white/70'
                }`}
              >
                Glossary
              </Link>
              <button
                className="border-b border-white/10 py-3 text-left text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Language
              </button>
              <a
                href="#download"
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Download
              </a>
              <a
                href="mailto:hello@onda-life.com"
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Contacts
              </a>

              {/* Store badges in mobile menu */}
              <div className="mt-6 flex gap-3">
                <a
                  href="#"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs text-white/50 transition-all hover:border-white/20"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  App Store
                </a>
                <a
                  href="#"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs text-white/50 transition-all hover:border-white/20"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-[#050a0f]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-1 font-mono text-lg font-bold">
              <span className="text-cyan-400">{'> ONDA'}</span>
              <span className="text-green-400"> LIFE</span>
            </div>
            <div className="flex gap-6">
              <Link to="/glossary" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Glossary
              </Link>
              <a href="mailto:hello@onda-life.com" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Contact
              </a>
            </div>
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} ONDA Life
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
