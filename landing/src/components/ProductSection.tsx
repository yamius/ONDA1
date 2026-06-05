import { useTranslation } from 'react-i18next'

interface Shot {
  caption: string
  alt: string
}

// Phone-frame placeholder for an app screenshot.
// When a final asset exists at /images/home/showcase-{n}.png it renders on top;
// until then the labeled placeholder layer behind it shows.
function PhoneShot({ n, caption, alt }: { n: number; caption: string; alt: string }) {
  const src = `/images/home/showcase-${n}.png`
  return (
    <figure className="flex flex-col items-center">
      <div className="relative w-full max-w-[230px] overflow-hidden rounded-[2rem] border-2 border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-2 shadow-2xl">
        <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.5rem] bg-[#0a1018]">
          {/* placeholder layer (always present, sits behind the image) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-terminal-green/50">
              screen {n}
            </span>
            <span className="font-mono text-[11px] leading-relaxed text-white/30">{alt}</span>
          </div>
          {/* image layer — covers the placeholder when the asset exists; hides itself if missing */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          {/* notch (on top of everything) */}
          <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/15" />
        </div>
      </div>
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
