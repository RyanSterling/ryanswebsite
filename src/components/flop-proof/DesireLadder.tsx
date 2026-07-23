import { DesireLadder as DesireLadderType, isDesireLadderComplete } from './types'

interface Props {
  label: string
  data: DesireLadderType
  onChange: (data: DesireLadderType) => void
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
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
            <span className="text-brand-orange text-xs">1</span>
          </div>
          <input
            type="text"
            value={data.desire_text}
            onChange={(e) => updateField('desire_text', e.target.value)}
            placeholder="They want to..."
            className="flex-1 px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        <div className={`flex items-center gap-3 transition-all duration-200 ${showRung1 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
            <span className="text-brand-orange text-xs">2</span>
          </div>
          <input
            type="text"
            value={data.so_i_can_1}
            onChange={(e) => updateField('so_i_can_1', e.target.value)}
            placeholder="...so they can..."
            className="flex-1 px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        <div className={`flex items-center gap-3 transition-all duration-200 ${showRung2 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
            <span className="text-brand-orange text-xs">3</span>
          </div>
          <input
            type="text"
            value={data.so_i_can_2}
            onChange={(e) => updateField('so_i_can_2', e.target.value)}
            placeholder="...so they can..."
            className="flex-1 px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        <div className={`flex items-center gap-3 transition-all duration-200 ${showRung3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 text-xs">4</span>
          </div>
          <input
            type="text"
            value={data.so_i_can_3}
            onChange={(e) => updateField('so_i_can_3', e.target.value)}
            placeholder="...so they can..."
            className="flex-1 px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 border border-green-500/30"
          />
        </div>
      </div>
    </div>
  )
}
