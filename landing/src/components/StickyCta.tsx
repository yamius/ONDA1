import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Mobile-only sticky "Start Free" bar. Slides up once the visitor scrolls
// past the hero, giving a persistent low-friction CTA on the long page.
export function StickyCta() {
  const { t } = useTranslation('home')
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!show}
    >
      <div className="border-t border-white/10 bg-[#0a1018]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <a
          href="#download"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-6 py-3 text-sm font-bold text-black"
          aria-label={t('hero.ctaDownloadAria')}
          tabIndex={show ? 0 : -1}
        >
          <span>{t('hero.ctaDownload')}</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>
  )
}
