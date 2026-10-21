import type { UtcDateTime } from '../../model'

export interface QuoteRequest {
  readonly from: string
  readonly to: string
  readonly amount: number
}

export interface Quote {
  readonly quoteId: string
  readonly from: string
  readonly to: string
  readonly rate: string
  readonly amount: number
  readonly createdAt: UtcDateTime
  readonly expiresAt: UtcDateTime
}
