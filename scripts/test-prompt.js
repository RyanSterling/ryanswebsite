// Simple test script - just run: node scripts/test-prompt.js YOUR_API_KEY

const apiKey = process.argv[2]

if (!apiKey) {
  console.log('')
  console.log('Usage: node scripts/test-prompt.js YOUR_API_KEY')
  console.log('')
  console.log('Example: node scripts/test-prompt.js sk-ant-api03-xxxxx')
  console.log('')
  process.exit(1)
}

// Test data: Football recruiting coach
const testData = {
  lesson1: {
    niche: 'College football recruiting',
    core_problem: "Parents don't know how the recruiting process works and their kids are getting overlooked",
    what_you_do: 'Help high school athletes get recruited to play college football',
    what_you_teach: "The recruiting timeline, how to build relationships with coaches, what coaches actually look for beyond highlight tapes",
  },
  lesson2: {
    audience_description: "Parents of high school football players (mostly dads, ages 40-55) who believe their son has college potential but feel lost navigating the recruiting process. They've been to showcases, made highlight videos, but haven't heard from coaches.",
    desire_1: {
      desire_text: 'Get my son recruited to play college football',
      so_i_can_1: 'See him keep playing the sport he loves past high school',
      so_i_can_2: 'Know the years of early mornings and travel ball meant something',
      so_i_can_3: "Not watch his dream die because we didn't know how the game works",
      urgency: 5, repeats: 4, who_cares: 'some_strangers_too',
    },
    desire_2: {
      desire_text: 'Understand what coaches actually want',
      so_i_can_1: 'Stop guessing and wasting time on the wrong things',
      so_i_can_2: 'Give my son the best chance instead of random shots in the dark',
      so_i_can_3: 'Feel like a good dad who did everything he could',
      urgency: 4, repeats: 5, who_cares: 'almost_everyone',
    },
    desire_3: {
      desire_text: 'Know if my son is actually good enough',
      so_i_can_1: 'Stop lying to myself or underselling him',
      so_i_can_2: 'Set realistic expectations instead of chasing false hope',
      so_i_can_3: 'Have an honest conversation about his future without crushing him',
      urgency: 5, repeats: 3, who_cares: 'almost_everyone',
    },
  },
  lesson3: {
    will_tell_1: 'My son just needs to get seen by more coaches',
    will_tell_2: 'The recruiting process is confusing and nobody explains it clearly',
    will_tell_3: "We've done showcases and camps but nothing is happening",
    wont_tell_1: "I'm terrified we've already missed the window and it's too late",
    wont_tell_2: "I don't actually know if my son is good enough and I'm scared to find out",
    wont_tell_3: 'I feel like a failure as a dad for not figuring this out earlier',
    cant_tell_1: "Coaches aren't evaluating your son's tape — they're evaluating whether he's coachable",
    cant_tell_2: 'The recruiting process is a relationship game, not a talent showcase',
    cant_tell_3: 'Most parents are doing the exact opposite of what works',
  },
  lesson4: {
    unaware_questions: 'How do I help my kid stand out in sports? Is it worth pushing my son in athletics?',
    problem_aware_questions: "How does college recruiting actually work? Why aren't coaches reaching out to my son?",
    solution_aware_questions: 'Are recruiting services worth it? What should be in a highlight video?',
    product_aware_questions: 'Does this recruiting system actually work? What results have other families gotten?',
  },
  lesson5: {
    saturated_topics: '"Email coaches early", "GPA matters", "Make a highlight video", "Go to camps"',
    saturated_formats: '"Day in the life of a recruit", "Things coaches won\'t tell you"',
    competitor_angles: '"Coaches want hustle", "Be proactive", "Your highlight tape is your resume"',
    sophistication_stage: 3,
  },
}

// Build the prompt
const stagePrescriptions = {
  1: "You're first. Just say it clearly.",
  2: "Others have said it. Go bolder — say what they were afraid to.",
  3: "Everyone's made the claim. Show HOW it works, not just what.",
  4: "Everyone's explained it. Go where they didn't — the part they oversimplified.",
  5: "They've tuned out tips. Show what life looks like on the other side.",
}

const systemPrompt = `You are a content strategist who generates viral-worthy content ideas for creators. You understand that content fails not because of bad hooks or editing, but because creators pick topics that only appeal to their existing followers.

Your job is to generate content ideas that reach STRANGERS, not just followers. Every idea must pass "the room size test" — would someone who has never heard of this creator still stop scrolling?

Return valid JSON only. No markdown, no explanation, just the JSON object.`

const { lesson1, lesson2, lesson3, lesson4, lesson5 } = testData

