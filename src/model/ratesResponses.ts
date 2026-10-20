export interface RatesResponse {
  base: string
  currencies: string[]
  rates: Record<string, string>
  updatedAt: string
}
