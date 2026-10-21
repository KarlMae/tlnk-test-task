import { motion } from 'motion/react'
import type { BaseHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './ExchangePanel.module.css'
import { CurrencySelect } from '../CurrencySelect/CurrencySelect'
import { LastUpdated } from '../LastUpdated/LastUpdated'
import { Icon } from '../Icon/Icon'
import { FitText } from '../FitText/FitText'
import { RequestError } from '../RequestError/RequestError'
import { Spinner } from '../Spinner/Spinner'
import { LoadingDots } from '../LoadingDots/LoadingDots'

interface Exchange {
  readonly currenciesStatus: 'pending' | 'error' | 'success'
  readonly onRetryCurrencies: () => void
  readonly quoteFailed: boolean
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

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  readonly exchange: Exchange
}

export function ExchangePanel({ className, exchange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={classNames(className, styles.panel)}
    >
      <ExchangePanelContent exchange={exchange} />
    </motion.div>
  )
}

function ExchangePanelContent({ exchange }: { readonly exchange: Exchange }) {
  switch (exchange.currenciesStatus) {
    case 'pending':
      return (
        <div className={styles.placeholder}>
          <Spinner label="Loading currencies" />
        </div>
      )
    case 'error':
      return (
        <RequestError
          className={styles.placeholder}
          message="Couldn't load currencies"
          onRetry={exchange.onRetryCurrencies}
        />
      )
    case 'success':
      return <ExchangeForm exchange={exchange} />
  }
}

function ExchangeForm({ exchange }: { readonly exchange: Exchange }) {
  const { currencies, from, to, amount, result, isFetching, onFromChange, onToChange } = exchange

  return (
    <>
      <div className={styles.values}>
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
          {isFetching ? (
            <LoadingDots
              data-testid="result"
              label="Loading quote"
              className={classNames(styles.amount, styles.resultLoading)}
            />
          ) : (
            <FitText data-testid="result" className={styles.amount}>
              {result}
            </FitText>
          )}
        </div>
      </div>
      <QuoteStatus exchange={exchange} />
    </>
  )
}

function QuoteStatus({ exchange }: { readonly exchange: Exchange }) {
  const { isFetching, quoteFailed, quoteCreatedAt, onRefresh } = exchange

  if (quoteFailed) {
    return <RequestError message="Couldn't get a quote" onRetry={onRefresh} />
  }

  return (
    <motion.button
      key="refresh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      type="button"
      data-testid="refresh"
      aria-label="Refresh exchange rate"
      className={classNames(styles.refresh, (isFetching || !quoteCreatedAt) && styles.hidden)}
      onClick={onRefresh}
    >
      {quoteCreatedAt && <LastUpdated updatedAt={quoteCreatedAt} />}
      <Icon className={styles.refreshIcon} type="reload" />
    </motion.button>
  )
}
