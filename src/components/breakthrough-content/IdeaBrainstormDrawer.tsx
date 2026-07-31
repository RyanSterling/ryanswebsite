import { useState } from 'react'
import { BreakthroughFormData } from './types'
import { GeneratedIdea } from '../../lib/supabase'

interface Props {
  idea: GeneratedIdea
  formData: BreakthroughFormData
  isOpen: boolean
  onClose: () => void
}

export default function IdeaBrainstormDrawer({ idea, formData, isOpen, onClose }: Props) {
  const [userContext, setUserContext] = useState('')
  const [copied, setCopied] = useState(false)

  const { lesson1, lesson2, lesson3 } = formData

  const buildPrompt = () => {
    return `## MY NICHE
${lesson1.niche}

## MY AUDIENCE
${lesson2.audience_description}

## WHAT THEY REALLY WANT (DESIRE LADDERS)

**Desire 1:** ${lesson2.desire_1.desire_text}
→ So they can: ${lesson2.desire_1.so_i_can_1}
→ So they can: ${lesson2.desire_1.so_i_can_2}
→ **Emotional core:** ${lesson2.desire_1.so_i_can_3}

**Desire 2:** ${lesson2.desire_2.desire_text}
→ So they can: ${lesson2.desire_2.so_i_can_1}
→ So they can: ${lesson2.desire_2.so_i_can_2}
→ **Emotional core:** ${lesson2.desire_2.so_i_can_3}

**Desire 3:** ${lesson2.desire_3.desire_text}
→ So they can: ${lesson2.desire_3.so_i_can_1}
→ So they can: ${lesson2.desire_3.so_i_can_2}
→ **Emotional core:** ${lesson2.desire_3.so_i_can_3}

## WHAT THEY THINK BUT WON'T ADMIT
- ${lesson3.wont_tell_1}
- ${lesson3.wont_tell_2}
- ${lesson3.wont_tell_3}

## WHAT THEY DON'T KNOW ABOUT THEIR SITUATION
- ${lesson3.cant_tell_1}
- ${lesson3.cant_tell_2}
- ${lesson3.cant_tell_3}

## THE IDEA
**Title:** ${idea.idea}

**Why This Works:** ${idea.room_rationale}

**Awareness Level:** ${idea.awareness_level}

**Resolution Preview:** ${idea.resolution_preview || 'Not specified'}

## MY CONTEXT & THOUGHTS
${userContext || '(Add your personal angle, recent examples, or why this matters to you above)'}

---

## YOUR TASK

This idea needs to become a 40-second video that stops scrollers and delivers value fast.

**IMPORTANT:** Use my context heavily. The examples, observations, and beliefs I shared above are gold — work them into the suggestions. Don't give me generic advice. Give me angles that sound like ME.

Give me:

1. **3-5 Hook Variations** - NOT word-for-word scripts. Give me different angles or framings I can riff on in my own voice. If I shared examples or stories in my context, reference them. Think of these as "ways in" to the topic.

2. **2-4 Key Points** - The actual value/insight I need to deliver. Pull from my context where possible. What are the critical things my audience needs to understand? Give me the bones, not exact phrasing.

3. **A Suggested Close** - How should I wrap this up without being cringe? One sentence that feels like my voice.

Remember: I'm talking to real people, not reading a script. Give me structure and direction, not a teleprompter. Make it sound like ME, not generic content advice.
`
  }

  const handleCopy = async () => {
    const prompt = buildPrompt()
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-brand-card z-50 overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-brand-card border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-soehne text-xl text-white">Create AI Prompt</h2>
            <p className="text-gray-400 text-sm mt-1">Add context, then copy to ChatGPT/Claude</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Steps */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-medium">1</div>
              <span className="text-gray-300">Add context</span>
            </div>
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-medium">2</div>
              <span className="text-gray-300">Copy prompt</span>
            </div>
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-medium">3</div>
              <span className="text-gray-300">Paste in AI</span>
            </div>
          </div>

          {/* The Idea Preview */}
          <div className="bg-brand-dark rounded-xl p-4 border border-gray-800">
            <h3 className="text-white font-medium mb-2">{idea.idea}</h3>
            <p className="text-gray-400 text-sm">{idea.room_rationale}</p>
          </div>

          {/* Context Input */}
          <div>
            <label className="block text-white font-medium mb-2">
              Brain Dump Everything You Know About This Idea
            </label>
            <p className="text-gray-400 text-sm mb-3">
              <strong className="text-white">The more context you give, the better the AI output.</strong> Don't hold back. What do you believe about this topic? What have you seen? What do you want to say? Use dictation (voice-to-text) if typing feels slow — just talk through everything.
            </p>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-3">
              <p className="text-purple-200 text-xs">
                <strong>Tip:</strong> Aim for 3-5 sentences minimum. Include examples, stories, observations, beliefs, frustrations, or anything that comes to mind about this topic. The AI can only work with what you give it.
              </p>
            </div>
            <textarea
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              rows={8}
              placeholder="Example: Had a client last week who said... I keep seeing people do X when they should... What frustrates me is... The thing nobody talks about is... I've noticed that... My take on this is..."
              className="w-full px-4 py-3 rounded-xl bg-brand-dark text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none border border-gray-800"
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-white font-medium mb-2">
              Your Complete Prompt
            </label>
            <p className="text-gray-400 text-sm mb-3">
              This includes your niche, audience, the idea, and your context. Copy everything below and paste it into ChatGPT or Claude.
            </p>
            <div className="bg-brand-dark rounded-xl p-4 max-h-80 overflow-y-auto border border-gray-800">
              <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
                {buildPrompt()}
              </pre>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-brand-orange text-white hover:opacity-90'
            }`}
          >
            {copied ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied to Clipboard!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Everything
              </span>
            )}
          </button>

          {/* Next Steps */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <h4 className="text-purple-300 font-medium mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              After You Paste
            </h4>
            <p className="text-purple-200 text-sm">
              The AI will give you hook angles and talking points. Use them as inspiration, not a script. Riff in your own voice, add your personality, make it yours.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
