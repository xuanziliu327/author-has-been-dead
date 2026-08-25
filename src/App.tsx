import { Navigate, Route, Routes } from 'react-router-dom'
import { SoundFallbackButton } from './components/SoundFallbackButton'
import { MediaProvider } from './context/MediaContext'
import { ArchivePage } from './pages/ArchivePage'
import { EndingPage } from './pages/EndingPage'
import { FailurePage } from './pages/FailurePage'
import { LandingPage } from './pages/LandingPage'
import { NormalCreditsPage } from './pages/NormalCreditsPage'
import { NoticePage } from './pages/NoticePage'
import { SpecialLockPage } from './pages/SpecialLockPage'
import { SpecialMaterialsPage } from './pages/SpecialMaterialsPage'
import { SpecialQuestionPage } from './pages/SpecialQuestionPage'

export default function App() {
  return (
    <MediaProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/archive/*" element={<ArchivePage />} />
        <Route path="/failure" element={<FailurePage />} />
        <Route path="/ending/normal" element={<NormalCreditsPage />} />
        <Route path="/special/lock" element={<SpecialLockPage />} />
        <Route path="/special/materials" element={<SpecialMaterialsPage />} />
        <Route path="/special/question" element={<SpecialQuestionPage />} />
        <Route path="/ending/yes" element={<EndingPage kind="yes" />} />
        <Route path="/ending/no" element={<EndingPage kind="no" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SoundFallbackButton />
    </MediaProvider>
  )
}
