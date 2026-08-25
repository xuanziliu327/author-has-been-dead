import { useNavigate } from 'react-router-dom'
import { audioManager } from '../audio/AudioManager'
import { isSpecialLocalDate } from '../utils/date'

export function LandingPage() {
  const navigate = useNavigate()

  async function enter() {
    await audioManager.unlock()
    audioManager.setRiverMode(isSpecialLocalDate() ? 'STOPPED' : 'NORMAL_INTERVAL', true)
    navigate('/notice')
  }

  return (
    <main className="landing-page page-fade">
      <div className="landing-content">
        <h1>作者已死</h1>
        <button className="primary-button" type="button" onClick={() => void enter()}>进入</button>
      </div>
    </main>
  )
}
