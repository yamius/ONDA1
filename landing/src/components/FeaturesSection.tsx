import { useTranslation } from 'react-i18next'

const FEATURE_ICONS = ['📊', '🎮', '⚙️']

interface FeatureItem {
  title: string
  description: string
  iconAlt: string
}

export function FeaturesSection() {
  const { t } = useTranslation('home')
  const items = t('features.items', { returnObjects: true }) as FeatureItem[]

  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('features.tag')}
        </h2>
        <h3 className="mb-10 text-2xl font-bold tracking-tight md:mb-16 md:text-4xl">
          {t('features.titlePrefix')}{' '}
          <span className="bg-gradient-to-r from-terminal-cyan to-terminal-green bg-clip-text text-transparent">
            {t('features.titleHighlight')}
          </span>
        </h3>

        <div className="grid gap-4 md:gap-8 md:grid-cols-3">
          {items.map((feature, i) => (
            <div
              key={i}
              className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/10 md:p-8"
            >
              <span className="mb-6 block text-4xl" role="img" aria-label={feature.iconAlt}>
                {FEATURE_ICONS[i]}
              </span>
              <h3 className="mb-3 text-lg font-semibold">{feature.title}</h3>
              <p className="font-mono text-xs leading-relaxed text-white/40">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
