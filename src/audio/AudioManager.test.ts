import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

class FakeAudio {
  static instances: FakeAudio[] = []
  src: string
  preload = ''
  paused = true
  ended = false
  loop = false
  volume = 1
  currentTime = 0
  onended: (() => void) | null = null
  play = vi.fn(async () => { this.paused = false })
  pause = vi.fn(() => { this.paused = true })

  constructor(src: string) {
    this.src = src
    FakeAudio.instances.push(this)
  }
}

class FakeAudioContext {
  sampleRate = 48_000
  destination = {}
  resume = vi.fn(async () => undefined)
  createBuffer = vi.fn(() => ({}))
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
  }))
}

describe('AudioManager river scheduling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    FakeAudio.instances = []
    vi.stubGlobal('Audio', FakeAudio)
    vi.stubGlobal('AudioContext', FakeAudioContext)
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('waits for ended before starting the next normal interval and supports continuous mode', async () => {
    const { audioManager } = await import('./AudioManager')
    const river = FakeAudio.instances[0]

    audioManager.setRiverMode('NORMAL_INTERVAL', true)
    expect(audioManager.mode).toBe('NORMAL_INTERVAL')
    await vi.advanceTimersByTimeAsync(300_000)
    expect(river.play).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(300_000)
    expect(river.play).toHaveBeenCalledTimes(1)

    river.onended?.()
    await vi.advanceTimersByTimeAsync(300_000)
    expect(river.play).toHaveBeenCalledTimes(2)

    audioManager.setRiverMode('CONTINUOUS', true)
    await vi.runAllTicks()
    expect(audioManager.mode).toBe('CONTINUOUS')
    expect(river.loop).toBe(true)
    expect(river.play).toHaveBeenCalledTimes(3)

    audioManager.playButton()
    expect(FakeAudio.instances.slice(2).some((audio) => audio.play.mock.calls.length > 0)).toBe(true)

    audioManager.stopAll()
    expect(audioManager.mode).toBe('STOPPED')
  })

  it('unlocks audio without touching the river media element', async () => {
    const { audioManager } = await import('./AudioManager')
    const river = FakeAudio.instances[0]

    await audioManager.unlock()

    expect(river.play).not.toHaveBeenCalled()
    expect(river.currentTime).toBe(0)
    expect(river.loop).toBe(false)
  })

  it('waits a full normal interval after leaving continuous mode', async () => {
    const { audioManager } = await import('./AudioManager')
    const river = FakeAudio.instances[0]

    audioManager.setRiverMode('CONTINUOUS', true)
    await Promise.resolve()
    river.play.mockClear()

    audioManager.setRiverMode('NORMAL_INTERVAL')
    expect(audioManager.mode).toBe('NORMAL_INTERVAL')
    expect(river.loop).toBe(false)
    expect(river.play).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(299_999)
    expect(river.play).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(river.play).toHaveBeenCalledTimes(1)
  })
})
