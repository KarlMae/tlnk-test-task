import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KeypadKey } from '../../model'
import { useAmountInput } from './amountInput'

const renderAmountInput = () => renderHook(() => useAmountInput())

describe('useAmountInput', () => {
  describe('amount', () => {
    it('should start at zero', () => {
      const { result } = renderAmountInput()

      expect(result.current.amount).toBe('0')
    })
  })

  describe('type', () => {
    it('should replace the leading zero with the first digit', () => {
      const { result } = renderAmountInput()

      act(() => result.current.type(KeypadKey.Five))

      expect(result.current.amount).toBe('5')
    })

    it('should append digits after the first one', () => {
      const { result } = renderAmountInput()

      act(() => result.current.type(KeypadKey.One))
      act(() => result.current.type(KeypadKey.DoubleZero))

      expect(result.current.amount).toBe('100')
    })

    it('should keep a single zero when typing a double zero on zero', () => {
      const { result } = renderAmountInput()

      act(() => result.current.type(KeypadKey.DoubleZero))

      expect(result.current.amount).toBe('0')
    })

    it('should append a double zero after the decimal dot', () => {
      const { result } = renderAmountInput()

      act(() => result.current.typeDot())
      act(() => result.current.type(KeypadKey.DoubleZero))

      expect(result.current.amount).toBe('0.00')
    })
  })

  describe('typeDot', () => {
    it('should add a dot only once', () => {
      const { result } = renderAmountInput()

      act(() => result.current.typeDot())
      act(() => result.current.typeDot())
      act(() => result.current.type(KeypadKey.Five))
      act(() => result.current.typeDot())

      expect(result.current.amount).toBe('0.5')
    })
  })

  describe('backspace', () => {
    it('should remove the last character', () => {
      const { result } = renderAmountInput()

      act(() => result.current.setAmount('123'))
      act(() => result.current.backspace())

      expect(result.current.amount).toBe('12')
    })

    it('should fall back to zero when removing the last remaining character', () => {
      const { result } = renderAmountInput()

      act(() => result.current.setAmount('7'))
      act(() => result.current.backspace())

      expect(result.current.amount).toBe('0')
    })
  })

  describe('clear', () => {
    it('should clear back to zero', () => {
      const { result } = renderAmountInput()

      act(() => result.current.setAmount('123.45'))
      act(() => result.current.clear())

      expect(result.current.amount).toBe('0')
    })
  })
})
