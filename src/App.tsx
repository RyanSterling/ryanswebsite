import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Challenge from './pages/Challenge'
import ChallengeSuccess from './pages/ChallengeSuccess'
import Assessment from './pages/Assessment'
import ResultsPage from './pages/ResultsPage'
import ThankYou from './pages/ThankYou'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/challenge-success" element={<ChallengeSuccess />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/results/:id" element={<ResultsPage />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  )
}

export default App
