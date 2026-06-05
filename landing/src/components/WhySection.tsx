import { useTranslation } from 'react-i18next'

interface WhyCard {
  title: string
  text: string
}

// "Why ONDA": differentiation vs meditation apps and trackers.
export function WhySection() {
  const { t } = useTranslation('home')
  const cards = t('why.cards', { returnObjects: true }) as WhyCard[]

  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('why.tag')}
        </h2>
        <h3 className="mb-10 text-2xl font-bold tracking-tight md:mb-16 md:text-4xl">
          {t('why.title')}
        </h3>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="glass-card rounded-xl border border-white/5 p-6 transition-all hover:border-terminal-green/20 md:p-8"
            >
              <h4 className="mb-2 text-lg font-semibold text-white">{card.title}</h4>
              <p className="font-mono text-xs leading-relaxed text-white/45 md:text-sm">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
