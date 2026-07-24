import { AudienceData, isLesson2Complete, SCOPE_OPTIONS } from './types'
import DesireLadder from './DesireLadder'
import HelpDrawer from './HelpDrawer'

interface Props {
  data: AudienceData
  onChange: (data: AudienceData) => void
}

export default function Lesson2Form({ data, onChange }: Props) {
  const updateField = <K extends keyof AudienceData>(field: K, value: AudienceData[K]) => {
    onChange({ ...data, [field]: value })
  }

  const isComplete = isLesson2Complete(data)

  return (
    <div className="space-y-6">
      {/* Audience */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-soehne text-xl text-white">Your Audience</h3>
          {isComplete && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Complete
            </span>
          )}
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">
            <HelpDrawer
              explanation="Describe a specific person — not a demographic. Include their situation, where they're stuck, and what they're trying to do. The more real they feel, the better your content ideas will be."
              examples={[
                {
                  label: "High school football recruiting coach",
                  value: "High school junior or senior athlete who's good enough to play college ball but isn't getting any looks. Parents are stressed, the kid is discouraged, and nobody knows how to get coaches' attention.",
                  note: "A person with a situation, not 'athletes ages 16-18'"
                },
                {
                  label: "Helps busy moms meal prep",
                  value: "Working mom with 2-3 kids who gets home at 6pm exhausted. Wants to feed her family healthy food but ends up ordering takeout 3x a week because she has no plan.",
                  note: "Captures the daily friction they actually feel"
                },
                {
                  label: "Teaches photographers to edit in Lightroom",
                  value: "Hobbyist photographer who's watched YouTube tutorials but their edited photos still look 'off.' Frustrated that presets don't look the same on their photos.",
                  note: "Where they're stuck, not just who they are"
                }
              ]}
            >
              Describe your target person
            </HelpDrawer>
          </label>
          <textarea
            value={data.audience_description}
            onChange={(e) => updateField('audience_description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
          />
        </div>
      </div>

      {/* Desire Ladders */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-4">
          <HelpDrawer
            explanation="List three things your audience wants. For each one, keep asking 'why do they want that?' until you reach the emotional core. The last rung is always the bigger room — that's where your reach lives."
            examples={[
              {
                label: "High school football recruiting coach",
                value: `Get recruited
  ↳ Keep playing the sport I love
    ↳ Know the early mornings meant something
      ↳ Not have the dream die`,
                note: "The core fear is the dream ending. That's universal."
              },
              {
                label: "Helps busy moms meal prep",
                value: `Have dinners planned
  ↳ Stop dreading 5pm every day
    ↳ Have one less thing draining me
      ↳ Have energy to actually enjoy my evening`,
                note: "The core isn't 'be a good mom' — it's not being empty by 8pm."
              },
              {
                label: "Teaches photographers to edit in Lightroom",
                value: `Make photos look professional
  ↳ Not be embarrassed to share them
    ↳ Feel like I'm actually improving
      ↳ Feel like a photographer, not just someone with an expensive camera`,
                note: "The core is identity — am I actually this thing, or just pretending?"
              }
            ]}
          >
            Desire Ladders
          </HelpDrawer>
        </h3>

        <div className="space-y-4">
          <DesireLadder
            label="Desire 1"
            data={data.desire_1}
            onChange={(value) => updateField('desire_1', value)}
          />
          <DesireLadder
            label="Desire 2"
            data={data.desire_2}
            onChange={(value) => updateField('desire_2', value)}
          />
          <DesireLadder
            label="Desire 3"
            data={data.desire_3}
            onChange={(value) => updateField('desire_3', value)}
          />
        </div>
      </div>

      {/* Dimensions */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-6">Desire Dimensions</h3>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 text-sm">
                <HelpDrawer
                  explanation="How pressing is this for them right now? A mild annoyance they'll get to someday (1) vs. something that keeps them up at night (5). High-urgency desires make people stop scrolling."
                  examples={[
                    {
                      label: "High school football recruiting coach",
                      value: "5 — Recruiting deadlines are real. Miss the window and you miss the scholarship.",
                      note: "Time pressure creates urgency"
                    },
                    {
                      label: "Helps busy moms meal prep",
                      value: "4 — The stress is daily, but it's not life-or-death. Still, it compounds.",
                      note: "Recurring friction builds urgency over time"
                    },
                    {
                      label: "Teaches photographers to edit in Lightroom",
                      value: "2-3 — It bugs them, but they're not losing sleep over it. It's a 'someday' problem.",
                      note: "Hobby problems feel less urgent than professional ones"
                    }
                  ]}
                >
                  Urgency
                </HelpDrawer>
              </label>
              <span className="text-brand-orange text-sm">{data.urgency_read}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.urgency_read}
              onChange={(e) => updateField('urgency_read', parseInt(e.target.value))}
              className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 text-sm">
                <HelpDrawer
                  explanation="Is this desire solved once and forgotten, or does it keep coming back? A one-time fix (1) vs. a recurring need (5). High staying power means your content stays relevant — evergreen, not dated."
                  examples={[
                    {
                      label: "High school football recruiting coach",
                      value: "2 — Once they're recruited, they're done. But new seniors every year keeps the market fresh.",
                      note: "One-time per person, but recurring in the market"
                    },
                    {
                      label: "Helps busy moms meal prep",
                      value: "5 — Dinner happens every single night. The problem never goes away.",
                      note: "Daily repetition = maximum staying power"
                    },
                    {
                      label: "Teaches photographers to edit in Lightroom",
                      value: "4 — Every new photo needs editing. The skill compounds but the need repeats.",
                      note: "Recurring activity, even after learning"
                    }
                  ]}
                >
                  Staying Power
                </HelpDrawer>
              </label>
              <span className="text-brand-orange text-sm">{data.staying_power_read}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.staying_power_read}
              onChange={(e) => updateField('staying_power_read', parseInt(e.target.value))}
              className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              <HelpDrawer
                explanation="How many people share this desire? This is your room size — the core concept from Lesson 1. The answer changes which topics will reach past your followers."
                examples={[
                  {
                    label: "High school football recruiting coach",
                    value: "Niche specialists only — Few people care about high school recruiting. But 'making your family proud'? That's universal.",
                    note: "The surface topic is small. The ladder-top emotion is big."
                  },
                  {
                    label: "Helps busy moms meal prep",
                    value: "Most people who scroll past — Everyone eats. Everyone knows dinner stress. Even non-parents get it.",
                    note: "Daily universal experience = massive scope"
                  },
                  {
                    label: "Teaches photographers to edit in Lightroom",
                    value: "Followers + some strangers — Lots of hobbyist photographers, but not everyone. Broader than recruiting, narrower than food.",
                    note: "Middle scope — reach depends on angle"
                  }
                ]}
              >
                Scope
              </HelpDrawer>
            </label>
            <div className="space-y-2">
              {SCOPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    data.scope_estimate === option.value
                      ? 'bg-brand-orange/20 border border-brand-orange'
                      : 'bg-brand-dark border border-transparent hover:border-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="scope_estimate"
                    value={option.value}
                    checked={data.scope_estimate === option.value}
                    onChange={(e) => updateField('scope_estimate', e.target.value as AudienceData['scope_estimate'])}
                    className="sr-only"
                  />
                  <span className="text-white text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
