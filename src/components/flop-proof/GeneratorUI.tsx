import { useState } from 'react'
import {
  FlopProofFormData,
  isLesson1Complete,
  isLesson2Complete,
  isLesson3Complete,
  isLesson4Complete,
  isLesson5Complete,
  SOPHISTICATION_PRESCRIPTIONS,
} from './types'

interface Props {
  formData: FlopProofFormData
  generationsRemaining: number
  onUseGeneration: () => void
  allComplete: boolean
  onLoadTestData?: () => void
}

// Placeholder for generated ideas - will be replaced with actual API response
interface GeneratedIdea {
  id: number
  idea: string
  room_rationale: string
  urgency: number
  staying_power: number
  scope: number
  hook_will_tell: string
  hook_wont_tell: string
  hook_cant_tell: string
}

export default function GeneratorUI({
  formData,
  generationsRemaining,
  onUseGeneration,
  allComplete,
  onLoadTestData,
}: Props) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([])
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null)

  const completionStatus = [
    { name: 'Lesson 1: Creator Profile', complete: isLesson1Complete(formData.lesson1) },
    { name: 'Lesson 2: Audience & Desires', complete: isLesson2Complete(formData.lesson2) },
    { name: 'Lesson 3: Tell Layers', complete: isLesson3Complete(formData.lesson3) },
    { name: 'Lesson 4: Awareness Questions', complete: isLesson4Complete(formData.lesson4) },
    { name: 'Lesson 5: Saturation Read', complete: isLesson5Complete(formData.lesson5) },
  ]

  const handleGenerate = async () => {
    if (generationsRemaining <= 0 || !allComplete) return

    setShowConfirmation(false)
    setIsGenerating(true)

    try {
      // Call the API endpoint
      const apiUrl = import.meta.env.DEV
        ? 'http://localhost:8787/generate-ideas'
        : 'https://ryan-website-api.rsterling20.workers.dev/generate-ideas'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Generation failed:', error)
        alert('Generation failed. Please try again.')
        setIsGenerating(false)
        return
      }

      const result = await response.json()

      if (result.ideas && result.ideas.length > 0) {
        setGeneratedIdeas(result.ideas)
        onUseGeneration()
      } else {
        console.error('No ideas in response:', result)
        alert('No ideas generated. Please try again.')
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert('Generation failed. Please check your connection and try again.')
    }

    setIsGenerating(false)
  }

  const downloadCSV = () => {
    if (generatedIdeas.length === 0) return

    const headers = [
      'id',
      'idea',
      'room_rationale',
      'urgency',
      'staying_power',
      'scope',
      'hook_will_tell',
      'hook_wont_tell',
      'hook_cant_tell',
    ]

    const csvContent = [
      headers.join(','),
      ...generatedIdeas.map((idea) =>
        [
          idea.id,
          `"${idea.idea.replace(/"/g, '""')}"`,
          `"${idea.room_rationale.replace(/"/g, '""')}"`,
          idea.urgency,
          idea.staying_power,
          idea.scope,
          `"${idea.hook_will_tell.replace(/"/g, '""')}"`,
          `"${idea.hook_wont_tell.replace(/"/g, '""')}"`,
          `"${idea.hook_cant_tell.replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'flop-proof-content-ideas.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const copyIdeaToClipboard = (idea: GeneratedIdea, hookType: 'will_tell' | 'wont_tell' | 'cant_tell') => {
    const hook = hookType === 'will_tell'
      ? idea.hook_will_tell
      : hookType === 'wont_tell'
      ? idea.hook_wont_tell
      : idea.hook_cant_tell

    // Prompt B would be included here
    const copyText = `Idea: ${idea.idea}

Hook: ${hook}

---
[Prompt B would be included here for expansion in your own LLM]`

    navigator.clipboard.writeText(copyText)
  }

  return (
    <div className="space-y-6">
      {/* Input Review */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-4">Input Review</h3>
        <p className="text-gray-400 text-sm mb-6">
          The generator is only as good as what you feed it. Review your inputs before running.
        </p>

        <div className="space-y-3 mb-6">
          {completionStatus.map((lesson, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl ${
                lesson.complete ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <span className="text-gray-300 text-sm">{lesson.name}</span>
              {lesson.complete ? (
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Complete
                </span>
              ) : (
                <span className="text-red-400 text-sm">Incomplete</span>
              )}
            </div>
          ))}
        </div>

        {/* Load Test Data Button (dev only) */}
        {onLoadTestData && !allComplete && (
          <button
            onClick={onLoadTestData}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors mb-4"
          >
            Load Test Data (Football Recruiting Coach)
          </button>
        )}

        {/* Quick Summary */}
        {allComplete && (
          <div className="bg-brand-dark/50 rounded-xl p-4 space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Niche:</span>
              <span className="text-white ml-2">{formData.lesson1.niche}</span>
            </div>
            <div>
              <span className="text-gray-500">Audience:</span>
              <span className="text-white ml-2">{formData.lesson2.audience_description.slice(0, 100)}...</span>
            </div>
            <div>
              <span className="text-gray-500">Market Stage:</span>
              <span className="text-white ml-2">
                Stage {formData.lesson5.sophistication_stage} — {SOPHISTICATION_PRESCRIPTIONS[formData.lesson5.sophistication_stage]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Generator Controls */}
      <div className="bg-brand-card rounded-2xl p-6 md:p-8">
        <h3 className="font-soehne text-xl text-white mb-4">Generate Ideas</h3>

        {/* Generation Warning */}
        <div className="bg-brand-dark/50 rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
              <span className="text-brand-orange font-bold">{generationsRemaining}</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                You have {generationsRemaining} generation{generationsRemaining !== 1 ? 's' : ''} remaining
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Once you run the generator, you'll use one. Review your inputs carefully — better inputs = better ideas.
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {!showConfirmation ? (
          <button
            onClick={() => setShowConfirmation(true)}
            disabled={!allComplete || generationsRemaining <= 0 || isGenerating}
            className={`w-full py-4 rounded-[19px] font-medium text-lg transition-all ${
              allComplete && generationsRemaining > 0 && !isGenerating
                ? 'bg-brand-orange text-white hover:opacity-90'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating 100 Ideas...
              </span>
            ) : generationsRemaining <= 0 ? (
              'No Generations Remaining'
            ) : !allComplete ? (
              'Complete All Lessons First'
            ) : (
              'Generate 100 Content Ideas'
            )}
          </button>
        ) : (
          <div className="bg-brand-orange/10 border border-brand-orange rounded-xl p-4">
            <p className="text-white text-sm mb-4">
              Are you sure? This will use 1 of your {generationsRemaining} remaining generations.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 py-3 rounded-xl bg-brand-orange text-white font-medium hover:opacity-90 transition-opacity"
              >
                Yes, Generate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Generated Ideas Display */}
      {generatedIdeas.length > 0 && (
        <div className="bg-brand-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-soehne text-xl text-white">
              Your Ideas ({generatedIdeas.length})
            </h3>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-dark text-gray-300 hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </button>
          </div>

          <div className="space-y-4">
            {generatedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-brand-dark rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIdea(expandedIdea === idea.id ? null : idea.id)}
                  className="w-full p-4 text-left flex items-start gap-4"
                >
                  <span className="text-gray-500 text-sm font-mono w-8 flex-shrink-0">
                    #{idea.id}
                  </span>
                  <div className="flex-1">
                    <p className="text-white">{idea.idea}</p>
                    <p className="text-gray-500 text-sm mt-1">{idea.room_rationale}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedIdea === idea.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedIdea === idea.id && (
                  <div className="px-4 pb-4 border-t border-gray-800 pt-4 ml-12">
                    <div className="flex items-center gap-4 mb-4 text-xs">
                      <span className="text-gray-500">
                        Urgency: <span className="text-white">{idea.urgency}/5</span>
                      </span>
                      <span className="text-gray-500">
                        Staying Power: <span className="text-white">{idea.staying_power}/5</span>
                      </span>
                      <span className="text-gray-500">
                        Scope: <span className="text-white">{idea.scope}/5</span>
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Will Tell Hook */}
                      <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-xs font-bold">W</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{idea.hook_will_tell}</p>
                        </div>
                        <button
                          onClick={() => copyIdeaToClipboard(idea, 'will_tell')}
                          className="text-gray-400 hover:text-white p-1"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>

                      {/* Won't Tell Hook */}
                      <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-400 text-xs font-bold">S</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{idea.hook_wont_tell}</p>
                        </div>
                        <button
                          onClick={() => copyIdeaToClipboard(idea, 'wont_tell')}
                          className="text-gray-400 hover:text-white p-1"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>

                      {/* Can't Tell Hook */}
                      <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 text-xs font-bold">C</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{idea.hook_cant_tell}</p>
                        </div>
                        <button
                          onClick={() => copyIdeaToClipboard(idea, 'cant_tell')}
                          className="text-gray-400 hover:text-white p-1"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
