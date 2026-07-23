import { TellLayers, isLesson3Complete } from './types'
import Tooltip from './Tooltip'

interface Props {
  data: TellLayers
  onChange: (data: TellLayers) => void
}

export default function Lesson3Form({ data, onChange }: Props) {
  const updateField = (field: keyof TellLayers, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson3Complete(data)

  return (
    <div className="bg-brand-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-soehne text-xl text-white">Tell Layers</h3>
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
        {/* Will Tell */}
        <div className="bg-blue-500/5 rounded-xl p-5 border border-blue-500/20">
          <h4 className="text-blue-400 text-sm font-medium mb-4">
            <Tooltip text="What they openly say about their situation.">Will Tell</Tooltip>
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              value={data.will_tell_1}
              onChange={(e) => updateField('will_tell_1', e.target.value)}
              placeholder="Something they say out loud..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={data.will_tell_2}
              onChange={(e) => updateField('will_tell_2', e.target.value)}
              placeholder="Another thing..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={data.will_tell_3}
              onChange={(e) => updateField('will_tell_3', e.target.value)}
              placeholder="One more..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Won't Tell */}
        <div className="bg-purple-500/5 rounded-xl p-5 border border-purple-500/20">
          <h4 className="text-purple-400 text-sm font-medium mb-4">
            <Tooltip text="The embarrassing truth they'd never admit publicly.">Won't Tell</Tooltip>
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              value={data.wont_tell_1}
              onChange={(e) => updateField('wont_tell_1', e.target.value)}
              placeholder="Something they'd never admit..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={data.wont_tell_2}
              onChange={(e) => updateField('wont_tell_2', e.target.value)}
              placeholder="Another secret thought..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={data.wont_tell_3}
              onChange={(e) => updateField('wont_tell_3', e.target.value)}
              placeholder="One more..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Can't Tell */}
        <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
          <h4 className="text-emerald-400 text-sm font-medium mb-4">
            <Tooltip text="The insight they're missing — what they don't know yet.">Can't Tell</Tooltip>
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              value={data.cant_tell_1}
              onChange={(e) => updateField('cant_tell_1', e.target.value)}
              placeholder="Something they don't know yet..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              value={data.cant_tell_2}
              onChange={(e) => updateField('cant_tell_2', e.target.value)}
              placeholder="Another blind spot..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              value={data.cant_tell_3}
              onChange={(e) => updateField('cant_tell_3', e.target.value)}
              placeholder="One more..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
