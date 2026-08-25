import { useNavigate } from 'react-router-dom'
import { audioManager } from '../audio/AudioManager'

export function FailurePage() {
  const navigate = useNavigate()

  function leave() {
    audioManager.setRiverMode('NORMAL_INTERVAL', true)
    navigate('/notice', { replace: true })
  }

  return (
    <main className="center-page failure-page page-fade">
      <div className="failure-copy">
        <p>读文本读得细一点。</p>
        <p>我本来没想做这个失败页面的，毕竟我压根没塞正经谜题，不过看来很遗憾这些文字无法吸引你，所以你好，再见。</p>
        <button className="primary-button" type="button" onClick={leave}>再见</button>
      </div>
    </main>
  )
}
