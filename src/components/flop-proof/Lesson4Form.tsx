import { AwarenessQuestions, isLesson4Complete } from './types'
import Tooltip from './Tooltip'

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
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-soehne text-xl text-white">
          <Tooltip text="What questions do people ask at each awareness level? Think: what would they Google?">
            Awareness Questions
          </Tooltip>
        </h3>
        {isComplete && (
          <span className="text-green-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded">Unaware</span>
            <span className="text-gray-500 text-xs">Widest reach</span>
          </div>
          <textarea
            value={data.unaware_questions}
            onChange={(e) => updateField('unaware_questions', e.target.value)}
            placeholder="What do they search before they know they have a problem?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded">Problem Aware</span>
          </div>
          <textarea
            value={data.problem_aware_questions}
            onChange={(e) => updateField('problem_aware_questions', e.target.value)}
            placeholder="What do they search when they feel the problem?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
          />
        </div>

        <div className="bg-orange-500/5 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded">Solution Aware</span>
          </div>
          <textarea
            value={data.solution_aware_questions}
            onChange={(e) => updateField('solution_aware_questions', e.target.value)}
            placeholder="What do they search when they know solutions exist?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded">Product Aware</span>
            <span className="text-gray-500 text-xs">Narrowest reach</span>
          </div>
          <textarea
            value={data.product_aware_questions}
            onChange={(e) => updateField('product_aware_questions', e.target.value)}
            placeholder="What do they search when they know about you?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>
      </div>
    </div>
  )
}
