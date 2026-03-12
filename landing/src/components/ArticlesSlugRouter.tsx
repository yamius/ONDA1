import { useParams } from 'react-router-dom'
import { getArticleBySlug } from '../data/articles'
import { ArticlePage } from '../pages/ArticlePage'
import { MdArticlePage } from '../pages/MdArticlePage'

export default function ArticlesSlugRouter() {
  const { slug } = useParams<{ slug: string }>()
  const staticArticle = slug ? getArticleBySlug(slug) : undefined
  if (staticArticle) return <ArticlePage />
  return <MdArticlePage />
}
