import { gameConfig } from '../config/game'
import { getRiverIntervalMs } from '../utils/date'
import { runtimeAssetUrl } from '../utils/media'

export type RiverMode = 'STOPPED' | 'NORMAL_INTERVAL' | 'CONTINUOUS'

type Listener = () => void

class AudioManager {
  private river: HTMLAudioElement
  private gasp: HTMLAudioElement
  private buttonPool: HTMLAudioElement[]
  private buttonIndex = 0
  private timer: number | null = null
  private buildVersion = `${Date.now()}`
  private listeners = new Set<Listener>()
  private blocked = false
  private currentMode: RiverMode = 'STOPPED'
  private audioContext: AudioContext | null = null

  constructor() {
    this.river = this.makeAudio(gameConfig.mediaFileNames.river)
    this.gasp = this.makeAudio(gameConfig.mediaFileNames.gasp)
    this.buttonPool = Array.from({ length: 6 }, () => this.makeAudio(gameConfig.mediaFileNames.button))
  }

  private makeAudio(fileName: string): HTMLAudioElement {
    const audio = new Audio(runtimeAssetUrl(fileName, this.buildVersion))
    audio.preload = 'auto'
    return audio
  }

  configure(buildVersion: string): void {
    if (!buildVersion || buildVersion === this.buildVersion) return
    this.buildVersion = buildVersion
    if (this.currentMode !== 'STOPPED') return
    this.river = this.makeAudio(gameConfig.mediaFileNames.river)
    this.gasp = this.makeAudio(gameConfig.mediaFileNames.gasp)
    this.buttonPool = Array.from({ length: 6 }, () => this.makeAudio(gameConfig.mediaFileNames.button))
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot = (): boolean => this.blocked

  get mode(): RiverMode {
    return this.currentMode
  }

  private setBlocked(value: boolean): void {
    if (this.blocked === value) return
    this.blocked = value
    this.listeners.forEach((listener) => listener())
  }

  async unlock(): Promise<void> {
    try {
      this.audioContext ??= new AudioContext()
      await this.audioContext.resume()
      const silentBuffer = this.audioContext.createBuffer(1, 1, this.audioContext.sampleRate)
      const silentSource = this.audioContext.createBufferSource()
      silentSource.buffer = silentBuffer
      silentSource.connect(this.audioContext.destination)
      silentSource.start(0)
      this.setBlocked(false)
    } catch (error) {
      console.warn('浏览器尚未允许声音，等待下一次用户交互。', error)
    }
  }

  setRiverMode(mode: RiverMode, restart = false): void {
    if (this.currentMode === mode && !restart) return
    this.clearRiver()
    this.currentMode = mode
    if (mode === 'NORMAL_INTERVAL') this.scheduleNormal()
    if (mode === 'CONTINUOUS') void this.playContinuous()
  }

  private clearTimer(): void {
    if (this.timer !== null) window.clearTimeout(this.timer)
    this.timer = null
  }

  private clearRiver(): void {
    this.clearTimer()
    this.river.onended = null
    this.river.loop = false
    this.river.pause()
    this.river.currentTime = 0
  }

  private scheduleNormal(): void {
    this.clearTimer()
    this.timer = window.setTimeout(() => void this.playNormalOnce(), getRiverIntervalMs())
  }

  private async playNormalOnce(): Promise<void> {
    if (this.currentMode !== 'NORMAL_INTERVAL') return
    this.river.loop = false
    this.river.volume = gameConfig.riverNormalVolume
    this.river.currentTime = 0
    this.river.onended = () => {
      if (this.currentMode === 'NORMAL_INTERVAL') this.scheduleNormal()
    }
    try {
      await this.river.play()
      this.setBlocked(false)
    } catch (error) {
      console.warn('水声音频播放被浏览器阻止。', error)
      this.setBlocked(true)
    }
  }

  private async playContinuous(): Promise<void> {
    this.river.loop = true
    this.river.volume = gameConfig.riverContinuousVolume
    this.river.currentTime = 0
    try {
      await this.river.play()
      this.setBlocked(false)
    } catch (error) {
      console.warn('连续水声播放被浏览器阻止。', error)
      this.setBlocked(true)
    }
  }

  async enableSound(): Promise<void> {
    await this.unlock()
    if (this.currentMode === 'CONTINUOUS') await this.playContinuous()
    if (this.currentMode === 'NORMAL_INTERVAL') await this.playNormalOnce()
  }

  playButton(): void {
    const audio = this.buttonPool.find((candidate) => candidate.paused || candidate.ended)
      ?? this.buttonPool[this.buttonIndex++ % this.buttonPool.length]
    audio.currentTime = 0
    void audio.play().catch((error) => console.warn('机械按键音效播放失败。', error))
  }

  playGasp(): Promise<void> {
    this.gasp.loop = false
    this.gasp.volume = 1
    this.gasp.currentTime = 0
    return new Promise((resolve) => {
      let settled = false
      const finish = () => {
        if (settled) return
        settled = true
        this.gasp.onended = null
        resolve()
      }
      const fallback = window.setTimeout(finish, 2_400)
      this.gasp.onended = () => {
        window.clearTimeout(fallback)
        finish()
      }
      void this.gasp.play().catch((error) => {
        console.warn('喘息音效播放失败，将按备用计时继续。', error)
      })
    })
  }

  stopAll(): void {
    this.currentMode = 'STOPPED'
    this.clearRiver()
    this.gasp.pause()
    this.gasp.currentTime = 0
    for (const audio of this.buttonPool) {
      audio.pause()
      audio.currentTime = 0
    }
  }
}

export const audioManager = new AudioManager()
