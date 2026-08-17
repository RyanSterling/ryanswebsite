import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  OPENAI_API_KEY: string
  ANTHROPIC_API_KEY: string
  ASSEMBLYAI_API_KEY: string
  APIFY_PROFILE_URL: string
  APIFY_REEL_URL: string
  N8N_EMAIL_WEBHOOK: string
  RESULTS_KV: KVNamespace
  // Stripe + Supabase for courses
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  // ConvertKit for email sequences
  CONVERTKIT_API_SECRET: string
  CONVERTKIT_COURSE_TAG_ID: string
}

// Stored result includes everything needed to display the results page
interface StoredResult {
  id: string
  email: string
  handle: string
  createdAt: string
  analysis: AssessmentResult
  profile: InstagramProfile
  reels: InstagramReel[]
}

// Generate a short unique ID
function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

interface AssessmentRequest {
  email: string
  handle: string
  problemTheySolve: string
  postingFrequency: string
  avgReelLength: string
  avgViews: string
  outliersLast90Days: string
  selfDiagnosis: string
}

interface InstagramProfile {
  username: string
  fullName: string
  biography: string
  followersCount: number
  postsCount: number
  profilePicUrl: string
  isVerified: boolean
}

interface InstagramReel {
  videoUrl: string
  thumbnailUrl: string
  viewCount: number
  commentsCount: number
  duration: number
  caption: string
  shortCode: string
  timestamp: string
}

// New analysis structure
interface MarketContext {
  niche: string
  market_desires: string[]
}

interface BioEvaluation {
  verdict: 'Clear' | 'Needs Work' | 'Unclear'
  states_problem_clearly: boolean
  speaks_to_desires: boolean
  clear_in_5_seconds: boolean
  explanation: string
  suggested_rewrite: string | null
}

interface ContentAnalysis {
  reel_number: number
  view_count: number
  idea_quality: 'strong' | 'weak' | 'misaligned'
  idea_explanation: string
  idea_repositioning: string | null
  hook_first_words: string
  hook_creates_curiosity: boolean
  hook_issue: string | null
  hook_rewrites: string[]
}

interface AssessmentResult {
  market_context: MarketContext
  bio_evaluation: BioEvaluation
  content_analysis: ContentAnalysis[]
  primary_bottleneck: 'HOOKS' | 'NICHE' | 'IDEAS' | 'BIO'
  bottleneck_explanation: string
  action_steps: string[]
}

interface AssessmentResponse {
  resultId: string
  analysis: AssessmentResult
  profile: InstagramProfile
  reels: InstagramReel[]
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for frontend
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://ryansterling.com', 'https://www.ryansterling.com', 'https://ryansterlingconsulting.com'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

// Health check
app.get('/', (c) => c.json({ status: 'ok' }))

// Get saved assessment result by ID
app.get('/results/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const stored = await c.env.RESULTS_KV.get(id, 'json') as StoredResult | null

    if (!stored) {
      return c.json({ error: 'Result not found' }, 404)
    }

    // Return the same format as the original response (minus email for privacy)
    return c.json({
      resultId: stored.id,
      analysis: stored.analysis,
      profile: stored.profile,
      reels: stored.reels,
    })
  } catch (error) {
    console.error('Error fetching result:', error)
    return c.json({ error: 'Failed to fetch result' }, 500)
  }
})

// Image proxy to bypass Instagram CORS
app.get('/proxy-image', async (c) => {
  const url = c.req.query('url')
  if (!url) {
    return c.text('Missing url parameter', 400)
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      return c.text('Failed to fetch image', 500)
    }

    const contentType = response.headers.get('Content-Type') || 'image/jpeg'
    const imageData = await response.arrayBuffer()

    return new Response(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return c.text('Failed to fetch image', 500)
  }
})

// Main assessment endpoint
app.post('/assess', async (c) => {
  const data = await c.req.json<AssessmentRequest>()

  try {
    // Step 1: Scrape Instagram profile and reels in parallel
    console.log('Scraping Instagram for:', data.handle)
    const [profile, reels] = await Promise.all([
      scrapeProfile(data.handle, c.env.APIFY_PROFILE_URL),
      scrapeReels(data.handle, c.env.APIFY_REEL_URL),
    ])

    console.log('Got profile and', reels.length, 'reels')

    // Step 2: Filter to mature reels (12+ hours old) to ensure reliable view counts
    const TWELVE_HOURS = 12 * 60 * 60 * 1000
    const now = new Date()

    const matureReels = reels.filter(reel => {
      const reelAge = now.getTime() - new Date(reel.timestamp).getTime()
      return reelAge >= TWELVE_HOURS
    })

    // Get candidate reels: mature ones first, or oldest if none mature
    let candidateReels: typeof reels
    if (matureReels.length > 0) {
      candidateReels = matureReels
    } else {
      candidateReels = [...reels]
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }

    console.log('Have', candidateReels.length, 'candidate reels to try')

    // Step 3: Transcribe reels one at a time until we have 3 valid ones
    console.log('Transcribing reels with AssemblyAI (sequential, stop at 3 valid)')
    const TARGET_VALID_REELS = 3
    const MIN_TRANSCRIPT_LENGTH = 50
    const validPairs: { reel: typeof candidateReels[0]; transcript: string }[] = []

    for (let i = 0; i < candidateReels.length && validPairs.length < TARGET_VALID_REELS; i++) {
      const reel = candidateReels[i]

      try {
        if (!reel.videoUrl) {
          console.log('Skipping reel with no video URL')
          continue
        }

        console.log(`Transcribing candidate ${i + 1}/${candidateReels.length}, have ${validPairs.length} valid so far`)

        // Submit transcription request
        const submitResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
          method: 'POST',
          headers: {
            'Authorization': c.env.ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio_url: reel.videoUrl }),
        })

        if (!submitResponse.ok) {
          console.error('AssemblyAI submit error:', submitResponse.status)
          continue
        }

        const submitData = await submitResponse.json() as { id: string }

        // Poll for completion
        const maxAttempts = 30
        let transcript = ''
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          await new Promise(resolve => setTimeout(resolve, 2000))

          const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${submitData.id}`, {
            headers: { 'Authorization': c.env.ASSEMBLYAI_API_KEY },
          })

          const pollData = await pollResponse.json() as { status: string; text?: string; error?: string }

          if (pollData.status === 'completed') {
            transcript = pollData.text || ''
            break
          } else if (pollData.status === 'error') {
            break
          }
        }

        // Validate transcript immediately
        const trimmed = transcript.trim()
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) continue
        if (trimmed === '') continue
        if (trimmed.length < MIN_TRANSCRIPT_LENGTH) continue

        validPairs.push({ reel, transcript: trimmed })
        console.log(`Now have ${validPairs.length}/${TARGET_VALID_REELS} valid reels`)

      } catch (error) {
        console.error('Transcription error:', error)
        continue
      }
    }

    const validReels = validPairs.map(p => p.reel)
    const validTranscripts = validPairs.map(p => p.transcript)

    if (validReels.length === 0) {
      return c.json({
        error: 'We couldn\'t transcribe any of your reels. Please make sure your videos have audible speech and try again.'
      }, 400)
    }

    // Step 4: Analyze with Claude
    console.log('Analyzing with Claude')
    const result = await analyzeWithClaude({
      profile,
      reels: validReels,
      transcripts: validTranscripts,
      userInput: data,
    }, c.env.ANTHROPIC_API_KEY)

    // Step 5: Generate unique ID and save to KV
    const resultId = generateId()
    const storedResult: StoredResult = {
      id: resultId,
      email: data.email,
      handle: data.handle,
      createdAt: new Date().toISOString(),
      analysis: result,
      profile: profile,
      reels: validReels,
    }

    // Store for 90 days (in seconds)
    await c.env.RESULTS_KV.put(resultId, JSON.stringify(storedResult), {
      expirationTtl: 90 * 24 * 60 * 60,
    })

    console.log('Saved result with ID:', resultId)

    // Step 6: Send to N8N for email (fire and forget) - include results URL
    const resultsUrl = `https://ryansterlingconsulting.com/results/${resultId}`
    sendToN8N({
      email: data.email,
      handle: data.handle,
      resultsUrl: resultsUrl,
      result,
      userResponses: {
        problemTheySolve: data.problemTheySolve,
        postingFrequency: data.postingFrequency,
        avgReelLength: data.avgReelLength,
        avgViews: data.avgViews,
        outliersLast90Days: data.outliersLast90Days,
        selfDiagnosis: data.selfDiagnosis,
      },
    }, c.env.N8N_EMAIL_WEBHOOK).catch(console.error)

    // Step 7: Return result to frontend with profile and reel data
    const response: AssessmentResponse = {
      resultId: resultId,
      analysis: result,
      profile: profile,
      reels: validReels,
    }
    return c.json(response)

  } catch (error) {
    console.error('Assessment error:', error)
    return c.json({
      error: error instanceof Error ? error.message : 'Assessment failed'
    }, 500)
  }
})

// ============================================
// SSE Streaming Assessment Endpoint
// ============================================

