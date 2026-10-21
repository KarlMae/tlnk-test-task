import type { BaseHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './RequestError.module.css'

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  readonly message: string
  readonly onRetry: () => void
}

export function RequestError({ className, message, onRetry }: Props) {
  return (
    <div role="alert" className={classNames(className, styles.error)}>
      {message}
      <button type="button" className={styles.retry} onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
