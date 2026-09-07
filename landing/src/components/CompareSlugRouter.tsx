/**
 * Dispatcher for /compare/<slug>. A slug is either a pairwise ONDA-vs
 * comparison or a "top X" round-up guide; this picks the right page.
 * Unknown slugs fall through to the round-up page, which renders NotFound.
 */
import { useParams } from 'react-router-dom'
import { getOndaVs } from '../data/onda-vs'
import { OndaVsPage } from '../pages/OndaVsPage'
import { OndaRoundupPage } from '../pages/OndaRoundupPage'

export function CompareSlugRouter() {
  const { slug } = useParams<{ slug: string }>()
  if (slug && getOndaVs(slug)) return <OndaVsPage />
  return <OndaRoundupPage />
}

export default CompareSlugRouter
