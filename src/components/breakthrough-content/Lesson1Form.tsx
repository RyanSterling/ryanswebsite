import { CreatorProfile, isLesson1Complete } from './types'
import HelpDrawer from './HelpDrawer'

interface Props {
  data: CreatorProfile
  onChange: (data: CreatorProfile) => void
}

export default function Lesson1Form({ data, onChange }: Props) {
  const updateField = (field: keyof CreatorProfile, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson1Complete(data)

  return (
    <div className="bg-brand-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-soehne text-xl text-white">Your Profile</h3>
        {isComplete && (
          <span className="text-green-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            <HelpDrawer
              explanation="Pick the broadest topic area where your expertise is credible and all your content ideas would be relevant. The follow-up questions handle the specifics — this just sets the domain."
              examples={[
                {
                  label: "High school football recruiting coach",
                  value: "Football",
                  note: "Not \"high school football recruiting\" — the other fields capture that specificity"
                },
                {
                  label: "Helps busy moms meal prep",
                  value: "Cooking",
                  note: "Not \"healthy meal prep for moms\" — keep it to the domain"
                },
                {
                  label: "Teaches photographers to edit in Lightroom",
                  value: "Photography",
                  note: "Not \"Lightroom editing\" — that's what you teach, not the niche"
                }
              ]}
            >
              Your niche
            </HelpDrawer>
          </label>
          <input
            type="text"
            value={data.niche}
            onChange={(e) => updateField('niche', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            <HelpDrawer
              explanation="Name the specific pain point your audience feels — something they'd actually say out loud or type into Google. Avoid vague terms like 'struggle' or 'issues.' The more concrete, the better your content ideas."
              examples={[
                {
                  label: "High school football recruiting coach",
                  value: "Athletes get overlooked because coaches never see their film",
                  note: "Specific and visceral — not 'recruiting is hard'"
                },
                {
                  label: "Helps busy moms meal prep",
                  value: "They spend 2 hours every night figuring out dinner",
                  note: "Names the daily friction they actually feel"
                },
                {
                  label: "Teaches photographers to edit in Lightroom",
                  value: "Their photos look flat and amateur even after editing",
                  note: "The gap between where they are and where they want to be"
                }
              ]}
            >
              What is the #1 problem you help people solve?
            </HelpDrawer>
          </label>
          <textarea
            value={data.core_problem}
            onChange={(e) => updateField('core_problem', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            <HelpDrawer
              explanation="Describe the outcome or transformation — what's different after they work with you? Focus on results, not methods. This isn't what you teach; it's what they get."
              examples={[
                {
                  label: "High school football recruiting coach",
                  value: "Get their highlight reel in front of college coaches",
                  note: "The result, not the process of making the reel"
                },
                {
                  label: "Helps busy moms meal prep",
                  value: "Have a week of dinners ready in 2 hours on Sunday",
                  note: "Specific outcome they can picture"
                },
                {
                  label: "Teaches photographers to edit in Lightroom",
                  value: "Make their photos look professional without spending hours editing",
                  note: "The after state, not the editing techniques"
                }
              ]}
            >
              What do you help people do?
            </HelpDrawer>
          </label>
          <textarea
            value={data.what_you_do}
            onChange={(e) => updateField('what_you_do', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            <HelpDrawer
              explanation="This is your edge — the insight, method, or perspective that makes your approach different. It's the thing you wish everyone knew, or the mistake you see people making that you know how to fix."
              examples={[
                {
                  label: "High school football recruiting coach",
                  value: "Coaches decide in the first 8 seconds — most highlight reels bury the best plays",
                  note: "An insight that changes how they'd approach it"
                },
                {
                  label: "Helps busy moms meal prep",
                  value: "You don't need 20 recipes — you need 5 base meals with variations",
                  note: "A reframe that simplifies everything"
                },
                {
                  label: "Teaches photographers to edit in Lightroom",
                  value: "90% of the 'look' comes from 3 sliders, not presets",
                  note: "The shortcut others don't know about"
                }
              ]}
            >
              What do you know that most don't?
            </HelpDrawer>
          </label>
          <textarea
            value={data.what_you_teach}
            onChange={(e) => updateField('what_you_teach', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>
      </div>
    </div>
  )
}
