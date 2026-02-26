import { HeroSection } from '../components/HeroSection'
import { ConceptSection } from '../components/ConceptSection'
import { LevelsSection } from '../components/LevelsSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { ArticlesSection } from '../components/ArticlesSection'
import { CtaSection } from '../components/CtaSection'

export function HomePage() {
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
