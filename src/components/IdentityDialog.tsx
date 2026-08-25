import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { audioManager } from '../audio/AudioManager'
import { gameConfig } from '../config/game'
import { sha256 } from '../utils/hash'

export function IdentityDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const nameInput = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    nameInput.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (checking) return
    setChecking(true)
    const [nameHash, ageHash] = await Promise.all([sha256(name.trim()), sha256(age.trim())])
    audioManager.stopAll()
    const correct = nameHash === gameConfig.identityNameHash && gameConfig.identityAgeHashes.includes(ageHash)
    navigate(correct ? '/ending/normal' : '/failure', { replace: true })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="identity-dialog" role="dialog" aria-modal="true" aria-labelledby="identity-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-header">
          <h2 id="identity-title">完善尸体信息</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">×</button>
        </div>
        <form onSubmit={(event) => void submit(event)}>
          <label>
            <span>死者的名字是？</span>
            <input ref={nameInput} value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" required />
          </label>
          <label className="age-field">
            <span>死者的年龄是</span>
            <span className="age-input-row"><input type="number" inputMode="numeric" value={age} onChange={(event) => setAge(event.target.value)} required /> 岁？</span>
          </label>
          <button className="primary-button dialog-submit" type="submit" disabled={checking}>
            {checking ? '核对中' : '确认'}
          </button>
        </form>
      </section>
    </div>
  )
}
