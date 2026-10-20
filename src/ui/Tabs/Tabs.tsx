import classNames from 'classnames'
import { Tab } from '../../model'
import styles from './Tabs.module.css'

interface Props {
  readonly tab: Tab
  readonly onTabChange: (tab: Tab) => void
}

const TABS = [
  { tab: Tab.Exchange, label: 'Exchange Rate' },
  { tab: Tab.History, label: 'History' },
]

export function Tabs({ tab, onTabChange }: Props) {
  return (
    <div>
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
