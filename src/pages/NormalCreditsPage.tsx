import { useEffect } from 'react'
import { audioManager } from '../audio/AudioManager'
import { Credits } from '../components/Credits'

export function NormalCreditsPage() {
  useEffect(() => audioManager.stopAll(), [])
  return <main className="normal-credits-page"><Credits /></main>
}
