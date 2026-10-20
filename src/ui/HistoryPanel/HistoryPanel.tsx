import type { BaseHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './HistoryPanel.module.css'
import type { HistoryRecord } from '../../model'
import { HistoryRow } from '../HistoryRow/HistoryRow'

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  readonly history: readonly HistoryRecord[]
  readonly selected: number
}

export function HistoryPanel({ className, history, selected }: Props) {
  return (
    <div className={classNames(className, styles.panel)}>
      <ul>
        {history.map((record, i) => (
          <HistoryRow key={i} record={record} selected={i === selected} />
        ))}
      </ul>
      <p data-testid="history-count">{history.length} records</p>
    </div>
  )
}
