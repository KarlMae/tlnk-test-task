import { AnimatePresence, motion } from 'motion/react'
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={classNames(className, styles.panel)}
    >
      <ul className={styles.list}>
        <AnimatePresence initial={false}>
          {history.map((record, i) => (
            <HistoryRow key={record.id} record={record} selected={i === selected} />
          ))}
        </AnimatePresence>
      </ul>
      <p data-testid="history-count" className={styles.count}>
        {history.length} records
      </p>
    </motion.div>
  )
}
