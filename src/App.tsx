import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Challenge from './pages/Challenge'
import ChallengeSuccess from './pages/ChallengeSuccess'
import Assessment from './pages/Assessment'
import ResultsPage from './pages/ResultsPage'
import ThankYou from './pages/ThankYou'
import ProfileAudit from './pages/ProfileAudit'
import AuditThankYou from './pages/AuditThankYou'
import PromptPage from './pages/PromptPage'
import PromptOptIn from './pages/PromptOptIn'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/challenge-success" element={<ChallengeSuccess />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/results/:id" element={<ResultsPage />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/profile-audit" element={<ProfileAudit />} />
      <Route path="/audit-thank-you" element={<AuditThankYou />} />
      <Route path="/prompts/:slug" element={<PromptPage />} />
      <Route path="/get/:slug" element={<PromptOptIn />} />
    </Routes>
  )
}

export default App
