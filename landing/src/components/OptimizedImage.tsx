import imageManifest from '../data/image-manifest.generated.json'

type ManifestEntry = { width: number | null; height: number | null; variants: number[] }

/**
 * Renders an image with AVIF + WebP variants and responsive srcset.
 *
 * Source priority (browser picks the first supported MIME type):
 *   1. <source type="image/avif" srcset="...">  ~30% smaller than WebP
 *   2. <source type="image/webp" srcset="...">  universal modern browsers
 *   3. <img src="...">                          PNG/JPG fallback (Safari ≤14, etc.)
 *
 * When `responsive` is true (default for raster images), each <source>
 * emits both the full-resolution file and a `-640w` variant produced by
 * scripts/optimize-images.mjs. The browser uses the `sizes` attribute to
 * pick the right one for the current viewport — saves ~60% bandwidth on
 * mobile cards.
 *
 * Pass `priority` for above-the-fold / LCP images: disables lazy loading
 * and sets fetchpriority=high.
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
  width?: number
  height?: number
  /** Use for hero/LCP image — no lazy, high priority */
  priority?: boolean
  /**
   * Whether a -640w responsive variant exists for this image.
   * Defaults to true. Set false for icons / images known to be small.
   */
  responsive?: boolean
  /** sizes attribute for responsive selection. Defaults to a reasonable card layout. */
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  loading,
  width,
  height,
  priority,
  responsive = true,
  sizes = '(max-width: 768px) 100vw, 720px',
  className,
  ...rest
}: OptimizedImageProps) {
  const isRaster = /\.(png|jpg|jpeg)$/i.test(src)

  // Fallback for non-raster sources (svg, already-encoded webp/avif passed directly).
  if (!isRaster) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : undefined}
        width={width}
        height={height}
        className={className}
        {...rest}
      />
    )
  }

  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  const avifSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.avif')

  // Phase 1.6: per-image srcset — read the manifest to know which widths
  // were actually emitted by optimize-images.mjs. Without this, a small
  // 1024px source would still advertise `-1920w.webp` in srcset and produce
  // a 404 when the browser tried to fetch it.
  const entry = (imageManifest as Record<string, ManifestEntry>)[src]
  const variants = entry?.variants ?? []
  const sourceWidth = entry?.width
  const buildSet = (ext: string) => {
    const stem = src.replace(/\.(png|jpg|jpeg)$/i, '')
    const parts = variants.map(w => `${stem}-${w}w.${ext} ${w}w`)
    // Source width as the high-res entry (only if known and meaningfully
    // larger than the largest responsive variant — otherwise it duplicates).
    const largest = variants.length > 0 ? variants[variants.length - 1] : 0
    if (sourceWidth && sourceWidth > largest) {
      parts.push(`${stem}.${ext} ${sourceWidth}w`)
    } else if (variants.length === 0) {
      // No responsive variants on disk — fall back to single source.
      parts.push(`${stem}.${ext}`)
    }
    return parts.join(', ')
  }
  const avifSrcSet = responsive && variants.length > 0 ? buildSet('avif') : avifSrc
  const webpSrcSet = responsive && variants.length > 0 ? buildSet('webp') : webpSrc

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={responsive ? sizes : undefined} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={responsive ? sizes : undefined} />
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : undefined}
        width={width}
        height={height}
        className={className}
        {...rest}
      />
    </picture>
  )
}
