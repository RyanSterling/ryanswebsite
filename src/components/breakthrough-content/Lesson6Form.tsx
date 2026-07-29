import { useState } from 'react'
import { BreakthroughFormData, SOPHISTICATION_PRESCRIPTIONS } from './types'

interface Props {
  formData: BreakthroughFormData
}

export default function Lesson6Form({ formData }: Props) {
  const [brainDump, setBrainDump] = useState('')
  const [copied, setCopied] = useState(false)

  const { lesson1, lesson2, lesson3, lesson4, lesson5 } = formData

  // Build the complete prompt with all data
  const buildCopyableContent = () => {
    const stage = lesson5.sophistication_stage as 1 | 2 | 3 | 4 | 5

    return `## MY CREATOR PROFILE

**Niche:** ${lesson1.niche}
**Core Problem I Solve:** ${lesson1.core_problem}
**What I Help People Do:** ${lesson1.what_you_do}
**My Unique Insight:** ${lesson1.what_you_teach}

## MY AUDIENCE

${lesson2.audience_description}

### Desire 1: "${lesson2.desire_1.desire_text}"
- So I can: ${lesson2.desire_1.so_i_can_1}
- So I can: ${lesson2.desire_1.so_i_can_2}
- So I can: ${lesson2.desire_1.so_i_can_3}

### Desire 2: "${lesson2.desire_2.desire_text}"
- So I can: ${lesson2.desire_2.so_i_can_1}
- So I can: ${lesson2.desire_2.so_i_can_2}
- So I can: ${lesson2.desire_2.so_i_can_3}

### Desire 3: "${lesson2.desire_3.desire_text}"
- So I can: ${lesson2.desire_3.so_i_can_1}
- So I can: ${lesson2.desire_3.so_i_can_2}
- So I can: ${lesson2.desire_3.so_i_can_3}

## WHAT MY AUDIENCE TELLS ME (Will-Tell Layer)
- ${lesson3.will_tell_1}
- ${lesson3.will_tell_2}
- ${lesson3.will_tell_3}

## WHAT THEY WON'T ADMIT (Won't-Tell Layer)
- ${lesson3.wont_tell_1}
- ${lesson3.wont_tell_2}
- ${lesson3.wont_tell_3}

## WHAT THEY DON'T KNOW YET (Can't-Tell Layer)
- ${lesson3.cant_tell_1}
- ${lesson3.cant_tell_2}
- ${lesson3.cant_tell_3}

## QUESTIONS BY AWARENESS LEVEL

**Unaware:** ${lesson4.unaware_questions}
**Problem Aware:** ${lesson4.problem_aware_questions}
**Solution Aware:** ${lesson4.solution_aware_questions}
**Product Aware:** ${lesson4.product_aware_questions}

## WHAT TO AVOID

**Saturated Topics:** ${lesson5.saturated_topics}
**Saturated Formats:** ${lesson5.saturated_formats}
**Competitor Angles:** ${lesson5.competitor_angles}
**Market Stage:** ${stage}/5 — ${SOPHISTICATION_PRESCRIPTIONS[stage]}

---

## MY BRAIN DUMP FOR THIS IDEA

${brainDump || '(Brain dump everything you know about ONE content idea above)'}

---

## YOUR TASK

I've brain dumped everything I know about ONE content idea above. Using my creator profile and audience data, help me develop this idea into a piece of content.

1. Refine the core angle — what's the sharpest version of this idea?
2. Explain why THIS audience would care (not just anyone — MY people)
3. Write 3-4 hook options I could use to open the video
4. Suggest a structure or flow for the content
5. Flag anything that might drift into the saturated topics/formats I listed

Stay within my niche. The final piece should feel like "this creator GETS me" not "this could be from anyone."
`
  }

  const handleCopy = async () => {
    const content = buildCopyableContent()
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-4">Unlimited AI Brainstorming</h3>
        <p className="text-gray-300 mb-4">
          Your 50 generated ideas are a starting point. Use this page to brainstorm more whenever you want — for free, using any AI tool you have access to (ChatGPT, Claude, etc).
        </p>
        <p className="text-gray-400 text-sm">
          Add your rough ideas, observations, or topics below. Then copy everything and paste it into your AI of choice.
        </p>
      </div>

      {/* Brain Dump Input */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-lg text-white mb-2">Your Brain Dump</h3>
        <p className="text-gray-400 text-sm mb-4">
          Pick ONE content idea you want to develop. Then dump everything you know about it here — your take, what most people get wrong, examples you've seen, things you'd want to say, related stories, anything. The more you put in, the better the AI can help you shape it.
        </p>
        <textarea
          value={brainDump}
          onChange={(e) => setBrainDump(e.target.value)}
          rows={6}
          placeholder="e.g., I want to make something about [topic]. My take is... Most people think X but actually Y... I had a client who... The thing people don't realize is..."
          className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
        />
      </div>

      {/* Preview & Copy */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-soehne text-lg text-white">Your Complete Prompt</h3>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-brand-orange text-white hover:opacity-90'
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy All
              </span>
            )}
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          This includes all your form data, your brain dump, and a prompt that tells the AI exactly what to do. Copy and paste into ChatGPT, Claude, or any AI.
        </p>

        {/* Preview */}
        <div className="bg-brand-dark rounded-xl p-4 max-h-80 overflow-y-auto">
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
            {buildCopyableContent()}
          </pre>
        </div>
      </div>

      {/* Data Summary (Collapsed) */}
      <details className="bg-brand-card rounded-2xl overflow-hidden">
        <summary className="px-6 py-4 cursor-pointer text-gray-400 hover:text-white transition-colors flex items-center justify-between">
          <span>View your form data summary</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-6 pb-6 space-y-4 text-sm">
          <div>
            <h4 className="text-brand-orange font-medium mb-1">Lesson 1: Profile</h4>
            <p className="text-gray-300"><strong>Niche:</strong> {lesson1.niche}</p>
            <p className="text-gray-300"><strong>Problem:</strong> {lesson1.core_problem}</p>
          </div>
          <div>
            <h4 className="text-brand-orange font-medium mb-1">Lesson 2: Desires</h4>
            <p className="text-gray-300">1. {lesson2.desire_1.desire_text}</p>
            <p className="text-gray-300">2. {lesson2.desire_2.desire_text}</p>
            <p className="text-gray-300">3. {lesson2.desire_3.desire_text}</p>
          </div>
          <div>
            <h4 className="text-brand-orange font-medium mb-1">Lesson 3: Tell Layers</h4>
            <p className="text-gray-300"><strong>Won't tell:</strong> {lesson3.wont_tell_1}</p>
            <p className="text-gray-300"><strong>Can't tell:</strong> {lesson3.cant_tell_1}</p>
          </div>
          <div>
            <h4 className="text-brand-orange font-medium mb-1">Lesson 5: Saturation</h4>
            <p className="text-gray-300"><strong>Avoid:</strong> {lesson5.saturated_topics}</p>
            <p className="text-gray-300"><strong>Stage:</strong> {lesson5.sophistication_stage}/5</p>
          </div>
        </div>
      </details>
    </div>
  )
}
