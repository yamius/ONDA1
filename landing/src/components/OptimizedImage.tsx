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
  const webp640 = src.replace(/\.(png|jpg|jpeg)$/i, '-640w.webp')
  const avif640 = src.replace(/\.(png|jpg|jpeg)$/i, '-640w.avif')

  // Build srcsets only when responsive variants exist (assumed by build).
  const avifSrcSet = responsive ? `${avif640} 640w, ${avifSrc} 1280w` : avifSrc
  const webpSrcSet = responsive ? `${webp640} 640w, ${webpSrc} 1280w` : webpSrc

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
