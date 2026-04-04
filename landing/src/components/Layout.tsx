import { useState, useEffect, useLayoutEffect, Suspense } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { TransitionLink } from './TransitionLink'

export function Layout() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    if (location.hash) {
      // Hash present — scroll to anchor after page renders (e.g. /#download from another page)
      const id = location.hash.slice(1)
      const attempt = (tries: number) => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (tries > 0) {
          setTimeout(() => attempt(tries - 1), 100)
        }
      }
      attempt(8)
    } else {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [location.pathname, location.hash])

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
          <TransitionLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="mb-4 flex items-center gap-2 font-mono text-lg font-bold"
          >
            <span className="text-cyan-400">ONDA</span>
            <span className="text-green-400"> LIFE</span>
          </TransitionLink>
          <TransitionLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname === '/about' ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            About<span className="sr-only"> ONDA Life — biohacking OS</span>
          </TransitionLink>
          <TransitionLink
            to="/glossary"
            onClick={() => setMenuOpen(false)}
            className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname.startsWith('/glossary') ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            Glossary<span className="sr-only"> of biohacking and neuroscience terms</span>
          </TransitionLink>
          <TransitionLink
            to="/articles"
            onClick={() => setMenuOpen(false)}
            className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname.startsWith('/articles') ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            Articles<span className="sr-only"> on biohacking and human optimization</span>
          </TransitionLink>
          <a
            href="/#download"
            onClick={() => setMenuOpen(false)}
            className="block border-b border-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Download
          </a>
          <TransitionLink
            to="/bio"
            onClick={() => setMenuOpen(false)}
            className="-mx-4 block border-b border-white/5 bg-gradient-to-r from-green-400/70 to-transparent px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80"
          >
            Bio OS
          </TransitionLink>
          <TransitionLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={`block py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname === '/contact' ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            Contacts<span className="sr-only"> — reach ONDA Life team</span>
          </TransitionLink>
        </nav>
      </div>

      <main>
        {/* Scrolling header — logo + download */}
        <header className="border-b border-white/5 bg-[#1a1b26]/70 backdrop-blur-xl pt-[max(env(safe-area-inset-top,0px),8px)] md:pt-2">
          <div className="header-content-center mx-auto flex max-w-7xl items-center justify-between pr-5 py-2 md:py-2 md:pr-6">
            <TransitionLink to="/" className="font-mono text-base font-bold md:text-lg" onClick={() => setMenuOpen(false)}>
              <span className="text-cyan-400">ONDA</span>
              <span className="text-green-400"> LIFE</span>
            </TransitionLink>
            <TransitionLink
              to="/bio"
              onClick={() => setMenuOpen(false)}
              className="shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-3 py-1.5 text-xs font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600 md:px-4 md:py-1.5 md:text-sm"
            >
              Bio OS
            </TransitionLink>
          </div>
        </header>
        <div className="pt-6">
          <Suspense fallback={<div className="min-h-screen" />}>
            <Outlet />
          </Suspense>
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
                About<span className="sr-only"> ONDA Life — biohacking OS</span>
              </Link>
              <Link to="/glossary" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Glossary<span className="sr-only"> of biohacking and neuroscience terms</span>
              </Link>
              <Link to="/articles" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Articles<span className="sr-only"> on biohacking and human optimization</span>
              </Link>
              <Link to="/bio" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Bio OS<span className="sr-only"> — live biometrics measurement</span>
              </Link>
              <Link to="/contact" className="text-xs text-white/40 transition-colors hover:text-white/60">
                Contacts<span className="sr-only"> — reach ONDA Life team</span>
              </Link>
            </div>
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} ONDA Life
            </p>
          </div>
          <div className="mt-8 grid grid-cols-3 items-center">
            <div />
            <div className="flex justify-center">
              <Link
                to="/sitemap"
                className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 border-b border-dotted border-white/10 pb-0.5"
              >
                Site map
              </Link>
            </div>
            <div className="flex justify-end items-center gap-4">
              <Link
                to="/privacy"
                className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 border-b border-dotted border-white/10 pb-0.5"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 border-b border-dotted border-white/10 pb-0.5"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
