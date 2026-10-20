import classNames from 'classnames'
import { Tab } from '../../model'
import styles from './Tabs.module.css'
import type { BaseHTMLAttributes } from 'react'

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  readonly tab: Tab
  readonly onTabChange: (tab: Tab) => void
}

const TABS = [
  { tab: Tab.Exchange, label: 'Exchange Rate' },
  { tab: Tab.History, label: 'History' },
]

export function Tabs({ className, tab, onTabChange }: Props) {
  return (
    <div className={classNames(className, styles.tabs)}>
      {TABS.map(({ tab: value, label }) => (
        <button
          key={value}
          type="button"
          data-testid={`tab-${value}`}
          className={classNames(styles.tab, { [styles.selected]: tab === value })}
          onClick={() => onTabChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
