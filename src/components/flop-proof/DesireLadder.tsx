import { DesireLadder as DesireLadderType, isDesireLadderComplete, WHO_CARES_OPTIONS } from './types'

interface Props {
  label: string
  data: DesireLadderType
  onChange: (data: DesireLadderType) => void
}

function IndentArrow({ className = '' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 ${className}`}>
      <path d="M3.75 4.75V12.25C3.75 13.9069 5.09315 15.25 6.75 15.25H19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.25 11.25L20.25 15.25L16.25 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function DesireLadder({ label, data, onChange }: Props) {
  const updateField = <K extends keyof DesireLadderType>(field: K, value: DesireLadderType[K]) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isDesireLadderComplete(data)
  const showRung1 = data.desire_text.trim().length > 0
  const showRung2 = showRung1 && data.so_i_can_1.trim().length > 0
  const showRung3 = showRung2 && data.so_i_can_2.trim().length > 0
  const showDimensions = showRung3 && data.so_i_can_3.trim().length > 0

  return (
    <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        {isComplete && (
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      <div className="space-y-2">
        {/* Rung 1 - no indent */}
        <input
          type="text"
          value={data.desire_text}
          onChange={(e) => updateField('desire_text', e.target.value)}
          placeholder="They want to"
          className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />

        {/* Rung 2 - first indent */}
        <div className={`flex items-center gap-2 pl-4 transition-all duration-200 ${showRung1 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <IndentArrow className="text-gray-600" />
          <input
            type="text"
            value={data.so_i_can_1}
            onChange={(e) => updateField('so_i_can_1', e.target.value)}
            placeholder="So they can"
            className="flex-1 px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Rung 3 - second indent */}
        <div className={`flex items-center gap-2 pl-12 transition-all duration-200 ${showRung2 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <IndentArrow className="text-gray-600" />
          <input
            type="text"
            value={data.so_i_can_2}
            onChange={(e) => updateField('so_i_can_2', e.target.value)}
            placeholder="So they can"
            className="flex-1 px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Rung 4 - third indent (the emotional core) */}
        <div className={`flex items-center gap-2 pl-20 transition-all duration-200 ${showRung3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <IndentArrow className="text-green-500" />
          <input
            type="text"
            value={data.so_i_can_3}
            onChange={(e) => updateField('so_i_can_3', e.target.value)}
            placeholder="So they can"
            className="flex-1 px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 border border-green-500/30"
          />
        </div>
      </div>

      {/* Dimensions - appear after ladder is complete */}
      <div className={`mt-4 pt-4 border-t border-gray-700 space-y-4 transition-all duration-200 ${showDimensions ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
        {/* Urgency */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-400 text-xs">How urgent is this for them?</label>
            <span className="text-brand-orange text-xs">{data.urgency}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={data.urgency}
            onChange={(e) => updateField('urgency', parseInt(e.target.value))}
            className="w-full h-1.5 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange"
          />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>Mild annoyance</span>
            <span>Keeps them up at night</span>
          </div>
        </div>

        {/* Repeats */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-400 text-xs">Does this come up once or keep repeating?</label>
            <span className="text-brand-orange text-xs">{data.repeats}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={data.repeats}
            onChange={(e) => updateField('repeats', parseInt(e.target.value))}
            className="w-full h-1.5 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange"
          />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>One-time thing</span>
            <span>Comes up constantly</span>
          </div>
        </div>

        {/* Who cares */}
        <div>
          <label className="text-gray-400 text-xs block mb-2">Who feels this way?</label>
          <div className="flex flex-wrap gap-2">
            {WHO_CARES_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField('who_cares', option.value)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  data.who_cares === option.value
                    ? 'bg-brand-orange text-white'
                    : 'bg-brand-dark text-gray-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
