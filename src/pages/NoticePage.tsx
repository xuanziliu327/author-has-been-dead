import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { audioManager } from '../audio/AudioManager'
import { MarkdownDocument } from '../components/MarkdownDocument'
import { noticeMarkdown } from '../content/manifest'
import { isSpecialLocalDate } from '../utils/date'

export function NoticePage() {
  const navigate = useNavigate()
  const special = isSpecialLocalDate()

  useEffect(() => {
    audioManager.setRiverMode(special ? 'STOPPED' : 'NORMAL_INTERVAL')
  }, [special])

  async function enterSpecial() {
    await audioManager.unlock()
    audioManager.setRiverMode('CONTINUOUS', true)
    navigate('/special/lock')
  }

  if (special) {
    return (
      <main className="special-gateway page-fade">
        <button className="primary-button" type="button" onClick={() => void enterSpecial()}>进入</button>
      </main>
    )
  }

  return (
    <main className="notice-page page-fade">
      <div className="notice-paper">
        <MarkdownDocument source={noticeMarkdown} />
        <div className="notice-actions">
          <button className="paper-button" type="button" onClick={() => navigate('/archive/scene')}>下一步</button>
        </div>
      </div>
    </main>
  )
}
