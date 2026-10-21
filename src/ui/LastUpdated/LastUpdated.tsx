import { type BaseHTMLAttributes, useEffect, useState } from 'react'
import { parseISO } from 'date-fns'
import { formatTimeAgo } from '../../formatters/time'

const SECOND_IN_MS = 1000

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  readonly updatedAt: string
}

export function LastUpdated({ updatedAt }: Props) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), SECOND_IN_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <span data-testid="updated-at">
      Last updated {formatTimeAgo(parseISO(updatedAt), now)}
    </span>
  )
}
