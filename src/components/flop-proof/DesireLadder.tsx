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

  // Determine which rungs to show based on what's filled
  const showRung1 = data.desire_text.trim().length > 0
  const showRung2 = showRung1 && data.so_i_can_1.trim().length > 0
  const showRung3 = showRung2 && data.so_i_can_2.trim().length > 0

  return (
    <div className="bg-brand-dark/50 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        {isComplete && (
          <span className="text-green-400 text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Base desire */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-brand-orange text-xs font-bold">1</span>
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 text-xs mb-1">They want to...</label>
            <input
              type="text"
              value={data.desire_text}
              onChange={(e) => updateField('desire_text', e.target.value)}
              placeholder="e.g., lose 10 pounds"
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>

        {/* Rung 1 - animated */}
        <div
          className={`flex items-start gap-3 transition-all duration-300 ${
            showRung1 ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div className="w-8 flex flex-col items-center flex-shrink-0">
            <div className="w-px h-3 bg-gray-700" />
            <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <span className="text-brand-orange text-xs font-bold">2</span>
            </div>
          </div>
          <div className="flex-1 pt-3">
            <label className="block text-gray-400 text-xs mb-1">...so they can...</label>
            <input
              type="text"
              value={data.so_i_can_1}
              onChange={(e) => updateField('so_i_can_1', e.target.value)}
              placeholder="e.g., fit into their old clothes"
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>

        {/* Rung 2 - animated */}
        <div
          className={`flex items-start gap-3 transition-all duration-300 ${
            showRung2 ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div className="w-8 flex flex-col items-center flex-shrink-0">
            <div className="w-px h-3 bg-gray-700" />
            <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <span className="text-brand-orange text-xs font-bold">3</span>
            </div>
          </div>
          <div className="flex-1 pt-3">
            <label className="block text-gray-400 text-xs mb-1">...so they can...</label>
            <input
              type="text"
              value={data.so_i_can_2}
              onChange={(e) => updateField('so_i_can_2', e.target.value)}
              placeholder="e.g., feel confident at the beach"
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>

        {/* Rung 3 - animated (the big room) */}
        <div
          className={`flex items-start gap-3 transition-all duration-300 ${
            showRung3 ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div className="w-8 flex flex-col items-center flex-shrink-0">
            <div className="w-px h-3 bg-gray-700" />
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 pt-3">
            <label className="block text-green-400 text-xs mb-1 font-medium">...so they can... (the big room)</label>
            <input
              type="text"
              value={data.so_i_can_3}
              onChange={(e) => updateField('so_i_can_3', e.target.value)}
              placeholder="e.g., feel worthy of love and attention"
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 border border-green-500/30"
            />
            <p className="text-green-400/70 text-xs mt-1">
              This is the stadium — the desire everyone shares.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
