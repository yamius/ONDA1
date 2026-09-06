import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ExperientialFrameworkNote } from '../components/ExperientialFrameworkNote'
import { useTranslation } from 'react-i18next'
import { langFromPath, localizedPathFor } from '../i18n'
import { syncOgLocale } from '../utils/ogLocale'
const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function InnerSpectrumPage() {
  const { t } = useTranslation('inner-spectrum')
  const { t: tHome } = useTranslation('home')
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bgRef.current
    if (!el) return

    const isMobile = () => window.matchMedia('(pointer: coarse)').matches

    let raf = 0
    let tx = 50, ty = 50
    let cx = 50, cy = 50

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 100
      ty = (e.clientY / window.innerHeight) * 100
    }

    const tick = () => {
      if (isMobile()) {
        const t = Date.now() / 8000
        tx = 50 + Math.sin(t) * 20
        ty = 50 + Math.cos(t * 0.7) * 20
      }
      cx += (tx - cx) * 0.04
      cy += (ty - cy) * 0.04
      el.style.setProperty('--gx', `${cx.toFixed(2)}%`)
      el.style.setProperty('--gy', `${cy.toFixed(2)}%`)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const title = t('meta.title')
    const desc = t('meta.description')
    const url = `${SITE_URL}${localizedPathFor('/inner-spectrum', lang)}`
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'article', true)
    setMeta('og:url', url, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)
    syncOgLocale(lang)
    return () => {
      const homeTitle = tHome('meta.title')
      const homeDesc = tHome('meta.description')
      document.title = homeTitle
      setMeta('description', homeDesc)
      setMeta('og:title', homeTitle, true)
      setMeta('og:description', homeDesc, true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('twitter:title', homeTitle, true)
      setMeta('twitter:description', homeDesc, true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
  }, [t, tHome, lang])

  const multitudeItems = t('section1.multitudeItems', { returnObjects: true }) as string[]

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-32 pt-8 md:px-6">

      <div
        ref={bgRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at var(--gx, 50%) var(--gy, 50%), rgba(0,255,170,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-[3]">

      <div className="mb-8 font-mono text-xs tracking-widest text-terminal-green/60">
        {t('section1.tag')}
      </div>
      <h1 className="mb-12 font-serif text-3xl font-bold leading-snug text-white md:text-5xl">
        {t('section1.title')}
      </h1>
      <div className="space-y-7 text-base leading-relaxed text-white/65 md:text-lg">
        <p>{t('section1.p1')}</p>
        <p>{t('section1.p2')}</p>
      </div>

      <div className="my-14 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-8 py-10">
        <p className="mb-6 text-sm leading-relaxed text-white/50 md:text-base">
          {t('section1.multitudeIntro')}
        </p>
        <ul className="space-y-5">
          {multitudeItems.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-white/70">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-terminal-green/70" />
              <span className="text-base leading-relaxed md:text-lg">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative my-16 overflow-hidden rounded-2xl px-6 py-20 text-center md:px-12">
        <style>{`
          @keyframes is-breathe {
            0%, 100% { transform: scale(1); opacity: 0.55; }
            50%       { transform: scale(1.18); opacity: 1; }
          }
        `}</style>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,255,170,0.09) 0%, transparent 70%)',
            animation: 'is-breathe 7s ease-in-out infinite',
          }}
        />
        <p className="relative font-serif text-xl leading-relaxed text-white/90 md:text-2xl md:leading-relaxed">
          {t('section1.close')}
        </p>
      </div>

      <div className="my-20 border-t border-white/[0.06]" />

      <div className="mb-8 font-mono text-xs tracking-widest text-terminal-green/60">
        {t('section2.tag')}
      </div>
      <h2 className="mb-12 font-serif text-3xl font-bold leading-snug text-white md:text-5xl">
        {t('section2.title')}
      </h2>
      <div className="space-y-7 text-base leading-relaxed text-white/65 md:text-lg">
        <p>{t('section2.p1')}</p>
        <p>{t('section2.p2')}</p>
      </div>

      <div className="my-14 rounded-2xl border border-terminal-green/20 bg-terminal-green/[0.04] px-8 py-10">
        <p className="mb-6 font-serif text-xl leading-relaxed text-white/90 md:text-2xl">
          {t('section2.insightHead')}
        </p>
        <p className="text-base leading-relaxed text-white/55 md:text-lg">
          {t('section2.insightBody')}
        </p>
      </div>

      <div className="relative my-16 overflow-hidden rounded-2xl px-6 py-20 text-center md:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,255,170,0.09) 0%, transparent 70%)',
            animation: 'is-breathe 7s ease-in-out infinite',
          }}
        />
        <p className="relative font-serif text-xl leading-relaxed text-white/90 md:text-2xl md:leading-relaxed">
          {t('section2.close')}
        </p>
      </div>

      <div className="my-20 border-t border-white/[0.06]" />

      <div className="mb-8 font-mono text-xs tracking-widest text-terminal-green/60">
        {t('section3.tag')}
      </div>
      <h2 className="mb-12 font-serif text-3xl font-bold leading-snug text-white md:text-5xl">
        {t('section3.title')}
      </h2>
      <div className="space-y-7 text-base leading-relaxed text-white/65 md:text-lg">
        <p>{t('section3.p1')}</p>
        <p>{t('section3.p2')}</p>
      </div>

      <div className="my-14 rounded-2xl border border-terminal-green/20 bg-terminal-green/[0.04] px-8 py-10">
        <p className="mb-3 font-serif text-xl leading-relaxed text-white/90 md:text-2xl">
          {t('section3.insight1')}
        </p>
        <p className="font-serif text-xl leading-relaxed text-white/70 md:text-2xl">
          {t('section3.insight2')}
        </p>
      </div>

      <div className="space-y-7 text-base leading-relaxed text-white/65 md:text-lg">
        <p>{t('section3.p3')}</p>
      </div>

      <div className="relative my-16 overflow-hidden rounded-2xl px-6 py-20 text-center md:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,255,170,0.09) 0%, transparent 70%)',
            animation: 'is-breathe 7s ease-in-out infinite',
          }}
        />
        <p className="relative font-serif text-xl leading-relaxed text-white/90 md:text-2xl md:leading-relaxed">
          {t('section3.close')}
        </p>
      </div>

      <div className="my-20 border-t border-white/[0.06]" />

      <div className="mb-8 font-mono text-xs tracking-widest text-terminal-green/60">
        {t('section4.tag')}
      </div>
      <h2 className="mb-12 font-serif text-3xl font-bold leading-snug text-white md:text-5xl">
        {t('section4.title')}
      </h2>
      <div className="space-y-7 text-base leading-relaxed text-white/65 md:text-lg">
        <p>{t('section4.p1')}</p>
      </div>

      <div className="my-14 rounded-2xl border border-terminal-green/20 bg-terminal-green/[0.04] px-8 py-10">
        <p className="mb-5 font-serif text-xl leading-relaxed text-white/90 md:text-2xl">
          {t('section4.insightHead')}
        </p>
        <p className="text-base leading-relaxed text-white/55 md:text-lg">
          {t('section4.insightBody')}
        </p>
      </div>

      <div className="space-y-7 text-base leading-relaxed text-white/65 md:text-lg">
        <p>{t('section4.p2')}</p>
      </div>

      <div className="mt-20 text-center">
        <Link
          to={`${localizedPathFor('/', lang)}#download`.replace('//', '/')}
          className="inline-block font-mono text-sm text-terminal-green/50 transition-colors hover:text-terminal-green"
        >
          {t('cta')}
        </Link>
      </div>

      <ExperientialFrameworkNote />

      </div>
    </div>
  )
}
