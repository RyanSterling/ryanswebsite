import { TellLayers, BreakthroughFormData, isLesson3Complete } from './types'
import HelpDrawer from './HelpDrawer'

interface Props {
  data: TellLayers
  onChange: (data: TellLayers) => void
  formData?: BreakthroughFormData
}

export default function Lesson3Form({ data, onChange, formData }: Props) {
  const updateField = (field: keyof TellLayers, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson3Complete(data)

  return (
    <div className="bg-brand-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-soehne text-xl text-white">Getting In Their Head</h3>
        {isComplete && (
          <span className="text-green-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* What They Say */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What they openly say about their situation. The socially acceptable version they'd tell a friend or post publicly. This creates validation content — they feel seen — but it's the weakest hook because you're telling them what they already know."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"I just need to get seen by coaches"
"The competition is crazy these days"
"My highlight tape is solid"`,
                    note: "Safe to say out loud. Everyone in their situation says this."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"I don't have time to cook every night"
"My kids are picky eaters"
"Takeout is so expensive"`,
                    note: "Things they'd tell a friend without hesitation."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"Presets never look the same on my photos"
"I've watched so many tutorials"
"My edits look too edited"`,
                    note: "The surface-level frustration they're comfortable sharing."
                  }
                ]}
                fieldId="lesson3_will_tell"
                formData={formData}
              >
                What they say
              </HelpDrawer>
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={data.will_tell_1}
              onChange={(e) => updateField('will_tell_1', e.target.value)}
              placeholder="Something they say out loud..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              value={data.will_tell_2}
              onChange={(e) => updateField('will_tell_2', e.target.value)}
              placeholder="Another thing they'd tell a friend..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              value={data.will_tell_3}
              onChange={(e) => updateField('will_tell_3', e.target.value)}
              placeholder="One more..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>

        {/* What They Hide */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="The embarrassing truth they'd never admit publicly. The thing they think but would never say out loud. This is where your strongest hooks live — the 'how did you know?' moment that stops the scroll."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"I'm terrified the whole thing was a waste of time"
"I don't actually know if I'm good enough"
"I'm scared to hear I peaked in high school"`,
                    note: "The fears they won't admit even to themselves."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"I feel like a failure feeding them chicken nuggets again"
"I'm too tired to care by 6pm"
"My mom did this without complaining and I can't"`,
                    note: "The shame they carry quietly."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"I'm embarrassed to show my edited photos"
"I think I might just not have the eye for this"
"I feel like a fraud calling myself a photographer"`,
                    note: "The secret doubt they'd never post about."
                  }
                ]}
                fieldId="lesson3_wont_tell"
                formData={formData}
              >
                What they hide
              </HelpDrawer>
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={data.wont_tell_1}
              onChange={(e) => updateField('wont_tell_1', e.target.value)}
              placeholder="Something they'd never admit..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              value={data.wont_tell_2}
              onChange={(e) => updateField('wont_tell_2', e.target.value)}
              placeholder="Another secret thought..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              value={data.wont_tell_3}
              onChange={(e) => updateField('wont_tell_3', e.target.value)}
              placeholder="One more embarrassing truth..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>

        {/* What They Don't Know */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What they don't know yet about their own situation. The insight they're missing — the thing you can see that they can't. This is teaching content that builds authority and trust. You're the expert who sees what they don't."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"Coaches aren't evaluating your tape — they're evaluating whether you're coachable"
"The recruiting process tests character, not just talent"
"Your online presence matters more than your highlight reel"`,
                    note: "Insights that reframe how they see the problem."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"The problem isn't recipes, it's decision fatigue at 5pm"
"You don't need a meal plan — you need decisions removed"
"Batch cooking once won't solve this — you need recurring decisions eliminated"`,
                    note: "The mechanism they don't understand yet."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"You're editing based on what looks 'right' instead of telling a story"
"Presets are starting points, not finishes — you need to read the histogram"
"You're over-editing because you don't trust the original shot"`,
                    note: "The blind spot only an expert can see."
                  }
                ]}
                fieldId="lesson3_cant_tell"
                formData={formData}
              >
                What they don't know
              </HelpDrawer>
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={data.cant_tell_1}
              onChange={(e) => updateField('cant_tell_1', e.target.value)}
              placeholder="An insight they're missing..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              value={data.cant_tell_2}
              onChange={(e) => updateField('cant_tell_2', e.target.value)}
              placeholder="Another blind spot..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              value={data.cant_tell_3}
              onChange={(e) => updateField('cant_tell_3', e.target.value)}
              placeholder="One more thing they can't see yet..."
              className="w-full px-3 py-2 rounded-lg bg-brand-dark text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
