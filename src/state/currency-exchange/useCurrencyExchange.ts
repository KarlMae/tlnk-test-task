import { useState } from 'react'
import { useQuoteQuery, useRatesQuery } from '../../api'
import { formatMoney, formatQuoteResult, parseAmount } from '../../formatters/money'
import { AMOUNT_KEYS, KeypadKey, Tab } from '../../model'
import { useAmountInput } from '../amount-input/amountInput'
import { useHistory } from '../history/useHistory'

type KeyActions = Partial<Record<KeypadKey, () => void>>

export function useCurrencyExchange() {
  const [tab, setTab] = useState<Tab>(Tab.Exchange)
  const [selectedFrom, setFrom] = useState<string>()
  const [selectedTo, setTo] = useState<string>()
  const amountInput = useAmountInput()
  const history = useHistory()

  const ratesQuery = useRatesQuery()
  const currencies = ratesQuery.data?.currencies ?? []
  const from = selectedFrom ?? currencies[0]
  const to = selectedTo ?? currencies[1]

  const quoteQuery = useQuoteQuery(
    from && to ? { from, to, amount: parseAmount(amountInput.amount) } : undefined,
  )
  const result = formatQuoteResult(quoteQuery.data)

  const refresh = () => void quoteQuery.refetch()

  const saveCurrentConversion = () =>
    history.add({
      from,
      to,
      amount: formatMoney(parseAmount(amountInput.amount)),
      result,
    })

  const loadSelectedRecord = () => {
    if (!history.selectedRecord) return
    setFrom(history.selectedRecord.from)
    setTo(history.selectedRecord.to)
    amountInput.setAmount(history.selectedRecord.amount)
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
    isFetching: quoteQuery.isFetching,
    quoteCreatedAt: quoteQuery.data?.createdAt,
    onFromChange: setFrom,
    onToChange: setTo,
    onRefresh: refresh,
  }

  return { tab, setTab, exchange, history, handleKeyPress }
}