app.post('/assess-stream', async (c) => {
  const data = await c.req.json<AssessmentRequest>()

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: {
        type: string
        step?: string
        reelNumber?: number
        reelsTotal?: number
        profile?: InstagramProfile
        data?: AssessmentResponse
        message?: string
      }) => {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      try {
        // Step 1: Start both scrapers but don't wait for both
        console.log('Scraping Instagram for:', data.handle)
        sendEvent({ type: 'progress', step: 'scraping_profile' })

        // Start both requests in parallel
        const profilePromise = scrapeProfile(data.handle, c.env.APIFY_PROFILE_URL)
        const reelsPromise = scrapeReels(data.handle, c.env.APIFY_REEL_URL)

        // Wait for profile first and show it immediately
        const profile = await profilePromise
        console.log('Got profile for:', profile.username)
        sendEvent({ type: 'profile', profile })

        // Step 2: Wait for reels
        sendEvent({ type: 'progress', step: 'scraping_reels' })
        const reels = await reelsPromise
        console.log('Got', reels.length, 'reels')

        // Step 2: Filter to mature reels (12+ hours old) to ensure reliable view counts
        const TWELVE_HOURS = 12 * 60 * 60 * 1000
        const now = new Date()

        const matureReels = reels.filter(reel => {
          const reelAge = now.getTime() - new Date(reel.timestamp).getTime()
          return reelAge >= TWELVE_HOURS
        })

        // Get candidate reels: mature ones first, or oldest if none mature
        let candidateReels: typeof reels
        if (matureReels.length > 0) {
          candidateReels = matureReels
        } else {
          candidateReels = [...reels]
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        }

        console.log('Have', candidateReels.length, 'candidate reels to try')

        // Step 3: Transcribe reels one at a time until we have 3 valid ones
        // This avoids wasting transcription costs on music-only reels
        console.log('Transcribing reels with AssemblyAI (sequential, stop at 3 valid)')
        const TARGET_VALID_REELS = 3
        const MIN_TRANSCRIPT_LENGTH = 50
        const validPairs: { reel: typeof candidateReels[0]; transcript: string }[] = []

        for (let i = 0; i < candidateReels.length && validPairs.length < TARGET_VALID_REELS; i++) {
          const reel = candidateReels[i]
          sendEvent({
            type: 'progress',
            step: 'transcribing',
            reelNumber: validPairs.length + 1,
            reelsTotal: TARGET_VALID_REELS
          })

          try {
            if (!reel.videoUrl) {
              console.log('Skipping reel with no video URL')
              continue
            }

            console.log(`Transcribing candidate ${i + 1}/${candidateReels.length}, have ${validPairs.length} valid so far`)
            console.log('Submitting to AssemblyAI:', reel.videoUrl?.substring(0, 100))

            // Submit transcription request
            const submitResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
              method: 'POST',
              headers: {
                'Authorization': c.env.ASSEMBLYAI_API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ audio_url: reel.videoUrl }),
            })

            if (!submitResponse.ok) {
              const errorText = await submitResponse.text()
              console.error('AssemblyAI submit error:', submitResponse.status, errorText)
              continue // Try next reel
            }

            const submitData = await submitResponse.json() as { id: string }
            console.log('AssemblyAI job submitted:', submitData.id)

            // Poll for completion (max 60 seconds)
            const maxAttempts = 30
            let transcript = ''
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
              await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds between polls

              const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${submitData.id}`, {
                headers: { 'Authorization': c.env.ASSEMBLYAI_API_KEY },
              })

              const pollData = await pollResponse.json() as { status: string; text?: string; error?: string }
              console.log('AssemblyAI poll attempt', attempt + 1, 'status:', pollData.status)

              if (pollData.status === 'completed') {
                transcript = pollData.text || ''
                break
              } else if (pollData.status === 'error') {
                console.error('AssemblyAI error:', pollData.error)
                break
              }
              // Continue polling if 'queued' or 'processing'
            }

            // Validate transcript immediately
            const trimmed = transcript.trim()

            // Skip bracketed error messages
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
              console.log('Invalid transcript (error):', trimmed)
              continue
            }
            // Skip empty
            if (trimmed === '') {
              console.log('Invalid transcript (empty)')
              continue
            }
            // Skip too short - likely music/noise, not real dialogue
            if (trimmed.length < MIN_TRANSCRIPT_LENGTH) {
              console.log('Invalid transcript (too short):', trimmed.length, 'chars:', trimmed.substring(0, 30))
              continue
            }

            // Valid! Add to our collection
            console.log('Valid transcript, length:', trimmed.length, 'preview:', trimmed.substring(0, 100))
            validPairs.push({ reel, transcript: trimmed })
            console.log(`Now have ${validPairs.length}/${TARGET_VALID_REELS} valid reels`)

          } catch (error) {
            console.error('Transcription error for reel:', error)
            continue // Try next reel
          }
        }

        const validReels = validPairs.map(p => p.reel)
        const validTranscripts = validPairs.map(p => p.transcript)

        console.log('Final valid reels count:', validReels.length)

        if (validReels.length === 0) {
          sendEvent({
            type: 'error',
            message: 'We couldn\'t transcribe any of your reels. Please make sure your videos have audible speech and try again.'
          })
          controller.close()
          return
        }

        // Step 4: Analyze with Claude
        console.log('Analyzing with Claude')
        sendEvent({ type: 'progress', step: 'analyzing' })

        const result = await analyzeWithClaude({
          profile,
          reels: validReels,
          transcripts: validTranscripts,
          userInput: data,
        }, c.env.ANTHROPIC_API_KEY)

        // Step 5: Generate unique ID and save to KV
        const resultId = generateId()
        const storedResult: StoredResult = {
          id: resultId,
          email: data.email,
          handle: data.handle,
          createdAt: new Date().toISOString(),
          analysis: result,
          profile: profile,
          reels: validReels,
        }

        await c.env.RESULTS_KV.put(resultId, JSON.stringify(storedResult), {
          expirationTtl: 90 * 24 * 60 * 60,
        })

        console.log('Saved result with ID:', resultId)

        // Step 6: Send to N8N for email
        const resultsUrl = `https://ryansterlingconsulting.com/results/${resultId}`
        try {
          await sendToN8N({
            email: data.email,
            handle: data.handle,
            resultsUrl: resultsUrl,
            result,
            userResponses: {
              problemTheySolve: data.problemTheySolve,
              postingFrequency: data.postingFrequency,
              avgReelLength: data.avgReelLength,
              avgViews: data.avgViews,
              outliersLast90Days: data.outliersLast90Days,
              selfDiagnosis: data.selfDiagnosis,
            },
          }, c.env.N8N_EMAIL_WEBHOOK)
        } catch (e) {
          console.error('N8N webhook failed:', e)
        }

        // Step 7: Send complete event with result
        const response: AssessmentResponse = {
          resultId: resultId,
          analysis: result,
          profile: profile,
          reels: validReels,
        }

        sendEvent({ type: 'complete', data: response })
        controller.close()

      } catch (error) {
        console.error('Assessment error:', error)
        sendEvent({
          type: 'error',
          message: error instanceof Error ? error.message : 'Assessment failed'
        })
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
})

// ============================================
// Instagram Profile Scraping (Apify)
// ============================================

async function scrapeProfile(handle: string, apifyUrl: string): Promise<InstagramProfile> {
  const response = await fetch(apifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usernames: [handle],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Apify profile error:', error)
    throw new Error('Failed to scrape Instagram profile')
  }

  const results = await response.json() as Array<{
    username?: string
    fullName?: string
    biography?: string
    followersCount?: number
    postsCount?: number
    profilePicUrl?: string
    profilePicUrlHD?: string
    isVerified?: boolean
  }>

  if (results.length === 0) {
    throw new Error('Instagram profile not found or rate limited')
  }

  const profileData = results[0]
  return {
    username: profileData.username || handle,
    fullName: profileData.fullName || '',
    biography: profileData.biography || '',
    followersCount: profileData.followersCount || 0,
    postsCount: profileData.postsCount || 0,
    profilePicUrl: profileData.profilePicUrlHD || profileData.profilePicUrl || '',
    isVerified: profileData.isVerified || false,
  }
}

// ============================================
// Instagram Reel Scraping (Apify)
// ============================================

