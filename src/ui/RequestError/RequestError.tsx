import type { BaseHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './RequestError.module.css'
import { Icon } from '../Icon/Icon'

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  readonly message: string
  readonly onRetry: () => void
}

export function RequestError({ className, message, onRetry }: Props) {
  return (
    <div role="alert" className={classNames(className, styles.error)}>
      <button type="button" className={styles.retry} onClick={onRetry}>
        <span className={styles.message}>{message}</span>
        <Icon className={styles.icon} type="reload" />
      </button>
    </div>
  )
}
