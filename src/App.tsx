import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import Home from './pages/Home'
import Challenge from './pages/Challenge'
import ChallengeSuccess from './pages/ChallengeSuccess'
import Assessment from './pages/Assessment'
import ResultsPage from './pages/ResultsPage'
import ThankYou from './pages/ThankYou'
import PromptPage from './pages/PromptPage'
import PromptOptIn from './pages/PromptOptIn'
import LinkInBio from './pages/LinkInBio'
import RoastMyProfile from './pages/RoastMyProfile'
import ProfileAudit from './pages/ProfileAudit'
import AuditThankYou from './pages/AuditThankYou'

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
import { BreakthroughContentViewer } from './components/breakthrough-content'
import BreakthroughSalesPage from './pages/BreakthroughSalesPage'

function App() {
  const navigate = useNavigate()
  const { isSignedIn, isLoaded } = useAuth()

  // Handle pending redirects after OAuth sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const pendingRedirect = localStorage.getItem('pendingRedirect')
      if (pendingRedirect) {
        localStorage.removeItem('pendingRedirect')
        navigate(pendingRedirect)
      }
    }
  }, [isLoaded, isSignedIn, navigate])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/link-in-bio" element={<LinkInBio />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/challenge-success" element={<ChallengeSuccess />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/results/:id" element={<ResultsPage />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/prompts/:slug" element={<PromptPage />} />
      <Route path="/get/:slug" element={<PromptOptIn />} />
      <Route path="/roast" element={<RoastMyProfile />} />
      <Route path="/profile-audit" element={<ProfileAudit />} />
      <Route path="/audit-thank-you" element={<AuditThankYou />} />

      {/* Auth */}
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />

      {/* Courses - Public */}
      <Route path="/courses" element={<Courses />} />
      <Route path="/breakthrough" element={<BreakthroughSalesPage />} />
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
        path="/courses/breakthrough-content-strategy/learn/:lessonId?"
        element={
          <ProtectedRoute>
            <BreakthroughContentViewer />
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
