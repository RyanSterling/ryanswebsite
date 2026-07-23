import { AudienceData, isLesson2Complete, SCOPE_OPTIONS } from './types'
import DesireLadder from './DesireLadder'

interface Props {
  data: AudienceData
  onChange: (data: AudienceData) => void
}

export default function Lesson2Form({ data, onChange }: Props) {
  const updateField = <K extends keyof AudienceData>(field: K, value: AudienceData[K]) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson2Complete(data)

  return (
    <div className="space-y-6">
      {/* Audience Description */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-soehne text-xl text-white">Who You Serve</h3>
          {isComplete && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Complete
            </span>
          )}
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Describe the specific person you make content for. Who are they? Where are they stuck?
          </label>
          <textarea
            value={data.audience_description}
            onChange={(e) => updateField('audience_description', e.target.value)}
            placeholder="e.g., Millennials in their late 20s/early 30s who have a decent income but still live paycheck to paycheck. They know they should save but feel like they're always behind."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>
      </div>

      {/* Desire Ladders */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-2">Desire Inventory</h3>
        <p className="text-gray-400 text-sm mb-6">
          List three desires your audience has. For each one, keep asking "so they can what?" until you reach the emotional core. The top of the ladder is always the bigger room.
        </p>

        <div className="bg-brand-dark/30 rounded-xl p-4 mb-6 border border-gray-800">
          <p className="text-gray-300 text-sm">
            <span className="text-brand-orange font-medium">Teaching point:</span> The further up the ladder you go, the more people share the desire. "I want to lose 10 lbs" is a small room. "I want to feel confident" is a stadium.
          </p>
        </div>

        <div className="space-y-4">
          <DesireLadder
            label="Desire 1"
            data={data.desire_1}
            onChange={(value) => updateField('desire_1', value)}
          />
          <DesireLadder
            label="Desire 2"
            data={data.desire_2}
            onChange={(value) => updateField('desire_2', value)}
          />
          <DesireLadder
            label="Desire 3"
            data={data.desire_3}
            onChange={(value) => updateField('desire_3', value)}
          />
        </div>
      </div>

      {/* Dimensions */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-6">Desire Dimensions</h3>

        <div className="space-y-8">
          {/* Urgency Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-gray-300 text-sm">
                How urgent is this for them right now?
              </label>
              <span className="text-brand-orange font-medium">{data.urgency_read}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.urgency_read}
              onChange={(e) => updateField('urgency_read', parseInt(e.target.value))}
              className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Mild annoyance</span>
              <span>Keeps them up at night</span>
            </div>
          </div>

          {/* Staying Power Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-gray-300 text-sm">
                Does this desire repeat, or is it solved once?
              </label>
              <span className="text-brand-orange font-medium">{data.staying_power_read}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.staying_power_read}
              onChange={(e) => updateField('staying_power_read', parseInt(e.target.value))}
              className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>One-time fix</span>
              <span>Recurring forever</span>
            </div>
          </div>

          {/* Scope Select */}
          <div>
            <label className="block text-gray-300 text-sm mb-3">
              How many people share this desire?
            </label>
            <div className="space-y-2">
              {SCOPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                    data.scope_estimate === option.value
                      ? 'bg-brand-orange/20 border-2 border-brand-orange'
                      : 'bg-brand-dark border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="scope_estimate"
                    value={option.value}
                    checked={data.scope_estimate === option.value}
                    onChange={(e) => updateField('scope_estimate', e.target.value as AudienceData['scope_estimate'])}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      data.scope_estimate === option.value
                        ? 'border-brand-orange bg-brand-orange'
                        : 'border-gray-600'
                    }`}
                  >
                    {data.scope_estimate === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-white text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
