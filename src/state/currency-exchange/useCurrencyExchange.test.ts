import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { createElement, type PropsWithChildren } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Quote, QuoteRequest, RatesResponse } from '../../api'
import { ApiClientContext } from '../../data-access'
import { KeypadKey, Tab } from '../../model'
import { useCurrencyExchange } from './useCurrencyExchange'

const DEBOUNCE_MS = 1_000

const rates: RatesResponse = {
  base: 'EUR',
  currencies: ['EUR', 'USD', 'GBP', 'PLN'],
  rates: { EUR: '1', USD: '1.0843', GBP: '0.8352', PLN: '4.27' },
  updatedAt: '2026-10-20T12:00:00Z',
}

const quoteFor = (request: QuoteRequest, rate: string): Quote => ({
  quoteId: `${request.from}-${request.to}-${request.amount}`,
  ...request,
  rate,
  createdAt: '2026-10-20T12:00:00Z',
  expiresAt: '2026-10-20T12:01:00Z',
})

interface PendingQuote {
  readonly request: QuoteRequest
  readonly respond: (rate: string) => void
}

const apiClient = { get: vi.fn(), post: vi.fn() }
let pendingQuotes: PendingQuote[] = []

const holdQuotesUntilResponded = () =>
  apiClient.post.mockImplementation(
    (_path: string, request: QuoteRequest) =>
      new Promise<Quote>((resolve) => {
        pendingQuotes.push({ request, respond: (rate) => resolve(quoteFor(request, rate)) })
      }),
  )

const flush = (ms = 0) => act(() => vi.advanceTimersByTimeAsync(ms))

const latestPendingQuoteTo = (to: string) =>
  pendingQuotes.filter((pending) => pending.request.to === to).pop()!

const createProviders = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: PropsWithChildren) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(ApiClientContext, { value: apiClient }, children),
    )
}

const renderExchange = async () => {
  const rendered = renderHook(() => useCurrencyExchange(), { wrapper: createProviders() })
  await flush()
  return rendered
}

const typeKeys = (
  result: { current: ReturnType<typeof useCurrencyExchange> },
  ...keys: KeypadKey[]
) => {
  for (const key of keys) {
    act(() => result.current.handleKeyPress(key))
  }
}

