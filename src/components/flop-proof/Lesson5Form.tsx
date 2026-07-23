import { SaturationRead, isLesson5Complete, SOPHISTICATION_PRESCRIPTIONS } from './types'
import Tooltip from './Tooltip'

interface Props {
  data: SaturationRead
  onChange: (data: SaturationRead) => void
}

const SOPHISTICATION_OPTIONS: Array<{ value: 1 | 2 | 3 | 4 | 5; label: string }> = [
  { value: 1, label: 'Fresh — nobody has said this' },
  { value: 2, label: 'Early — a few have, I can go bigger' },
  { value: 3, label: 'Crowded — need a new angle' },
  { value: 4, label: 'Very crowded — even new angles are copied' },
  { value: 5, label: 'Burned out — they have heard it all' },
]

export default function Lesson5Form({ data, onChange }: Props) {
  const updateField = <K extends keyof SaturationRead>(field: K, value: SaturationRead[K]) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson5Complete(data)

  return (
    <div className="space-y-6">
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-soehne text-xl text-white">Saturation</h3>
          {isComplete && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Complete
            </span>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              <Tooltip text="Topics everyone has already covered.">Dead topics</Tooltip>
            </label>
            <textarea
              value={data.saturated_topics}
              onChange={(e) => updateField('saturated_topics', e.target.value)}
              placeholder="List topics that have been done to death..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              <Tooltip text="Formats or hooks that people skip past.">Dead formats</Tooltip>
            </label>
            <textarea
              value={data.saturated_formats}
              onChange={(e) => updateField('saturated_formats', e.target.value)}
              placeholder="List overused formats or hooks..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              <Tooltip text="Messages your audience has heard 100 times.">Competitor angles</Tooltip>
            </label>
            <textarea
              value={data.competitor_angles}
              onChange={(e) => updateField('competitor_angles', e.target.value)}
              placeholder="List angles your competitors keep using..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-4">
          <Tooltip text="How burned out is your audience on this topic?">Market Stage</Tooltip>
        </h3>

        <div className="space-y-2 mb-4">
          {SOPHISTICATION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                data.sophistication_stage === option.value
                  ? 'bg-brand-orange/20 border border-brand-orange'
                  : 'bg-brand-dark border border-transparent hover:border-gray-700'
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
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                data.sophistication_stage === option.value ? 'bg-brand-orange text-white' : 'bg-gray-800 text-gray-400'
              }`}>
                <span className="text-xs">{option.value}</span>
              </div>
              <span className="text-white text-sm">{option.label}</span>
            </label>
          ))}
        </div>

        <div className="bg-brand-dark rounded-xl p-4">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Prescription</span>
          <p className="text-white mt-1">{SOPHISTICATION_PRESCRIPTIONS[data.sophistication_stage]}</p>
        </div>
      </div>
    </div>
  )
}
