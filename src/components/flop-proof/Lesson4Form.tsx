import { AwarenessQuestions, isLesson4Complete } from './types'
import HelpDrawer from './HelpDrawer'

interface Props {
  data: AwarenessQuestions
  onChange: (data: AwarenessQuestions) => void
}

export default function Lesson4Form({ data, onChange }: Props) {
  const updateField = (field: keyof AwarenessQuestions, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson4Complete(data)

  return (
    <div className="bg-brand-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-soehne text-xl text-white">Reaching People Who Don't Know You</h3>
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
        {/* Unaware */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What do they search before they even know they have a problem? At this level, they're not looking for solutions — they're looking for identity and understanding. They're asking big questions about who they are or why things feel off. This is your widest reach because everyone starts here."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"How do I make my kid stand out?"
"Is travel ball worth it?"
"Should my son specialize in one sport?"`,
                    note: "Not searching for recruiting help yet. Just parenting a young athlete."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"Why am I so tired by 5pm?"
"How do other moms have energy at night?"
"Is it normal to dread dinner time?"`,
                    note: "Not looking for meal plans. Just trying to understand the exhaustion."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"Why don't my photos look like what I saw?"
"How do photographers get those colors?"
"Why does my camera make everything look flat?"`,
                    note: "Not searching for editing software. Wondering why their photos disappoint."
                  }
                ]}
              >
                Unaware
              </HelpDrawer>
            </span>
            <span className="text-green-400 text-xs">Widest reach</span>
          </div>
          <textarea
            value={data.unaware_questions}
            onChange={(e) => updateField('unaware_questions', e.target.value)}
            placeholder="What are they curious about before they know your topic matters?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        {/* Problem Aware */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What do they search when they feel the problem but don't know solutions exist? They're describing symptoms and pain points — not brand names, not specific solutions. They know something's wrong but haven't found the category of things that could fix it yet."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"How does college recruiting actually work?"
"When should my kid start getting recruited?"
"Why aren't coaches reaching out?"`,
                    note: "Knows recruiting matters, doesn't know there are systems for it."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"How do I stop eating out every night?"
"What can I make that's fast and my kids will eat?"
"How do I stick to a meal plan?"`,
                    note: "Knows she needs help with dinner, hasn't found a method yet."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"How do I make my edits look less edited?"
"Why do presets look different on my photos?"
"How do I get consistent edits?"`,
                    note: "Knows editing is the issue, doesn't know the solution category."
                  }
                ]}
              >
                Problem Aware
              </HelpDrawer>
            </span>
          </div>
          <textarea
            value={data.problem_aware_questions}
            onChange={(e) => updateField('problem_aware_questions', e.target.value)}
            placeholder="How do they describe their struggle before finding solutions?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        {/* Solution Aware */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What do they search when they know solutions exist but don't know yours? They're comparing options, shopping the category. They know what kind of thing they need — they just haven't found you yet. Still reachable, but more competitive."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"What recruiting services are worth it?"
"Should I hire a recruiting consultant?"
"What makes a good highlight video?"`,
                    note: "Knows recruiting services exist. Shopping for one."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"What's the best meal planning app?"
"Which meal delivery service is best for families?"
"Is batch cooking worth it?"`,
                    note: "Knows meal planning methods exist. Comparing them."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"What Lightroom presets do pros use?"
"Is Lightroom or Photoshop better for editing?"
"Best YouTube channels for photo editing?"`,
                    note: "Knows editing education exists. Looking for the right source."
                  }
                ]}
              >
                Solution Aware
              </HelpDrawer>
            </span>
          </div>
          <textarea
            value={data.solution_aware_questions}
            onChange={(e) => updateField('solution_aware_questions', e.target.value)}
            placeholder="What are they asking while shopping for a solution?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        {/* Product Aware */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What do they search when they already know about you? This is insider content — it only lands with people who already follow you. Lowest reach, but necessary for conversion. Don't build your whole content strategy here."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"Does [your name]'s system work?"
"What's different about [your method]?"
"Is [your course] worth it?"`,
                    note: "They're evaluating YOU. Already know you exist."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"Has anyone tried [your meal plan]?"
"What's in [your recipe pack]?"
"Does [your method] work for picky eaters?"`,
                    note: "They're deciding whether to buy YOUR thing."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"Are [your presets] worth the price?"
"What's different about [your editing style]?"
"Does [your course] cover portraits?"`,
                    note: "Pre-purchase questions. They found you already."
                  }
                ]}
              >
                Product Aware
              </HelpDrawer>
            </span>
            <span className="text-red-400 text-xs">Narrowest reach</span>
          </div>
          <textarea
            value={data.product_aware_questions}
            onChange={(e) => updateField('product_aware_questions', e.target.value)}
            placeholder="What's holding them back from working with you?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>
      </div>
    </div>
  )
}