async function scrapeReels(handle: string, apifyUrl: string): Promise<InstagramReel[]> {
  const response = await fetch(apifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: [handle],
      resultsLimit: 6,
      skipPinnedPosts: true,
      // No includeTranscript - we'll use Whisper instead (cheaper)
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Apify reel error:', error)
    throw new Error('Failed to scrape Instagram reels')
  }

  const results = await response.json() as Array<{
    videoUrl?: string
    displayUrl?: string
    thumbnailUrl?: string
    viewCount?: number
    playCount?: number
    videoPlayCount?: number
    videoViewCount?: number
    views?: number
    plays?: number
    likesCount?: number
    commentsCount?: number
    videoDuration?: number
    duration?: number
    caption?: string
    shortCode?: string
    id?: string
    url?: string
    timestamp?: string
  }>

  if (results.length === 0) {
    throw new Error('No reels found. Make sure the account has public reels.')
  }

  // Get 6 reels to have buffer after maturity + dialogue filters
  return results.slice(0, 6).map(r => {
    // Extract shortCode from URL if not provided directly
    let shortCode = r.shortCode || r.id || ''
    if (!shortCode && r.url) {
      const match = r.url.match(/\/(p|reel)\/([^\/]+)/)
      if (match) shortCode = match[2]
    }

    // videoPlayCount is what Instagram Reel Scraper uses for view count
    const viewCount = r.videoPlayCount || r.viewCount || r.playCount || r.videoViewCount || r.likesCount || 0

    return {
      videoUrl: r.videoUrl || '',
      thumbnailUrl: r.displayUrl || r.thumbnailUrl || '',
      viewCount: viewCount,
      commentsCount: r.commentsCount || 0,
      duration: r.videoDuration || r.duration || 0,
      caption: r.caption || '',
      shortCode: shortCode,
      timestamp: r.timestamp || new Date().toISOString(),
    }
  })
}

// ============================================
// Whisper Transcription (OpenAI)
// ============================================

async function transcribeReels(reels: InstagramReel[], apiKey: string): Promise<string[]> {
  const transcripts: string[] = []

  for (let i = 0; i < reels.length; i++) {
    const reel = reels[i]
    console.log(`Transcribing reel ${i + 1}/${reels.length}`)

    try {
      if (!reel.videoUrl) {
        console.log('No video URL for reel')
        transcripts.push('[No video URL]')
        continue
      }

      console.log('Downloading video from:', reel.videoUrl.substring(0, 100) + '...')

      // Download the video
      const videoResponse = await fetch(reel.videoUrl)

      if (!videoResponse.ok) {
        console.error('Video download failed:', videoResponse.status, videoResponse.statusText)
        transcripts.push('[Video download failed]')
        continue
      }

      const videoBlob = await videoResponse.blob()
      console.log('Video downloaded, size:', videoBlob.size, 'bytes, type:', videoBlob.type)

      if (videoBlob.size === 0) {
        console.error('Video blob is empty')
        transcripts.push('[Video download empty]')
        continue
      }

      // Send to Whisper API
      const formData = new FormData()
      formData.append('file', videoBlob, 'video.mp4')
      formData.append('model', 'whisper-1')
      formData.append('response_format', 'text')

      console.log('Sending to Whisper API...')
      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      })

      console.log('Whisper response status:', whisperResponse.status)

      if (!whisperResponse.ok) {
        const errorText = await whisperResponse.text()
        console.error('Whisper error:', whisperResponse.status, errorText)
        transcripts.push('[Transcription failed]')
        continue
      }

      const transcript = await whisperResponse.text()
      console.log('Transcript received, length:', transcript.length)
      transcripts.push(transcript)

    } catch (error) {
      console.error('Transcription error for reel:', error)
      transcripts.push('[Transcription failed]')
    }
  }

  console.log('All transcripts:', transcripts.map(t => t.substring(0, 50) + '...'))
  return transcripts
}

// ============================================
// Claude Analysis
// ============================================

