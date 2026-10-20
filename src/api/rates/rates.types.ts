export interface RatesResponse {
  readonly base: string
  readonly currencies: readonly string[]
  readonly rates: Readonly<Record<string, string>>
  readonly updatedAt: string
}
