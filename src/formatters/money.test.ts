import { describe, expect, it } from 'vitest'
import type { Quote } from '../api'
import { convert, formatMoney, formatQuoteResult, parseAmount } from './money'

const quote: Quote = {
  quoteId: 'q-1',
  from: 'EUR',
  to: 'USD',
  rate: '1.084300',
  amount: 250,
  createdAt: '2026-10-20T12:00:00Z',
  expiresAt: '2026-10-20T12:01:00Z',
}

describe('money', () => {
  describe('formatMoney', () => {
    it('formats a round amount without decimals', () => {
      expect(formatMoney(1000)).toBe('1,000')
    })

    it('formats zero', () => {
      expect(formatMoney(0)).toBe('0')
    })

    it('trims trailing zeros from the fraction', () => {
      expect(formatMoney(12.5)).toBe('12.5')
    })

    it('rounds to two decimals', () => {
      expect(formatMoney(1.239)).toBe('1.24')
    })

    it('rounds a half cent up despite floating point error', () => {
      expect(formatMoney(1.005)).toBe('1.01')
    })
    it('separates thousands in large amounts', () => {
      expect(formatMoney(1234567.89)).toBe('1,234,567.89')
    })
  })

  describe('parseAmount', () => {
    it('parses a plain numeric string', () => {
      expect(parseAmount('42')).toBe(42)
    })

    it('keeps every digit of a thousand', () => {
      expect(parseAmount('1000')).toBe(1000)
    })

    it('parses an amount with a trailing dot', () => {
      expect(parseAmount('1.')).toBe(1)
    })

    it('parses a fractional amount', () => {
      expect(parseAmount('0.05')).toBe(0.05)
    })
  })

  describe('convert', () => {
    it('multiplies the amount by the rate', () => {
      expect(formatMoney(convert(250, '1.084300'))).toBe('271.08')
    })
  })

  describe('formatQuoteResult', () => {
    it('shows zero without a quote', () => {
      expect(formatQuoteResult(undefined)).toBe('0')
    })

    it('formats the converted quote amount', () => {
      expect(formatQuoteResult(quote)).toBe('271.08')
    })
  })
})