async function analyzeWithClaude(data: {
  profile: InstagramProfile
  reels: InstagramReel[]
  transcripts: string[]
  userInput: AssessmentRequest
}, apiKey: string): Promise<AssessmentResult> {

  const prompt = `You are an expert Instagram growth coach. Analyze this creator's account and identify what's holding them back.

Write like a direct coach giving honest feedback. Be specific—reference their actual bio text, hook words, and topics. Avoid corporate language ("leverage", "optimize", "synergy") and empty validation ("Great job on X!"). Just tell them what's working, what isn't, and what to do about it.

IMPORTANT GUIDELINES:
- ADDRESS THE CREATOR DIRECTLY using "you" and "your" — never "she/he/they" or "the creator". You're talking TO them, not about them.
- Never tell them to delete content. Focus on what to do differently in FUTURE content.
- Use intellectually honest language. Say "this likely performed better because..." not "this performed better because..." — you're forming hypotheses based on limited data, not stating facts.
- When writing hook rewrites, MATCH THEIR VOICE. Analyze how they speak in the transcripts (casual vs formal, direct vs storytelling, first-person vs second-person) and write hooks that sound like them, not like a copywriter.

## STEP 1: UNDERSTAND THEIR MARKET (do this first)
Before giving ANY feedback, determine:
- What niche are they in? (based on bio + transcript themes)
- What does their market ACTUALLY desire? (specific pains, goals, transformations people in this niche search for)

## ACCOUNT DATA
- Username: @${data.profile.username}
- Followers: ${data.profile.followersCount.toLocaleString()}
- Total posts: ${data.profile.postsCount}
- Bio: "${data.profile.biography}"

## SELF-REPORTED DATA
- Problem they solve: ${data.userInput.problemTheySolve}
- Posting frequency: ${data.userInput.postingFrequency}
- Average views: ${data.userInput.avgViews}
- Outliers in last 90 days: ${data.userInput.outliersLast90Days}
- What they think is wrong: ${data.userInput.selfDiagnosis}

## PERFORMANCE CONTEXT
Use their self-reported average views (${data.userInput.avgViews}) to evaluate each reel:
- Above average = something worked (hook, topic, or both)
- Below average = something didn't land
- All reels similar = no clear winner, look for common weaknesses across all three

## LAST ${data.reels.length} REELS
${data.reels.map((reel, i) => `Reel ${i + 1}: ${reel.viewCount.toLocaleString()} views | ${reel.commentsCount} comments | ${reel.duration}s | Caption: "${reel.caption.slice(0, 150)}${reel.caption.length > 150 ? '...' : ''}"`).join('\n')}

## TRANSCRIPTS
${data.transcripts.map((t, i) => `Reel ${i + 1}: "${t}"`).join('\n\n')}

---

## YOUR ANALYSIS

### 1. MARKET CONTEXT
- Niche: (1 clear sentence based on bio + transcript themes)
- Market desires: (3-5 specific things their target audience wants - be specific, not generic like "success" or "growth")

### 2. BIO EVALUATION
Evaluate against these criteria:
- Does it clearly state the PROBLEM they solve? (not just what they do)
- Does it speak to real DESIRES or is it fluffy/ambiguous language?
- Can someone understand how they help in 5 seconds?

Verdict: Clear / Needs Work / Unclear
Explanation: (2-3 sentences, be specific about what's wrong or right. Quote their actual bio text.)
Suggested rewrite: If verdict is not "Clear", provide a rewritten bio that fixes the issues while maintaining their voice and positioning.

### 3. CONTENT ANALYSIS (per reel)
For each reel, analyze:

**Idea Quality**: Is this a topic their audience actively wants to learn about or relates to?
- If strong: Explain why it likely resonated (connects to a real desire or pain point)
- If weak: The topic itself doesn't connect to something they actively care about
- Note: Topic variety is fine if each piece still serves the same audience. The algorithm matches content to interested viewers on a piece-by-piece basis. Only mark "misaligned" if the topic is completely outside their world (e.g., a fitness coach posting about cryptocurrency).

**Hook Analysis**:
- Extract the hook: typically the first sentence. If the first sentence doesn't stand alone or make sense without context, include the second sentence.
- Did it create a curiosity gap that makes someone NEED to keep watching? (Yes/No)
- If No: What specifically went wrong (too generic? no stakes? no pattern interrupt?)
- Provide 3 alternative hooks that MATCH THEIR VOICE from the transcripts. Don't write generic copywriter hooks—write hooks that sound like them.

Compare view counts to their stated average (${data.userInput.avgViews}). If one reel dramatically outperformed, that's signal. If all reels are similar, identify the common weakness.

### 4. PRIMARY BOTTLENECK
Pick ONE: HOOKS | NICHE | IDEAS | BIO
- HOOKS = The topics are good but the first 3-5 seconds don't create curiosity
- NICHE = Content is COMPLETELY unrelated to their stated niche (e.g., a fitness coach posting about cryptocurrency). Note: The algorithm is interest-based and matches individual pieces well, so varied topics within the same general world (e.g., mom life + money + planning) are fine. Only flag NICHE if content is truly random.
- IDEAS = The topics aren't things their audience actively searches for or cares about
- BIO = Bio is unclear, fluffy, or doesn't speak to real desires

Explain in 2-3 sentences why this is likely their #1 issue. Reference their specific content.

### 5. ACTION STEPS
3 specific actions they can take THIS WEEK. Reference their actual content and situation - no generic advice.

---

## OUTPUT FORMAT (JSON only, no markdown):
{
  "market_context": {
    "niche": "One clear sentence describing their niche",
    "market_desires": ["specific desire 1", "specific desire 2", "specific desire 3"]
  },
  "bio_evaluation": {
    "verdict": "Clear" | "Needs Work" | "Unclear",
    "states_problem_clearly": true | false,
    "speaks_to_desires": true | false,
    "clear_in_5_seconds": true | false,
    "explanation": "2-3 sentences with specific feedback, quoting their bio",
    "suggested_rewrite": "A rewritten bio that fixes the issues (null if verdict is Clear)"
  },
  "content_analysis": [
    {
      "reel_number": 1,
      "view_count": 12300,
      "idea_quality": "strong" | "weak" | "misaligned",
      "idea_explanation": "Why this topic likely did or didn't resonate with their market",
      "idea_repositioning": "How to reframe this same idea to hit market desires (null if idea was strong)",
      "hook_first_words": "The hook - first sentence, or first 2 sentences if needed for context",
      "hook_creates_curiosity": true | false,
      "hook_issue": "What specifically went wrong with the hook (null if hook was good)",
      "hook_rewrites": ["voice-matched alternative 1", "voice-matched alternative 2", "voice-matched alternative 3"]
    }
  ],
  "primary_bottleneck": "HOOKS" | "NICHE" | "IDEAS" | "BIO",
  "bottleneck_explanation": "2-3 sentences explaining why this is likely their #1 issue",
  "action_steps": ["specific action 1", "specific action 2", "specific action 3"]
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Claude API error:', error)
    throw new Error('Claude analysis failed')
  }

  const result = await response.json() as {
    content: Array<{ type: string; text: string }>
  }

  const text = result.content[0].text

  // Clean up common JSON issues from Claude's output
  const cleanJson = (json: string): string => {
    return json
      // Remove trailing commas before } or ]
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      // Fix unescaped newlines in strings (replace with \n)
      .replace(/(?<=":.*)"([^"]*)\n([^"]*)"/g, '"$1\\n$2"')
  }

  // Parse JSON from response
  try {
    return JSON.parse(text) as AssessmentResult
  } catch (firstError) {
    // Try to extract JSON if wrapped in markdown code blocks or other text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as AssessmentResult
      } catch {
        // Try with cleanup
        try {
          return JSON.parse(cleanJson(jsonMatch[0])) as AssessmentResult
        } catch (cleanError) {
          console.error('Raw Claude response:', text)
          console.error('JSON parse error:', cleanError)
          throw new Error('Failed to parse Claude response - invalid JSON format')
        }
      }
    }
    console.error('Raw Claude response:', text)
    throw new Error('Failed to parse Claude response')
  }
}

// ============================================
// N8N Email Notification
// ============================================

async function sendToN8N(payload: {
  email: string
  handle: string
  resultsUrl: string
  result: AssessmentResult
  userResponses: {
    problemTheySolve: string
    postingFrequency: string
    avgReelLength: string
    avgViews: string
    outliersLast90Days: string
    selfDiagnosis: string
  }
}, webhookUrl: string): Promise<void> {
  console.log('Sending to N8N webhook:', webhookUrl)
  console.log('Payload email:', payload.email, 'handle:', payload.handle)

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  console.log('N8N webhook response status:', response.status)
  if (!response.ok) {
    const text = await response.text()
    console.error('N8N webhook error:', text)
  }
}

// ============================================
// BREAKTHROUGH CONTENT STRATEGY GENERATOR
// ============================================

interface BreakthroughFormData {
  lesson1: {
    niche: string
    core_problem: string
    what_you_do: string
    what_you_teach: string
  }
  lesson2: {
    audience_description: string
    desire_1: { desire_text: string; so_i_can_1: string; so_i_can_2: string; so_i_can_3: string; urgency: number; repeats: number; who_cares: string }
    desire_2: { desire_text: string; so_i_can_1: string; so_i_can_2: string; so_i_can_3: string; urgency: number; repeats: number; who_cares: string }
    desire_3: { desire_text: string; so_i_can_1: string; so_i_can_2: string; so_i_can_3: string; urgency: number; repeats: number; who_cares: string }
  }
  lesson3: {
    will_tell_1: string; will_tell_2: string; will_tell_3: string
    wont_tell_1: string; wont_tell_2: string; wont_tell_3: string
    cant_tell_1: string; cant_tell_2: string; cant_tell_3: string
  }
  lesson4: {
    unaware_questions: string
    problem_aware_questions: string
    solution_aware_questions: string
    product_aware_questions: string
  }
  lesson5: {
    saturated_topics: string
    saturated_formats: string
    competitor_angles: string
    sophistication_stage: 1 | 2 | 3 | 4 | 5
  }
}

// Generated idea structure
interface GeneratedIdea {
  id: number
  idea: string
  room_rationale: string
  awareness_level: string
  urgency: number
  staying_power: number
  scope: number
  hook_fortune_teller: string
  hook_experimenter: string
  hook_teacher: string
  hook_investigator: string
  hook_contrarian: string
}

// Job state for background generation (stored in KV)
interface BreakthroughJobState {
  jobId: string
  status: 'in_progress' | 'partial_complete' | 'complete'
  totalBatches: number
  completedBatches: number
  batches: Array<{
    batch: number
    ideas: GeneratedIdea[]
    completedAt: string
  }>
  formData: BreakthroughFormData
  startedAt: string
  completedAt: string | null
  error: { batch: number; message: string } | null
}

app.post('/generate-ideas', async (c) => {
  const formData = await c.req.json<BreakthroughFormData>()

  const stagePrescriptions: Record<number, string> = {
    1: "You're first. Just say it clearly.",
    2: "Others have said it. Go bolder — say what they were afraid to.",
    3: "Everyone's made the claim. Show HOW it works, not just what.",
    4: "Everyone's explained it. Go where they didn't — the part they oversimplified.",
    5: "They've tuned out tips. Show what life looks like on the other side.",
  }

  const { lesson1, lesson2, lesson3, lesson4, lesson5 } = formData

  const systemPrompt = `You are a content strategist who generates viral-worthy content ideas for creators. You understand that content fails not because of bad hooks or editing, but because creators pick topics that only appeal to their existing followers.

Your job is to generate content ideas that reach STRANGERS, not just followers. Every idea must pass "the room size test" — would someone who has never heard of this creator still stop scrolling?

Return valid JSON only. No markdown, no explanation, just the JSON object.`

  const userPrompt = `Generate 25 content ideas for this creator.

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

## HOOK FORMATS

For each idea, write 5 different hooks using these formats. Each format creates contrast differently:

1. **Fortune Teller** (Present vs Future): Frame the idea as something that will change the future. "This is going to change how you X forever" or "In 6 months, everyone will be doing this"

2. **Experimenter** (Before vs After): Frame it as an experiment or test you ran. "I tried X for 30 days - here's what happened" or "I tested every method and this one wins"

3. **Teacher** (Unknown vs Known): Frame it as a lesson or how-to. "3 things you need to know about X" or "Here's how the pros actually do X"

4. **Investigator** (Hidden vs Revealed): Frame it as a secret or discovery. "Nobody talks about this..." or "I found the real reason why X happens"

5. **Contrarian** (Belief A vs Belief B): Challenge conventional wisdom directly. "You're doing X completely wrong" or "Everyone says Y but actually..."

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
      "hook_fortune_teller": "Present vs future hook",
      "hook_experimenter": "Before vs after / experiment hook",
      "hook_teacher": "Lesson / how-to hook",
      "hook_investigator": "Secret / discovery hook",
      "hook_contrarian": "Challenge conventional wisdom hook"
    }
  ],
  "meta": {
    "total_generated": 25,
    "awareness_distribution": { "unaware": 8, "problem_aware": 9, "solution_aware": 6, "product_aware": 2 }
  }
}

Generate 25 ideas now. Return ONLY valid JSON.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': c.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 16000,
        stream: true,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Claude API error:', error)
      return c.json({ error: 'Generation failed', details: error }, 500)
    }

    // Accumulate streamed text chunks
    let text = ''
    const reader = response.body?.getReader()
    if (!reader) return c.json({ error: 'No response body' }, 500)

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const event = JSON.parse(data)
            if (event.type === 'content_block_delta' && event.delta?.text) {
              text += event.delta.text
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    // Parse JSON
    let parsed
    try {
      let jsonStr = text
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (match) jsonStr = match[1]
      parsed = JSON.parse(jsonStr)
    } catch {
      console.error('Failed to parse JSON:', text.substring(0, 500))
      return c.json({ error: 'Failed to parse response' }, 500)
    }

    console.log(`Generated ${parsed.ideas?.length} ideas`)

    return c.json(parsed)
  } catch (error) {
    console.error('Generate error:', error)
    return c.json({ error: 'Generation failed' }, 500)
  }
})

// ============================================
// BREAKTHROUGH CONTENT GENERATION (25 ideas)
// ============================================

// Single batch of 25 ideas focused on problem-aware stage (highest reach)
const AWARENESS_BATCHES = [
  { level: 'problem_aware', count: 25 },
] as const

const TOTAL_BATCHES = AWARENESS_BATCHES.length

