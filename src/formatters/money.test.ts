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
    it('should format a round amount without decimals', () => {
      expect(formatMoney(1000)).toBe('1,000')
    })

    it('should format zero', () => {
      expect(formatMoney(0)).toBe('0')
    })

    it('should trim trailing zeros from the fraction', () => {
      expect(formatMoney(12.5)).toBe('12.5')
    })

    it('should round to two decimals', () => {
      expect(formatMoney(1.239)).toBe('1.24')
    })

    it('should round a half cent up', () => {
      expect(formatMoney(1.005)).toBe('1.01')
    })
    it('should separate thousands in large amounts', () => {
      expect(formatMoney(1234567.89)).toBe('1,234,567.89')
    })
  })

  describe('parseAmount', () => {
    it('should parse a plain numeric string', () => {
      expect(parseAmount('42')).toBe(42)
    })

    it('should parse an amount with a trailing dot', () => {
      expect(parseAmount('1.')).toBe(1)
    })

    it('should parse a fractional amount', () => {
      expect(parseAmount('0.05')).toBe(0.05)
    })
  })

  describe('convert', () => {
    it('should multiply the amount by the rate', () => {
      expect(formatMoney(convert(250, '1.084300'))).toBe('271.08')
    })
  })

  describe('formatQuoteResult', () => {
    it('should show zero without a quote', () => {
      expect(formatQuoteResult(undefined)).toBe('0')
    })

    it('should format the converted quote amount', () => {
      expect(formatQuoteResult(quote)).toBe('271.08')
    })
  })
})
