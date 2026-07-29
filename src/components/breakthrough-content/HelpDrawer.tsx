import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BreakthroughFormData, isLesson1Complete } from './types'

interface Example {
  label: string
  value: string
  note?: string
}

interface Props {
  children: React.ReactNode
  explanation: string
  examples: Example[]
  // Optional AI prompt support
  fieldId?: string
  formData?: BreakthroughFormData
}

export default function HelpDrawer({ children, explanation, examples, fieldId, formData }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  // Ensure we only render portal on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Build AI prompt based on field ID
  const buildPrompt = (): string => {
    if (!fieldId || !formData) return ''

    const { lesson1 } = formData

    // Build field-specific content
    const getFieldContent = (): { fieldName: string; instructions: string } => {
      switch (fieldId) {
        case 'lesson2_audience_description':
          return {
            fieldName: 'Describe Your Target Person',
            instructions: `Give me 5-8 different variations of a specific person who fits my niche. Each should include their situation, where they're stuck, and what they're trying to do. Make them feel like real humans, not demographics. I'll pick the one that feels most accurate to who I actually help.`
          }
        case 'lesson2_desire_ladders':
          return {
            fieldName: 'Desire Ladders',
            instructions: `Give me 6-8 different surface desires my audience might have. For a few of them, show the full ladder (3 "so I can" layers) as examples. Make sure the bottom layers hit emotional needs, not just practical ones. I'll pick the 3 that feel most true to my audience.`
          }
        case 'lesson3_will_tell':
          return {
            fieldName: 'What They Will Tell (Openly Admit)',
            instructions: `Give me 6-8 things my audience would openly admit about their situation. These should be socially acceptable, safe to say to friends. Based on my niche and the problem I solve. I'll pick the 3 most common ones I actually hear.`
          }
        case 'lesson3_wont_tell':
          return {
            fieldName: 'What They Won\'t Tell (Hide From Others)',
            instructions: `Give me 6-8 embarrassing thoughts my audience hides. The fears and shame they carry privately. Things that would make them feel seen and understood. I'll pick the 3 I know they're actually thinking.`
          }
        case 'lesson3_cant_tell':
          return {
            fieldName: 'What They Can\'t Tell (Don\'t Know Yet)',
            instructions: `Give me 6-8 blind spots my audience has. What they're misdiagnosing about their real problem. Insights only an expert in my niche would see. I'll pick the 3 most important reframes I teach.`
          }
        case 'lesson4_unaware':
          return {
            fieldName: 'Unaware Stage Search Queries',
            instructions: `Give me 8-10 search queries for the unaware awareness stage - when they don't even know they have a problem yet. Actual phrases they'd type into Google or YouTube. Based on my niche and the problem I solve. I'll pick the most realistic ones I've actually seen.`
          }
        case 'lesson4_problem_aware':
          return {
            fieldName: 'Problem-Aware Stage Search Queries',
            instructions: `Give me 8-10 search queries for the problem-aware stage - when they feel the pain but don't know solutions exist. Actual phrases they'd type into Google or YouTube. Based on my niche and the problem I solve. I'll pick the most realistic ones I've actually seen.`
          }
        case 'lesson4_solution_aware':
          return {
            fieldName: 'Solution-Aware Stage Search Queries',
            instructions: `Give me 8-10 search queries for the solution-aware stage - when they're shopping and comparing options. Actual phrases they'd type into Google or YouTube. Based on my niche and the problem I solve. I'll pick the most realistic ones I've actually seen.`
          }
        case 'lesson4_product_aware':
          return {
            fieldName: 'Product-Aware Stage Search Queries',
            instructions: `Give me 8-10 search queries for the product-aware stage - when they already know about me and are evaluating fit. Actual phrases they'd type into Google or YouTube. Based on my niche and the problem I solve. I'll pick the most realistic ones I've actually seen.`
          }
        case 'lesson5_saturated_topics':
          return {
            fieldName: 'Dead Topics (Overdone in Your Niche)',
            instructions: `Give me 6-8 examples of topics that are overdone in my niche. Things that have been said so many times people tune out. I'll pick the ones that actually match what I see in my space.`
          }
        case 'lesson5_saturated_formats':
          return {
            fieldName: 'Dead Formats (Hooks People Scroll Past)',
            instructions: `Give me 6-8 examples of formats and hooks that are overdone in my niche. Things that make people scroll past immediately. I'll pick the ones that actually match what I see in my space.`
          }
        case 'lesson5_competitor_angles':
          return {
            fieldName: 'Dead Angles (Messages Heard Everywhere)',
            instructions: `Give me 6-8 examples of angles and messages that competitors use all the time in my niche. Things my audience has heard a hundred times. I'll pick the ones that actually match what I see in my space.`
          }
        default:
          return {
            fieldName: 'This Field',
            instructions: 'Help me think through what belongs here based on my creator profile.'
          }
      }
    }

    const { fieldName, instructions } = getFieldContent()

    // Format examples nicely
    const formattedExamples = examples.map((ex, i) => {
      let exampleText = `**Example ${i + 1}:** ${ex.label}\n${ex.value}`
      if (ex.note) {
        exampleText += `\n*Note: ${ex.note}*`
      }
      return exampleText
    }).join('\n\n')

    return `## YOUR CREATOR PROFILE

**Niche:** ${lesson1.niche || '(not filled out yet)'}
**Core Problem:** ${lesson1.core_problem || '(not filled out yet)'}
**What You Help People Do:** ${lesson1.what_you_do || '(not filled out yet)'}
**Your Unique Insight:** ${lesson1.what_you_teach || '(not filled out yet)'}

---

## WHAT I NEED HELP WITH

I'm working on: **${fieldName}**

${explanation}

---

## YOUR TASK

${instructions}

Examples of good answers:

${formattedExamples}

---

**IMPORTANT:** Give me 5-8 different options to choose from. Don't write my answer for me - give me a variety of examples that fit my creator profile, and I'll pick the ones that resonate most. This is a thinking tool, not a done-for-you solution. I need options to react to and select from based on what I know about my audience.`
  }

  const handleCopy = async () => {
    const prompt = buildPrompt()
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-card border-l border-gray-800 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <h4 className="font-soehne text-white text-lg">How to fill this out</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Explanation */}
            <p className="text-gray-300 leading-relaxed font-normal text-base">
              {explanation}
            </p>

            {/* Examples */}
            <div className="space-y-4">
              <h5 className="text-white text-sm font-medium uppercase tracking-wide">Examples</h5>
              <div className="space-y-3">
                {examples.map((example, i) => (
                  <div key={i} className="bg-brand-dark rounded-xl p-4">
                    <div className="text-gray-500 text-xs uppercase tracking-wide mb-1 font-normal">
                      {example.label}
                    </div>
                    <div className="text-white font-normal text-sm whitespace-pre-line">
                      {example.value}
                    </div>
                    {example.note && (
                      <div className="text-gray-500 text-sm mt-2 italic font-normal">
                        {example.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Help Section - Fixed at bottom */}
          {fieldId && formData && isLesson1Complete(formData.lesson1) && (
            <div className="border-t border-gray-800 p-5 space-y-3 bg-brand-card">
              <h5 className="text-white text-sm font-medium">Still Stuck?</h5>
              <p className="text-gray-400 text-sm">
                Copy this prompt and paste it into ChatGPT or Claude. The AI will give you multiple examples to choose from based on your creator profile.
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-brand-orange text-white hover:opacity-90'
                }`}
              >
                {copied ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied to Clipboard!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy AI Prompt
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Show hint if Lesson 1 not complete - Fixed at bottom */}
          {fieldId && formData && !isLesson1Complete(formData.lesson1) && (
            <div className="border-t border-gray-800 p-5 bg-brand-card">
              <p className="text-gray-500 text-sm italic">
                Complete Lesson 1 to unlock AI help for this field
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      <span className="relative inline-flex items-center">
        {children}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ml-1.5 w-4 h-4 rounded-full bg-gray-700 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors"
          aria-label="More info"
        >
          ?
        </button>
      </span>

      {mounted && createPortal(drawer, document.body)}
    </>
  )
}
