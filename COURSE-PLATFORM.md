# Course Platform Documentation

## Overview

A custom course hosting platform built with:
- **Frontend**: React + Vite + Tailwind
- **Auth**: Clerk
- **Database**: Supabase
- **Payments**: Stripe
- **API**: Cloudflare Workers (Hono)

## Architecture

```
User clicks "Buy" → Checkout.tsx → API /create-checkout-session → Stripe Checkout
                                                                       ↓
User completes payment ← Dashboard.tsx ← Supabase ← API /webhooks/stripe ← Stripe webhook
```

## Database Schema (Supabase)

### courses
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| title | text | Course title |
| description | text | Course description |
| price_cents | int | Price in cents (e.g., 2900 = $29) |
| thumbnail_url | text | Course thumbnail image |
| published | boolean | Whether course is visible |
| created_at | timestamp | Creation date |

### lessons
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| course_id | uuid | FK to courses |
| title | text | Lesson title |
| content | text | Markdown content |
| video_url | text | Video embed URL |
| order_index | int | Sort order |
| created_at | timestamp | Creation date |

### purchases
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | text | Clerk user ID |
| course_id | uuid | FK to courses |
| stripe_payment_id | text | Stripe payment intent ID |
| created_at | timestamp | Purchase date |

**Unique constraint**: (user_id, course_id) - prevents duplicate purchases

## Key Files

### Frontend
- `src/pages/Checkout.tsx` - Pre-checkout page, calls API to create Stripe session
- `src/pages/Dashboard.tsx` - Shows purchased courses
- `src/pages/CourseViewer.tsx` - Course player with lessons
- `src/pages/CourseLanding.tsx` - Public course sales page
- `src/lib/supabase.ts` - Supabase client and types

### API (Cloudflare Workers)
- `api/src/index.ts` - All API endpoints including:
  - `POST /create-checkout-session` - Creates Stripe checkout session
  - `POST /webhooks/stripe` - Handles Stripe webhook events

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://ryan-website-api.rsterling20.workers.dev
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://xxx.supabase.co/
VITE_SUPABASE_ANON_KEY=eyJ...
```

### API (Cloudflare secrets)
Set via `npx wrangler secret put <NAME>`:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://xxx.supabase.co/
SUPABASE_SERVICE_KEY=eyJ...
```

### Local API Development (api/.dev.vars)
Same as above but for local `npm run dev`.

## Stripe Setup

### Dashboard Configuration
1. **Webhook endpoint**: `https://ryan-website-api.rsterling20.workers.dev/webhooks/stripe`
2. **Events to listen for**: `checkout.session.completed`
3. **Promotion codes**: Enabled via `allow_promotion_codes: true` in checkout session

### Creating Coupons
1. Go to Stripe Dashboard → Products → Coupons
2. Create coupon (e.g., 100% off for testing)
3. Users enter code on Stripe checkout page

## Deployment

### API (Cloudflare Workers)
```bash
cd api
npm run deploy
```

### Frontend
Build and deploy to your hosting provider:
```bash
npm run build
# Deploy dist/ folder
```

## Common Tasks

### Add a new course (FULL CHECKLIST)

**1. Supabase - Create the course**
- [ ] Insert row into `courses` table:
  - `slug`: URL-friendly name (e.g., `instagram-growth-101`)
  - `title`: Display name
  - `description`: Sales page description
  - `price_cents`: Price in cents (e.g., 2900 = $29)
  - `thumbnail_url`: Course image URL (optional)
  - `published`: Set to `true` when ready

**2. Supabase - Add lessons**
- [ ] Insert rows into `lessons` table with matching `course_id`:
  - `title`: Lesson title
  - `video_url`: Video embed URL
  - `order_index`: Sort order (0, 1, 2, ...)
  - `duration_seconds`: Video length in seconds
  - `description`: Optional lesson description

**3. ConvertKit - Create email sequence tag**
- [ ] Go to ConvertKit → Subscribers → Tags
- [ ] Create a new tag for this course (e.g., "Purchased: Course Name")
- [ ] Copy the tag ID from the URL (e.g., `https://app.convertkit.com/tags/21232701`)
- [ ] **If using a different tag per course**: Update `CONVERTKIT_COURSE_TAG_ID` in:
  - `api/.dev.vars` (local)
  - Cloudflare secrets: `wrangler secret put CONVERTKIT_COURSE_TAG_ID`
  - Then redeploy API: `cd api && npm run deploy`

**4. Test the flow**
- [ ] Visit `/courses/{slug}` - verify landing page shows correctly
- [ ] Click "Get Instant Access" - should redirect to checkout
- [ ] Complete purchase with 100% off coupon
- [ ] Verify purchase appears in Supabase `purchases` table
- [ ] Verify user is tagged in ConvertKit
- [ ] Verify course appears in dashboard
- [ ] Verify course content is accessible

### Test payments
1. Create a 100% off coupon in Stripe (Live mode)
2. Go through checkout with your real card + coupon
3. Verify purchase appears in Supabase and dashboard

### Debug webhook issues
1. Check Stripe Dashboard → Developers → Webhooks → Recent events
2. Look for failed deliveries and error messages
3. Check Cloudflare Workers logs: `npx wrangler tail`

## Purchase Flow Details

1. **Checkout.tsx** sends POST to `/create-checkout-session` with:
   - course_id, course_slug, user_id, user_email, price_cents, course_title, origin_url

2. **API** creates Stripe checkout session with:
   - Line item with course price
   - Success/cancel URLs
   - Customer email
   - Metadata (user_id, course_id, course_slug)
   - Promotion codes enabled

3. **Stripe** redirects user to checkout, then to success URL

4. **Stripe webhook** fires `checkout.session.completed` to `/webhooks/stripe`

5. **API webhook handler**:
   - Verifies signature with `constructEventAsync`
   - Extracts user_id and course_id from metadata
   - Inserts purchase into Supabase
   - Handles duplicates gracefully (idempotent)

6. **Dashboard** queries purchases table and shows owned courses

## ConvertKit Integration

On successful purchase, the webhook automatically tags the customer in ConvertKit.

### Configuration
- **API Secret**: Stored in `CONVERTKIT_API_SECRET` (Cloudflare secret) - Get from ConvertKit → Settings → Advanced → API
- **Tag ID**: Stored in `CONVERTKIT_COURSE_TAG_ID` (Cloudflare secret)
- **API Version**: V3 (uses api_secret in request body)

### How it works
1. Stripe webhook fires after successful payment
2. API extracts customer email from Stripe session
3. API calls ConvertKit V3 API to add tag to subscriber
4. ConvertKit triggers any automations linked to that tag

### Updating the tag
To change which tag is applied:
```bash
cd api
echo "NEW_TAG_ID" | ./node_modules/.bin/wrangler secret put CONVERTKIT_COURSE_TAG_ID
./node_modules/.bin/wrangler deploy
```

### Multiple courses with different tags
Currently uses a single tag for all courses. To support per-course tags:
1. Add a `convertkit_tag_id` column to `courses` table
2. Pass tag ID through Stripe metadata
3. Update webhook handler to use course-specific tag

## CORS Configuration

API allows requests from:
- `http://localhost:5173` (local dev)
- `http://localhost:5174` (local dev alternate port)
- `https://ryansterling.com`
- `https://www.ryansterling.com`
- `https://ryansterlingconsulting.com`

Update in `api/src/index.ts` if deploying to new domains.
