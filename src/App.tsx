import { ExchangePanel, HistoryPanel, Keypad, Tabs } from './ui'
import { Tab } from './model'
import { useCurrencyExchange } from './state'
import styles from './App.module.css'
import { MotionConfig, useReducedMotion } from 'motion/react'

export default function App() {
  const reducedMotion = useReducedMotion()
  const { tab, setTab, exchange, history, hasQuote, handleKeyPress } = useCurrencyExchange()

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: reducedMotion ? 0 : 0.1, ease: 'easeInOut' }}
    >
      <div className={styles.app}>
        <Tabs className={styles.tabs} tab={tab} onTabChange={setTab} />
        {tab === Tab.Exchange && <ExchangePanel className={styles.exchange} exchange={exchange} />}
        {tab === Tab.History && <HistoryPanel className={styles.history} history={history} />}

        <Keypad
          className={styles.keypad}
          tab={tab}
          hasQuote={hasQuote}
          onKeyPress={handleKeyPress}
        />
      </div>
    </MotionConfig>
  )
}
