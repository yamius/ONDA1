import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HeroSection } from '../components/HeroSection'
import { ConceptSection } from '../components/ConceptSection'
import { LevelsSection } from '../components/LevelsSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { ArticlesSection } from '../components/ArticlesSection'
import { CtaSection } from '../components/CtaSection'

export function HomePage() {
  const { t } = useTranslation('home')

  useEffect(() => {
    const title = t('meta.title')
    const desc = t('meta.description')
    document.title = title
    const setMeta = (name: string, content: string, isProp = false) => {
      const sel = isProp ? `meta[property="${name}"]` : `meta[name="${name}"]`
      const el = document.head.querySelector(sel) as HTMLMetaElement | null
      if (el) el.content = content
    }
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
  }, [t])

  return (
    <>
      <HeroSection />
      <ConceptSection />
      <LevelsSection />
      <FeaturesSection />
      <ArticlesSection />
      <CtaSection />
    </>
  )
}
