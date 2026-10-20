import { useState } from 'react'
import classNames from 'classnames'
import { HistoryRow, Keypad } from './ui'
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
    <div>
      <div>
        <button
          type="button"
          data-testid="tab-exchange"
          onClick={() => setTab(Tab.Exchange)}
          className={classNames(styles.tab, { [styles.selected]: tab === Tab.Exchange })}
        >
          Exchange Rate
        </button>
        <button
          type="button"
          data-testid="tab-history"
          onClick={() => setTab(Tab.History)}
          className={classNames(styles.tab, { [styles.selected]: tab === Tab.History })}
        >
          History
        </button>
      </div>

      {tab === Tab.Exchange && (
        <div>
          <div>
            <select
              data-testid="from-currency"
              value={from ?? ''}
              onChange={(e) => setFrom(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span data-testid="amount">{amount}</span>
          </div>
          <div>
            <select
              data-testid="to-currency"
              value={to ?? ''}
              onChange={(e) => setTo(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span data-testid="result">{result}</span>
          </div>
          <div>
            {quoteQuery.isFetching ? (
              <span>Loading…</span>
            ) : (
              quote && (
                <span data-testid="updated-at">
                  Last updated {quote.createdAt.split('T')[1].slice(0, 8)}
                </span>
              )
            )}
            <button type="button" data-testid="refresh" onClick={() => void quoteQuery.refetch()}>
              ⟳
            </button>
          </div>
        </div>
      )}

      {tab === Tab.History && (
        <div>
          <ul>
            {history.map((record, i) => (
              <HistoryRow key={i} record={record} selected={i === selected} />
            ))}
          </ul>
          <p data-testid="history-count">{history.length} records</p>
        </div>
      )}

      <Keypad tab={tab} onKeyPress={handleKeyPress} />
    </div>
  )
}
