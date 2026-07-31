import { useState, useEffect } from 'react'
import {
  BreakthroughFormData,
  isLesson1Complete,
  isLesson2Complete,
  isLesson3Complete,
  isLesson4Complete,
  isLesson5Complete,
  SOPHISTICATION_PRESCRIPTIONS,
} from './types'
import { GeneratedIdea } from '../../lib/supabase'
import IdeaBrainstormDrawer from './IdeaBrainstormDrawer'

interface Props {
  formData: BreakthroughFormData
  generationsRemaining: number
  onCreditsUpdate: (remaining: number) => void
  allComplete: boolean
  onLoadTestData?: () => void
  userId?: string
  courseId?: string
  savedIdeas?: GeneratedIdea[]
}


export default function GeneratorUI({
  formData,
  generationsRemaining,
  onCreditsUpdate,
  allComplete,
  onLoadTestData,
  userId,
  courseId,
  savedIdeas,
}: Props) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>(savedIdeas || [])
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null)
  const [brainstormIdea, setBrainstormIdea] = useState<GeneratedIdea | null>(null)
  const [completedBatches, setCompletedBatches] = useState(0)
  const [jobStatus, setJobStatus] = useState<'in_progress' | 'partial_complete' | 'complete' | null>(null)
  const [jobError, setJobError] = useState<string | null>(null)
  const apiUrl = import.meta.env.DEV
    ? 'http://localhost:8787'
    : 'https://ryan-website-api.rsterling20.workers.dev'

  // Load saved ideas when prop changes
  useEffect(() => {
    if (savedIdeas && savedIdeas.length > 0 && generatedIdeas.length === 0) {
      setGeneratedIdeas(savedIdeas)
      setJobStatus('complete')
    }
  }, [savedIdeas])

  // Warn user if they try to close/navigate away during generation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGenerating) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isGenerating])

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
    setJobError(null)
    setGeneratedIdeas([])
    setCompletedBatches(0)
    setJobStatus('in_progress')

    console.log('[Breakthrough] Starting SSE generation...')

    try {
      // Use fetch with SSE streaming - include userId and courseId for server-side credit tracking
      const response = await fetch(`${apiUrl}/generate-ideas-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId,
          courseId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Generation failed:', response.status, errorText)

        // Handle specific error cases
        if (response.status === 403) {
          setJobError('No generation credits remaining.')
        } else {
          try {
            const errorJson = JSON.parse(errorText)
            setJobError(errorJson.error || 'Generation failed. Please try again.')
          } catch {
            setJobError('Generation failed. Please try again.')
          }
        }
        setIsGenerating(false)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        setJobError('Streaming not supported. Please try again.')
        setIsGenerating(false)
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      console.log('[Breakthrough] SSE stream connected, reading events...')

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log('[Breakthrough] SSE stream ended')
          break
        }

        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE events (data: {...}\n\n)
        const events = buffer.split('\n\n')
        buffer = events.pop() || '' // Keep incomplete event in buffer

        for (const eventStr of events) {
          if (!eventStr.startsWith('data: ')) continue
          const jsonStr = eventStr.slice(6) // Remove 'data: ' prefix

          try {
            const event = JSON.parse(jsonStr)
            console.log(`[Breakthrough] SSE event:`, event.type, event.batch || '')

            if (event.type === 'progress') {
              setCompletedBatches(event.batch - 1) // Currently working on this batch
            } else if (event.type === 'batch_complete') {
              setGeneratedIdeas(event.allIdeas)
              setCompletedBatches(event.batch)
              // Credit is NOT counted here - only after ALL batches complete successfully on the server
            } else if (event.type === 'complete') {
              console.log(`[Breakthrough] All batches complete! ${event.allIdeas.length} ideas`)
              setGeneratedIdeas(event.allIdeas)
              setCompletedBatches(event.totalBatches)
              setJobStatus('complete')
              setIsGenerating(false)

              // Update credits from server response (generation was saved server-side)
              if (typeof event.creditsRemaining === 'number') {
                onCreditsUpdate(event.creditsRemaining)
                console.log(`[Breakthrough] Credits remaining: ${event.creditsRemaining}`)
              }
            } else if (event.type === 'error') {
              console.error('[Breakthrough] Generation error:', event.error)
              if (event.allIdeas && event.allIdeas.length > 0) {
                // Partial success - show ideas but DON'T save or consume credit
                // User can try again since generation didn't fully complete
                setGeneratedIdeas(event.allIdeas)
                setJobStatus('partial_complete')
                setJobError(`Generated ${event.allIdeas.length} ideas but generation incomplete. No credit used - you can try again.`)
              } else {
                setJobError(event.error || 'Generation failed. No credit used - you can try again.')
              }
              setIsGenerating(false)
            }
          } catch {
            console.error('[Breakthrough] Failed to parse SSE event:', jsonStr)
          }
        }
      }

      // Stream ended without explicit complete event
      if (isGenerating) {
        setIsGenerating(false)
      }

    } catch (error) {
      console.error('[Breakthrough] SSE connection error:', error)
      setJobError('Connection lost. Please check your internet and try again.')
      setIsGenerating(false)
    }
  }

  const downloadCSV = () => {
    if (generatedIdeas.length === 0) return

    const headers = [
      'id',
      'idea',
      'room_rationale',
      'awareness_level',
      'urgency',
      'staying_power',
      'scope',
      'resolution_preview',
      'hook_experimenter',
      'hook_teacher',
      'hook_investigator',
      'hook_contrarian',
    ]

    const csvContent = [
      headers.join(','),
      ...generatedIdeas.map((idea) =>
        [
          idea.id,
          `"${idea.idea.replace(/"/g, '""')}"`,
          `"${idea.room_rationale.replace(/"/g, '""')}"`,
          idea.awareness_level,
          idea.urgency,
          idea.staying_power,
          idea.scope,
          `"${(idea.resolution_preview || '').replace(/"/g, '""')}"`,
          `"${idea.hook_experimenter.replace(/"/g, '""')}"`,
          `"${idea.hook_teacher.replace(/"/g, '""')}"`,
          `"${idea.hook_investigator.replace(/"/g, '""')}"`,
          `"${idea.hook_contrarian.replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'breakthrough-content-ideas.csv'
    link.click()
    URL.revokeObjectURL(link.href)
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
            Load Test Data (Ostomy/Cancer Alteration)
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

        {/* Error Message */}
        {jobError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-red-400 text-sm">{jobError}</p>
          </div>
        )}

        {/* Generation In Progress Warning */}
        {isGenerating && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-amber-200 text-sm">
              Generation in progress — please keep this tab open until complete
            </p>
          </div>
        )}

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
                {completedBatches === 0 ? 'Starting generation...' : `${generatedIdeas.length} of 50 ideas...`}
              </span>
            ) : generationsRemaining <= 0 ? (
              'No Generations Remaining'
            ) : !allComplete ? (
              'Complete All Lessons First'
            ) : (
              'Generate 50 Content Ideas'
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
            <div>
              <h3 className="font-soehne text-xl text-white">
                Your Ideas ({generatedIdeas.length})
              </h3>
              {isGenerating && jobStatus === 'in_progress' && completedBatches > 0 && (
                <p className="text-brand-orange text-sm mt-1 flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {generatedIdeas.length} of 50 • Generating more...
                </p>
              )}
              {jobStatus === 'complete' && (
                <p className="text-green-400 text-sm mt-1">All {generatedIdeas.length} ideas ready!</p>
              )}
              {jobStatus === 'partial_complete' && (
                <p className="text-amber-400 text-sm mt-1">
                  Generation partially complete ({generatedIdeas.length} ideas)
                </p>
              )}
            </div>
            <button
              onClick={downloadCSV}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
                isGenerating
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-dark text-gray-300 hover:text-white transition-colors'
              }`}
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
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4 text-xs">
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
                      <button
                        onClick={() => setBrainstormIdea(idea)}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Create AI Prompt
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Resolution Preview */}
                      {idea.resolution_preview && (
                        <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-400 text-xs font-bold">R</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs mb-1">Resolution Preview</p>
                            <p className="text-white text-sm">{idea.resolution_preview}</p>
                          </div>
                        </div>
                      )}

                      {/* Experimenter Hook */}
                      <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-xs font-bold">E</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-xs mb-1">Experimenter</p>
                          <p className="text-white text-sm">{idea.hook_experimenter}</p>
                        </div>
                      </div>

                      {/* Teacher Hook */}
                      <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 text-xs font-bold">T</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-xs mb-1">Teacher</p>
                          <p className="text-white text-sm">{idea.hook_teacher}</p>
                        </div>
                      </div>

                      {/* Investigator Hook */}
                      <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-400 text-xs font-bold">I</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-xs mb-1">Investigator</p>
                          <p className="text-white text-sm">{idea.hook_investigator}</p>
                        </div>
                      </div>

                      {/* Contrarian Hook */}
                      <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-400 text-xs font-bold">C</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-xs mb-1">Contrarian</p>
                          <p className="text-white text-sm">{idea.hook_contrarian}</p>
                        </div>
                      </div>
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

      {/* Brainstorm Drawer */}
      {brainstormIdea && (
        <IdeaBrainstormDrawer
          idea={brainstormIdea}
          formData={formData}
          isOpen={!!brainstormIdea}
          onClose={() => setBrainstormIdea(null)}
        />
      )}
    </div>
  )
}
