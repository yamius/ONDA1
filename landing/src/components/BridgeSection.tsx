import { useTranslation } from 'react-i18next'

// "The bridge": name the pain → why apps/trackers fall short → the shift.
// Pure typographic block, no imagery. Honest by construction.
export function BridgeSection() {
  const { t } = useTranslation('home')

  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('bridge.tag')}
        </h2>
        <h3 className="mb-8 text-2xl font-bold leading-tight tracking-tight md:text-4xl">
          {t('bridge.title')}
        </h3>
        <p className="mb-5 text-base leading-relaxed text-white/60 md:text-lg">
          {t('bridge.p1')}
        </p>
        <p className="text-base leading-relaxed text-white/80 md:text-lg">
          <span className="bg-gradient-to-r from-terminal-cyan to-terminal-green bg-clip-text font-semibold text-transparent">
            {t('bridge.p2')}
          </span>
        </p>
      </div>
    </section>
  )
}
