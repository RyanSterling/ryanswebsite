import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AssessmentResult, InstagramProfile, InstagramReel } from '../../pages/Assessment'
import AuditPromoCard from '../AuditPromoCard'

interface Props {
  result: AssessmentResult
  profile: InstagramProfile
  reels: InstagramReel[]
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

// Proxy images through API to bypass Instagram CORS
function proxyImageUrl(url: string): string {
  if (!url) return ''
  const apiUrl = 'https://ryan-website-api.rsterling20.workers.dev'
  return `${apiUrl}/proxy-image?url=${encodeURIComponent(url)}`
}

// Video player with fallback to thumbnail when CDN URLs expire
function ReelVideo({ reel, reelNumber }: { reel: InstagramReel | undefined, reelNumber: number }) {
  const [videoFailed, setVideoFailed] = useState(false)

  // Fallback: thumbnail with Instagram link
  if (videoFailed || !reel?.videoUrl) {
    if (!reel?.thumbnailUrl) {
      return (
        <div className="w-full aspect-[9/16] bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-xs">No preview</span>
        </div>
      )
    }

    return (
      <a
        href={`https://instagram.com/reel/${reel.shortCode}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block"
      >
        <img
          src={proxyImageUrl(reel.thumbnailUrl)}
          alt={`Reel ${reelNumber}`}
          className="w-full aspect-[9/16] object-cover rounded-lg hover:opacity-80 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <span className="absolute bottom-2 left-2 right-2 text-white text-xs bg-black/60 rounded px-2 py-1 text-center">
          Watch on Instagram
        </span>
      </a>
    )
  }

  return (
    <video
      src={reel.videoUrl}
      controls
      playsInline
      preload="metadata"
      onError={() => setVideoFailed(true)}
      className="w-full aspect-[9/16] object-cover rounded-lg bg-black"
      poster={reel.thumbnailUrl ? proxyImageUrl(reel.thumbnailUrl) : undefined}
    />
  )
}

export default function Results({ result, profile, reels }: Props) {
  return (
    <main className="min-h-screen px-4 md:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Profile Header */}
        <div className="bg-brand-card rounded-2xl p-6 flex items-start gap-5">
          {profile.profilePicUrl ? (
            <img
              src={proxyImageUrl(profile.profilePicUrl)}
              alt={profile.username}
              className="w-20 h-20 rounded-full object-cover border-2 border-brand-orange flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-gray-400">@</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-semibold text-lg truncate">@{profile.username}</span>
              {profile.isVerified && (
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </div>
            {profile.fullName && (
              <p className="text-gray-400 text-sm mb-1 truncate">{profile.fullName}</p>
            )}
            <div className="flex gap-4 text-sm mb-3">
              <span className="text-white">
                <span className="font-semibold">{formatNumber(profile.followersCount)}</span>
                <span className="text-gray-400 ml-1">followers</span>
              </span>
              <span className="text-white">
                <span className="font-semibold">{profile.postsCount}</span>
                <span className="text-gray-400 ml-1">posts</span>
              </span>
            </div>
            {profile.biography && (
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {profile.biography}
              </p>
            )}
          </div>
        </div>

        {/* Primary Bottleneck */}
        <div className="bg-brand-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-xl">Primary Bottleneck</h2>
            <span className="bg-brand-orange/20 text-brand-orange text-sm font-medium px-3 py-1 rounded-full">
              {result.primary_bottleneck}
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {result.bottleneck_explanation}
          </p>
        </div>

        {/* Bio Evaluation */}
        <div className="bg-brand-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-xl">Bio Evaluation</h2>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              result.bio_evaluation.verdict === 'Clear'
                ? 'bg-green-500/20 text-green-400'
                : result.bio_evaluation.verdict === 'Needs Work'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {result.bio_evaluation.verdict}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              {result.bio_evaluation.states_problem_clearly ? (
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-gray-300">States problem clearly</span>
            </div>
            <div className="flex items-center gap-2">
              {result.bio_evaluation.speaks_to_desires ? (
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-gray-300">Speaks to real desires</span>
            </div>
            <div className="flex items-center gap-2">
              {result.bio_evaluation.clear_in_5_seconds ? (
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-gray-300">Clear in 5 seconds</span>
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed">
            {result.bio_evaluation.explanation}
          </p>

          {result.bio_evaluation.suggested_rewrite && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Suggested rewrite</p>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {result.bio_evaluation.suggested_rewrite}
              </p>
            </div>
          )}
        </div>

        {/* Market Context */}
        <div className="bg-brand-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-xl">Your Market</h2>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              result.bio_evaluation.speaks_to_desires
                ? 'bg-green-500/20 text-green-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {result.bio_evaluation.speaks_to_desires ? 'Aligned' : 'Misaligned'}
            </span>
          </div>

          <p className="text-gray-300 mb-4">{result.market_context.niche}</p>

          <p className="text-gray-400 text-sm mb-3">What your audience wants:</p>
          <div className="space-y-2">
            {result.market_context.market_desires.map((desire, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">{desire}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reel Analysis - Each reel as its own section */}
        {result.content_analysis?.map((analysis, index) => {
          const reel = reels[index]

          return (
            <div key={analysis.reel_number} className="bg-brand-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-xl">Reel {analysis.reel_number}</h2>
                <span className="text-gray-400 text-sm">{formatNumber(reel?.viewCount || 0)} views</span>
              </div>

              {/* Video + Content Layout */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Video Player - 30% larger (260px vs 200px) */}
                <div className="w-full md:w-[260px] flex-shrink-0">
                  <ReelVideo reel={reel} reelNumber={analysis.reel_number} />
                </div>

                {/* Content beside video */}
                <div className="flex-1 min-w-0">
                  {/* HOOK SECTION */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      {analysis.hook_creates_curiosity ? (
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className="text-gray-300">Hook: {analysis.hook_creates_curiosity ? 'creates curiosity' : 'weak'}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Your hook</p>
                    <p className="text-gray-300 leading-relaxed italic">"{analysis.hook_first_words}"</p>
                  </div>

                  {analysis.hook_issue && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Issue</p>
                      <p className="text-gray-300 leading-relaxed">{analysis.hook_issue}</p>
                    </div>
                  )}

                  {!analysis.hook_creates_curiosity && analysis.hook_rewrites && analysis.hook_rewrites.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-3">Try instead</p>
                      <div className="space-y-2">
                        {analysis.hook_rewrites.map((rewrite, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-300 leading-relaxed">"{rewrite}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700 my-6"></div>

              {/* IDEA SECTION - Full width below */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  {analysis.idea_quality === 'strong' ? (
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-gray-300">Idea: {analysis.idea_quality}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Idea analysis</p>
                <p className="text-gray-300 leading-relaxed">{analysis.idea_explanation}</p>
              </div>

              {analysis.idea_repositioning && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">How to reposition this idea</p>
                  <p className="text-gray-300 leading-relaxed">{analysis.idea_repositioning}</p>
                </div>
              )}
            </div>
          )
        })}

        {/* Action Steps */}
        <div className="bg-brand-card rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-4">Action Steps</h2>
          <div className="space-y-4">
            {result.action_steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-300 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Audit Upsell */}
        <AuditPromoCard />

        {/* CTA */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-orange rounded-2xl p-8 text-center">
          <h2 className="font-soehne text-2xl md:text-3xl text-white mb-4">
            Want help fixing this?
          </h2>
          <p className="text-white/80 mb-6">
            Join the 10K Challenge for daily feedback on your hooks, ideas, and growth strategy.
          </p>
          <Link
            to="/challenge"
            className="inline-block bg-white text-brand-dark font-semibold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            Join the 10K Challenge
          </Link>
        </div>

        {/* Back to home */}
        <div className="text-center">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
