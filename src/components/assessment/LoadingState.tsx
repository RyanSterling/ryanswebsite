import type { LoadingStep, InstagramProfile } from '../../pages/Assessment'

interface LoadingStateProps {
  loadingStep: LoadingStep
  reelNumber: number
  reelsTotal: number
  profile: InstagramProfile | null
}

// Proxy images through API to bypass Instagram CORS
function proxyImageUrl(url: string): string {
  if (!url) return ''
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
  return `${apiUrl}/proxy-image?url=${encodeURIComponent(url)}`
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

// Map SSE steps to step index
function getStepIndex(loadingStep: LoadingStep): number {
  switch (loadingStep) {
    case 'scraping_profile':
      return 0
    case 'scraping_reels':
      return 1
    case 'transcribing':
      return 2
    case 'analyzing':
      return 3
    default:
      return 0
  }
}

// Get display text for each step
function getStepText(
  index: number,
  loadingStep: LoadingStep,
  reelNumber: number,
  reelsTotal: number,
  hasProfile: boolean
): string {
  switch (index) {
    case 0:
      if (hasProfile) {
        return 'Profile found'
      }
      return 'Pulling your profile...'
    case 1:
      return 'Getting your reels...'
    case 2:
      if (loadingStep === 'transcribing' && reelsTotal > 0) {
        return `Transcribing reel ${reelNumber} of ${reelsTotal}...`
      }
      return 'Transcribing your hooks...'
    case 3:
      return 'Analyzing your content...'
    default:
      return ''
  }
}

export default function LoadingState({
  loadingStep,
  reelNumber,
  reelsTotal,
  profile,
}: LoadingStateProps) {
  const currentStepIndex = getStepIndex(loadingStep)
  const hasProfile = profile !== null

  const steps = [
    getStepText(0, loadingStep, reelNumber, reelsTotal, hasProfile),
    getStepText(1, loadingStep, reelNumber, reelsTotal, hasProfile),
    getStepText(2, loadingStep, reelNumber, reelsTotal, hasProfile),
    getStepText(3, loadingStep, reelNumber, reelsTotal, hasProfile),
  ]

  return (
    <main className="min-h-screen flex items-center justify-center px-4 md:px-8 py-12">
      <div className="w-full max-w-md">
        {/* Profile Card - shown when profile is available */}
        {profile && (
          <div className="bg-brand-card rounded-2xl p-5 mb-8 flex items-start gap-4">
            {profile.profilePicUrl ? (
              <img
                src={proxyImageUrl(profile.profilePicUrl)}
                alt={profile.username}
                className="w-16 h-16 rounded-full object-cover border-2 border-brand-orange flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-gray-400">@</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold truncate">@{profile.username}</span>
                {profile.isVerified && (
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
              </div>
              <div className="flex gap-3 text-sm text-gray-400 mb-2">
                <span><span className="text-white font-medium">{formatNumber(profile.followersCount)}</span> followers</span>
                <span><span className="text-white font-medium">{profile.postsCount}</span> posts</span>
              </div>
              {profile.biography && (
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {profile.biography}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading indicator and steps */}
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-brand-orange border-t-transparent animate-spin" />
            <h1 className="font-soehne text-2xl md:text-3xl text-white mb-2">
              Running your Growth Audit...
            </h1>
            <p className="text-gray-400">This takes about 60 seconds</p>
          </div>

          <div className="space-y-4 text-left">
            {steps.map((stepText, index) => {
              // Step 0 is complete when we have profile, others complete when currentStepIndex > index
              const isComplete = index === 0 ? hasProfile : index < currentStepIndex
              const isCurrent = index === currentStepIndex
              const isActive = isComplete || isCurrent

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isComplete
                        ? 'bg-green-500'
                        : isCurrent
                        ? 'bg-brand-orange'
                        : 'bg-brand-card'
                    }`}
                  >
                    {isComplete ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isCurrent ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-600 rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {stepText}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
