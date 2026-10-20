import { describe, expect, it } from 'vitest'
import { formatTimeAgo } from './time'

const now = new Date('2026-10-20T12:00:00Z')

describe('time', () => {
  it('describes a date under a minute ago as less than a minute', () => {
    expect(formatTimeAgo(new Date('2026-10-20T11:59:01Z'), now)).toBe('less than a minute ago')
  })

  it('describes a date exactly a minute ago in minutes', () => {
    expect(formatTimeAgo(new Date('2026-10-20T11:59:00Z'), now)).toBe('1 minute ago')
  })

  it('rounds partial minutes down', () => {
    expect(formatTimeAgo(new Date('2026-10-20T11:58:20Z'), now)).toBe('1 minute ago')
  })

  it('rounds partial hours down', () => {
    expect(formatTimeAgo(new Date('2026-10-20T10:01:00Z'), now)).toBe('1 hour ago')
  })

  it('describes dates over a day ago in days', () => {
    expect(formatTimeAgo(new Date('2026-10-18T00:00:00Z'), now)).toBe('2 days ago')
  })
})
