import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useHistory } from './useHistory'

const INITIAL_RECORD_COUNT = 7

const renderHistory = () => renderHook(() => useHistory())

describe('useHistory', () => {
  describe('records and selectedRecord', () => {
    it('should start with the seeded records and the first one selected', () => {
      const { result } = renderHistory()

      expect(result.current.records).toHaveLength(INITIAL_RECORD_COUNT)
      expect(result.current.selectedIndex).toBe(0)
      expect(result.current.selectedRecord).toBe(result.current.records[0])
    })
  })

  describe('selectNext', () => {
    it('should not move the selection past the last record', () => {
      const { result } = renderHistory()

      for (let i = 0; i < INITIAL_RECORD_COUNT + 2; i++) {
        act(() => result.current.selectNext())
      }

      expect(result.current.selectedIndex).toBe(INITIAL_RECORD_COUNT - 1)
    })

    it('should do nothing on an empty list', () => {
      const { result } = renderHistory()

      act(() => result.current.clear())
      act(() => result.current.selectNext())

      expect(result.current.selectedIndex).toBe(0)
      expect(result.current.selectedRecord).toBeUndefined()
    })
  })

  describe('selectPrevious', () => {
    it('should move the selection up', () => {
      const { result } = renderHistory()

      act(() => result.current.selectNext())
      act(() => result.current.selectNext())
      expect(result.current.selectedIndex).toBe(2)

      act(() => result.current.selectPrevious())
      expect(result.current.selectedIndex).toBe(1)
    })

    it('should not move the selection before the first record', () => {
      const { result } = renderHistory()

      act(() => result.current.selectPrevious())

      expect(result.current.selectedIndex).toBe(0)
    })
  })

  describe('removeSelected', () => {
    it('should remove the selected record and select the one that took its place', () => {
      const { result } = renderHistory()
      const removed = result.current.records[2]
      const next = result.current.records[3]

      act(() => result.current.selectNext())
      act(() => result.current.selectNext())
      act(() => result.current.removeSelected())

      expect(result.current.records).not.toContain(removed)
      expect(result.current.selectedIndex).toBe(2)
      expect(result.current.selectedRecord).toBe(next)
    })

    it('should select the new last record after removing the last one', () => {
      const { result } = renderHistory()

      for (let i = 0; i < INITIAL_RECORD_COUNT; i++) {
        act(() => result.current.selectNext())
      }
      act(() => result.current.removeSelected())

      expect(result.current.records).toHaveLength(INITIAL_RECORD_COUNT - 1)
      expect(result.current.selectedRecord).toBe(result.current.records[INITIAL_RECORD_COUNT - 2])
    })

    it('should empty the list after removing every record one by one', () => {
      const { result } = renderHistory()

      for (let i = 0; i < INITIAL_RECORD_COUNT; i++) {
        act(() => result.current.removeSelected())
      }

      expect(result.current.records).toHaveLength(0)
      expect(result.current.selectedIndex).toBe(0)
    })

    it('should do nothing on an empty list', () => {
      const { result } = renderHistory()

      act(() => result.current.clear())
      act(() => result.current.removeSelected())

      expect(result.current.records).toHaveLength(0)
      expect(result.current.selectedIndex).toBe(0)
      expect(result.current.selectedRecord).toBeUndefined()
    })
  })

  describe('clear', () => {
    it('should clear every record and reset the selection', () => {
      const { result } = renderHistory()

      act(() => result.current.selectNext())
      act(() => result.current.clear())

      expect(result.current.records).toHaveLength(0)
      expect(result.current.selectedIndex).toBe(0)
    })
  })

  describe('add', () => {
    it('should append a conversion with a generated id', () => {
      const { result } = renderHistory()
      const conversion = { from: 'EUR', to: 'USD', amount: 10, result: '10.84' }

      act(() => result.current.add(conversion))

      expect(result.current.records[INITIAL_RECORD_COUNT]).toEqual({
        id: expect.any(String),
        ...conversion,
      })
    })
  })
})
