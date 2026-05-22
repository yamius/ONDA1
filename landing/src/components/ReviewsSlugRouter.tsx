/**
 * /reviews/:slug serves two distinct page types depending on the slug:
 *   - per-category landing pages (hrv-trackers, cgm, eeg-headsets, …) →
 *     ReviewCategoryPage
 *   - individual product reviews (oura-ring-4, levels, muse-2, …) →
 *     ReviewPage
 *
 * The category URL slug set is owned by the reviews data module so the
 * routing logic and the data definitions cannot drift apart.
 */
import { useParams } from 'react-router-dom'
import { CATEGORY_URL_SLUG_SET } from '../data/reviews'
import { ReviewPage } from '../pages/ReviewPage'
import { ReviewCategoryPage } from '../pages/ReviewCategoryPage'

export default function ReviewsSlugRouter() {
  const { slug } = useParams<{ slug: string }>()
  if (slug && CATEGORY_URL_SLUG_SET.has(slug)) return <ReviewCategoryPage />
  return <ReviewPage />
}
