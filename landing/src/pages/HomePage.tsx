import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HeroSection } from '../components/HeroSection'
import { BridgeSection } from '../components/BridgeSection'
import { ProductSection } from '../components/ProductSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { WhySection } from '../components/WhySection'
import { ProofSection } from '../components/ProofSection'
import { LevelsSection } from '../components/LevelsSection'
import { ArticlesSection } from '../components/ArticlesSection'
import { RecentLog } from '../components/RecentLog'
import { CtaSection } from '../components/CtaSection'
import { StickyCta } from '../components/StickyCta'

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

  // Conversion-focused order (product-first, framework-last):
  // hook → name the pain → show the product → how → differentiate → prove
  // → the 8-level journey (depth for the curious) → content → invite.
  return (
    <>
      <HeroSection />
      <BridgeSection />
      <ProductSection />
      <HowItWorksSection />
      <WhySection />
      <ProofSection />
      <LevelsSection />
      <RecentLog />
      <ArticlesSection />
      <CtaSection />
      <StickyCta />
    </>
  )
}
