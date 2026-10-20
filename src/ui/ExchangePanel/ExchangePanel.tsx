import type { BaseHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './ExchangePanel.module.css'
import { CurrencySelect } from '../CurrencySelect/CurrencySelect'
import { LastUpdated } from '../LastUpdated/LastUpdated'
import { Icon } from '../Icon/Icon'
import { FitText } from '../FitText/FitText'

type Props = BaseHTMLAttributes<HTMLDivElement> & {
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
  className,
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
    <div className={classNames(className, styles.panel)}>
      <div className={styles.row}>
        <CurrencySelect
          testId="from-currency"
          currencies={currencies}
          value={from}
          className={styles.currencySelect}
          onChange={onFromChange}
        />
        <Icon type="right-chevron" width={8} height={14} />
        <FitText data-testid="amount" className={styles.amount}>
          {amount}
        </FitText>
      </div>
      <div className={styles.row}>
        <CurrencySelect
          testId="to-currency"
          currencies={currencies}
          value={to}
          className={styles.currencySelect}
          onChange={onToChange}
        />
        <Icon type="right-chevron" width={8} height={14} />
        <FitText data-testid="result" className={styles.amount}>
          {result}
        </FitText>
      </div>
      <div>
        {isFetching ? (
          <span>Loading…</span>
        ) : (
          quoteCreatedAt && <LastUpdated updatedAt={quoteCreatedAt} />
        )}
        <button
          type="button"
          data-testid="refresh"
          aria-label="Refresh exchange rate"
          className={styles.refreshButton}
          onClick={onRefresh}
        >
          <Icon type="reload" />
        </button>
      </div>
    </div>
  )
}
