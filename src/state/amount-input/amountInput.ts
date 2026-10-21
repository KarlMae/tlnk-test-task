import { useState } from 'react'
import { type AmountKey } from '../../model'

const INITIAL_AMOUNT = '0'

export function useAmountInput() {
  const [amount, setAmount] = useState(INITIAL_AMOUNT)

  const appendAmountKey = (amount: string, key: AmountKey) =>
    amount === INITIAL_AMOUNT ? key : amount + key

  const appendDot = (amount: string) => (amount.includes('.') ? amount : `${amount}.`)

  const removeLastCharacter = (amount: string) =>
    amount.length > 1 ? amount.slice(0, -1) : INITIAL_AMOUNT

  const type = (key: AmountKey) => setAmount((prev) => appendAmountKey(prev, key))
  const typeDot = () => setAmount(appendDot)
  const backspace = () => setAmount(removeLastCharacter)
  const clear = () => setAmount(INITIAL_AMOUNT)

  return { amount, setAmount, type, typeDot, backspace, clear }
}