describe('useCurrencyExchange', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    apiClient.get.mockResolvedValue(rates)
    holdQuotesUntilResponded()
  })

  afterEach(() => {
    pendingQuotes = []
    apiClient.get.mockReset()
    apiClient.post.mockReset()
    vi.useRealTimers()
  })

  describe('exchange.from and exchange.to', () => {
    it('should default to the first two currencies', async () => {
      const { result } = await renderExchange()

      expect(result.current.exchange.from).toBe('EUR')
      expect(result.current.exchange.to).toBe('USD')
    })
  })

  describe('exchange.result', () => {
    it('should request a quote only after the amount settles', async () => {
      const { result } = await renderExchange()
      pendingQuotes = []

      typeKeys(result, KeypadKey.One, KeypadKey.Two)
      expect(result.current.exchange.isFetching).toBe(true)

      await flush(DEBOUNCE_MS - 1)
      expect(pendingQuotes).toHaveLength(0)

      await flush(1)
      expect(pendingQuotes.map((pending) => pending.request)).toEqual([
        { from: 'EUR', to: 'USD', amount: 12 },
      ])
    })

    it('should show the converted amount once the quote arrives', async () => {
      const { result } = await renderExchange()

      typeKeys(result, KeypadKey.One, KeypadKey.Zero)
      await flush(DEBOUNCE_MS)
      latestPendingQuoteTo('USD').respond('2')
      await flush()

      expect(result.current.exchange.result).toBe('20')
    })

    it('should show the result for the latest currency when quotes arrive out of order', async () => {
      const { result } = await renderExchange()

      typeKeys(result, KeypadKey.One, KeypadKey.Zero)
      await flush(DEBOUNCE_MS)
      act(() => result.current.exchange.onToChange('GBP'))
      await flush()

      latestPendingQuoteTo('GBP').respond('0.5')
      await flush()
      latestPendingQuoteTo('USD').respond('2')
      await flush()

      expect(result.current.exchange.to).toBe('GBP')
      expect(result.current.exchange.result).toBe('5')
    })

    it('should not show a stale result while the new currency is loading', async () => {
      const { result } = await renderExchange()

      typeKeys(result, KeypadKey.One, KeypadKey.Zero)
      await flush(DEBOUNCE_MS)
      act(() => result.current.exchange.onToChange('GBP'))
      await flush()

      latestPendingQuoteTo('USD').respond('2')
      await flush()

      expect(result.current.exchange.result).toBe('0')
    })
  })

  describe('handleKeyPress', () => {
    describe('on the exchange tab', () => {
      it('should type digits, dot and double zero into the amount', async () => {
        const { result } = await renderExchange()

        typeKeys(result, KeypadKey.One, KeypadKey.DoubleZero, KeypadKey.Dot, KeypadKey.Five)

        expect(result.current.exchange.amount).toBe('100.5')
      })

      it('should remove the last character and clear the amount', async () => {
        const { result } = await renderExchange()

        typeKeys(result, KeypadKey.One, KeypadKey.Two, KeypadKey.Backspace)
        expect(result.current.exchange.amount).toBe('1')

        typeKeys(result, KeypadKey.Clear)
        expect(result.current.exchange.amount).toBe('0')
      })

      it('should ignore the history navigation keys', async () => {
        const { result } = await renderExchange()

        typeKeys(result, KeypadKey.Down, KeypadKey.Ok)

        expect(result.current.history.selectedIndex).toBe(0)
        expect(result.current.tab).toBe(Tab.Exchange)
      })

      it('should save the current conversion to the history', async () => {
        const { result } = await renderExchange()
        const recordCount = result.current.history.records.length

        typeKeys(result, KeypadKey.One, KeypadKey.Zero)
        await flush(DEBOUNCE_MS)
        latestPendingQuoteTo('USD').respond('2')
        await flush()
        typeKeys(result, KeypadKey.Save)

        expect(result.current.history.records).toHaveLength(recordCount + 1)
        expect(result.current.history.records[recordCount]).toMatchObject({
          from: 'EUR',
          to: 'USD',
          amount: 10,
          result: '20',
        })
      })

      it('should save nothing before a quote arrives', async () => {
        const { result } = await renderExchange()
        const recordCount = result.current.history.records.length

        typeKeys(result, KeypadKey.Save)

        expect(result.current.history.records).toHaveLength(recordCount)
      })
    })

    describe('on the history tab', () => {
      const renderHistoryTab = async () => {
        const rendered = await renderExchange()
        act(() => rendered.result.current.setTab(Tab.History))
        return rendered
      }

      it('should ignore the amount keys', async () => {
        const { result } = await renderHistoryTab()

        typeKeys(result, KeypadKey.Five, KeypadKey.Dot, KeypadKey.Save)

        expect(result.current.exchange.amount).toBe('0')
      })

      it('should move the selection with up and down', async () => {
        const { result } = await renderHistoryTab()

        typeKeys(result, KeypadKey.Down, KeypadKey.Down, KeypadKey.Up)

        expect(result.current.history.selectedIndex).toBe(1)
      })

      it('should remove the selected record', async () => {
        const { result } = await renderHistoryTab()
        const selected = result.current.history.selectedRecord

        typeKeys(result, KeypadKey.Backspace)

        expect(result.current.history.records).not.toContain(selected)
      })

      it('should remove all records', async () => {
        const { result } = await renderHistoryTab()

        typeKeys(result, KeypadKey.Clear)

        expect(result.current.history.records).toHaveLength(0)
      })

      it('should load the currencies and full amount of the selected record', async () => {
        const { result } = await renderHistoryTab()

        typeKeys(result, KeypadKey.Down, KeypadKey.Down, KeypadKey.Down)
        const selected = result.current.history.selectedRecord!
        typeKeys(result, KeypadKey.Ok)

        expect(selected).toMatchObject({ from: 'PLN', to: 'EUR', amount: 12500 })
        expect(result.current.tab).toBe(Tab.Exchange)
        expect(result.current.exchange.from).toBe('PLN')
        expect(result.current.exchange.to).toBe('EUR')
        expect(result.current.exchange.amount).toBe('12500')
      })
    })
  })
})
