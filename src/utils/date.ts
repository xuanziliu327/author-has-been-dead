import { gameConfig } from '../config/game'

function devParam(name: string): string | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get(name)
}

function parseDebugDate(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

export function isSpecialLocalDate(now = new Date()): boolean {
  const current = parseDebugDate(devParam('debugDate')) ?? now
  const { year, month, day } = gameConfig.specialDate
  return current.getFullYear() === year && current.getMonth() === month - 1 && current.getDate() === day
}

function devDuration(name: string, fallback: number): number {
  const value = devParam(name)
  if (value === null || value.trim() === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export function getRiverIntervalMs(): number {
  return devDuration('riverMs', gameConfig.riverIntervalMs)
}

export function getCreditsDurationMs(): number {
  return devDuration('creditsMs', gameConfig.creditsDurationMs)
}
