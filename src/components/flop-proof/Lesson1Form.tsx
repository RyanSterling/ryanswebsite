import { CreatorProfile, isLesson1Complete } from './types'

interface Props {
  data: CreatorProfile
  onChange: (data: CreatorProfile) => void
}

export default function Lesson1Form({ data, onChange }: Props) {
  const updateField = (field: keyof CreatorProfile, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson1Complete(data)

  return (
    <div className="bg-brand-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-soehne text-xl text-white">Your Creator Profile</h3>
        {isComplete && (
          <span className="text-green-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Niche */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            What's your niche or topic area?
          </label>
          <input
            type="text"
            value={data.niche}
            onChange={(e) => updateField('niche', e.target.value)}
            placeholder="e.g., Personal finance for millennials"
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* What You Do */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            In one sentence, what do you help people do?
          </label>
          <textarea
            value={data.what_you_do}
            onChange={(e) => updateField('what_you_do', e.target.value)}
            placeholder="e.g., I help people pay off debt and build their first $10K emergency fund"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        {/* What You Teach */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            What do you know that most people in your audience don't?
          </label>
          <textarea
            value={data.what_you_teach}
            onChange={(e) => updateField('what_you_teach', e.target.value)}
            placeholder="e.g., Most debt payoff advice ignores the psychological side — I teach the behavioral systems that actually stick"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
          <p className="text-gray-500 text-xs mt-2">
            This is your unique knowledge — the content differentiation.
          </p>
        </div>
      </div>
    </div>
  )
}
