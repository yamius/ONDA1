import { useTranslation } from 'react-i18next'

interface Shot {
  caption: string
  alt: string
}

// Cropped device-frame screenshots live at /images/home/showcase-{n}.webp.
function PhoneShot({ n, caption, alt }: { n: number; caption: string; alt: string }) {
  return (
    <figure className="flex flex-col items-center">
      <img
        src={`/images/home/showcase-${n}.webp`}
        alt={alt}
        loading="lazy"
        width="600"
        height="1252"
        className="w-full max-w-[230px] [filter:drop-shadow(0_0_24px_rgba(45,212,191,0.45))]"
      />
      <figcaption className="mt-4 max-w-[230px] text-center font-mono text-[11px] leading-relaxed text-white/45">
        {caption}
      </figcaption>
    </figure>
  )
}

// Product showcase: the live-feedback magic, made visible.
export function ProductSection() {
  const { t } = useTranslation('home')
  const shots = t('product.shots', { returnObjects: true }) as Shot[]

  return (
    <section id="product" className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('product.tag')}
        </h2>
        <h3 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
          {t('product.title')}
        </h3>
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
          {t('product.subtitle')}
        </p>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          {shots.map((shot, i) => (
            <PhoneShot key={i} n={i + 1} caption={shot.caption} alt={shot.alt} />
          ))}
        </div>
      </div>
    </section>
  )
}
