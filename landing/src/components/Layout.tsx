import { useState, useEffect, useLayoutEffect, Suspense, useMemo } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TransitionLink } from './TransitionLink'
import i18n, { SUPPORTED_LANGS, LANG_LABELS, langFromPath, homePathFor, localizedPathFor, type Lang } from '../i18n'

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation('home')

  // Derive language from URL — single source of truth.
  const currentLang: Lang = useMemo(() => langFromPath(location.pathname), [location.pathname])

  // Keep i18n + <html lang> in sync with the URL on every navigation
  useLayoutEffect(() => {
    if (i18n.language !== currentLang) {
      void i18n.changeLanguage(currentLang)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang
    }
  }, [currentLang])

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

  const switchLang = (lang: Lang) => {
    setMenuOpen(false)
    // Try to keep the user on the same page in the new language. For pages not
    // yet localized (Articles, Glossary, etc) localizedPathFor falls back to
    // the home of the chosen locale.
    navigate(localizedPathFor(location.pathname, lang))
  }

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
            to={homePathFor(currentLang)}
            onClick={() => setMenuOpen(false)}
            className="mb-4 flex items-center gap-2 font-mono text-lg font-bold"
          >
            <span className="text-cyan-400">ONDA</span>
            <span className="text-green-400"> LIFE</span>
          </TransitionLink>
          <TransitionLink
            to={localizedPathFor('/about', currentLang)}
            onClick={() => setMenuOpen(false)}
            className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname.endsWith('/about') ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            {t('menu.about')}<span className="sr-only">{t('menu.aboutSr')}</span>
          </TransitionLink>
          <TransitionLink
            to={localizedPathFor('/inner-spectrum', currentLang)}
            onClick={() => setMenuOpen(false)}
            className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname.endsWith('/inner-spectrum') ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            {t('menu.philosophy')}<span className="sr-only">{t('menu.philosophySr')}</span>
          </TransitionLink>
          <TransitionLink
            to="/glossary"
            onClick={() => setMenuOpen(false)}
            className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname.startsWith('/glossary') ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            {t('menu.glossary')}<span className="sr-only">{t('menu.glossarySr')}</span>
          </TransitionLink>
          <TransitionLink
            to="/articles"
            onClick={() => setMenuOpen(false)}
            className={`block border-b border-white/5 py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname.startsWith('/articles') ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            {t('menu.articles')}<span className="sr-only">{t('menu.articlesSr')}</span>
          </TransitionLink>
          <a
            href={`${homePathFor(currentLang)}#download`.replace('//', '/')}
            onClick={() => setMenuOpen(false)}
            className="block border-b border-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            {t('menu.download')}
          </a>
          {/* Language picker — between Download and Bio OS */}
          <div
            role="group"
            aria-label={t('menu.languagesLabel')}
            className="flex items-center justify-between gap-1 border-b border-white/5 py-2"
          >
            {SUPPORTED_LANGS.map(lang => {
              const active = lang === currentLang
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => switchLang(lang)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex-1 rounded-md py-1.5 font-mono text-xs font-semibold tracking-wider transition-colors ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              )
            })}
          </div>
          <TransitionLink
            to={localizedPathFor('/bio', currentLang)}
            onClick={() => setMenuOpen(false)}
            className="-mx-4 block border-b border-white/5 bg-gradient-to-r from-green-400/70 to-transparent px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80"
          >
            {t('menu.bio')}
          </TransitionLink>
          <TransitionLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={`block py-3 text-sm font-medium transition-colors hover:text-white ${
              location.pathname === '/contact' ? 'text-cyan-400' : 'text-white/70'
            }`}
          >
            {t('menu.contacts')}<span className="sr-only">{t('menu.contactsSr')}</span>
          </TransitionLink>
        </nav>
      </div>

      <main>
        {/* Scrolling header — logo + download */}
        <header className="border-b border-white/5 bg-[#1a1b26]/70 backdrop-blur-xl pt-[max(env(safe-area-inset-top,0px),8px)] md:pt-2">
          <div className="header-content-center mx-auto flex max-w-7xl items-center justify-between pr-5 py-2 md:py-2 md:pr-6">
            <TransitionLink to={homePathFor(currentLang)} className="font-mono text-base font-bold md:text-lg" onClick={() => setMenuOpen(false)}>
              <span className="text-cyan-400">ONDA</span>
              <span className="text-green-400"> LIFE</span>
            </TransitionLink>
            <TransitionLink
              to={localizedPathFor('/bio', currentLang)}
              onClick={() => setMenuOpen(false)}
              className="shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-3 py-1.5 text-xs font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600 md:px-4 md:py-1.5 md:text-sm"
            >
              {t('menu.bio')}
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
              to={homePathFor(currentLang)}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 font-mono text-lg font-bold transition-colors hover:text-cyan-400/90"
            >
              <span className="text-cyan-400">{'> ONDA'}</span>
              <span className="text-green-400"> LIFE</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to={localizedPathFor('/about', currentLang)} className="text-xs text-white/40 transition-colors hover:text-white/60">
                {t('menu.about')}<span className="sr-only">{t('menu.aboutSr')}</span>
              </Link>
              <Link to={localizedPathFor('/inner-spectrum', currentLang)} className="text-xs text-white/40 transition-colors hover:text-white/60">
                {t('menu.philosophy')}<span className="sr-only">{t('menu.philosophySr')}</span>
              </Link>
              <Link to={currentLang === 'en' ? '/glossary' : `/${currentLang}/glossary`} className="text-xs text-white/40 transition-colors hover:text-white/60">
                {t('menu.glossary')}<span className="sr-only">{t('menu.glossarySr')}</span>
              </Link>
              <Link to={currentLang === 'en' ? '/articles' : `/${currentLang}/articles`} className="text-xs text-white/40 transition-colors hover:text-white/60">
                {t('menu.articles')}<span className="sr-only">{t('menu.articlesSr')}</span>
              </Link>
              <Link to={localizedPathFor('/bio', currentLang)} className="text-xs text-white/40 transition-colors hover:text-white/60">
                {t('menu.bio')}<span className="sr-only">{t('menu.bioSr')}</span>
              </Link>
              <Link to={currentLang === 'en' ? '/contact' : `/${currentLang}/contact`} className="text-xs text-white/40 transition-colors hover:text-white/60">
                {t('menu.contacts')}<span className="sr-only">{t('menu.contactsSr')}</span>
              </Link>
            </div>
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} ONDA Life
            </p>
          </div>
          <div className="mt-8 flex flex-col items-center gap-2 md:grid md:grid-cols-3 md:items-center md:gap-0">
            <div className="hidden md:block" />
            <div className="flex justify-center">
              <Link
                to={currentLang === 'en' ? '/sitemap' : `/${currentLang}/sitemap`}
                className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 border-b border-dotted border-white/10 pb-0.5"
              >
                {t('footer.sitemap')}
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-end">
              <Link
                to={currentLang === 'en' ? '/privacy' : `/${currentLang}/privacy`}
                className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 border-b border-dotted border-white/10 pb-0.5"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to={currentLang === 'en' ? '/terms' : `/${currentLang}/terms`}
                className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 border-b border-dotted border-white/10 pb-0.5"
              >
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
