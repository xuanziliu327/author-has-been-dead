import { useNavigate } from 'react-router-dom'

export function SpecialQuestionPage() {
  const navigate = useNavigate()
  return (
    <main className="question-page center-page page-fade">
      <div className="question-content">
        <h1>我死了吗？</h1>
        <div className="question-actions">
          <button className="primary-button" type="button" onClick={() => navigate('/ending/yes')}>是</button>
          <button className="primary-button" type="button" onClick={() => navigate('/ending/no')}>否</button>
        </div>
      </div>
    </main>
  )
}
