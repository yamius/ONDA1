import { useTranslation } from 'react-i18next'

interface ConceptCardData {
  title: string
  description: string
}

export function ConceptSection() {
  const { t } = useTranslation('home')
  const cards = t('concept.cards', { returnObjects: true }) as ConceptCardData[]

  return (
    <section id="concept" className="relative -mt-20 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60 md:mb-6">
          {t('concept.tag')}
        </h2>
        <h3 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
          {t('concept.titlePrefix')}{' '}
          <span className="bg-gradient-to-r from-terminal-green to-terminal-cyan bg-clip-text text-transparent">
            {t('concept.titleHighlight')}
          </span>
        </h3>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-white/40 md:text-base">
          {t('concept.subtitle')}
        </p>

        <div className="mt-10 grid gap-4 md:mt-16 md:gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <ConceptCard
              key={i}
              number={String(i + 1).padStart(2, '0')}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ConceptCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/10">
      <div className="mb-4 font-mono text-xs text-terminal-green/40">{number}</div>
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      <p className="font-mono text-xs leading-relaxed text-white/40">{description}</p>
    </div>
  )
}
