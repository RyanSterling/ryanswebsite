# Instagram Growth Assessment - Project Summary

## What We Built
An AI-powered lead magnet that analyzes someone's actual Instagram account (profile + last 3 reels with transcripts) to diagnose the #1 thing holding them back from 10K followers.

---

## Architecture

```
Frontend (Vite + React)          API (Hono + Cloudflare Workers)
─────────────────────           ────────────────────────────────
localhost:5173                   localhost:8787

/assessment page                 POST /assess
    │                                │
    │ Submit form data               │
    └────────────────────────────────►
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                    Apify Profile         Apify Reel
                    Scraper               Scraper
                    (bio, followers)      (3 reels, no pinned)
                          │                     │
                          └──────────┬──────────┘
                                     │
                              OpenAI Whisper
                              (transcribe reels)
                                     │
                              Claude API
                              (analyze & diagnose)
                                     │
                              N8N Webhook
                              (send email)
                                     │
                    ◄────────────────┘
                    JSON result
```

---

## User Flow (8 Steps)

1. **Email** - Lead capture gate
2. **Instagram Handle** - Which account to analyze
3. **Problem They Solve** - Compare to bio + transcripts
4. **Posting Frequency** - Volume diagnosis
5. **Average Reel Length** - Length diagnosis
6. **Average Views** - Baseline performance
7. **Outliers (Last 90 Days)** - 0, 1-2, 3-5, or 6+
8. **Self-Diagnosis** - What they think is wrong

Then: Loading state → Results page

---

## Diagnostic Categories

| Category | Signal |
|----------|--------|
| **VOLUME** | Posting <3x/week, not enough reps |
| **HOOKS** | Good ideas, weak first 3 seconds |
| **NICHE** | Bio/content mismatch, algorithm can't categorize |
| **CONTENT_FIT** | Making what they want vs what audience searches for |
| **LENGTH** | Reels too long, losing viewers |

---

## API Response Structure

```typescript
interface AssessmentResult {
  diagnosis: string              // VOLUME|HOOKS|NICHE|CONTENT_FIT|LENGTH
  headline: string               // "Your hooks are losing viewers"
  bio_quality: string            // Assessment of bio clarity
  bio_alignment: string          // Does bio match content?
  hook_analysis: HookAnalysis[]  // Per-reel breakdown
  core_issue: string             // 2-3 sentence explanation
  action_steps: string[]         // 3 specific actions
}

interface HookAnalysis {
  reel_number: number
  first_words: string            // Exact first 5-10 words
  hook_grade: 'A'|'B'|'C'|'D'|'F'
  issue: string                  // What's wrong
  rewrite: string                // Better version
}
```

---

## Files Created/Modified

### Frontend
- `src/pages/Assessment.tsx` - Main assessment page with state management
- `src/components/assessment/AssessmentStepper.tsx` - 8-step form
- `src/components/assessment/StepEmail.tsx` through `StepSelfDiagnosis.tsx` - Individual steps
- `src/components/assessment/LoadingState.tsx` - Loading animation
- `src/components/assessment/Results.tsx` - Results display with hook analysis

### API
- `api/src/index.ts` - Hono API with all endpoints
- `api/wrangler.toml` - Cloudflare Workers config
- `api/.dev.vars` - Local secrets (gitignored)
- `api/.dev.vars.example` - Template for secrets

---

## Environment Variables

### `.dev.vars` (in `/api` folder)
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
APIFY_PROFILE_URL=https://api.apify.com/v2/actors/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=YOUR_TOKEN
APIFY_REEL_URL=https://api.apify.com/v2/actors/apify~instagram-reel-scraper/run-sync-get-dataset-items?token=YOUR_TOKEN
```

---

## Running Locally

**Terminal 1 (Frontend):**
```bash
cd "/Users/ryansterling/Desktop/Code Projects/Ryan Website"
npm run dev
```

**Terminal 2 (API):**
```bash
cd "/Users/ryansterling/Desktop/Code Projects/Ryan Website/api"
npx wrangler dev
```

Then visit: http://localhost:5173/assessment

---

## Cost Per Assessment

| Service | Cost |
|---------|------|
| Apify Profile Scraper | ~$0.01 |
| Apify Reel Scraper (no transcript) | ~$0.02-0.05 |
| OpenAI Whisper (~2 min audio) | ~$0.01 |
| Claude API | ~$0.02-0.05 |
| **Total** | **~$0.05-0.10** |

Note: Apify's built-in transcript costs ~$0.21 for 3 reels. Using Whisper is much cheaper.

---

## Key Decisions Made

1. **Two Apify scrapers** - Profile scraper for bio/followers, Reel scraper for content (excludes pinned posts)

2. **Whisper over Apify transcription** - Apify charges ~$0.21 for transcripts, Whisper is ~$0.01

3. **Claude model** - Using `claude-sonnet-4-5` (check latest model IDs at platform.claude.com)

4. **Hook analysis per reel** - Grade A-F, identifies issue, provides rewrite

5. **N8N for email** - Fire-and-forget webhook, doesn't block response

---

## TODO / Next Steps

- [ ] Test full flow end-to-end
- [ ] Deploy API to Cloudflare Workers (`npx wrangler deploy`)
- [ ] Set production secrets (`npx wrangler secret put OPENAI_API_KEY`)
- [ ] Update CORS for production domain
- [ ] Set up N8N workflow for email delivery
- [ ] Iterate on Claude prompt based on output quality
- [ ] Add error handling UI for rate limits / no reels found

---

## Troubleshooting

### "Invalid URL: undefined"
Your `.dev.vars` is missing a variable. Make sure all 4 are set:
- OPENAI_API_KEY
- ANTHROPIC_API_KEY
- APIFY_PROFILE_URL
- APIFY_REEL_URL

### CORS errors
Make sure wrangler is running in a separate terminal. The API must be on port 8787.

### "No reels found"
- Account might be private
- Account might not have video reels
- Instagram rate-limited the request (wait 1 min and retry)

### Claude model not found
Model IDs change. Check https://platform.claude.com/docs for current IDs. We're using `claude-sonnet-4-5`.