const userPrompt = `Generate 100 content ideas for this creator.

## CREATOR PROFILE
- Niche: ${lesson1.niche}
- Core problem: ${lesson1.core_problem}
- What they do: ${lesson1.what_you_do}
- What they teach: ${lesson1.what_you_teach}

## AUDIENCE
${lesson2.audience_description}

## DESIRE LADDERS

**Desire 1:** ${lesson2.desire_1.desire_text}
→ ${lesson2.desire_1.so_i_can_1}
→ ${lesson2.desire_1.so_i_can_2}
→ Emotional core: ${lesson2.desire_1.so_i_can_3}

**Desire 2:** ${lesson2.desire_2.desire_text}
→ ${lesson2.desire_2.so_i_can_1}
→ ${lesson2.desire_2.so_i_can_2}
→ Emotional core: ${lesson2.desire_2.so_i_can_3}

**Desire 3:** ${lesson2.desire_3.desire_text}
→ ${lesson2.desire_3.so_i_can_1}
→ ${lesson2.desire_3.so_i_can_2}
→ Emotional core: ${lesson2.desire_3.so_i_can_3}

## TELL LAYERS

**What they say openly:**
- ${lesson3.will_tell_1}
- ${lesson3.will_tell_2}
- ${lesson3.will_tell_3}

**What they think but won't admit:**
- ${lesson3.wont_tell_1}
- ${lesson3.wont_tell_2}
- ${lesson3.wont_tell_3}

**What they don't know:**
- ${lesson3.cant_tell_1}
- ${lesson3.cant_tell_2}
- ${lesson3.cant_tell_3}

## AWARENESS LEVELS

**Unaware:** ${lesson4.unaware_questions}
**Problem Aware:** ${lesson4.problem_aware_questions}
**Solution Aware:** ${lesson4.solution_aware_questions}
**Product Aware:** ${lesson4.product_aware_questions}

## WHAT TO AVOID

**Dead topics:** ${lesson5.saturated_topics}
**Dead formats:** ${lesson5.saturated_formats}
**Competitor angles:** ${lesson5.competitor_angles}

**Market Stage:** ${lesson5.sophistication_stage}/5
Prescription: ${stagePrescriptions[lesson5.sophistication_stage]}

## OUTPUT

Return JSON with this structure:
{
  "ideas": [
    {
      "id": 1,
      "idea": "The content idea",
      "room_rationale": "Why strangers would care",
      "awareness_level": "unaware|problem_aware|solution_aware|product_aware",
      "urgency": 1-5,
      "staying_power": 1-5,
      "scope": 1-5,
      "hook_will_tell": "Hook based on what they say",
      "hook_wont_tell": "Hook based on their secret thought",
      "hook_cant_tell": "Hook based on what they don't know"
    }
  ],
  "meta": {
    "total_generated": 100,
    "awareness_distribution": { "unaware": 30, "problem_aware": 35, "solution_aware": 25, "product_aware": 10 }
  }
}

Generate 100 ideas now. Return ONLY valid JSON.`

async function run() {
  console.log('')
  console.log('🎯 Testing Prompt A')
  console.log('   Model: claude-sonnet-4-20250514')
  console.log('   Niche:', testData.lesson1.niche)
  console.log('')
  console.log('⏳ Calling API... (this takes 30-60 seconds)')
  console.log('')

  const start = Date.now()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)

  if (!response.ok) {
    const err = await response.text()
    console.log('❌ Error:', response.status)
    console.log(err)
    process.exit(1)
  }

  const data = await response.json()
  console.log(`✅ Response in ${elapsed}s`)
  console.log(`   Tokens: ${data.usage?.input_tokens} in, ${data.usage?.output_tokens} out`)

  const text = data.content[0].text

  // Parse JSON
  let parsed
  try {
    // Handle potential markdown code blocks
    let jsonStr = text
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (match) jsonStr = match[1]
    parsed = JSON.parse(jsonStr)
  } catch (e) {
    console.log('❌ Failed to parse JSON')
    console.log('Raw response saved to: test-output-raw.txt')
    require('fs').writeFileSync('test-output-raw.txt', text)
    process.exit(1)
  }

  console.log('')
  console.log(`📊 Generated ${parsed.ideas?.length || 0} ideas`)

  if (parsed.meta?.awareness_distribution) {
    console.log('')
    console.log('Distribution:')
    console.log(`   Unaware: ${parsed.meta.awareness_distribution.unaware}`)
    console.log(`   Problem Aware: ${parsed.meta.awareness_distribution.problem_aware}`)
    console.log(`   Solution Aware: ${parsed.meta.awareness_distribution.solution_aware}`)
    console.log(`   Product Aware: ${parsed.meta.awareness_distribution.product_aware}`)
  }

  console.log('')
  console.log('📋 First 5 ideas:')
  console.log('')

  for (let i = 0; i < Math.min(5, parsed.ideas?.length || 0); i++) {
    const idea = parsed.ideas[i]
    console.log(`${i + 1}. ${idea.idea}`)
    console.log(`   [${idea.awareness_level}] ${idea.room_rationale}`)
    console.log(`   Hook: "${idea.hook_wont_tell}"`)
    console.log('')
  }

  // Save full output
  const filename = `test-output-${Date.now()}.json`
  require('fs').writeFileSync(filename, JSON.stringify(parsed, null, 2))
  console.log(`💾 Full output: ${filename}`)

  // Cost estimate
  const cost = ((data.usage?.input_tokens || 0) * 0.003 + (data.usage?.output_tokens || 0) * 0.015) / 1000
  console.log(`💰 Estimated cost: $${cost.toFixed(4)}`)
}

run().catch(console.error)
