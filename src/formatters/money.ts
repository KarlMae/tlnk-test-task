import type { Quote } from '../api'

const moneyFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export function parseAmount(value: string): number {
  return parseFloat(value)
}

export function convert(amount: number, rate: string): number {
  return amount * parseFloat(rate)
}

export function formatMoney(value: number): string {
  return moneyFormat.format(value)
}

export function formatQuoteResult(quote: Quote | undefined): string {
  return quote ? formatMoney(convert(quote.amount, quote.rate)) : '0'
}
