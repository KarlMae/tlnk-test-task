import { AnimatePresence, motion } from 'motion/react'
import type { BaseHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './HistoryPanel.module.css'
import { HistoryRow } from '../HistoryRow/HistoryRow'
import type { HistoryRecord } from '../../model'

interface History {
  readonly records: readonly HistoryRecord[]
  readonly selectedIndex: number
}

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  readonly history: History
}

export function HistoryPanel({ className, history }: Props) {
  const { records, selectedIndex } = history

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={classNames(className, styles.panel)}
    >
      <ul className={styles.list}>
        <AnimatePresence initial={false}>
          {records.map((record, i) => (
            <HistoryRow key={record.id} record={record} selected={i === selectedIndex} />
          ))}
        </AnimatePresence>
      </ul>
      <p data-testid="history-count" className={styles.count}>
        {records.length} records
      </p>
    </motion.div>
  )
}
