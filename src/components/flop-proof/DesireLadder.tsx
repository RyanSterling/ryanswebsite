import { DesireLadder as DesireLadderType, isDesireLadderComplete } from './types'

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
  const updateField = (field: keyof DesireLadderType, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isDesireLadderComplete(data)
  const showRung1 = data.desire_text.trim().length > 0
  const showRung2 = showRung1 && data.so_i_can_1.trim().length > 0
  const showRung3 = showRung2 && data.so_i_can_2.trim().length > 0

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
    </div>
  )
}
