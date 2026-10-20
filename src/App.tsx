import { useState } from 'react'
import { ExchangePanel, HistoryPanel, Keypad, Tabs } from './ui'
import { initialHistory } from './history'
import { convert, formatMoney, parseAmount } from './money'
import { KeypadKey, Tab, type HistoryRecord } from './model'
import { useQuoteQuery, useRatesQuery } from './api'
import styles from './App.module.css'

export default function App() {
  const [tab, setTab] = useState<Tab>(Tab.Exchange)
  const [amount, setAmount] = useState('0')
  const [selectedFrom, setFrom] = useState<string>()
  const [selectedTo, setTo] = useState<string>()
  const [history, setHistory] = useState<HistoryRecord[]>(initialHistory)
  const [selected, setSelected] = useState(0)

  const ratesQuery = useRatesQuery()
  const currencies = ratesQuery.data?.currencies ?? []
  const from = selectedFrom ?? currencies[0]
  const to = selectedTo ?? currencies[1]

  const quoteQuery = useQuoteQuery(
    from && to ? { from, to, amount: parseAmount(amount) } : undefined,
  )
  const quote = quoteQuery.data
  const result = quote ? formatMoney(convert(quote.amount, quote.rate)) : '0'

  const handleKeyPress = (key: KeypadKey) => {
    switch (key) {
      case KeypadKey.Zero:
      case KeypadKey.One:
      case KeypadKey.Two:
      case KeypadKey.Three:
      case KeypadKey.Four:
      case KeypadKey.Five:
      case KeypadKey.Six:
      case KeypadKey.Seven:
      case KeypadKey.Eight:
      case KeypadKey.Nine:
      case KeypadKey.DoubleZero:
        setAmount((prev) => (prev === '0' ? key : prev + key))
        break
      case KeypadKey.Dot:
        setAmount((prev) => (prev.includes('.') ? prev : `${prev}.`))
        break
      case KeypadKey.Backspace:
        if (tab === Tab.Exchange) {
          setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'))
        } else {
          setHistory((prev) => prev.filter((_, i) => i !== selected))
        }
        break
      case KeypadKey.Clear:
        if (tab === Tab.Exchange) {
          setAmount('0')
        } else {
          setHistory([])
        }
        break
      case KeypadKey.Save:
        if (tab === Tab.Exchange) {
          setHistory((prev) => [
            ...prev,
            { from, to, amount: formatMoney(parseAmount(amount)), result },
          ])
        }
        break
      case KeypadKey.Up:
        setSelected((prev) => Math.max(0, prev - 1))
        break
      case KeypadKey.Down:
        setSelected((prev) => Math.min(history.length - 1, prev + 1))
        break
      case KeypadKey.Ok: {
        const record = history[selected]
        if (record) {
          setFrom(record.from)
          setTo(record.to)
          setAmount(record.amount)
          setTab(Tab.Exchange)
        }
        break
      }
    }
  }

  return (
    <div className={styles.app}>
      <Tabs className={styles.tabs} tab={tab} onTabChange={setTab} />

      {tab === Tab.Exchange && (
        <ExchangePanel
          className={styles.exchange}
          currencies={currencies}
          from={from}
          to={to}
          amount={amount}
          result={result}
          isFetching={quoteQuery.isFetching}
          quoteCreatedAt={quote?.createdAt}
          onFromChange={setFrom}
          onToChange={setTo}
          onRefresh={() => void quoteQuery.refetch()}
        />
      )}

      {tab === Tab.History && (
        <HistoryPanel className={styles.history} history={history} selected={selected} />
      )}

      <Keypad className={styles.keypad} tab={tab} onKeyPress={handleKeyPress} />
    </div>
  )
}