// Helper to get batch-specific directive based on awareness level
function getBatchDirective(awarenessLevel: string, targetCount: number, formData: BreakthroughFormData): string {
  const { lesson1, lesson2, lesson3, lesson4, lesson5 } = formData

  switch (awarenessLevel) {
    case 'unaware':
      return `## BATCH FOCUS: UNAWARE (Generate exactly ${targetCount} ideas)

These people don't know they have a named problem yet. They're experiencing symptoms or feelings but haven't connected them to a cause.

Questions they're asking themselves:
${lesson4.unaware_questions}

Anchor ideas to UNIVERSAL EXPERIENCES that this audience has (scope 4-5). The topic is universally relatable; the explanation connects to THIS creator's expertise.

## EMOTIONAL ANCHORS — EVERY IDEA MUST CONNECT TO AT LEAST ONE

**Hidden frustrations they won't admit:**
- "${lesson3.wont_tell_1}"
- "${lesson3.wont_tell_2}"
- "${lesson3.wont_tell_3}"

**Emotional cores driving their behavior:**
- "${lesson2.desire_1.so_i_can_3}"
- "${lesson2.desire_2.so_i_can_3}"
- "${lesson2.desire_3.so_i_can_3}"

CRITICAL: Generic facts about the topic are NOT enough. Each idea must speak to WHY this specific audience cares — their shame, their frustration, their deeper motivation.

Example of what NOT to do: "Why you feel hungrier on days you barely moved" — generic physiology that could work for any fitness account
Example of what TO do: "Why you feel like a failure when you miss the gym even though you know rest matters" — speaks to the emotional shame

ALL ${targetCount} ideas in this batch MUST be awareness_level: "unaware".`

    case 'problem_aware':
      return `## BATCH FOCUS: PROBLEM AWARE (Generate exactly ${targetCount} ideas)

These people know their problem but haven't found solutions. They understand something is wrong but don't know what to do about it.

Questions they're asking:
${lesson4.problem_aware_questions}

Mine these psychological layers — make them feel SEEN:

**What they think but won't admit:**
- "${lesson3.wont_tell_1}"
- "${lesson3.wont_tell_2}"
- "${lesson3.wont_tell_3}"

**What they don't know about their situation:**
- "${lesson3.cant_tell_1}"
- "${lesson3.cant_tell_2}"
- "${lesson3.cant_tell_3}"

Create ideas that NAME hidden experiences directly. These are callout hooks — content that makes someone say "how did you know?"

ALL ${targetCount} ideas in this batch MUST be awareness_level: "problem_aware".`

    case 'solution_aware':
      return `## BATCH FOCUS: SOLUTION AWARE (Generate exactly ${targetCount} ideas)

These people are comparing approaches and evaluating methods. They know the problem and are looking for the right solution.

Questions they're asking:
${lesson4.solution_aware_questions}

## EMOTIONAL ANCHORS — EVERY IDEA MUST CONNECT TO AT LEAST ONE

**The skepticism they've earned (what they won't admit):**
- "${lesson3.wont_tell_1}"
- "${lesson3.wont_tell_2}"
- "${lesson3.wont_tell_3}"

**What they don't know is sabotaging their choices:**
- "${lesson3.cant_tell_1}"
- "${lesson3.cant_tell_2}"
- "${lesson3.cant_tell_3}"

Create ideas that:
- Compare approaches: "Why X works better than Y for bodies like yours"
- Validate their frustration with generic advice
- Help them choose based on their SPECIFIC situation

Reference THIS creator's unique positioning:
- What they teach: ${lesson1.what_you_teach}

What's being OVERSIMPLIFIED by competitors that this creator can address?
${lesson5.competitor_angles}

ALL ${targetCount} ideas in this batch MUST be awareness_level: "solution_aware".`

    case 'product_aware':
      return `## BATCH FOCUS: PRODUCT AWARE (Generate exactly ${targetCount} ideas)

These people are deciding whether THIS CREATOR is for them. They're considering following, joining, or buying.

Questions they're asking about this creator specifically:
${lesson4.product_aware_questions}

## EMOTIONAL ANCHORS — EVERY IDEA MUST CONNECT TO AT LEAST ONE

**The skepticism and baggage they're bringing (what they won't admit):**
- "${lesson3.wont_tell_1}"
- "${lesson3.wont_tell_2}"
- "${lesson3.wont_tell_3}"

**Their deeper motivations (why this matters):**
- "${lesson2.desire_1.so_i_can_3}"
- "${lesson2.desire_2.so_i_can_3}"
- "${lesson2.desire_3.so_i_can_3}"

Create ideas that:
- Address the hidden objections they won't say out loud
- Show this creator UNDERSTANDS their frustration with past failures
- Prove authority through empathy, not just credentials

Emphasize what makes this creator UNIQUE in the space:
- What they do: ${lesson1.what_you_do}
- What they teach: ${lesson1.what_you_teach}
- Their position vs competitors: ${lesson5.competitor_angles}

ALL ${targetCount} ideas in this batch MUST be awareness_level: "product_aware".`

    default:
      return ''
  }
}

// Helper to build the base prompt (without deduplication section)
function buildBasePrompt(formData: BreakthroughFormData): { systemPrompt: string; userPromptBase: string } {
  const stagePrescriptions: Record<number, string> = {
    1: "You're first. Just say it clearly.",
    2: "Others have said it. Go bolder — say what they were afraid to.",
    3: "Everyone's made the claim. Show HOW it works, not just what.",
    4: "Everyone's explained it. Go where they didn't — the part they oversimplified.",
    5: "They've tuned out tips. Show what life looks like on the other side.",
  }

  const { lesson1, lesson2, lesson3, lesson4, lesson5 } = formData

  const systemPrompt = `You are a content strategist who generates emotionally resonant content ideas that reach strangers. You understand that most content fails because it's generic — it could work for any account in the niche.

Your job is to generate content ideas that make THIS SPECIFIC AUDIENCE feel seen. Every idea must tap into their hidden fears, unspoken frustrations, or deep emotional motivations.

CRITICAL RULES:
1. Generate exactly ${formData.lesson5.sophistication_stage === 5 ? 'ideas that a SKEPTICAL, oversaturated audience hasn\'t seen before. No tips, no obvious advice.' : 'ideas that are fresh and specific.'}
2. Every idea must connect to the EMOTIONAL PAIN or DESIRE of the audience — not just interesting facts about the topic.
3. The idea title should work as a hook on its own. Hooks should BUILD on the idea, not water it down.
4. ${formData.lesson5.sophistication_stage >= 4 ? 'This audience has heard it all. Generic advice will scroll past. Go deeper.' : 'Stay specific to this audience.'}

Return valid JSON only. No markdown, no explanation, just the JSON object.`

  const userPromptBase = `Generate content ideas for this creator.

## CREATOR PROFILE
- Niche: ${lesson1.niche}
- Core problem: ${lesson1.core_problem}
- What they do: ${lesson1.what_you_do}
- What they teach: ${lesson1.what_you_teach}

## TARGET AUDIENCE
${lesson2.audience_description}

## NICHE BOUNDARIES — CRITICAL

Every idea MUST pass this test: Would someone matching this exact audience description immediately think "this is for me"?

If an idea could work equally well for:
- A general psychology account
- A productivity coach
- A generic wellness page
- A therapy practice
- A meditation teacher
- ANY OTHER ACCOUNT in this niche

...then it's TOO BROAD or OUT OF NICHE. Skip it.

The TOPIC can be universal (everyone experiences it), but the ANGLE must clearly serve THIS specific audience. "Why you wake up at 3am" is universal; "Why you wake up at 3am when you have chronic symptoms" serves this niche.

## ANTI-GENERIC FILTER — CRITICAL

Do NOT generate content that:
- Explains physiological facts without emotional connection ("Why you feel X when Y happens")
- Could be posted by any account in this niche and still make sense
- Teaches concepts without addressing the PAIN of not knowing them
- Sounds like a textbook or educational video

DO generate content that:
- Names specific emotional experiences this audience has
- Validates frustrations they've never heard articulated
- Speaks to the SHAME, EMBARRASSMENT, or HIDDEN STRUGGLES they carry
- Makes them feel understood, not just informed

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

**Dead topics (overdone, skip entirely):** ${lesson5.saturated_topics}

**Dead formats (skip these structures):** ${lesson5.saturated_formats}

**Competitor angles — DO NOT USE THESE FRAMINGS even if the topic is different:**
${lesson5.competitor_angles}

**Market Stage:** ${lesson5.sophistication_stage}/5
${lesson5.sophistication_stage === 5 ? `
⚠️ STAGE 5 MARKET — CRITICAL INSTRUCTION ⚠️

This audience is HIGHLY SKEPTICAL. They've:
- Heard every tip, trick, and hack
- Seen the same "Why you..." hooks hundreds of times
- Become numb to generic advice

DO NOT generate content that:
- Explains basic concepts they already know
- Sounds like it could come from any account in this niche
- Delivers "tips" or "hacks" or "reasons why"
- Uses educational framing ("here's what's happening in your body")

INSTEAD generate content that:
- Names experiences they've NEVER heard articulated
- Challenges beliefs they didn't know they had
- Shows transformation stories and "life on the other side"
- Speaks to the EMOTIONAL EXHAUSTION of trying everything
- Validates the frustration of "doing everything right and still failing"
` : `Prescription: ${stagePrescriptions[lesson5.sophistication_stage]}`}

## HOOK FORMATS

For each idea, write 4 opening hooks. Each hook should be the OPENING LINE(S) of the actual video — not a rewritten title.

CRITICAL HOOK RULES:
1. The idea title is already a hook. Your job is to create opening lines that INCLUDE and BUILD ON the specific detail, not replace it with generic language.
2. BANNED PHRASES: "forever," "completely change," "shocked me," "nobody's talking about," "what nobody tells you," "here's what," "the real reason" — these are content marketing clichés that strip specificity.
3. PRESERVE THE PUNCH: If the idea says "even good ones" or "even when you're doing everything right" — that qualifier IS the hook. Keep it.

**Hook formats:**

1. **Experimenter** (Before vs After): Frame as observation or experience. Only claim "I did X" if plausible for this creator. Otherwise use "When people try X..." or "What happens when..."
   BAD: "I tracked my symptoms for 3 months and the results shocked me"
   GOOD: "I tracked my symptoms around doctor appointments for 3 months. They spiked after every visit — even the good ones."

2. **Teacher** (Unknown vs Known): Lead with the INSIGHT, not filler words. State the surprising fact directly.
   BAD: "Here's what's actually happening in your body after appointments"
   GOOD: "Your symptoms spike after doctor appointments because your nervous system reads medical settings as threat — even when the news is good."

3. **Investigator** (Hidden vs Revealed): Name the specific hidden thing IN the hook. Don't tease — deliver.
   BAD: "Nobody talks about why you feel worse after appointments"
   GOOD: "Medical settings trigger your nervous system the same way danger does. That's why you crash after appointments."

4. **Contrarian** (Belief A vs Belief B): State the contrarian position directly and specifically. Challenge the belief, then land the counter.
   BAD: "Everyone's wrong about doctor appointments"
   GOOD: "Doctor appointments make your symptoms worse — and the 'good' ones are the worst. Here's the survival mechanism behind it."

## RESOLUTION REQUIREMENT

Every idea MUST include a resolution_preview — what the viewer will understand or be able to do after watching.

NOT just "here's a painful pattern you hadn't named" but "here's a painful pattern + what changes it."

The resolution should hint at THIS CREATOR's unique angle, not generic advice.

Example:
- IDEA: "Why you crash the day after you felt almost normal"
- RESOLUTION: "The crash isn't punishment—it's your body equalizing what it borrowed. Once you see it as debt repayment, you can plan for it instead of fighting it."

## FORMAT DIVERSITY RULES

- Maximum 25% of ideas can start with "Why you"
- Maximum 15% can start with "The specific" or "The moment" or "The exact"
- Vary sentence structures: questions, statements, second-person, third-person observations
- Each batch must use at least 4 different opener patterns

## SCORING RULES

Link scores to the desire metadata provided above:
- urgency (1-5): How urgent is this for the audience right now?
- staying_power (1-5): Does this matter on day 1 vs day 1000?
- scope (1-5): How many people does this apply to? (1=very niche, 5=universal)

CRITICAL: Scores MUST use the full 1-5 range across the batch:
- At least 20% of ideas should score 2-3 on each dimension
- Not everything is a 5. If an idea only matters to people with THIS exact condition, scope is 2.
- If an idea is universally relatable, scope is 5.

## OUTPUT

Return JSON with this structure:
{
  "ideas": [
    {
      "id": 1,
      "idea": "The content idea — should work as a hook on its own",
      "room_rationale": "Why STRANGERS (not followers) would stop scrolling for this",
      "awareness_level": "unaware|problem_aware|solution_aware|product_aware",
      "urgency": 1-5,
      "staying_power": 1-5,
      "scope": 1-5,
      "resolution_preview": "What the viewer will understand or be able to do after — the shift or next step",
      "hook_experimenter": "Opening line(s) — observation/experience angle",
      "hook_teacher": "Opening line(s) — direct insight delivery",
      "hook_investigator": "Opening line(s) — reveal the hidden thing directly",
      "hook_contrarian": "Opening line(s) — challenge then land the counter"
    }
  ]
}`

  return { systemPrompt, userPromptBase }
}

// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelayMs: 2000, // 2 seconds
  maxDelayMs: 30000, // 30 seconds max
  timeoutMs: 300000, // 5 minute timeout per attempt - complex prompts with deduplication context need time
}

// Helper to sleep with exponential backoff
function getRetryDelay(attempt: number): number {
  const delay = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt)
  return Math.min(delay, RETRY_CONFIG.maxDelayMs)
}

// Helper to generate a single batch at a specific awareness level (with retry + timeout)
async function generateBatch(
  formData: BreakthroughFormData,
  awarenessLevel: string,
  targetCount: number,
  previousIdeas: GeneratedIdea[],
  apiKey: string
): Promise<GeneratedIdea[]> {
  const { systemPrompt, userPromptBase } = buildBasePrompt(formData)
  const batchDirective = getBatchDirective(awarenessLevel, targetCount, formData)

  // Build deduplication section if we have previous ideas
  // Escape quotes and newlines in idea titles to prevent prompt injection
  let deduplicationSection = ''
  if (previousIdeas.length > 0) {
    const previousTitles = previousIdeas.map((idea, i) => {
      // Escape special characters that could break the prompt
      const escapedIdea = idea.idea
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, ' ')
        .trim()
      return `${i + 1}. "${escapedIdea}"`
    }).join('\n')
    deduplicationSection = `

## ALREADY GENERATED — DO NOT DUPLICATE

You have already generated these ideas. Do NOT create variations, rewordings, or similar angles:

${previousTitles}

Generate COMPLETELY DIFFERENT ideas that still serve the SAME specific audience.

CRITICAL: Different topic, same niche. Do NOT drift outside the niche to avoid repetition (e.g., general psychology, random body facts, productivity tips). Find fresh angles WITHIN the niche.

`
  }

  const userPrompt = batchDirective + '\n\n' + deduplicationSection + userPromptBase + `\n\nGenerate exactly ${targetCount} ideas for this batch. ALL ideas must be awareness_level: "${awarenessLevel}". Return ONLY valid JSON.`

  console.log(`Batch ${awarenessLevel}: Sending request to Claude API for ${targetCount} ideas...`)
  console.log(`Batch ${awarenessLevel}: Deduplication includes ${previousIdeas.length} previous ideas`)

  // Retry loop with exponential backoff
  let lastError: Error | null = null

  for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
    if (attempt > 0) {
      const delay = getRetryDelay(attempt - 1)
      console.log(`Batch ${awarenessLevel}: Retry attempt ${attempt + 1}/${RETRY_CONFIG.maxAttempts} after ${delay}ms delay`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    try {
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeoutMs)

      // Use streaming to prevent Cloudflare timeout on long-running responses
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 16000,
          stream: true,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorBody = await response.text()
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
          headers: Object.fromEntries(response.headers.entries()),
        }
        console.error(`Batch ${awarenessLevel} Claude API error (attempt ${attempt + 1}):`, JSON.stringify(errorDetails, null, 2))

        // Check if this is a retryable error (5xx or rate limit)
        const isRetryable = response.status >= 500 || response.status === 429

        let errorMessage = `Claude API failed for batch ${awarenessLevel} (${response.status})`
        try {
          const parsed = JSON.parse(errorBody)
          if (parsed.error?.message) {
            errorMessage = `Batch ${awarenessLevel}: ${parsed.error.message}`
          }
        } catch {
          // Use generic message if we can't parse
        }

        lastError = new Error(errorMessage)

        if (!isRetryable) {
          throw lastError // Don't retry client errors (4xx except 429)
        }
        continue // Retry on server errors or rate limits
      }

      // Accumulate streamed text chunks
      let text = ''
      let inputTokens = 0
      let outputTokens = 0
      const reader = response.body?.getReader()
      if (!reader) throw new Error(`No response body for batch ${awarenessLevel}`)

      const decoder = new TextDecoder()
      let buffer = ''

      // Stream reading with timeout protection
      const streamTimeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.timeoutMs)

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const event = JSON.parse(data)
                if (event.type === 'content_block_delta' && event.delta?.text) {
                  text += event.delta.text
                } else if (event.type === 'message_delta' && event.usage) {
                  outputTokens = event.usage.output_tokens
                } else if (event.type === 'message_start' && event.message?.usage) {
                  inputTokens = event.message.usage.input_tokens
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      } finally {
        clearTimeout(streamTimeoutId)
      }

      // Parse JSON
      let parsed
      try {
        let jsonStr = text
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (match) jsonStr = match[1]
        parsed = JSON.parse(jsonStr)
      } catch {
        console.error(`Batch ${awarenessLevel} failed to parse JSON (attempt ${attempt + 1}):`, text.substring(0, 500))
        lastError = new Error(`Failed to parse response for batch ${awarenessLevel}`)
        continue // Retry on parse errors
      }

      // Validate we got ideas
      if (!parsed.ideas || !Array.isArray(parsed.ideas) || parsed.ideas.length === 0) {
        console.error(`Batch ${awarenessLevel}: Got empty or invalid ideas array (attempt ${attempt + 1})`)
        lastError = new Error(`Batch ${awarenessLevel} returned no ideas`)
        continue // Retry
      }

      console.log(`Batch ${awarenessLevel}: Generated ${parsed.ideas.length} ideas, tokens: ${inputTokens} in, ${outputTokens} out`)

      // Success! Renumber and return
      const startId = previousIdeas.length + 1
      const ideas = (parsed.ideas as GeneratedIdea[]).map((idea, index) => ({
        ...idea,
        id: startId + index,
      }))

      return ideas

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Batch ${awarenessLevel}: Request timed out (attempt ${attempt + 1})`)
        lastError = new Error(`Batch ${awarenessLevel} timed out after ${RETRY_CONFIG.timeoutMs}ms`)
      } else {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.error(`Batch ${awarenessLevel}: Error (attempt ${attempt + 1}):`, lastError.message)
      }
      // Continue to next retry attempt
    }
  }

  // All retries exhausted
  throw lastError || new Error(`Batch ${awarenessLevel} failed after ${RETRY_CONFIG.maxAttempts} attempts`)
}

// POST /generate-ideas-start - Return immediately, generate ALL batches in background
app.post('/generate-ideas-start', async (c) => {
  const formData = await c.req.json<BreakthroughFormData>()
  const jobId = crypto.randomUUID()

  console.log(`Starting job ${jobId} - spawning ${TOTAL_BATCHES} batches in background`)

  // Create initial job state (no ideas yet)
  const jobState: BreakthroughJobState = {
    jobId,
    status: 'in_progress',
    totalBatches: TOTAL_BATCHES,
    completedBatches: 0,
    batches: [],
    formData,
    startedAt: new Date().toISOString(),
    completedAt: null,
    error: null,
  }

  // Save initial state to KV
  await c.env.RESULTS_KV.put(
    `breakthrough-job:${jobId}`,
    JSON.stringify(jobState),
    { expirationTtl: 24 * 60 * 60 } // 24 hours
  )

  // Spawn ALL background work (batches 1-4)
  const ctx = c.executionCtx
  console.log(`Job ${jobId}: About to spawn ctx.waitUntil`)
  ctx.waitUntil(
    (async () => {
      console.log(`Job ${jobId}: Background work starting - timestamp ${Date.now()}`)

      // Check if API key is available
      if (!c.env.ANTHROPIC_API_KEY) {
        console.error(`Job ${jobId}: ANTHROPIC_API_KEY is not set!`)
        const currentState = await c.env.RESULTS_KV.get(`breakthrough-job:${jobId}`, 'json') as BreakthroughJobState
        if (currentState) {
          currentState.status = 'partial_complete'
          currentState.completedAt = new Date().toISOString()
          currentState.error = { batch: 0, message: 'API key not configured' }
          await c.env.RESULTS_KV.put(`breakthrough-job:${jobId}`, JSON.stringify(currentState), { expirationTtl: 24 * 60 * 60 })
        }
        return
      }
      console.log(`Job ${jobId}: API key present, length: ${c.env.ANTHROPIC_API_KEY.length}`)

      try {
        let allIdeas: GeneratedIdea[] = []

        for (let batchIndex = 0; batchIndex < AWARENESS_BATCHES.length; batchIndex++) {
          const { level: awarenessLevel, count: targetCount } = AWARENESS_BATCHES[batchIndex]
          const batchNum = batchIndex + 1

          try {
            console.log(`Job ${jobId}: Starting ${awarenessLevel} batch (${targetCount} ideas) at ${new Date().toISOString()}`)

          const batchIdeas = await generateBatch(
            formData,
            awarenessLevel,
            targetCount,
            allIdeas,
            c.env.ANTHROPIC_API_KEY
          )

          allIdeas = [...allIdeas, ...batchIdeas]

          // Read current state, update, and save
          const currentState = await c.env.RESULTS_KV.get(`breakthrough-job:${jobId}`, 'json') as BreakthroughJobState
          if (!currentState) {
            console.error(`Job ${jobId}: State not found in KV`)
            return
          }

          currentState.batches.push({
            batch: batchNum,
            ideas: batchIdeas,
            completedAt: new Date().toISOString(),
          })
          currentState.completedBatches = batchNum

          if (batchNum === AWARENESS_BATCHES.length) {
            currentState.status = 'complete'
            currentState.completedAt = new Date().toISOString()
          }

          await c.env.RESULTS_KV.put(
            `breakthrough-job:${jobId}`,
            JSON.stringify(currentState),
            { expirationTtl: 24 * 60 * 60 }
          )

          console.log(`Job ${jobId}: ${awarenessLevel} batch complete (${batchIdeas.length} ideas), ${allIdeas.length} total`)

        } catch (error) {
          console.error(`Job ${jobId}: ${awarenessLevel} batch failed:`, error)

          // Mark as partial_complete
          const currentState = await c.env.RESULTS_KV.get(`breakthrough-job:${jobId}`, 'json') as BreakthroughJobState
          if (currentState) {
            currentState.status = 'partial_complete'
            currentState.completedAt = new Date().toISOString()
            currentState.error = {
              batch: batchNum,
              message: error instanceof Error ? error.message : 'Unknown error',
            }
            await c.env.RESULTS_KV.put(
              `breakthrough-job:${jobId}`,
              JSON.stringify(currentState),
              { expirationTtl: 24 * 60 * 60 }
            )
          }
          return // Stop processing further batches
        }
      }

        console.log(`Job ${jobId}: All ${TOTAL_BATCHES} batches complete`)
      } catch (outerError) {
        console.error(`Job ${jobId}: Fatal error in background work:`, outerError)
        // Try to mark job as failed
        try {
          const currentState = await c.env.RESULTS_KV.get(`breakthrough-job:${jobId}`, 'json') as BreakthroughJobState
          if (currentState && currentState.status === 'in_progress') {
            currentState.status = 'partial_complete'
            currentState.completedAt = new Date().toISOString()
            currentState.error = {
              batch: 0,
              message: outerError instanceof Error ? outerError.message : 'Background task failed',
            }
            await c.env.RESULTS_KV.put(
              `breakthrough-job:${jobId}`,
              JSON.stringify(currentState),
              { expirationTtl: 24 * 60 * 60 }
            )
          }
        } catch (kvError) {
          console.error(`Job ${jobId}: Failed to update KV with error state:`, kvError)
        }
      }
    })()
  )

  // Return immediately with jobId (no ideas yet - frontend polls for them)
  return c.json({
    jobId,
    status: 'in_progress',
    totalBatches: TOTAL_BATCHES,
    completedBatches: 0,
    batches: [],
  })
})

// GET /generation-status/:jobId - Poll for job status
app.get('/generation-status/:jobId', async (c) => {
  const jobId = c.req.param('jobId')

  const jobState = await c.env.RESULTS_KV.get(`breakthrough-job:${jobId}`, 'json') as BreakthroughJobState | null

  if (!jobState) {
    return c.json({ error: 'Job not found or expired' }, 404)
  }

  return c.json({
    jobId: jobState.jobId,
    status: jobState.status,
    totalBatches: jobState.totalBatches,
    completedBatches: jobState.completedBatches,
    batches: jobState.batches,
    startedAt: jobState.startedAt,
    completedAt: jobState.completedAt,
    error: jobState.error,
  })
})

// ============================================
// SSE STREAMING IDEA GENERATION (100 ideas)
// ============================================
// This keeps the connection open and streams batches as they complete
// Works on free tier since it's a single long-running request, not background work

interface GenerateStreamRequest extends BreakthroughFormData {
  userId?: string
  courseId?: string
}

// Generation credit limit per user per course
const MAX_GENERATIONS_PER_COURSE = 1

app.post('/generate-ideas-stream', async (c) => {
  const requestData = await c.req.json<GenerateStreamRequest>()
  const { userId, courseId, ...formData } = requestData

  // Extract Supabase client for credit checking
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)

  // Server-side credit check BEFORE starting generation
  if (userId && courseId) {
    const { count, error } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Failed to check generation credits:', error)
      return c.json({ error: 'Failed to verify generation credits' }, 500)
    }

    const used = count || 0
    if (used >= MAX_GENERATIONS_PER_COURSE) {
      console.log(`User ${userId} has no credits remaining (${used}/${MAX_GENERATIONS_PER_COURSE})`)
      return c.json({ error: 'No generation credits remaining' }, 403)
    }

    console.log(`User ${userId} has ${MAX_GENERATIONS_PER_COURSE - used} credits remaining`)
  }

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: {
        type: string
        batch?: number
        totalBatches?: number
        ideas?: GeneratedIdea[]
        allIdeas?: GeneratedIdea[]
        error?: string
        creditsRemaining?: number
      }) => {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      try {
        console.log('Starting SSE idea generation')
        let allIdeas: GeneratedIdea[] = []

        for (let batchIndex = 0; batchIndex < AWARENESS_BATCHES.length; batchIndex++) {
          const { level: awarenessLevel, count: targetCount } = AWARENESS_BATCHES[batchIndex]
          const batchNum = batchIndex + 1

          // Add delay between batches to avoid rate limiting (skip for batch 1)
          if (batchIndex > 0) {
            console.log(`SSE: Waiting 3 seconds before ${awarenessLevel} batch to avoid rate limiting...`)
            await new Promise(resolve => setTimeout(resolve, 3000))
          }

          sendEvent({
            type: 'progress',
            batch: batchNum,
            totalBatches: AWARENESS_BATCHES.length,
          })

          console.log(`SSE: Starting ${awarenessLevel} batch (${targetCount} ideas)`)

          // Start heartbeat to keep connection alive during long batch generation
          const heartbeatInterval = setInterval(() => {
            try {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'ping' })}\n\n`))
            } catch {
              // Connection may have closed, ignore
            }
          }, 10000) // Send ping every 10 seconds

          try {
            const batchIdeas = await generateBatch(
              formData,
              awarenessLevel,
              targetCount,
              allIdeas,
              c.env.ANTHROPIC_API_KEY
            )

            clearInterval(heartbeatInterval)

            allIdeas = [...allIdeas, ...batchIdeas]

            // Send batch complete event with all ideas so far
            sendEvent({
              type: 'batch_complete',
              batch: batchNum,
              totalBatches: AWARENESS_BATCHES.length,
              ideas: batchIdeas,
              allIdeas: allIdeas,
            })

            console.log(`SSE: ${awarenessLevel} batch complete (${batchIdeas.length} ideas), ${allIdeas.length} total`)

          } catch (error) {
            clearInterval(heartbeatInterval)
            console.error(`SSE: ${awarenessLevel} batch failed:`, error)
            sendEvent({
              type: 'error',
              batch: batchNum,
              error: error instanceof Error ? error.message : 'Generation failed',
              allIdeas: allIdeas, // Return what we have so far
            })
            controller.close()
            return
          }
        }

        // All batches complete - NOW save the generation (consumes credit)
        let creditsRemaining = MAX_GENERATIONS_PER_COURSE

        if (userId && courseId) {
          // Save generation to Supabase - this is what "consumes" the credit
          const { error: saveError } = await supabase
            .from('generations')
            .insert({
              user_id: userId,
              course_id: courseId,
              ideas: allIdeas,
            })

          if (saveError) {
            console.error('Failed to save generation:', saveError)
            // Don't fail the whole request - ideas are generated, just saving failed
            // User will still see their ideas
          } else {
            console.log(`Saved generation for user ${userId}, course ${courseId}, ${allIdeas.length} ideas`)
          }

          // Get updated credit count
          const { count } = await supabase
            .from('generations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('course_id', courseId)

          creditsRemaining = Math.max(0, MAX_GENERATIONS_PER_COURSE - (count || 0))
        }

        sendEvent({
          type: 'complete',
          totalBatches: AWARENESS_BATCHES.length,
          allIdeas: allIdeas,
          creditsRemaining: creditsRemaining,
        })

        console.log(`SSE: All ${AWARENESS_BATCHES.length} batches complete, ${allIdeas.length} total ideas, ${creditsRemaining} credits remaining`)
        controller.close()

      } catch (error) {
        console.error('SSE generation error:', error)
        sendEvent({
          type: 'error',
          error: error instanceof Error ? error.message : 'Generation failed',
        })
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
})

