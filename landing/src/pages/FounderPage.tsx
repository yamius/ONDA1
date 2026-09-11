/**
 * /people/yakiv-bilenko — the founder's canonical person page. Localized to
 * ru + es via people-i18n.ts. The visible bio + meta localize; the ProfilePage's
 * mainEntity Person is the site's canonical author (@id <site>/#author) and
 * stays language-neutral so the author graph is one node — only the ProfilePage
 * wrapper carries inLanguage.
 *
 * Honesty: Yakiv's expertise is architecture, psychology and Gestalt therapy
 * plus product engineering — NOT clinical neuroscience; that authority is the
 * scientific advisor's. Never imply the founder is the scientific authority.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath, langHref, homePathFor } from '../i18n'
import { renderRich, type RichLink } from '../utils/richText'
import { PEOPLE_I18N, type PeopleCopy } from '../data/people-i18n'

type Lang = 'en' | 'ru' | 'es'
const SITE_URL = 'https://onda-life.com'
const CANONICAL_URL = `${SITE_URL}/people/yakiv-bilenko`
const AUTHOR_ID = `${SITE_URL}/#author`
const SAME_AS = ['https://www.linkedin.com/in/yamius', 'https://wateremotions.tilda.ws/kukoom']
const PAGE_DESC_EN = PEOPLE_I18N.en.metaDescription

function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
}

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

/** ProfilePage/Person JSON-LD. The Person is the site's canonical author node
 *  (language-neutral, EN); only the ProfilePage wrapper localizes. */
export function founderJsonLd(lang: Lang = 'en'): Record<string, unknown>[] {
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/people/yakiv-bilenko`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${pageUrl}#profile`,
      url: pageUrl,
      inLanguage: lang,
      isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL },
      mainEntity: {
        '@type': 'Person',
        '@id': AUTHOR_ID,
        name: 'Yakiv Bilenko',
        url: CANONICAL_URL,
        sameAs: SAME_AS,
        jobTitle: 'Founder & CEO, ONDA Life',
        description: PAGE_DESC_EN,
        knowsAbout: [
          'architecture',
          'architecture and human psychological states',
          'Gestalt therapy',
          'systemic family therapy',
          'psychology',
          'breathwork',
          'heart rate variability',
          'physiological self-regulation',
        ],
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'Kyiv National University of Construction and Architecture (KNUCA)' },
          { '@type': 'EducationalOrganization', name: 'MIGIS institute (Gestalt therapy)' },
        ],
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Architect (urban planning), KNUCA, 2006' },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'Gestalt & systemic-family therapist, MIGIS, 2018' },
        ],
        worksFor: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      },
    },
  ]
}

export function FounderPage() {
  const location = useLocation()
  const lang = langFromPath(location.pathname) as Lang
  const copy: PeopleCopy = PEOPLE_I18N[lang] ?? PEOPLE_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/people/yakiv-bilenko`

  const links: Record<string, RichLink> = Object.fromEntries(
    Object.entries(copy.links).map(([k, v]) => [k, { to: langHref(v.path, lang), label: v.label }]),
  )

  useEffect(() => {
    document.title = copy.metaTitle
    setMeta('description', copy.metaDescription)
    setMeta('og:title', copy.metaTitle, true)
    setMeta('og:description', copy.metaDescription, true)
    setMeta('og:type', 'profile', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary', true)
    setMeta('twitter:title', copy.metaTitle, true)
    setMeta('twitter:description', copy.metaDescription, true)
    // ProfilePage/Person JSON-LD + hreflang emitted statically by prerender/meta-inject.
  }, [copy, pageUrl])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      {/* Breadcrumb */}
      <nav className="mt-6 mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to={langHref('/about', lang)} className="transition-colors hover:text-white/50">{copy.breadcrumbAbout}</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">Yakiv Bilenko</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">{copy.kicker}</div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-5xl">Yakiv Bilenko</h1>
      <p className="mb-8 font-mono text-sm text-white/50">{copy.role}</p>

      {/* Bio */}
      <section className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
        {copy.bioParas.map((p, i) => (
          <p key={i}>{renderRich(p, links, `bio${i}`)}</p>
        ))}
      </section>

      {/* Scope boundary — the honest E-E-A-T note */}
      <section className="mt-10 rounded-lg border border-white/10 bg-white/[0.02] p-5">
        <h2 className="mb-2 font-mono text-xs tracking-widest text-terminal-amber/80">{copy.scopeHeading}</h2>
        <p className="font-mono text-xs leading-relaxed text-white/60 md:text-sm">{renderRich(copy.scopeBody, links, 'scope')}</p>
      </section>

      {/* Links */}
      <section className="mt-10">
        <h2 className="mb-3 font-mono text-xs tracking-widest text-terminal-green/60">{copy.elsewhereHeading}</h2>
        <ul className="space-y-2 font-mono text-sm">
          <li>
            <a href="https://www.linkedin.com/in/yamius" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green">
              {copy.linkedinLabel}
            </a>
          </li>
          <li>
            <a href="https://wateremotions.tilda.ws/kukoom" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green">
              {copy.kukoomLabel}
            </a>
          </li>
        </ul>
      </section>

      <p className="mt-10 font-mono text-xs leading-relaxed text-white/40">
        {copy.morePre}
        <Link to={langHref('/about', lang)} className="text-terminal-green hover:underline">{copy.links.aboutLink.label}</Link>,{' '}
        <Link to={langHref('/product', lang)} className="text-terminal-green hover:underline">{copy.links.productLink.label}</Link>,{' '}
        <Link to={langHref('/research', lang)} className="text-terminal-green hover:underline">{copy.links.scienceLink.label}</Link>.
      </p>
    </main>
  )
}
