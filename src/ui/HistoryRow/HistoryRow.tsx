import { type BaseHTMLAttributes, useState } from 'react'
import classNames from 'classnames'
import type { HistoryRecord } from '../../model'
import styles from './HistoryRow.module.css'

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  readonly record: HistoryRecord
  readonly selected: boolean
}

function formatRecord(record: HistoryRecord): string {
  return `${record.from} ${record.amount} → ${record.to} ${record.result}`
}

export function HistoryRow({ record, selected }: Props) {
  const [label] = useState(() => formatRecord(record))
  return (
    <li
      data-testid="history-item"
      aria-selected={selected}
      className={classNames(styles.row, { [styles.selected]: selected })}
    >
      {label}
    </li>
  )
}
