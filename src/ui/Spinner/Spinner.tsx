import type { BaseHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './Spinner.module.css'

type Props = BaseHTMLAttributes<HTMLSpanElement> & {
  readonly label: string
}

export function Spinner({ className, label }: Props) {
  return <span role="status" aria-label={label} className={classNames(className, styles.spinner)} />
}
