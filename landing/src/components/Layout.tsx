import { useState, useEffect, useLayoutEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

export function Layout() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)

  useLayoutEffect(() => {
    setVisible(false)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    requestAnimationFrame(() => setVisible(true))
  }, [location.pathname])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-[#050a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050a0f]/60 backdrop-blur-xl pt-[max(env(safe-area-inset-top,0px),12px)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6 md:py-4">
          {/* Logo with > button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 font-mono text-sm text-cyan-400 transition-all hover:border-cyan-500 hover:text-cyan-300"
              style={{ transform: menuOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
              aria-label="Menu"
            >
              {'>'}
            </button>
            <Link to="/" className="font-mono text-lg font-bold" onClick={() => setMenuOpen(false)}>
              <span className="text-cyan-400">ONDA</span>
              <span className="text-green-400"> LIFE</span>
            </Link>
          </div>

          {/* Download App — always visible */}
          <a
            href="#download"
            className="shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-4 py-2 text-xs font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600 mr-6 md:mr-8 md:px-5 md:text-sm"
          >
            Download App
          </a>
        </div>

        {/* Dropdown menu — same on all screens */}
        {menuOpen && (
          <div className="border-t border-white/5 bg-[#050a0f]">
            <div className="mx-auto max-w-7xl px-5 py-2 md:px-6">
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/about' ? 'text-cyan-400' : 'text-white/70'
                }`}
              >
                About
              </Link>
              <Link
                to="/glossary"
                onClick={() => setMenuOpen(false)}
                className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
                  location.pathname.startsWith('/glossary') ? 'text-cyan-400' : 'text-white/70'
                }`}
              >
                Glossary
              </Link>
              <Link
                to="/articles"
                onClick={() => setMenuOpen(false)}
                className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
                  location.pathname.startsWith('/articles') ? 'text-cyan-400' : 'text-white/70'
                }`}
              >
                Articles
              </Link>
              <button
                className="block w-full border-b border-white/5 py-3 text-left text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Language
              </button>
              <a
                href="#download"
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Download
              </a>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className={`block py-3 text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/contact' ? 'text-cyan-400' : 'text-white/70'
                }`}
              >
                Contacts
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main style={{ opacity: visible ? 1 : 0 }}>
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-[#050a0f]/60 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-1 font-mono text-lg font-bold">
              <span className="text-cyan-400">{'> ONDA'}</span>
              <span className="text-green-400"> LIFE</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/about" className="text-xs text-white/40 transition-colors hover:text-white/60">
                About
              </Link>
              <Link to="/glossary" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Glossary
              </Link>
              <Link to="/articles" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Articles
              </Link>
              <a href="#download" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Download
              </a>
              <Link to="/contact" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Contacts
              </Link>
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
