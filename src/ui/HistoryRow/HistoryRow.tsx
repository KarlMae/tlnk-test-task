import { useState } from 'react'
import classNames from 'classnames'
import type { HistoryRecord } from '../../model'
import styles from './HistoryRow.module.css'

function formatRecord(record: HistoryRecord): string {
  return `${record.from} ${record.amount} → ${record.to} ${record.result}`
}

export function HistoryRow({ record, selected }: { record: HistoryRecord; selected: boolean }) {
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
