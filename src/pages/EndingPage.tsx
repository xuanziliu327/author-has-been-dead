import { useCallback, useEffect, useRef, useState } from 'react'
import { audioManager } from '../audio/AudioManager'
import { Credits } from '../components/Credits'
import { gameConfig } from '../config/game'
import { useMediaManifest } from '../context/MediaContext'
import { runtimeAssetUrl } from '../utils/media'

export function EndingPage({ kind }: { kind: 'yes' | 'no' }) {
  const manifest = useMediaManifest()
  const videoRef = useRef<HTMLVideoElement>(null)
  const freezeTimer = useRef<number | null>(null)
  const creditsStarted = useRef(false)
  const [creditsVisible, setCreditsVisible] = useState(false)
  const [playBlocked, setPlayBlocked] = useState(false)
  const hasVideo = kind === 'yes' ? manifest.endingYes : manifest.endingNo
  const fileName = kind === 'yes' ? gameConfig.mediaFileNames.endingYes : gameConfig.mediaFileNames.endingNo

  useEffect(() => {
    audioManager.stopAll()
    return () => {
      if (freezeTimer.current !== null) window.clearTimeout(freezeTimer.current)
    }
  }, [])

  const beginCredits = useCallback(() => {
    if (creditsStarted.current) return
    creditsStarted.current = true
    if (kind === 'yes' && gameConfig.yesEndingLoopsRiver) audioManager.setRiverMode('CONTINUOUS', true)
    setCreditsVisible(true)
  }, [kind])

  function freezeLastFrame() {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      beginCredits()
      return
    }
    video.pause()
    freezeTimer.current = window.setTimeout(beginCredits, 700)
    try {
      video.currentTime = Math.max(0, video.duration - 0.06)
    } catch (error) {
      console.warn('无法定位视频最后一帧，将保留浏览器结束画面。', error)
      beginCredits()
    }
  }

  async function playVideo() {
    try {
      await videoRef.current?.play()
      setPlayBlocked(false)
    } catch (error) {
      console.warn('结局视频自动播放被浏览器阻止。', error)
      setPlayBlocked(true)
    }
  }

  const finishNoEnding = useCallback(async () => {
    if (kind !== 'no') return
    if (gameConfig.noEndingPlaysGasp) await audioManager.playGasp()
    window.history.replaceState(null, '', gameConfig.noEndingReturnRoute)
    window.location.reload()
  }, [kind])

  return (
    <main className="ending-page page-fade">
      <div className="ending-stage">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={runtimeAssetUrl(fileName, manifest.buildVersion)}
            playsInline
            autoPlay
            preload="auto"
            onCanPlay={() => void playVideo()}
            onEnded={freezeLastFrame}
            onSeeked={() => {
              if (freezeTimer.current !== null) window.clearTimeout(freezeTimer.current)
              beginCredits()
            }}
          />
        ) : (
          <div className="video-placeholder media-placeholder">
            <p>结局视频素材待补充</p>
            {!creditsVisible && (
              <button className="placeholder-continue" type="button" onClick={beginCredits}>继续（占位测试）</button>
            )}
          </div>
        )}
        {playBlocked && !creditsVisible && (
          <button className="video-play-fallback primary-button" type="button" onClick={() => void playVideo()}>播放结局</button>
        )}
        {creditsVisible && <Credits overlay onComplete={kind === 'no' ? () => void finishNoEnding() : undefined} />}
      </div>
    </main>
  )
}
