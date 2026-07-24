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
import LinkInBio from './pages/LinkInBio'

// Course pages
import Courses from './pages/Courses'
import CourseLanding from './pages/CourseLanding'
import Dashboard from './pages/Dashboard'
import CourseViewer from './pages/CourseViewer'
import Checkout from './pages/Checkout'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ProtectedRoute from './components/ProtectedRoute'

// Custom course viewers
import { FlopProofViewer } from './components/flop-proof'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/link-in-bio" element={<LinkInBio />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/challenge-success" element={<ChallengeSuccess />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/results/:id" element={<ResultsPage />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/profile-audit" element={<ProfileAudit />} />
      <Route path="/audit-thank-you" element={<AuditThankYou />} />
      <Route path="/prompts/:slug" element={<PromptPage />} />
      <Route path="/get/:slug" element={<PromptOptIn />} />

      {/* Auth */}
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />

      {/* Courses - Public */}
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:slug" element={<CourseLanding />} />

      {/* Courses - Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/flop-proof-content-system/learn/:lessonId?"
        element={
          <ProtectedRoute>
            <FlopProofViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:slug/learn"
        element={
          <ProtectedRoute>
            <CourseViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout/:slug"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
