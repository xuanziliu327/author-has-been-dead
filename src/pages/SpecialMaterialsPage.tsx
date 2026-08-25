import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { audioManager } from '../audio/AudioManager'
import { MarkdownDocument } from '../components/MarkdownDocument'
import { StoryPlayer } from '../components/StoryPlayer'
import { gameConfig } from '../config/game'
import { hiddenMarkdown } from '../content/manifest'
import { useMediaManifest } from '../context/MediaContext'
import { runtimeAssetUrl } from '../utils/media'

export function SpecialMaterialsPage() {
  const navigate = useNavigate()
  const manifest = useMediaManifest()

  useEffect(() => audioManager.setRiverMode('STOPPED'), [])

  return (
    <main className="materials-page page-fade">
      <div className="materials-content">
        <section className="material-section" aria-labelledby="story-audio-title">
          <h1 id="story-audio-title">音频记录</h1>
          {manifest.story ? (
            <StoryPlayer src={runtimeAssetUrl(gameConfig.mediaFileNames.story, manifest.buildVersion)} />
          ) : (
            <div className="media-placeholder audio-placeholder">音频素材待补充：story.mp3</div>
          )}
        </section>
        <MarkdownDocument source={hiddenMarkdown} />
        <div className="materials-next">
          <button className="primary-button" type="button" onClick={() => navigate('/special/question')}>完善？？信息</button>
        </div>
      </div>
    </main>
  )
}
