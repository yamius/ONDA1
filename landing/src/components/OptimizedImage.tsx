/**
 * Renders image with WebP when available for smaller payload.
 * Uses <picture> with source for WebP and img fallback for PNG/JPG.
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
  width?: number
  height?: number
  /** Use for hero/LCP image - no lazy, high priority */
  priority?: boolean
}

export function OptimizedImage({
  src,
  alt,
  loading,
  width,
  height,
  priority,
  className,
  ...rest
}: OptimizedImageProps) {
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  const useWebP = /\.(png|jpg|jpeg)$/i.test(src)

  if (!useWebP) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        width={width}
        height={height}
        className={className}
        {...rest}
      />
    )
  }

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
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
