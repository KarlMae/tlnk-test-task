import type { QuoteRequest } from './quote.types'

export const quoteKeys = {
  all: () => ['quote'] as const,
  detail: (input: QuoteRequest | undefined) => [...quoteKeys.all(), input] as const,
} as const