// ============================================
// STRIPE CHECKOUT & WEBHOOK FOR COURSES
// ============================================

interface CheckoutRequest {
  course_id: string
  course_slug: string
  user_id: string
  user_email: string
  price_cents: number
  course_title: string
  origin_url: string
}

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (c) => {
  const data = await c.req.json<CheckoutRequest>()

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  })

  // Use the origin URL from the request (localhost in dev, ryansterling.com in prod)
  const baseUrl = data.origin_url || 'https://ryansterling.com'

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: data.course_title,
            },
            unit_amount: data.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/dashboard?purchased=${data.course_slug}`,
      cancel_url: `${baseUrl}/courses/${data.course_slug}`,
      customer_email: data.user_email,
      metadata: {
        user_id: data.user_id,
        course_id: data.course_id,
        course_slug: data.course_slug,
      },
    })

    return c.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return c.json({ error: 'Failed to create checkout session' }, 500)
  }
})

// Stripe Webhook - handles successful payments
app.post('/webhooks/stripe', async (c) => {
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  })

  const signature = c.req.header('stripe-signature')
  if (!signature) {
    return c.json({ error: 'Missing signature' }, 400)
  }

  const body = await c.req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      c.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return c.json({ error: 'Invalid signature' }, 400)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const courseId = session.metadata?.course_id
    const paymentId = session.payment_intent as string

    if (!userId || !courseId) {
      console.error('Missing metadata in checkout session')
      return c.json({ error: 'Missing metadata' }, 400)
    }

    // Insert purchase into Supabase
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_KEY
    )

    const { error: insertError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        course_id: courseId,
        stripe_payment_id: paymentId,
      })

    if (insertError) {
      // Check if it's a duplicate (idempotent)
      if (insertError.code === '23505') {
        console.log('Purchase already exists, skipping')
      } else {
        console.error('Failed to insert purchase:', insertError)
        return c.json({ error: 'Failed to record purchase' }, 500)
      }
    }

    console.log('Purchase recorded:', { userId, courseId, paymentId })

    // Tag user in ConvertKit for email sequence (V3 API)
    const customerEmail = session.customer_email
    if (customerEmail && c.env.CONVERTKIT_API_SECRET && c.env.CONVERTKIT_COURSE_TAG_ID) {
      try {
        const ckResponse = await fetch(
          `https://api.convertkit.com/v3/tags/${c.env.CONVERTKIT_COURSE_TAG_ID}/subscribe`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_secret: c.env.CONVERTKIT_API_SECRET,
              email: customerEmail,
            }),
          }
        )
        if (ckResponse.ok) {
          console.log('Tagged user in ConvertKit:', customerEmail)
        } else {
          console.error('ConvertKit tagging failed:', await ckResponse.text())
        }
      } catch (ckError) {
        console.error('ConvertKit API error:', ckError)
      }
    }
  }

  return c.json({ received: true })
})

