import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { audioManager } from '../audio/AudioManager'
import { gameConfig } from '../config/game'
import { stepDigit } from '../utils/game'
import { sha256 } from '../utils/hash'

export function SpecialLockPage() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState([0, 0, 0, 0, 0, 0])
  const [motion, setMotion] = useState<{ index: number; direction: 1 | -1; key: number } | null>(null)
  const [unlocking, setUnlocking] = useState(false)
  const validationSequence = useRef(0)

  async function validate(value: string, sequence: number) {
    const digest = await sha256(value)
    if (sequence !== validationSequence.current || digest !== gameConfig.passwordHash) return
    audioManager.setRiverMode('STOPPED', true)
    setUnlocking(true)
    window.setTimeout(() => navigate('/special/materials', { replace: true }), 200)
  }

  function changeDigit(index: number, direction: 1 | -1) {
    if (unlocking) return
    audioManager.playButton()
    const next = [...digits]
    next[index] = stepDigit(next[index], direction)
    const sequence = ++validationSequence.current
    setDigits(next)
    setMotion({ index, direction, key: sequence })
    void validate(next.join(''), sequence)
  }

  return (
    <main className={`lock-page page-fade ${unlocking ? 'unlocking' : ''}`}>
      <section className="lock-panel" aria-label="六位数字密码装置">
        <div className="lock-screws" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="digit-bank">
          {digits.map((digit, index) => (
            <div className="digit-column" key={index}>
              <button type="button" aria-label={`第 ${index + 1} 位加一`} onClick={() => changeDigit(index, 1)}>▲</button>
              <div className="digit-window" aria-live="off">
                <span
                  key={motion?.index === index ? motion.key : `steady-${index}`}
                  className={motion?.index === index ? (motion.direction === 1 ? 'digit-up' : 'digit-down') : ''}
                >{digit}</span>
              </div>
              <button type="button" aria-label={`第 ${index + 1} 位减一`} onClick={() => changeDigit(index, -1)}>▼</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
