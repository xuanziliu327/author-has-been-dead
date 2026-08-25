import { describe, expect, it } from 'vitest'
import { isSpecialLocalDate } from './date'
import { formatTime, stepDigit } from './game'
import { sha256 } from './hash'

describe('game utilities', () => {
  it('wraps lock digits in both directions', () => {
    expect(stepDigit(9, 1)).toBe(0)
    expect(stepDigit(0, -1)).toBe(9)
    expect(stepDigit(4, 1)).toBe(5)
  })

  it('checks the configured local calendar date', () => {
    expect(isSpecialLocalDate(new Date(2026, 10, 23, 23, 59))).toBe(true)
    expect(isSpecialLocalDate(new Date(2026, 10, 22, 23, 59))).toBe(false)
  })

  it('formats media time', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(65.9)).toBe('1:05')
  })

  it('creates browser-compatible SHA-256 digests', async () => {
    await expect(sha256('abc')).resolves.toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })
})
