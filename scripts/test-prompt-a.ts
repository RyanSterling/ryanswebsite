#!/usr/bin/env npx ts-node

/**
 * Test script for Prompt A
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... npx ts-node scripts/test-prompt-a.ts
 *
 * Or set the key in your environment first:
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   npx ts-node scripts/test-prompt-a.ts
 */

import { footballRecruitingCoach, mealPrepMom, lightroomPhotographer } from '../src/prompts/test-data'
import { buildSystemPrompt, buildUserPrompt, parseResponse, PromptAResponse } from '../src/prompts/prompt-a'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

async function testPromptA() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable not set')
    console.error('')
    console.error('Usage:')
    console.error('  ANTHROPIC_API_KEY=sk-ant-... npx ts-node scripts/test-prompt-a.ts')
    process.exit(1)
  }

  // Pick which test persona to use
  const persona = process.argv[2] || 'football'
  const testData = persona === 'mealprep' ? mealPrepMom
    : persona === 'lightroom' ? lightroomPhotographer
    : footballRecruitingCoach

  console.log(`\n🎯 Testing Prompt A with ${persona} persona`)
  console.log(`   Model: ${MODEL}`)
  console.log(`   Niche: ${testData.lesson1.niche}`)
  console.log('')

  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(testData)

  console.log('📝 System prompt length:', systemPrompt.length, 'chars')
  console.log('📝 User prompt length:', userPrompt.length, 'chars')
  console.log('')
  console.log('⏳ Calling Anthropic API...')
  console.log('')

  const startTime = Date.now()

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    })

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

    if (!response.ok) {
      const error = await response.text()
      console.error(`❌ API error: ${response.status}`)
      console.error(error)
      process.exit(1)
    }

    const data = await response.json()

    // Log usage stats
    console.log(`✅ Response received in ${elapsed}s`)
    console.log(`   Input tokens: ${data.usage?.input_tokens || 'unknown'}`)
    console.log(`   Output tokens: ${data.usage?.output_tokens || 'unknown'}`)
    console.log('')

    // Extract and parse the response
    const textContent = data.content.find((c: { type: string }) => c.type === 'text')
    if (!textContent) {
      console.error('❌ No text content in response')
      process.exit(1)
    }

    const parsed = parseResponse(textContent.text)

    console.log(`📊 Generated ${parsed.ideas.length} ideas`)
    console.log('')
    console.log('Awareness distribution:')
    console.log(`   Unaware: ${parsed.meta.awareness_distribution.unaware}`)
    console.log(`   Problem Aware: ${parsed.meta.awareness_distribution.problem_aware}`)
    console.log(`   Solution Aware: ${parsed.meta.awareness_distribution.solution_aware}`)
    console.log(`   Product Aware: ${parsed.meta.awareness_distribution.product_aware}`)
    console.log('')

    // Show first 5 ideas as preview
    console.log('📋 First 5 ideas:')
    console.log('')
    for (let i = 0; i < Math.min(5, parsed.ideas.length); i++) {
      const idea = parsed.ideas[i]
      console.log(`${i + 1}. ${idea.idea}`)
      console.log(`   [${idea.awareness_level}] ${idea.room_rationale}`)
      console.log(`   Hook (won't-tell): "${idea.hook_wont_tell}"`)
      console.log('')
    }

    // Save full output to file
    const outputPath = `test-output-${persona}-${Date.now()}.json`
    const fs = require('fs')
    fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2))
    console.log(`💾 Full output saved to: ${outputPath}`)

    // Calculate estimated cost
    const inputCost = (data.usage?.input_tokens || 0) * 0.003 / 1000
    const outputCost = (data.usage?.output_tokens || 0) * 0.015 / 1000
    const totalCost = inputCost + outputCost
    console.log('')
    console.log(`💰 Estimated cost: $${totalCost.toFixed(4)}`)
    console.log(`   (Input: $${inputCost.toFixed(4)}, Output: $${outputCost.toFixed(4)})`)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

testPromptA()
