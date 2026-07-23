import { AwarenessQuestions, isLesson4Complete } from './types'

interface Props {
  data: AwarenessQuestions
  onChange: (data: AwarenessQuestions) => void
}

export default function Lesson4Form({ data, onChange }: Props) {
  const updateField = (field: keyof AwarenessQuestions, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson4Complete(data)

  return (
    <div className="bg-brand-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-soehne text-xl text-white">Awareness Questions</h3>
        {isComplete && (
          <span className="text-green-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4">
        What questions do people ask at different awareness levels? Think: <span className="text-white">what would they type into Google?</span>
      </p>

      <div className="bg-brand-dark/30 rounded-xl p-4 mb-8 border border-gray-800">
        <p className="text-gray-300 text-sm">
          <span className="text-brand-orange font-medium">Teaching point:</span> Most creators only make content for the bottom two levels — insider content, updates about themselves. That's why it doesn't reach. <span className="text-white">Stranger reach lives at the top.</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Awareness Level Visual */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>WIDEST REACH</span>
            </div>
            <div className="w-px h-4 bg-gradient-to-b from-green-500 to-transparent" />
          </div>
        </div>

        {/* Unaware - Widest */}
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-500/50 rounded-full" />
          <div className="bg-green-500/5 rounded-xl p-5 border border-green-500/20 ml-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                UNAWARE
              </span>
              <span className="text-gray-500 text-xs">Widest reach zone</span>
            </div>
            <label className="block text-gray-300 text-sm mb-2">
              What do people search when they don't even know they have this problem?
            </label>
            <textarea
              value={data.unaware_questions}
              onChange={(e) => updateField('unaware_questions', e.target.value)}
              placeholder='e.g., "why am I always tired", "adulting is hard", "how to feel less stressed"'
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              These become identification content — "you are this person"
            </p>
          </div>
        </div>

        {/* Problem Aware */}
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500/50 to-yellow-500/50 rounded-full" />
          <div className="bg-yellow-500/5 rounded-xl p-5 border border-yellow-500/20 ml-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
                PROBLEM AWARE
              </span>
              <span className="text-gray-500 text-xs">High reach zone</span>
            </div>
            <label className="block text-gray-300 text-sm mb-2">
              What do they search when they feel the problem but don't know solutions exist?
            </label>
            <textarea
              value={data.problem_aware_questions}
              onChange={(e) => updateField('problem_aware_questions', e.target.value)}
              placeholder="e.g., how to stop living paycheck to paycheck, why can't I save money"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              Name and dramatize the problem — biggest stranger reach
            </p>
          </div>
        </div>

        {/* Solution Aware */}
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500/50 to-orange-500/50 rounded-full" />
          <div className="bg-orange-500/5 rounded-xl p-5 border border-orange-500/20 ml-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-500/20 text-orange-400 text-xs font-medium px-2 py-1 rounded-full">
                SOLUTION AWARE
              </span>
              <span className="text-gray-500 text-xs">Moderate reach</span>
            </div>
            <label className="block text-gray-300 text-sm mb-2">
              What do they search when they know solutions exist but haven't found yours?
            </label>
            <textarea
              value={data.solution_aware_questions}
              onChange={(e) => updateField('solution_aware_questions', e.target.value)}
              placeholder='e.g., "best budgeting app", "50/30/20 rule explained", "how to budget on low income"'
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              Proof and mechanism content
            </p>
          </div>
        </div>

        {/* Product Aware */}
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/50 to-red-500/30 rounded-full" />
          <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/20 ml-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red-500/20 text-red-400 text-xs font-medium px-2 py-1 rounded-full">
                PRODUCT AWARE
              </span>
              <span className="text-gray-500 text-xs">Follower-only reach</span>
            </div>
            <label className="block text-gray-300 text-sm mb-2">
              What do people ask when they know about YOU but haven't bought/followed yet?
            </label>
            <textarea
              value={data.product_aware_questions}
              onChange={(e) => updateField('product_aware_questions', e.target.value)}
              placeholder='e.g., "is [your program] worth it", "reviews of [your thing]", "does [your method] actually work"'
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              Lands with existing followers, not strangers
            </p>
          </div>
        </div>

        {/* Visual indicator at bottom */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-gradient-to-b from-transparent to-red-500/30" />
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>FOLLOWERS ONLY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
