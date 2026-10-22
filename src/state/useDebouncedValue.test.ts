import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

const DELAY_MS = 1_000

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderDebounced = () =>
    renderHook(({ value }) => useDebouncedValue(value, DELAY_MS), {
      initialProps: { value: 'a' },
    })

  it('should return the initial value immediately', () => {
    const { result } = renderDebounced()

    expect(result.current).toBe('a')
  })

  it('should update only after the delay', () => {
    const { result, rerender } = renderDebounced()

    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(DELAY_MS - 1))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('b')
  })

  it('should restart the delay on every change', () => {
    const { result, rerender } = renderDebounced()

    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(DELAY_MS - 1))
    rerender({ value: 'c' })
    act(() => vi.advanceTimersByTime(DELAY_MS - 1))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('c')
  })
})
