import { useState, useEffect, useLayoutEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { FooterSitemap } from './FooterSitemap'

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
    if (!menuOpen) return
    const handleScroll = () => setMenuOpen(false)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen && window.innerWidth >= 768) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-[#050a0f] text-white">
      {/* Fixed burger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="burger-anchor-center fixed z-[60] flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white/10 bg-[#1a1b26]/90 backdrop-blur-sm text-cyan-400 shadow-lg transition-colors hover:bg-[#1a1b26] hover:text-cyan-300 md:h-[30px] md:w-[30px]"
        style={{
          transform: menuOpen ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.2s',
        }}
        aria-label="Menu"
      >
        {'>'}
      </button>

      {/* Menu overlay — always in DOM for crawlers; hidden via opacity when closed */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => menuOpen && setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <div
        className={`fixed inset-0 z-50 flex items-start justify-center pt-20 transition-opacity duration-200 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Main navigation" className="mx-4 w-full max-w-sm rounded-lg border border-white/10 bg-[#1a1b26] p-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="mb-4 flex items-center gap-2 font-mono text-lg font-bold"
          >
            <span className="text-cyan-400">ONDA</span>
            <span className="text-green-400"> LIFE</span>
          </Link>
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
            type="button"
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
        </nav>
      </div>

      <main style={{ opacity: visible ? 1 : 0 }}>
        {/* Scrolling header — logo + download */}
        <header className="border-b border-white/5 bg-[#1a1b26]/70 backdrop-blur-xl pt-[max(env(safe-area-inset-top,0px),8px)] md:pt-2">
          <div className="header-content-center mx-auto flex max-w-7xl items-center justify-between pr-5 py-2 md:py-2 md:pr-6">
            <Link to="/" className="font-mono text-base font-bold md:text-lg" onClick={() => setMenuOpen(false)}>
              <span className="text-cyan-400">ONDA</span>
              <span className="text-green-400"> LIFE</span>
            </Link>
            <a
              href="#download"
              className="shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-3 py-1.5 text-xs font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600 md:px-4 md:py-1.5 md:text-sm"
            >
              Download App
            </a>
          </div>
        </header>
        <div className="pt-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-white/5 bg-[#1a1b26]/70 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 font-mono text-lg font-bold transition-colors hover:text-cyan-400/90"
            >
              <span className="text-cyan-400">{'> ONDA'}</span>
              <span className="text-green-400"> LIFE</span>
            </Link>
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
          <FooterSitemap />
        </div>
      </footer>
    </div>
  )
}
