import { SaturationRead, BreakthroughFormData, isLesson5Complete, SOPHISTICATION_PRESCRIPTIONS } from './types'
import HelpDrawer from './HelpDrawer'

interface Props {
  data: SaturationRead
  onChange: (data: SaturationRead) => void
  formData?: BreakthroughFormData
}

const SOPHISTICATION_OPTIONS: Array<{ value: 1 | 2 | 3 | 4 | 5; label: string }> = [
  { value: 1, label: 'Fresh — nobody has said this' },
  { value: 2, label: 'Early — a few have, I can go bigger' },
  { value: 3, label: 'Crowded — need a new angle' },
  { value: 4, label: 'Very crowded — even new angles are copied' },
  { value: 5, label: 'Burned out — they have heard it all' },
]

export default function Lesson5Form({ data, onChange, formData }: Props) {
  const updateField = <K extends keyof SaturationRead>(field: K, value: SaturationRead[K]) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson5Complete(data)

  return (
    <div className="bg-brand-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-soehne text-xl text-white">Setting Yourself Apart</h3>
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
        {/* Dead Topics */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What topics have been posted to death in your niche? The obvious takes everyone makes. These aren't bad topics — they're just exhausted. The generator will avoid producing ideas your audience has already scrolled past."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"You need to email coaches"
"GPA matters for recruiting"
"Start your recruiting journey early"`,
                    note: "Everyone has made this content. Your audience has heard it."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"Meal prep saves time"
"Cook once, eat all week"
"Here's what I meal prepped this Sunday"`,
                    note: "True, but overdone. Nothing new to say here."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"Before and after edits"
"My editing workflow"
"How I edit my photos in Lightroom"`,
                    note: "The format worked once. Now it's background noise."
                  }
                ]}
                fieldId="lesson5_saturated_topics"
                formData={formData}
              >
                Dead topics
              </HelpDrawer>
            </span>
          </div>
          <textarea
            value={data.saturated_topics}
            onChange={(e) => updateField('saturated_topics', e.target.value)}
            placeholder="What topics has everyone already covered?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        {/* Dead Formats */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What hooks or formats make people scroll without reading? These structures have been copied so many times that your audience recognizes them before they even start — and skips past."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"Day in the life of a recruit"
"Things coaches won't tell you"
"Unpopular recruiting opinion"`,
                    note: "The format signals 'content I've seen before.'"
                  },
                  {
                    label: "Meal prep mom",
                    value: `"What I eat in a day"
"Grocery haul"
"Realistic meal prep for busy moms"`,
                    note: "They've scrolled past this exact title 100 times."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"POV: you're editing photos"
"Presets I can't live without"
"Watch me edit this photo"`,
                    note: "The hook is invisible now. Nobody stops."
                  }
                ]}
                fieldId="lesson5_saturated_formats"
                formData={formData}
              >
                Dead formats
              </HelpDrawer>
            </span>
          </div>
          <textarea
            value={data.saturated_formats}
            onChange={(e) => updateField('saturated_formats', e.target.value)}
            placeholder="What hooks or formats make people scroll past?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        {/* Competitor Angles */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="What messages has your audience heard 100 times? The positioning everyone uses. These might be true, but your audience has stopped listening because they've heard it from everyone else."
                examples={[
                  {
                    label: "Football recruiting coach",
                    value: `"Coaches want to see hustle"
"Be proactive, reach out first"
"Your highlight tape is your resume"`,
                    note: "Not wrong — just overused. No one stops for this."
                  },
                  {
                    label: "Meal prep mom",
                    value: `"You just need to plan ahead"
"Healthy eating doesn't have to be hard"
"15-minute meals the whole family will love"`,
                    note: "Every meal prep account says this. It's wallpaper."
                  },
                  {
                    label: "Lightroom photographer",
                    value: `"Editing is where the magic happens"
"Presets are just a starting point"
"Shoot in RAW for more flexibility"`,
                    note: "True advice that now sounds like noise."
                  }
                ]}
                fieldId="lesson5_competitor_angles"
                formData={formData}
              >
                Competitor angles
              </HelpDrawer>
            </span>
          </div>
          <textarea
            value={data.competitor_angles}
            onChange={(e) => updateField('competitor_angles', e.target.value)}
            placeholder="What messages has your audience heard from everyone else?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>

        {/* Market Stage */}
        <div className="bg-brand-dark/50 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              <HelpDrawer
                explanation="How saturated is your market? This determines what kind of execution you need. A stage 1 take in a stage 3 market will flop — even if the topic is 'proven.' Select honestly, and the prescription will tell you what to do about it."
                examples={[
                  {
                    label: "Stage 1-2: Fresh or Early",
                    value: "You're first, or close to it. Say it clearly, or go bolder than the few who came before.",
                    note: "Rare. Most niches are past this point."
                  },
                  {
                    label: "Stage 3: Crowded",
                    value: "Everyone's made the claim. Show HOW it works, not just what.",
                    note: "Most niches live here. This is where 'proven' topics flop."
                  },
                  {
                    label: "Stage 4-5: Very crowded or Burned out",
                    value: "They've heard the explanations too. Go where others didn't, or show what life looks like on the other side.",
                    note: "Stop explaining. Go deeper or show the result."
                  }
                ]}
              >
                Market stage
              </HelpDrawer>
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {SOPHISTICATION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  data.sophistication_stage === option.value
                    ? 'bg-brand-orange/20 border border-brand-orange'
                    : 'bg-brand-dark border border-transparent hover:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="sophistication_stage"
                  value={option.value}
                  checked={data.sophistication_stage === option.value}
                  onChange={() => updateField('sophistication_stage', option.value)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  data.sophistication_stage === option.value ? 'bg-brand-orange text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  <span className="text-xs">{option.value}</span>
                </div>
                <span className="text-white text-sm">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="bg-brand-dark rounded-xl p-4">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Your prescription</span>
            <p className="text-white mt-1">{SOPHISTICATION_PRESCRIPTIONS[data.sophistication_stage]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
