import { useState } from 'react'
import { useQuoteQuery, useRatesQuery } from '../../api'
import { formatQuoteResult, parseAmount } from '../../formatters/money'
import { AMOUNT_KEYS, KeypadKey, Tab } from '../../model'
import { useAmountInput } from '../amount-input/amountInput'
import { useHistory } from '../history/useHistory'
import { useDebouncedValue } from '../useDebouncedValue'

const SECOND_IN_MS = 1_000

type KeyActions = Partial<Record<KeypadKey, () => void>>

export function useCurrencyExchange() {
  const [tab, setTab] = useState<Tab>(Tab.Exchange)
  const [selectedFrom, setFrom] = useState<string>()
  const [selectedTo, setTo] = useState<string>()
  const amountInput = useAmountInput()
  const amount = parseAmount(amountInput.amount)
  const debouncedAmount = useDebouncedValue(amount, SECOND_IN_MS)
  const isDebouncing = amount !== debouncedAmount
  const history = useHistory()

  const ratesQuery = useRatesQuery()
  const currencies = ratesQuery.data?.currencies ?? []
  const from = selectedFrom ?? currencies[0]
  const to = selectedTo ?? currencies[1]

  const quoteQuery = useQuoteQuery(
    from && to && !isDebouncing ? { from, to, amount: debouncedAmount } : undefined,
  )
  const result = formatQuoteResult(quoteQuery.data)

  const refresh = () => {
    if (!isDebouncing) void quoteQuery.refetch()
  }

  const hasQuote = quoteQuery.data !== undefined

  const saveCurrentConversion = () => {
    const quote = quoteQuery.data
    if (!quote) return
    history.add({
      from: quote.from,
      to: quote.to,
      amount: quote.amount,
      result,
    })
  }

  const loadSelectedRecord = () => {
    if (!history.selectedRecord) return
    setFrom(history.selectedRecord.from)
    setTo(history.selectedRecord.to)
    amountInput.setAmount(String(history.selectedRecord.amount))
    setTab(Tab.Exchange)
  }

  const typeAmountKeys: KeyActions = Object.fromEntries(
    AMOUNT_KEYS.map((key) => [key, () => amountInput.type(key)]),
  )

  const exchangeActions: KeyActions = {
    ...typeAmountKeys,
    [KeypadKey.Dot]: () => amountInput.typeDot(),
    [KeypadKey.Backspace]: () => amountInput.backspace(),
    [KeypadKey.Clear]: () => amountInput.clear(),
    [KeypadKey.Save]: () => saveCurrentConversion(),
  }

  const historyActions: KeyActions = {
    [KeypadKey.Backspace]: () => history.removeSelected(),
    [KeypadKey.Clear]: () => history.clear(),
    [KeypadKey.Up]: () => history.selectPrevious(),
    [KeypadKey.Down]: () => history.selectNext(),
    [KeypadKey.Ok]: () => loadSelectedRecord(),
  }

  const handleKeyPress = (key: KeypadKey) => {
    const actions = tab === Tab.Exchange ? exchangeActions : historyActions
    actions[key]?.()
  }

  const exchange = {
    currencies,
    from,
    to,
    amount: amountInput.amount,
    result,
    isFetching: isDebouncing || quoteQuery.isFetching,
    quoteCreatedAt: quoteQuery.data?.createdAt,
    onFromChange: setFrom,
    onToChange: setTo,
    onRefresh: refresh,
  }

  return { tab, setTab, exchange, history, hasQuote, handleKeyPress }
}
