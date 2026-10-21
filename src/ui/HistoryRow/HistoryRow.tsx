import type { BaseHTMLAttributes } from 'react'
import { motion, useIsPresent } from 'motion/react'
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
  const isPresent = useIsPresent()
  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      aria-hidden={!isPresent}
      data-testid="history-item"
      aria-selected={selected}
      className={classNames(styles.row, { [styles.selected]: selected })}
    >
      {formatRecord(record)}
    </motion.li>
  )
}
