import { useState } from 'react'
import AssessmentStepper from '../components/assessment/AssessmentStepper'
import LoadingState from '../components/assessment/LoadingState'
import Results from '../components/assessment/Results'

export type AssessmentStep =
  | 'email'
  | 'handle'
  | 'problem'
  | 'frequency'
  | 'length'
  | 'views'
  | 'outliers'
  | 'selfDiagnosis'
  | 'loading'
  | 'results'

export interface AssessmentData {
  email: string
  handle: string
  problemTheySolve: string
  postingFrequency: string
  avgReelLength: string
  avgViews: string
  outliersLast90Days: string
  selfDiagnosis: string
}

// Instagram profile data from API
export interface InstagramProfile {
  username: string
  fullName: string
  biography: string
  followersCount: number
  postsCount: number
  profilePicUrl: string
  isVerified: boolean
}

// Instagram reel data from API
export interface InstagramReel {
  videoUrl: string
  thumbnailUrl: string
  viewCount: number
  commentsCount: number
  duration: number
  caption: string
  shortCode: string
}

// New analysis structure
export interface MarketContext {
  niche: string
  market_desires: string[]
}

export interface BioEvaluation {
  verdict: 'Clear' | 'Needs Work' | 'Unclear'
  states_problem_clearly: boolean
  speaks_to_desires: boolean
  clear_in_5_seconds: boolean
  explanation: string
  suggested_rewrite: string | null
}

export interface ContentAnalysis {
  reel_number: number
  view_count: number
  idea_quality: 'strong' | 'weak' | 'misaligned'
  idea_explanation: string
  idea_repositioning: string | null
  hook_first_words: string
  hook_creates_curiosity: boolean
  hook_issue: string | null
  hook_rewrites: string[]
}

export interface AssessmentResult {
  market_context: MarketContext
  bio_evaluation: BioEvaluation
  content_analysis: ContentAnalysis[]
  primary_bottleneck: 'HOOKS' | 'NICHE' | 'IDEAS' | 'BIO'
  bottleneck_explanation: string
  action_steps: string[]
}

export interface AssessmentResponse {
  resultId: string
  analysis: AssessmentResult
  profile: InstagramProfile
  reels: InstagramReel[]
}

// Loading progress state type
export type LoadingStep = 'scraping_profile' | 'scraping_reels' | 'transcribing' | 'analyzing'

export default function Assessment() {
  const [step, setStep] = useState<AssessmentStep>('email')
  const [data, setData] = useState<AssessmentData>({
    email: '',
    handle: '',
    problemTheySolve: '',
    postingFrequency: '',
    avgReelLength: '',
    avgViews: '',
    outliersLast90Days: '',
    selfDiagnosis: '',
  })
  const [response, setResponse] = useState<AssessmentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // SSE streaming progress state
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('scraping_profile')
  const [reelNumber, setReelNumber] = useState(0)
  const [reelsTotal, setReelsTotal] = useState(0)
  const [loadingProfile, setLoadingProfile] = useState<InstagramProfile | null>(null)

  const handleSubmit = async () => {
    setStep('loading')
    setError(null)
    setLoadingStep('scraping_profile')
    setReelNumber(0)
    setReelsTotal(0)
    setLoadingProfile(null)

    try {
      // API endpoint - uses local dev server or production Cloudflare Worker
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
      const fetchResponse = await fetch(`${apiUrl}/assess-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!fetchResponse.ok) {
        throw new Error('Failed to start assessment')
      }

      const reader = fetchResponse.body?.getReader()
      if (!reader) {
        throw new Error('Stream not available')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Parse SSE events from buffer
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6))

              if (event.type === 'progress') {
                setLoadingStep(event.step)
                if (event.reelNumber) setReelNumber(event.reelNumber)
                if (event.reelsTotal) setReelsTotal(event.reelsTotal)
              } else if (event.type === 'profile') {
                // Profile data received - show it in loading state
                setLoadingProfile(event.profile as InstagramProfile)
              } else if (event.type === 'complete') {
                setResponse(event.data as AssessmentResponse)
                setStep('results')
                return
              } else if (event.type === 'error') {
                throw new Error(event.message || 'Assessment failed')
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              if (parseError instanceof SyntaxError) continue
              throw parseError
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('selfDiagnosis') // Go back to last step
    }
  }

  if (step === 'loading') {
    return (
      <LoadingState
        loadingStep={loadingStep}
        reelNumber={reelNumber}
        reelsTotal={reelsTotal}
        profile={loadingProfile}
      />
    )
  }

  if (step === 'results' && response) {
    return (
      <Results
        result={response.analysis}
        profile={response.profile}
        reels={response.reels}
      />
    )
  }

  return (
    <AssessmentStepper
      step={step}
      setStep={setStep}
      data={data}
      setData={setData}
      onSubmit={handleSubmit}
      error={error}
    />
  )
}
