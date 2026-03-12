import { useNavigate } from 'react-router-dom'
import { useTransition } from 'react'
import type { LinkProps } from 'react-router-dom'
import { Link } from 'react-router-dom'

type Props = LinkProps & { to: string }

export function TransitionLink({ to, children, onClick, ...props }: Props) {
  const navigate = useNavigate()
  const [, startTransition] = useTransition()

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) return

    e.preventDefault()
    onClick?.(e)
    startTransition(() => navigate(to))
  }

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