// ============================================
// GENERATION CREDITS (Server-side tracking)
// ============================================

// Get remaining generation credits for a user/course
app.get('/generation-credits/:courseId', async (c) => {
  const courseId = c.req.param('courseId')
  const userId = c.req.query('userId')

  if (!userId) {
    return c.json({ error: 'Missing userId' }, 400)
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)

  // Count how many generations this user has for this course
  const { count, error } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('course_id', courseId)

  if (error) {
    console.error('Failed to count generations:', error)
    return c.json({ error: 'Failed to check credits' }, 500)
  }

  const used = count || 0
  const remaining = Math.max(0, MAX_GENERATIONS_PER_COURSE - used)

  return c.json({
    used,
    remaining,
    max: MAX_GENERATIONS_PER_COURSE,
  })
})

// ============================================
// FLOP-PROOF GENERATIONS PERSISTENCE
// ============================================

// Save a completed generation to Supabase
app.post('/save-generation', async (c) => {
  const { userId, courseId, ideas } = await c.req.json<{
    userId: string
    courseId: string
    ideas: GeneratedIdea[]
  }>()

  if (!userId || !courseId || !ideas) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)

  const { error } = await supabase
    .from('generations')
    .insert({
      user_id: userId,
      course_id: courseId,
      ideas: ideas,
    })

  if (error) {
    console.error('Failed to save generation:', error)
    return c.json({ error: 'Failed to save generation' }, 500)
  }

  console.log(`Saved generation for user ${userId}, course ${courseId}, ${ideas.length} ideas`)
  return c.json({ success: true })
})

// Get generations for a user/course
app.get('/generations/:courseId', async (c) => {
  const courseId = c.req.param('courseId')
  const userId = c.req.query('userId')

  if (!userId) {
    return c.json({ error: 'Missing userId' }, 400)
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch generations:', error)
    return c.json({ error: 'Failed to fetch generations' }, 500)
  }

  return c.json({ generations: data })
})

// ============================================
// ROAST MY PROFILE SUBMISSION
// ============================================

const ROAST_WEBHOOK_URL = 'https://n8n.srv1369832.hstgr.cloud/webhook/42a4d4f8-664e-4200-9a43-dab4fc043768'

interface RoastSubmission {
  email: string
  handle: string
  timestamp: string
}

app.post('/roast-submission', async (c) => {
  const data = await c.req.json<RoastSubmission>()

  console.log('Roast submission received:', data.email, data.handle)

  // Send to N8N - handles ConvertKit + email notification
  try {
    const res = await fetch(ROAST_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        handle: data.handle,
        timestamp: data.timestamp,
      }),
    })
    console.log('N8N response:', res.status)
  } catch (err) {
    console.error('N8N webhook error:', err)
  }

  return c.json({ success: true })
})

export default app
