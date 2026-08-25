import { useSyncExternalStore } from 'react'
import { audioManager } from '../audio/AudioManager'

export function SoundFallbackButton() {
  const blocked = useSyncExternalStore(
    (callback) => audioManager.subscribe(callback),
    audioManager.getSnapshot,
    () => false,
  )

  if (!blocked) return null

  return (
    <button className="sound-fallback" type="button" onClick={() => void audioManager.enableSound()}>
      <span aria-hidden="true">◖</span>
      启用声音
    </button>
  )
}
