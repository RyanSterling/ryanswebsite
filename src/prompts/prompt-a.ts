// Prompt A: The 100-Idea Generator
// This prompt turns the user's form data into 100 content ideas
// Model: Claude Sonnet 4 (claude-sonnet-4-20250514)

import { FlopProofFormData } from '../components/flop-proof/types'

export interface GeneratedIdea {
  id: number
  idea: string
  room_rationale: string
  awareness_level: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware'
  urgency: number // 1-5
  staying_power: number // 1-5
  scope: number // 1-5
  hook_will_tell: string
  hook_wont_tell: string
  hook_cant_tell: string
}

export interface PromptAResponse {
  ideas: GeneratedIdea[]
  meta: {
    total_generated: number
    awareness_distribution: {
      unaware: number
      problem_aware: number
      solution_aware: number
      product_aware: number
    }
  }
}

/**
 * Builds the system prompt for Prompt A
 */
export function buildSystemPrompt(): string {
  return `You are a content strategist who generates viral-worthy content ideas for creators. You understand that content fails not because of bad hooks or editing, but because creators pick topics that only appeal to their existing followers — a room too small for the algorithm to push.

Your job is to generate content ideas that reach STRANGERS, not just followers. Every idea must pass "the room size test" — would someone who has never heard of this creator still stop scrolling for this topic?

You will receive structured data about:
1. Who the creator is and what they teach
2. Who their audience is and what they deeply want (laddered desires)
3. What the audience thinks at three levels (what they say, what they hide, what they don't know)
4. What questions strangers ask at each awareness level
5. What's been posted to death in their niche (saturation data)

Your output must be valid JSON matching the specified schema.`
}

/**
 * Builds the user prompt with all form data
 */
