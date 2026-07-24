import { AudienceData, isLesson2Complete } from './types'
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
            explanation="Start with something your audience wants, then keep asking 'why?' until you hit the emotional core. The surface desire is specific to your niche. The emotional core is something almost everyone can relate to — and that's what makes content spread."
            examples={[
              {
                label: "High school football recruiting coach",
                value: `They want to: Get recruited
  ↳ So they can: Keep playing the sport I love
    ↳ So they can: Know the early mornings meant something
      ↳ So they can: Not have the dream die`,
                note: "The core fear is the dream ending. That's universal."
              },
              {
                label: "Helps busy moms meal prep",
                value: `They want to: Have dinners planned
  ↳ So they can: Stop dreading 5pm every day
    ↳ So they can: Have one less thing draining me
      ↳ So they can: Have energy to actually enjoy my evening`,
                note: "The core isn't 'be a good mom' — it's not being empty by 8pm."
              },
              {
                label: "Teaches photographers to edit in Lightroom",
                value: `They want to: Make photos look professional
  ↳ So they can: Not be embarrassed to share them
    ↳ So they can: Feel like I'm actually improving
      ↳ So they can: Feel like a photographer, not just someone with an expensive camera`,
                note: "The core is identity — am I actually this thing, or just pretending?"
              }
            ]}
          >
            Desire Ladders
          </HelpDrawer>
        </h3>
        <p className="text-gray-500 text-sm mb-4">Fill out the ladder first, then answer the questions about each desire.</p>

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
    </div>
  )
}
