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

export default app
