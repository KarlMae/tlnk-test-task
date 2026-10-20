import { CurrencySelect } from '../CurrencySelect/CurrencySelect'

interface Props {
  readonly currencies: readonly string[]
  readonly from: string | undefined
  readonly to: string | undefined
  readonly amount: string
  readonly result: string
  readonly isFetching: boolean
  readonly quoteCreatedAt: string | undefined
  readonly onFromChange: (currency: string) => void
  readonly onToChange: (currency: string) => void
  readonly onRefresh: () => void
}

export function ExchangePanel({
  currencies,
  from,
  to,
  amount,
  result,
  isFetching,
  quoteCreatedAt,
  onFromChange,
  onToChange,
  onRefresh,
}: Props) {
  return (
    <div>
      <div>
        <CurrencySelect
          testId="from-currency"
          currencies={currencies}
          value={from}
          onChange={onFromChange}
        />
        <span data-testid="amount">{amount}</span>
      </div>
      <div>
        <CurrencySelect
          testId="to-currency"
          currencies={currencies}
          value={to}
          onChange={onToChange}
        />
        <span data-testid="result">{result}</span>
      </div>
      <div>
        {isFetching ? (
          <span>Loading…</span>
        ) : (
          quoteCreatedAt && (
            <span data-testid="updated-at">
              Last updated {quoteCreatedAt.split('T')[1].slice(0, 8)}
            </span>
          )
        )}
        <button type="button" data-testid="refresh" onClick={onRefresh}>
          ⟳
        </button>
      </div>
    </div>
  )
}
