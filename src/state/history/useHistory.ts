import { useState } from 'react'
import type { Conversion, HistoryRecord } from '../../model'

const initialHistory: HistoryRecord[] = [
  { id: 'initial-1', from: 'USD', to: 'EUR', amount: 1000, result: '922.25' },
  { id: 'initial-2', from: 'EUR', to: 'USD', amount: 500, result: '542.15' },
  { id: 'initial-3', from: 'GBP', to: 'PLN', amount: 250, result: '1,271.72' },
  { id: 'initial-4', from: 'PLN', to: 'EUR', amount: 12500, result: '2,921.18' },
  { id: 'initial-5', from: 'SEK', to: 'GBP', amount: 3400, result: '254.49' },
  { id: 'initial-6', from: 'EUR', to: 'JPY', amount: 75, result: '12,185.25' },
  { id: 'initial-7', from: 'USD', to: 'SEK', amount: 2750, result: '28,503.07' },
]

export function useHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>(initialHistory)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectedRecord: HistoryRecord | undefined = records[selectedIndex]

  const add = (conversion: Conversion) =>
    setRecords((prev) => [...prev, { id: crypto.randomUUID(), ...conversion }])
  const removeSelected = () => {
    setRecords((prev) => prev.filter((_, i) => i !== selectedIndex))
    setSelectedIndex((prev) => Math.max(0, Math.min(prev, records.length - 2)))
  }
  const clear = () => {
    setRecords([])
    setSelectedIndex(0)
  }
  const selectPrevious = () => setSelectedIndex((prev) => Math.max(0, prev - 1))
  const selectNext = () =>
    setSelectedIndex((prev) => Math.max(0, Math.min(records.length - 1, prev + 1)))

  return {
    records,
    selectedIndex,
    selectedRecord,
    add,
    removeSelected,
    clear,
    selectPrevious,
    selectNext,
  }
}
