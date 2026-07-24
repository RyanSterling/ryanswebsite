// API connection for Prompt A
// Uses Claude Sonnet 4 via Anthropic API

import { FlopProofFormData } from '../components/flop-proof/types'
import { buildSystemPrompt, buildUserPrompt, parseResponse, PromptAResponse } from './prompt-a'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 16000 // Enough for 100 ideas with full JSON structure

/**
 * Calls the Anthropic API to generate content ideas
 *
 * @param formData - The user's completed form data
 * @param apiKey - Anthropic API key (should come from environment variable)
 * @returns Promise<PromptAResponse> - The generated ideas
 */
export async function generateIdeas(
  formData: FlopProofFormData,
  apiKey: string
): Promise<PromptAResponse> {
  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(formData)

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${response.status} - ${error}`)
  }

  const data = await response.json()

  // Extract the text content from Claude's response
  const textContent = data.content.find((c: { type: string }) => c.type === 'text')
  if (!textContent) {
    throw new Error('No text content in response')
  }

  return parseResponse(textContent.text)
}

/**
 * Server-side function for calling from API route
 * This keeps the API key server-side
 */
export async function generateIdeasServerSide(
  formData: FlopProofFormData
): Promise<PromptAResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set')
  }
  return generateIdeas(formData, apiKey)
}
