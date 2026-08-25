import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { audioManager } from '../audio/AudioManager'
import { fallbackMediaManifest, loadMediaManifest, type MediaManifest } from '../utils/media'

const MediaContext = createContext<MediaManifest>(fallbackMediaManifest)

export function MediaProvider({ children }: { children: ReactNode }) {
  const [manifest, setManifest] = useState(fallbackMediaManifest)

  useEffect(() => {
    let active = true
    void loadMediaManifest().then((next) => {
      if (!active) return
      audioManager.configure(next.buildVersion)
      setManifest(next)
    })
    return () => { active = false }
  }, [])

  return <MediaContext.Provider value={manifest}>{children}</MediaContext.Provider>
}

export function useMediaManifest(): MediaManifest {
  return useContext(MediaContext)
}
