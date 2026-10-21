import type { HistoryRecord } from './model'

export const initialHistory: HistoryRecord[] = [
  { id: 'initial-1', from: 'USD', to: 'EUR', amount: '1,000', result: '922.25' },
  { id: 'initial-2', from: 'EUR', to: 'USD', amount: '500', result: '542.15' },
  { id: 'initial-3', from: 'GBP', to: 'PLN', amount: '250', result: '1,271.72' },
  { id: 'initial-4', from: 'PLN', to: 'EUR', amount: '12,500', result: '2,921.18' },
  { id: 'initial-5', from: 'SEK', to: 'GBP', amount: '3,400', result: '254.49' },
  { id: 'initial-6', from: 'EUR', to: 'JPY', amount: '75', result: '12,185.25' },
  { id: 'initial-7', from: 'USD', to: 'SEK', amount: '2,750', result: '28,503.07' },
]
