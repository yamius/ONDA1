import { Outlet, Link, useLocation } from 'react-router-dom'

export function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#050a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050a0f]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-mono text-lg font-bold">
            <span className="text-cyan-400">{'> ONDA'}</span>
            <span className="text-green-400"> LIFE</span>
          </Link>
          <div className="flex items-center gap-3">
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
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-[#050a0f]">
        <div className="mx-auto max-w-7xl px-6 py-12">
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
