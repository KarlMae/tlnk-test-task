import { useEffect, useRef, useState } from 'react'
import Keypad from './Keypad'
import { initialHistory } from './history'
import { convert, formatMoney, parseAmount } from './money'
import { Tab } from './model/tab.ts'
import { useRatesQuery } from './api/rates/rates.api.ts'
import { useQuoteQuery } from './api/quote/quote.api.ts'
import { HistoryRecord } from './model/historyRecord.ts'

function formatRecord(record: HistoryRecord): string {
  return `${record.from} ${record.amount} → ${record.to} ${record.result}`
}

function HistoryRow({ record, selected }: { record: HistoryRecord; selected: boolean }) {
  const [label] = useState(() => formatRecord(record))
  return (
    <li
      data-testid="history-item"
      aria-selected={selected}
      style={{ fontWeight: selected ? 'bold' : 'normal' }}
    >
      {label}
    </li>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>('exchange')
  const [amount, setAmount] = useState('0')
  const [selectedFrom, setFrom] = useState<string>()
  const [selectedTo, setTo] = useState<string>()
  const [history, setHistory] = useState<HistoryRecord[]>(initialHistory)
  const [selected, setSelected] = useState(0)

  const tableRef = useRef<HTMLTableElement>(null)

  const ratesQuery = useRatesQuery()
  const currencies = ratesQuery.data?.currencies ?? []
  const from = selectedFrom ?? currencies[0]
  const to = selectedTo ?? currencies[1]

  const quoteQuery = useQuoteQuery(
    from && to ? { from, to, amount: parseAmount(amount) } : undefined,
  )
  const quote = quoteQuery.data
  const result = quote ? formatMoney(convert(quote.amount, quote.rate)) : '0'

  useEffect(() => {
    const table = tableRef.current
    if (!table) return

    const handler = (e: MouseEvent) => {
      const label = (e.target as HTMLElement).innerText

      switch (label) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '00':
          setAmount((prev) => (prev === '0' ? label : prev + label))
          break
        case '.':
          setAmount((prev) => (prev.includes('.') ? prev : `${prev}.`))
          break
        case '⌫':
          if (tab === 'exchange') {
            setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'))
          } else {
            setHistory((prev) => prev.filter((_, i) => i !== selected))
          }
          break
        case 'C':
          if (tab === 'exchange') {
            setAmount('0')
          } else {
            setHistory([])
          }
          break
        case 'm':
          if (tab === 'exchange') {
            setHistory((prev) => [
              ...prev,
              { from, to, amount: formatMoney(parseAmount(amount)), result },
            ])
          }
          break
        case '▲':
          setSelected((prev) => Math.max(0, prev - 1))
          break
        case '▼':
          setSelected((prev) => Math.min(history.length - 1, prev + 1))
          break
        case 'OK': {
          const record = history[selected]
          if (record) {
            setFrom(record.from)
            setTo(record.to)
            setAmount(record.amount)
            setTab('exchange')
          }
          break
        }
        default:
          break
      }
    }

    table.addEventListener('click', handler)
  }, [tab])

  return (
    <div>
      <div>
        <button
          type="button"
          data-testid="tab-exchange"
          onClick={() => setTab('exchange')}
          style={{ fontWeight: tab === 'exchange' ? 'bold' : 'normal' }}
        >
          Exchange Rate
        </button>
        <button
          type="button"
          data-testid="tab-history"
          onClick={() => setTab('history')}
          style={{ fontWeight: tab === 'history' ? 'bold' : 'normal' }}
        >
          History
        </button>
      </div>

      {tab === 'exchange' && (
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

      {tab === 'history' && (
        <div>
          <ul>
            {history.map((record, i) => (
              <HistoryRow key={i} record={record} selected={i === selected} />
            ))}
          </ul>
          <p data-testid="history-count">{history.length} records</p>
        </div>
      )}

      <Keypad ref={tableRef} tab={tab} />
    </div>
  )
}
