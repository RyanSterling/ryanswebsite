import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Results from '../components/assessment/Results'
import { AssessmentResult, InstagramProfile, InstagramReel } from './Assessment'

interface ResultsData {
  resultId: string
  analysis: AssessmentResult
  profile: InstagramProfile
  reels: InstagramReel[]
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<ResultsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResults() {
      if (!id) {
        setError('No result ID provided')
        setLoading(false)
        return
      }

      try {
        const envUrl = import.meta.env.VITE_API_URL
        const apiUrl = (envUrl && envUrl !== 'undefined') ? envUrl : 'http://localhost:8787'
        const response = await fetch(`${apiUrl}/results/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Result not found. This link may have expired.')
          } else {
            setError('Failed to load results')
          }
          setLoading(false)
          return
        }

        const result = await response.json() as ResultsData
        setData(result)
        setLoading(false)
      } catch (err) {
        setError('Failed to load results. Please try again.')
        setLoading(false)
      }
    }

    fetchResults()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your results...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-white text-xl font-semibold mb-2">Oops!</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/assessment"
            className="inline-block bg-brand-orange text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Get a New Assessment
          </Link>
        </div>
      </main>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Results
      result={data.analysis}
      profile={data.profile}
      reels={data.reels}
    />
  )
}
