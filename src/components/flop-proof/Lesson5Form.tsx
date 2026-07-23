import { SaturationRead, isLesson5Complete, SOPHISTICATION_PRESCRIPTIONS } from './types'

interface Props {
  data: SaturationRead
  onChange: (data: SaturationRead) => void
}

const SOPHISTICATION_OPTIONS: Array<{
  value: 1 | 2 | 3 | 4 | 5
  label: string
  description: string
}> = [
  {
    value: 1,
    label: 'Stage 1: Fresh territory',
    description: "Nobody's said this yet",
  },
  {
    value: 2,
    label: 'Stage 2: Early game',
    description: 'A few have, I can go bigger',
  },
  {
    value: 3,
    label: 'Stage 3: Crowded',
    description: "Everyone's said it, need a new angle",
  },
  {
    value: 4,
    label: 'Stage 4: Very crowded',
    description: 'Even the new angles are copied',
  },
  {
    value: 5,
    label: 'Stage 5: Total burnout',
    description: "They've heard it all",
  },
]

export default function Lesson5Form({ data, onChange }: Props) {
  const updateField = <K extends keyof SaturationRead>(field: K, value: SaturationRead[K]) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson5Complete(data)

  return (
    <div className="space-y-6">
      {/* Saturation Fields */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-soehne text-xl text-white">Saturation Read</h3>
          {isComplete && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Complete
            </span>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-6">
          This is your chance to vent. What's been done to death in your niche? The generator will avoid these traps.
        </p>

        <div className="space-y-6">
          {/* Saturated Topics */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              What topics in your niche have been posted to death?
            </label>
            <textarea
              value={data.saturated_topics}
              onChange={(e) => updateField('saturated_topics', e.target.value)}
              placeholder='e.g., "How to save money on coffee", "Pay yourself first", "The latte factor", "Track every expense"'
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              The obvious takes everyone makes — list 3-5
            </p>
          </div>

          {/* Saturated Formats */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              What content formats or hooks are overdone?
            </label>
            <textarea
              value={data.saturated_formats}
              onChange={(e) => updateField('saturated_formats', e.target.value)}
              placeholder='e.g., "Day in my life as a...", "Unpopular opinion:", "Things I wish I knew at 20"'
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              Formats that make people scroll past — list 2-3
            </p>
          </div>

          {/* Competitor Angles */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              What angles do your competitors keep using?
            </label>
            <textarea
              value={data.competitor_angles}
              onChange={(e) => updateField('competitor_angles', e.target.value)}
              placeholder="e.g., Just stop buying avocado toast, The rich do this the poor do that"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              The messages your audience has heard 100 times
            </p>
          </div>
        </div>
      </div>

      {/* Sophistication Stage */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-2">Market Sophistication</h3>
        <p className="text-gray-400 text-sm mb-6">
          How burned out is your audience on this topic?
        </p>

        <div className="bg-brand-dark/30 rounded-xl p-4 mb-6 border border-gray-800">
          <p className="text-gray-300 text-sm">
            <span className="text-brand-orange font-medium">Teaching point:</span> This is why "proven" topics still flop for you — you arrived at stage 3 with stage 1 execution. The generator won't make that mistake.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {SOPHISTICATION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                data.sophistication_stage === option.value
                  ? 'bg-brand-orange/20 border-2 border-brand-orange'
                  : 'bg-brand-dark border-2 border-transparent hover:border-gray-700'
              }`}
            >
              <input
                type="radio"
                name="sophistication_stage"
                value={option.value}
                checked={data.sophistication_stage === option.value}
                onChange={() => updateField('sophistication_stage', option.value)}
                className="sr-only"
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  data.sophistication_stage === option.value
                    ? 'bg-brand-orange text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                <span className="text-sm font-bold">{option.value}</span>
              </div>
              <div className="flex-1">
                <span className="text-white text-sm font-medium">{option.label}</span>
                <p className="text-gray-500 text-xs mt-0.5">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Prescription Display */}
        <div className="bg-gradient-to-r from-brand-orange/10 to-yellow-500/10 rounded-xl p-5 border border-brand-orange/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-brand-orange font-medium text-sm mb-1">Your Prescription</h4>
              <p className="text-white">
                {SOPHISTICATION_PRESCRIPTIONS[data.sophistication_stage]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
