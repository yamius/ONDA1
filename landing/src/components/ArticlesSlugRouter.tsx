import { useParams } from 'react-router-dom'
import { articleExists } from '../lib/article-content'
import { ArticlePage } from '../pages/ArticlePage'
import { MdArticlePage } from '../pages/MdArticlePage'

export default function ArticlesSlugRouter() {
  const { slug } = useParams<{ slug: string }>()
  if (slug && articleExists(slug)) return <ArticlePage />
  return <MdArticlePage />
}
