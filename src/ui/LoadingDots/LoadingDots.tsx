import type { BaseHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './LoadingDots.module.css'

type Props = BaseHTMLAttributes<HTMLSpanElement> & {
  readonly label: string
}

export function LoadingDots({ className, label, ...props }: Props) {
  return (
    <span
      {...props}
      role="status"
      aria-label={label}
      className={classNames(className, styles.dots)}
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  )
}
