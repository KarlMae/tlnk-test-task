import { QuoteRequest } from './quote.types.ts'

export const quoteKeys = {
  all: () => ['quote'] as const,
  detail: (input: QuoteRequest | undefined) => [...quoteKeys.all(), input] as const,
} as const
