import { useTranslation } from 'react-i18next'

interface Step {
  n: string
  title: string
  text: string
}

export function HowItWorksSection() {
  const { t } = useTranslation('home')
  const steps = t('how.steps', { returnObjects: true }) as Step[]

  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('how.tag')}
        </h2>
        <h3 className="mb-10 text-2xl font-bold tracking-tight md:mb-16 md:text-4xl">
          {t('how.title')}
        </h3>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <div key={step.n} className="relative">
              <div className="mb-4 font-mono text-3xl font-bold text-terminal-green/30 md:text-4xl">
                {step.n}
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">{step.title}</h4>
              <p className="font-mono text-xs leading-relaxed text-white/45">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
