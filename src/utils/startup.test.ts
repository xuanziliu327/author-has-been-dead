import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetHashRouteBeforeMount } from './startup'

describe('resetHashRouteBeforeMount', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
    vi.restoreAllMocks()
  })

  it('replaces every deep hash route with the home route', () => {
    window.history.replaceState(null, '', '/#/archive/calls')

    resetHashRouteBeforeMount()

    expect(window.location.pathname).toBe('/')
    expect(window.location.hash).toBe('#/')
  })

  it('preserves outer development query parameters while resetting the hash', () => {
    window.history.replaceState(null, '', '/?debugDate=2026-11-23#/ending/yes')

    resetHashRouteBeforeMount()

    expect(window.location.search).toBe('?debugDate=2026-11-23')
    expect(window.location.hash).toBe('#/')
  })

  it('normalizes an initial URL without a hash and leaves home unchanged afterward', () => {
    window.history.replaceState(null, '', '/')
    resetHashRouteBeforeMount()
    expect(window.location.hash).toBe('#/')

    const replaceState = vi.spyOn(window.history, 'replaceState')
    resetHashRouteBeforeMount()
    expect(replaceState).not.toHaveBeenCalled()
  })
})
