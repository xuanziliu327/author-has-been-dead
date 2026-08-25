import { useEffect, useRef, useState } from 'react'
import { formatTime } from '../utils/game'

export function StoryPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)

  useEffect(() => () => audioRef.current?.pause(), [])

  async function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try {
        await audio.play()
      } catch (error) {
        console.warn('故事音频播放失败。', error)
      }
    } else {
      audio.pause()
    }
  }

  return (
    <div className="story-player">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
      <button className="player-toggle" type="button" onClick={() => void toggle()} aria-label={playing ? '暂停' : '播放'}>
        {playing ? '暂停' : '播放'}
      </button>
      <label className="player-progress">
        <span className="sr-only">播放进度</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (audioRef.current) audioRef.current.currentTime = next
            setCurrentTime(next)
          }}
        />
      </label>
      <span className="player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
      <label className="player-volume">
        <span>音量</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => {
            const next = Number(event.target.value)
            setVolume(next)
            if (audioRef.current) audioRef.current.volume = next
          }}
        />
      </label>
    </div>
  )
}
