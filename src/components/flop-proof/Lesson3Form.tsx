import { TellLayers, isLesson3Complete } from './types'

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-soehne text-xl text-white">The Tell Layers</h3>
        {isComplete && (
          <span className="text-green-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        )}
      </div>

      <div className="bg-brand-dark/30 rounded-xl p-4 mb-8 border border-gray-800">
        <p className="text-gray-300 text-sm">
          <span className="text-brand-orange font-medium">Teaching point:</span> Will-tell makes them feel seen. Won't-tell makes them stop scrolling. Can't-tell makes them trust you.
        </p>
      </div>

      <div className="space-y-8">
        {/* Will Tell Layer */}
        <div className="bg-blue-500/5 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 className="text-blue-400 font-medium">Will Tell</h4>
              <p className="text-gray-500 text-xs">What they say out loud — the public version</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2">
                What's something they openly say about their situation?
              </label>
              <input
                type="text"
                value={data.will_tell_1}
                onChange={(e) => updateField('will_tell_1', e.target.value)}
                placeholder="e.g., 'I just need to get more disciplined with my budget'"
                className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2">
                Another thing they say out loud?
              </label>
              <input
                type="text"
                value={data.will_tell_2}
                onChange={(e) => updateField('will_tell_2', e.target.value)}
                placeholder="e.g., 'I know I should be saving more'"
                className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2">
                One more?
              </label>
              <input
                type="text"
                value={data.will_tell_3}
                onChange={(e) => updateField('will_tell_3', e.target.value)}
                placeholder="e.g., 'I'm working on getting my finances in order'"
                className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Won't Tell Layer - the secrets */}
        <div className="bg-purple-500/5 rounded-xl p-6 border border-purple-500/30 relative overflow-hidden">
          {/* Subtle pattern to make it feel different */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(168, 85, 247, 0.1) 10px, rgba(168, 85, 247, 0.1) 20px)'
            }} />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-purple-400 font-medium">Won't Tell</h4>
                <p className="text-gray-500 text-xs">The embarrassing truth they'd never admit publicly</p>
              </div>
            </div>

            <p className="text-purple-300/60 text-sm mb-4 italic">
              This is where the scroll-stopping hooks live. What are they too ashamed to say?
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-2">
                  What's something they think but would never admit publicly?
                </label>
                <input
                  type="text"
                  value={data.wont_tell_1}
                  onChange={(e) => updateField('wont_tell_1', e.target.value)}
                  placeholder="e.g., 'I'm scared I'll never be able to retire'"
                  className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2">
                  Another thing they'd never admit?
                </label>
                <input
                  type="text"
                  value={data.wont_tell_2}
                  onChange={(e) => updateField('wont_tell_2', e.target.value)}
                  placeholder="e.g., 'I lie to my partner about how much I spend'"
                  className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2">
                  One more secret thought?
                </label>
                <input
                  type="text"
                  value={data.wont_tell_3}
                  onChange={(e) => updateField('wont_tell_3', e.target.value)}
                  placeholder="e.g., 'I feel like a failure compared to my friends'"
                  className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Can't Tell Layer */}
        <div className="bg-emerald-500/5 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-emerald-400 font-medium">Can't Tell</h4>
              <p className="text-gray-500 text-xs">The insight they're missing — what they don't know yet</p>
            </div>
          </div>

          <p className="text-emerald-300/60 text-sm mb-4 italic">
            This is your teaching content. What blind spots do they have?
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2">
                What don't they know yet about their own situation?
              </label>
              <input
                type="text"
                value={data.cant_tell_1}
                onChange={(e) => updateField('cant_tell_1', e.target.value)}
                placeholder="e.g., 'Their spending problem is actually an emotional regulation problem'"
                className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2">
                Another thing they can't see?
              </label>
              <input
                type="text"
                value={data.cant_tell_2}
                onChange={(e) => updateField('cant_tell_2', e.target.value)}
                placeholder="e.g., 'Most budgeting advice fails because it ignores their nervous system'"
                className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2">
                One more blind spot?
              </label>
              <input
                type="text"
                value={data.cant_tell_3}
                onChange={(e) => updateField('cant_tell_3', e.target.value)}
                placeholder="e.g., 'The real payoff of saving isn't retirement — it's present-day peace of mind'"
                className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
