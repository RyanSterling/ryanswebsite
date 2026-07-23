import { AudienceData, isLesson2Complete, SCOPE_OPTIONS } from './types'
import DesireLadder from './DesireLadder'
import Tooltip from './Tooltip'

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
      {/* Audience */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-soehne text-xl text-white">Your Audience</h3>
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
            <Tooltip text="Who specifically are you making content for? What's their situation?">
              Describe your target person
            </Tooltip>
          </label>
          <textarea
            value={data.audience_description}
            onChange={(e) => updateField('audience_description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>
      </div>

      {/* Desire Ladders */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-4">
          <Tooltip text="List desires, then keep asking 'so they can what?' to find the deeper motivation.">
            Desire Ladders
          </Tooltip>
        </h3>

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

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 text-sm">
                <Tooltip text="How badly does this bug them right now?">Urgency</Tooltip>
              </label>
              <span className="text-brand-orange text-sm">{data.urgency_read}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.urgency_read}
              onChange={(e) => updateField('urgency_read', parseInt(e.target.value))}
              className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 text-sm">
                <Tooltip text="Is this solved once, or does it keep coming back?">Staying Power</Tooltip>
              </label>
              <span className="text-brand-orange text-sm">{data.staying_power_read}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.staying_power_read}
              onChange={(e) => updateField('staying_power_read', parseInt(e.target.value))}
              className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              <Tooltip text="How many people share this desire?">Scope</Tooltip>
            </label>
            <div className="space-y-2">
              {SCOPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    data.scope_estimate === option.value
                      ? 'bg-brand-orange/20 border border-brand-orange'
                      : 'bg-brand-dark border border-transparent hover:border-gray-700'
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