export function buildUserPrompt(formData: FlopProofFormData): string {
  const { lesson1, lesson2, lesson3, lesson4, lesson5 } = formData

  // Market stage prescriptions
  const stagePrescriptions: Record<1 | 2 | 3 | 4 | 5, string> = {
    1: "You're first. Just say it clearly.",
    2: "Others have said it. Go bolder — say what they were afraid to.",
    3: "Everyone's made the claim. Show HOW it works, not just what.",
    4: "Everyone's explained it. Go where they didn't — the part they oversimplified.",
    5: "They've tuned out tips. Show what life looks like on the other side.",
  }

  return `Generate 100 content ideas for this creator. Each idea must reach strangers, not just existing followers.

## CREATOR PROFILE
- Niche: ${lesson1.niche}
- Core problem they solve: ${lesson1.core_problem}
- What they help people do: ${lesson1.what_you_do}
- What they know that most don't: ${lesson1.what_you_teach}

## TARGET AUDIENCE
${lesson2.audience_description}

## DESIRE LADDERS
These are what the audience REALLY wants. The bottom of each ladder is the surface desire; the top is the emotional core (the bigger room).

**Desire 1:**
- Surface: ${lesson2.desire_1.desire_text}
- Why: ${lesson2.desire_1.so_i_can_1}
- Deeper why: ${lesson2.desire_1.so_i_can_2}
- Emotional core: ${lesson2.desire_1.so_i_can_3}
- Urgency: ${lesson2.desire_1.urgency}/5 | Repeats: ${lesson2.desire_1.repeats}/5 | Scope: ${lesson2.desire_1.who_cares}

**Desire 2:**
- Surface: ${lesson2.desire_2.desire_text}
- Why: ${lesson2.desire_2.so_i_can_1}
- Deeper why: ${lesson2.desire_2.so_i_can_2}
- Emotional core: ${lesson2.desire_2.so_i_can_3}
- Urgency: ${lesson2.desire_2.urgency}/5 | Repeats: ${lesson2.desire_2.repeats}/5 | Scope: ${lesson2.desire_2.who_cares}

**Desire 3:**
- Surface: ${lesson2.desire_3.desire_text}
- Why: ${lesson2.desire_3.so_i_can_1}
- Deeper why: ${lesson2.desire_3.so_i_can_2}
- Emotional core: ${lesson2.desire_3.so_i_can_3}
- Urgency: ${lesson2.desire_3.urgency}/5 | Repeats: ${lesson2.desire_3.repeats}/5 | Scope: ${lesson2.desire_3.who_cares}

## THE THREE TELL LAYERS
Use these to craft hooks. Each idea needs three hook variations.

**What they openly say (will-tell):**
- ${lesson3.will_tell_1}
- ${lesson3.will_tell_2}
- ${lesson3.will_tell_3}

**What they think but won't admit (won't-tell):**
- ${lesson3.wont_tell_1}
- ${lesson3.wont_tell_2}
- ${lesson3.wont_tell_3}

**What they don't know about their own situation (can't-tell):**
- ${lesson3.cant_tell_1}
- ${lesson3.cant_tell_2}
- ${lesson3.cant_tell_3}

## AWARENESS LEVELS
What questions do strangers ask at each level? Use these to target content appropriately.

**Unaware (widest reach):** They don't even know they have this problem yet.
${lesson4.unaware_questions}

**Problem Aware (high reach):** They feel the problem but don't know solutions exist.
${lesson4.problem_aware_questions}

**Solution Aware (moderate reach):** They know solutions exist but are comparing options.
${lesson4.solution_aware_questions}

**Product Aware (narrow reach):** They know about this creator specifically.
${lesson4.product_aware_questions}

## SATURATION DATA — WHAT TO AVOID

**Dead topics (overdone, skip these):**
${lesson5.saturated_topics}

**Dead formats (people scroll past these hooks):**
${lesson5.saturated_formats}

**Competitor angles (what everyone else says):**
${lesson5.competitor_angles}

**Market Stage: ${lesson5.sophistication_stage}/5**
Prescription: ${stagePrescriptions[lesson5.sophistication_stage]}

---

## OUTPUT REQUIREMENTS

Generate exactly 100 content ideas. For each idea, provide:

1. **idea** — The content topic/angle (1-2 sentences max)
2. **room_rationale** — Why this reaches strangers, not just followers (1 sentence)
3. **awareness_level** — Which awareness level this targets: "unaware", "problem_aware", "solution_aware", or "product_aware"
4. **urgency** — How urgent is this for the audience (1-5)
5. **staying_power** — Does this stay relevant or is it one-and-done (1-5)
6. **scope** — How many people would stop scrolling for this (1-5)
7. **hook_will_tell** — A hook based on what they openly say
8. **hook_wont_tell** — A hook based on the secret they'd never admit
9. **hook_cant_tell** — A hook based on the insight they're missing

## DISTRIBUTION REQUIREMENTS
- At least 30% of ideas must target "unaware" audience
- At least 30% of ideas must target "problem_aware" audience
- No more than 25% of ideas should target "solution_aware"
- No more than 15% of ideas should target "product_aware"

## QUALITY REQUIREMENTS
- Every idea must pass the "stranger test" — would someone who has never heard of this creator stop scrolling?
- NO ideas that require knowing the creator first
- NO ideas that only appeal to existing followers
- NO ideas using the dead topics, dead formats, or competitor angles listed above
- Apply the market stage prescription to every idea's execution
- If you cannot generate 100 quality ideas, return fewer. Quality beats quantity.

## OUTPUT FORMAT
Return valid JSON matching this structure:
{
  "ideas": [
    {
      "id": 1,
      "idea": "...",
      "room_rationale": "...",
      "awareness_level": "unaware",
      "urgency": 4,
      "staying_power": 5,
      "scope": 4,
      "hook_will_tell": "...",
      "hook_wont_tell": "...",
      "hook_cant_tell": "..."
    }
  ],
  "meta": {
    "total_generated": 100,
    "awareness_distribution": {
      "unaware": 35,
      "problem_aware": 35,
      "solution_aware": 20,
      "product_aware": 10
    }
  }
}

Generate the ideas now.`
}

/**
 * Parses the API response and validates the output
 */
export function parseResponse(responseText: string): PromptAResponse {
  // Find JSON in the response (handle markdown code blocks)
  let jsonStr = responseText
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1]
  }

  const parsed = JSON.parse(jsonStr)

  // Validate structure
  if (!parsed.ideas || !Array.isArray(parsed.ideas)) {
    throw new Error('Invalid response: missing ideas array')
  }

  // Validate each idea has required fields
  for (const idea of parsed.ideas) {
    if (!idea.id || !idea.idea || !idea.room_rationale || !idea.awareness_level) {
      throw new Error(`Invalid idea object: ${JSON.stringify(idea)}`)
    }
  }

  return parsed as PromptAResponse
}
