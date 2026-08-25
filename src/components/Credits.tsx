import { useEffect } from 'react'
import { gameConfig } from '../config/game'
import { getCreditsDurationMs } from '../utils/date'

interface CreditsProps {
  overlay?: boolean
  onComplete?: () => void
}

export function Credits({ overlay = false, onComplete }: CreditsProps) {
  useEffect(() => {
    if (!onComplete) return
    const timer = window.setTimeout(onComplete, getCreditsDurationMs())
    return () => window.clearTimeout(timer)
  }, [onComplete])

  const [title, ...lines] = gameConfig.creditsLines

  return (
    <section
      className={`credits ${overlay ? 'credits-overlay' : 'credits-plain'}`}
      style={{ '--credits-duration': `${getCreditsDurationMs()}ms`, '--credits-fade': `${gameConfig.creditsFadeMs}ms` } as React.CSSProperties}
      aria-label="制作人员名单"
    >
      <div className="credits-content">
        <h1>{title}</h1>
        <div className="credits-lines">
          {lines.map((line, index) => <p key={line} style={{ animationDelay: `${index * 550 + 450}ms` }}>{line}</p>)}
        </div>
      </div>
    </section>
  )
}
