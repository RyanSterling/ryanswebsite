# The Flop-Proof Content System — Master Spec

> **Status:** L1-L5 content locked. Prompt A next.
> **Last updated:** 2026-07-23 (L5 content + UI finalized)
> **Owner:** Ryan (R Sterling LLC)

---

## 0. How to use this doc

This is the single source of truth for the build. It is a **living document** — it gets updated as decisions are made, not rewritten from scratch.

**Rules for Claude Code (and any future session):**

1. **Read this file first**, before writing any code or copy for this project.
2. **Update it in the same session you change something.** A decision that only exists in a chat log is a decision that will be lost.
3. **Move items, don't delete them.** When an open question in §9 gets answered, move it into the relevant section and log it in §10. Keep rejected options in §10 with the reason — re-litigating settled decisions is the main way this project wastes time.
4. **Mark confidence.** Anything not yet validated gets tagged `[DRAFT]`. Anything settled gets `[LOCKED]`. Don't build load-bearing code on `[DRAFT]` without flagging it.
5. **Don't invent mechanics.** If a section is empty, it's empty because the real answer doesn't exist yet. Ask rather than fill.

---

## 1. The offer `[LOCKED]`

| | |
|---|---|
| **Name** | The Flop-Proof Content System |
| **Price** | $29 |
| **Type** | Front-end course with a generator tool built into the final lesson |
| **Platform** | Ryan's own custom-coded course delivery site |

### Audience
Content creators and business owners posting to grow an audience.

### Their desire ladder
Attack rung 1 only. It is the biggest room, which is the whole point of the thesis.

1. **Views** — stuck at 300–1,500 views, can't break out ← **this offer**
2. Views → followers
3. Followers → sales

### Positioning boundaries
- **Not** "go viral." The gap being sold is between *barely seen* and *actually getting traction*.
- **Never name a view number in the offer.** No "300 views," no "10K."
- Not positioned as social media tactics. This is marketing, applied to content.

### The reframe (core message)
> Your content isn't failing because of your hook, your editing, your posting time, or your follower count. It's failing because you keep making content for a room that's too small. The algorithm won't push a video past your followers if the topic only appeals to your followers.

This is the "he's in my head" moment. It takes blame off their effort and skill — where they've been beating themselves up — and puts it on something fixable they've never heard named.

### The promise
> Never wonder what to post again. Generate ideas that get seen — without posting a hundred times to find out what works.

### The three outcomes sold
1. Solves "what do I post"
2. Kills the guessing grind — the "just post 100 times and learn what works" advice everyone else sells
3. Teaches how to appeal to more people

### Positioning against the market
The dominant advice is **volume-as-education**: post constantly, let the algorithm teach you. It isn't wrong, it's just expensive — months of effort to learn what could be reasoned out up front. This offer sells the shortcut. That contrast is the sharpest hook available and should show up in the sales copy, the intro lesson, and the ads.

---

## 2. Product architecture `[LOCKED]`

```
Lesson 1 ─┐
Lesson 2 ─┤  each lesson teaches one mechanic
Lesson 3 ─┤  AND fills in one section of the input form
Lesson 4 ─┤
Lesson 5 ─┘
    ↓
Final lesson: THE GENERATOR
    input form (pre-filled from lessons)
    ↓
    Prompt A → 100 content ideas
    ↓
    each idea: 3 hook variations + copy button
    ↓
    copy button → idea + hook + Prompt B (hidden) → user's own LLM
```

### Why this structure
- **Each lesson earns a better output.** The course isn't "watch 5 videos then use a tool" — every lesson has a tangible payoff, and the finale assembles everything they built. This is what makes a $29 course feel like it overdelivers instead of like filler.
- **The deliverable is a list, not a skill.** Nobody can see "better ideas." Everyone can see *"I have 100 ideas in a doc and I know none of them will flop."* Tangibility comes from walking out holding something.
- **It's re-runnable.** Positioned as an engine, not a one-time exercise: run it any time the well runs dry.

### Why the copy button offloads to the user's LLM
Expansion happens on **their** LLM, not Ryan's API key. The platform generates the seed list once. Someone expanding idea #47 into a full script costs nothing. This is deliberate — protect the margin on a $29 product.

---

## 3. The generator — data model `[DRAFT]`

### 3.1 Input form — field definitions by lesson

Fields filled progressively across lessons, saved to the student's account, editable before generation.

---

#### Lesson 1: Why Your Content Isn't Getting Views

**Purpose:** Establish what the creator does, teaches, or sells — the product/expertise that content ultimately points back to.

| Field | Type | Label | Why Prompt A needs it |
|-------|------|-------|----------------------|
| `niche` | text (short) | "Your niche" | Sets the domain for all idea generation |
| `core_problem` | text (medium) | "What is the #1 problem you help people solve?" | Anchors content to a specific pain point |
| `what_you_do` | text (medium) | "What do you help people do?" | Defines the transformation you offer |
| `what_you_teach` | text (medium) | "What do you know that most don't?" | Your unique knowledge = content differentiation |

**Field count:** 4 fields
**UX note:** These feel like "profile" questions, not homework. Light lift.

**Removed:** `content_format` multi-select. The course assumes short-form video — filtered via sales page. Format variations within short-form (talking head, b-roll, text overlay, etc.) can be added later with data.

---

#### Lesson 2: Who They Serve + Desire Inventory

**Purpose:** Define the specific person they're making content for, and ladder their desires up to find the "big room" topics.

| Field | Type | Prompt copy | Why Prompt A needs it |
|-------|------|-------------|----------------------|
| `audience_description` | text (medium) | "Describe the specific person you make content for. Who are they? Where are they stuck?" | Persona anchor for all idea targeting |
| `desire_1` | structured (see below) | — | First desire to ladder |
| `desire_2` | structured | — | Second desire to ladder |
| `desire_3` | structured | — | Third desire to ladder |

**Desire ladder structure** (repeated for each desire):

Each desire is its own mini-exercise with its own dimensions. The UI presents them as three separate "ladders" with visual indent arrows showing the progressive depth.

```
desire_text: "They want to..." (text)
so_i_can_1: "...so they can..." (text)
so_i_can_2: "...so they can..." (text)
so_i_can_3: "...so they can..." (text, highlighted as "emotional core")

// Dimensions for THIS desire (appear after ladder is complete):
urgency: 1-5 slider
repeats: 1-5 slider
who_cares: select
```

**Prompt copy for the exercise intro (not per-field):**
> "List three desires your audience has. For each one, keep asking 'so they can what?' until you reach the emotional core. The top of the ladder is always the bigger room."

**Teaching point to embed in UI:** "The further up the ladder you go, the more people share the desire. 'I want to lose 10 lbs' is a small room. 'I want to feel confident' is a stadium."

**Per-desire dimensions** (inside each ladder card, appear after all 4 rungs filled):

| Field | Type | Label | Scale endpoints | Why Prompt A needs it |
|-------|------|-------|-----------------|----------------------|
| `urgency` | 1-5 slider | "How urgent is this for them?" | Mild annoyance ↔ Keeps them up at night | Filters ideas toward high-urgency angles |
| `repeats` | 1-5 slider | "How often does this come up?" | One-time thing ↔ Comes up constantly | Identifies evergreen vs. one-shot content |
| `who_cares` | select | "This desire is..." | Very specific / Somewhat common / Nearly universal | Core room-size input |

**Field count:** 7 fields per desire × 3 desires = 21 inputs total
**UX note:** The ladder UI uses progressive disclosure — each rung appears after the previous is filled, dimensions appear after ladder is complete. Visual indent arrows show the deepening chain.

---

#### Lesson 3: The Tell Layers

**Purpose:** Capture what the audience thinks at three depths — what they say publicly, what they'd never admit, and what they don't yet know about themselves.

| Field | Type | Prompt copy | Why Prompt A needs it |
|-------|------|-------------|----------------------|
| `will_tell_1` | text | "What's something they openly say about their situation? The thing they'd post or tell a friend." | Relatable/validation content angles |
| `will_tell_2` | text | "Another thing they say out loud?" | |
| `will_tell_3` | text | "One more?" | |
| `wont_tell_1` | text | "What's something they think but would never admit publicly? The embarrassing truth." | Callout/hook content — strongest attention |
| `wont_tell_2` | text | "Another thing they'd never admit?" | |
| `wont_tell_3` | text | "One more secret thought?" | |
| `cant_tell_1` | text | "What don't they know yet about their own situation? The insight they're missing." | Teaching/contrarian content — "here's what's actually happening" |
| `cant_tell_2` | text | "Another thing they can't see?" | |
| `cant_tell_3` | text | "One more blind spot?" | |

**Teaching point to embed in UI:** "Will-tell makes them feel seen. Won't-tell makes them stop scrolling. Can't-tell makes them trust you."

**Field count:** 9 fields
**UX note:** Group these as three distinct "layers" with visual separation. The won't-tell section should feel like you're asking for secrets — different energy than the others.

---

#### Lesson 4: Awareness Read

**Purpose:** Capture the questions strangers ask at different awareness levels. Content that answers stranger-level questions gets stranger reach.

| Field | Type | Prompt copy | Why Prompt A needs it |
|-------|------|-------------|----------------------|
| `unaware_questions` | text (multi-line or 3 inputs) | "What questions do people ask when they don't even know they have this problem yet? (Think: what they'd Google before they know your solution exists)" | Widest-reach content: identification content |
| `problem_aware_questions` | text (multi-line or 3 inputs) | "What questions do people ask when they feel the problem but don't know solutions exist?" | High-reach content: name and dramatize the problem |
| `solution_aware_questions` | text (multi-line or 3 inputs) | "What questions do people ask when they know solutions exist but haven't found yours?" | Proof and mechanism content |
| `product_aware_questions` | text (multi-line or 3 inputs) | "What questions do people ask when they know about YOU but haven't bought/followed yet?" | Lands with existing followers, not strangers |

**Teaching point to embed in UI:** "Most creators only make content for the bottom two levels — insider content, updates about themselves. That's why it doesn't reach. Stranger reach lives at the top."

**Skip Most Aware:** The spec notes that "most aware" = ready to buy, zero reach. Not useful for content idea generation — these people don't need to be convinced, they need a link.

**Field count:** 4 fields (each potentially multi-line or 3 sub-inputs = 12 questions total)
**UX note:** Frame this as "What would they type into Google?" — makes the question concrete.

---

#### Lesson 5: Saturation Read

**Purpose:** Identify what's already been said to death in their niche, so the generator avoids producing 100 ideas everyone's already made.

| Field | Type | Prompt copy | Why Prompt A needs it |
|-------|------|-------------|----------------------|
| `saturated_topics` | text (multi-line, 3-5 items) | "What topics in your niche have been posted to death? The obvious takes everyone makes." | Explicit exclusion list for Prompt A |
| `saturated_formats` | text (multi-line, 2-3 items) | "What content formats or hooks are overdone? (e.g., 'day in my life,' 'unpopular opinion:...')" | Format/hook exclusion |
| `competitor_angles` | text (multi-line, 3-5 items) | "What angles do your competitors keep using? The messages your audience has heard 100 times." | Competitive differentiation |
| `sophistication_stage` | select | "How burned out is your audience on this topic?" [1: Nobody's said this yet / 2: A few have, I can go bigger / 3: Everyone's said it, need a new angle / 4: Even the new angles are copied / 5: Total burnout, need identity play] | Tells Prompt A how much mechanism/reframe work is needed |

**Teaching point to embed in UI:** "This is why 'proven' topics still flop for you — you arrived at stage 3 with stage 1 execution. The generator won't make that mistake."

**Prescription display (read-only, based on stage selection):**
- Stage 1: You're first. Just say it clearly.
- Stage 2: Others have said it. Go bolder — say what they were afraid to.
- Stage 3: Everyone's made the claim. Show HOW it works, not just what.
- Stage 4: Everyone's explained it. Go where they didn't — the part they oversimplified.
- Stage 5: They've tuned out tips. Show what life looks like on the other side.

**Field count:** 4 fields
**UX note:** The "saturated topics" field is cathartic — they get to vent about what they're sick of seeing.

---

### 3.1.1 Field summary

| Lesson | Fields | Total inputs | Purpose |
|--------|--------|--------------|---------|
| L1 | 4 | 4 | Creator profile |
| L2 | 1 + (7 × 3 desires) | 22 | Audience + desire inventory with per-desire dimensions |
| L3 | 9 | 9 | Tell layers for hooks |
| L4 | 4 (12 questions total) | 12 | Awareness targeting |
| L5 | 4 | ~12 lines | Saturation avoidance |
| **Total** | **~30 fields** | **~59 inputs** | |

**Design constraint met:** Each lesson has its own fields. Students fill as they learn, not all at once at the end.
**All fields required:** No skipping, no partial completion.

---

### 3.1.2 All fields required `[LOCKED]`

**Decision:** All fields are required. No "skip for now." No partial completion.

**Rationale:** Garbage input = garbage output. Lazy inputs lead to weak ideas, which leads to refund requests and bad word-of-mouth. The intro video will set this expectation explicitly: "The generator is only as good as what you feed it."

**UX behavior:**
- Show completion progress per lesson
- Generator button disabled until 100% complete
- No field is optional

---

### 3.1.3 Generation limits `[LOCKED]`

**Decision:** 3 generations per purchase.

**Rationale:** Protects API costs on a $29 product. Also creates productive pressure — students must review their inputs before running.

**UX copy before generation:**
> "You have 3 generations. Once you run the generator, you'll use one. Review your inputs carefully — better inputs = better ideas."

**After generation:**
> "Generations remaining: 2"

**Edge case:** If someone genuinely needs a reset (e.g., pivoted niches), handle via support. Don't build a self-serve reset — it gets abused.

---

### 3.1.4 Output export `[LOCKED]`

**Decision:** Allow CSV download of all 100 ideas.

**Format:**
```csv
id,idea,room_rationale,urgency,staying_power,scope,hook_will_tell,hook_wont_tell,hook_cant_tell
1,"Idea text here","Why this reaches strangers",4,5,4,"Hook 1","Hook 2","Hook 3"
...
```

**UX:** "Download as CSV" button below the idea list. Also include copy button per-idea (existing spec).

---

### 3.1.5 How fields feed Prompt A

The prompt receives structured data, not a wall of text. Payload shape:

```json
{
  "creator": {
    "niche": "...",
    "what_you_do": "...",
    "what_you_teach": "...",
    "formats": ["short-form video", "carousel"]
  },
  "audience": {
    "description": "...",
    "desires": [
      {
        "want": "...",
        "so_i_can": ["...", "...", "..."],
        "ladder_top": "..."
      }
    ],
    "urgency": 4,
    "staying_power": 5,
    "scope": "most_people"
  },
  "tell_layers": {
    "will_tell": ["...", "...", "..."],
    "wont_tell": ["...", "...", "..."],
    "cant_tell": ["...", "...", "..."]
  },
  "awareness": {
    "unaware": ["...", "..."],
    "problem_aware": ["...", "..."],
    "solution_aware": ["...", "..."]
  },
  "saturation": {
    "dead_topics": ["...", "..."],
    "dead_formats": ["...", "..."],
    "competitor_angles": ["...", "..."],
    "stage": 3
  }
}
```

**Prompt A instructions will:**
1. Weight idea generation toward high-scope desires (top of ladder)
2. Generate hooks using the three tell layers (will/won't/can't)
3. Skew toward unaware + problem_aware questions for reach
4. Explicitly exclude dead_topics and competitor_angles
5. Apply stage-appropriate mechanism work based on sophistication

---

### 3.1.6 Legacy summary (for reference)

| Field group | Captures | Fed by lesson |
|---|---|---|
| Who they are | niche, what they do, what they know | L1 |
| Who they serve | the specific person, where they're stuck | L2 |
| Desire inventory | what that person wants, laddered up | L2 |
| The tell layers | will tell / won't tell / can't tell | L3 |
| Awareness read | what a stranger already knows vs. doesn't | L4 |
| Saturation read | what's already been posted to death in their niche | L5 |

### 3.2 Output object

```json
{
  "id": "string",
  "idea": "string",
  "room_rationale": "string — why this reaches past existing followers",
  "scores": { "urgency": 1-5, "staying_power": 1-5, "scope": 1-5 },
  "hooks": [
    { "type": "TBD", "text": "string" },
    { "type": "TBD", "text": "string" },
    { "type": "TBD", "text": "string" }
  ],
  "copy_payload": "idea + selected hook + Prompt B"
}
```

**Open design question:** are scores shown to the student or used internally to rank/filter? Showing them makes the output feel rigorous and reinforces the teaching. Showing them also invites arguing with the number. Lean toward showing, ranked highest-scope first.

### 3.3 The two prompts — this is the IP

**Prompt A** — turns the input form into 100 ideas.
**Prompt B** — the hidden per-idea prompt shipped in the copy button; expands one idea into a script/post.

> **The moat is Prompt A and the input form, not the AI.** If the 100 ideas come back generic, the whole offer reads as a ChatGPT wrapper and dies on refund requests. Prompt A must encode the thesis — room size, desire dimensions, awareness match, saturation avoidance — as hard constraints, not vibes.

Requirements for Prompt A:
- Rejects small-room ideas rather than padding to hit 100. Quality floor beats the round number. If it can only produce 60 good ones, that needs a designed behavior (generate fewer, or widen inputs and retry).
- No duplicates-in-disguise. 100 rewordings of 8 ideas is the obvious failure mode.
- Must cover a spread of awareness levels, weighted toward stranger-facing.
- Must avoid saturated angles unless it supplies a new mechanism.

---

## 4. Source mechanics — Breakthrough Advertising, modernized

Source: Schwartz's *Breakthrough Advertising* (1966) via the Brian Kurtz / Chris Mason bundle Ryan owns.

> **IP note:** the *concepts* — mass desire, states of awareness, market sophistication — are Schwartz's ideas and are fair to teach; nobody owns them. The bundle's specific spreadsheets, worksheet wording, chart layouts, and lesson videos are Kurtz/Mason's copyrighted material. **Take cues, rebuild everything.** All worksheets, forms, wording, and examples in this product must be written from scratch in Ryan's language, aimed at views-not-sales. This is also just better product — theirs is aimed at direct-response copywriters, not creators.

### 4.1 Desire → "the size of the room" `[DRAFT]`

Three dimensions, scored 1–5:

| Schwartz | Modernized for content |
|---|---|
| Urgency — intensity of the want | How badly does this bug them *right now* |
| Staying Power — satisfied once, or recurring | Does this keep mattering, or is it solved and forgotten |
| Scope — how many people share the desire | **How many people would stop scrolling for this** ← the room |

Scope is the load-bearing one. It is literally room size, already quantified in the original framework.

**The laddering mechanic:** "I want X… so I can Y… so I can Z… so I can W." Chasing a narrow desire up the ladder lands on what it's *really* about — which is nearly always a bigger room. This is the core move for widening an idea, and it's a generation mechanic, not just analysis.

### 4.2 The three layers (source: will/won't/can't tell) `[LOCKED]`

The sharpest content mechanic in the source material. Three layers of what a person in the market is thinking:

| Source term | UI label | What it is | Content it produces |
|---|---|---|---|
| Will tell | **What they say** | What they say out loud, publicly | Relatable / validation content |
| Won't tell | **What they hide** | The shameful thing they'd never admit | Callout content — strongest hooks |
| Can't tell | **What they don't know** | What they don't yet know about their own situation | Teaching / contrarian content |

**Leading candidate for the 3 hook variations.** See §5.

### 4.3 Awareness → how much a stranger needs to already know `[DRAFT]`

Schwartz's five levels, translated:

| Level | Original | For content |
|---|---|---|
| Unaware | Doesn't know they have the problem | Identification content — "you are this person." Reaches widest |
| Problem Aware | Feels the problem, doesn't know solutions exist | Biggest stranger-reach zone. Name and dramatize the problem |
| Solution Aware | Knows solutions exist, not yours | Proof and mechanism content |
| Product/Creator Aware | Knows you, hasn't bought in | Lands with followers, not strangers |
| Most Aware | Ready, just needs the nudge | Offers. Zero reach |

**The teaching point:** most people make content at the bottom two levels — insider content, references only their followers get, updates about themselves — and then wonder why it didn't reach. **Reach lives at the top two levels.** This is a second, independent explanation for why videos flop, and it's directly actionable.

Reusable exercise (rebuilt): *what questions is this person asking themselves at each level?* Content that answers a stranger-level question gets stranger reach.

### 4.4 Sophistication → how done-to-death is this angle `[DRAFT]`

Schwartz's five stages, translated to: **how many times has your audience already seen this exact content?**

| Stage | State | What the content has to do |
|---|---|---|
| 1 | Nobody's said this | Just say it plainly. Rare |
| 2 | A few have | Say it bigger / go further than they did |
| 3 | Everyone's said it, nobody believes it | **Need a new mechanism.** Shift from *what* to *how it actually works* |
| 4 | Your mechanism is now copied too | Extend it — make it explain more than theirs does |
| 5 | Total burnout, they've tuned out | Stop arguing the point. Use identity — "this is who we are" |

**Why this matters more than it looks:** it answers the exact frustration creators feel but can't articulate — *"this topic worked for someone else, why did mine flop?"* Because they arrived at stage 3 with stage 1 execution. This is also the guardrail that keeps the generator from producing 100 ideas everyone's already made.

### 4.5 Headline patterns `[DRAFT]`

The source Ch. 4 exercise: pick several headline patterns, write five headlines each against one idea, to force new angles on the same core. Relevant structurally to **3 hooks per idea** — same idea, different pattern.

Write our own pattern set. Don't reuse theirs.

---

## 5. Hook taxonomy `[OPEN — next decision]`

The 3 variations must be **3 distinct mechanisms**, not 3 rewordings. Rewordings feel like padding and undercut the whole "tangible" promise.

**Leading candidate** — map to §4.2:

| Hook | Mechanism | Feels like |
|---|---|---|
| 1 | **Will tell** | "You've said this out loud" — instant recognition |
| 2 | **Won't tell** | "You've thought this and never admitted it" — the callout |
| 3 | **Can't tell** | "Here's what's actually happening" — the reveal |

Why it's promising: each targets a different psychological entry point, they're mutually exclusive by construction, and they're derived from the same input data the form already collects — so no extra fields needed.

**To validate:** does hook 1 (will tell) actually perform, or is it the weakest of the three because it tells people what they already know? Possible replacement: an awareness-level split instead (unaware / problem-aware / solution-aware openers). Test before locking.

---

## 6. Lesson architecture `[LOCKED]`

| # | Title (student-facing) | Teaches | Fills |
|---|---|---|---|
| 1 | Why Your Content Isn't Getting Views | The reframe: room size > hooks | Creator profile (4 fields) |
| 2 | What They Actually Want | Desire laddering to find the big room | Audience + desire inventory |
| 3 | Getting In Their Head | Will / won't / can't tell layers | Tell layers (9 fields) |
| 4 | Reaching People Who Don't Know You | Awareness levels — why insider content dies | Awareness questions |
| 5 | Setting Yourself Apart | Saturation — why "proven" topics still flop | Saturation read |
| 6 | Generate 100 Ideas | Run the generator | — |

**UI built:** `/src/components/flop-proof/` — forms for all 5 lessons + generator UI with generation counter and CSV export.

**Progressive disclosure help:** HelpDrawer component added for complex fields. Slide-in drawer with 1-3 sentence explanation + 3 consistent examples (football recruiting coach, meal prep mom, Lightroom photographer).

Keep it short. The model offer is one 20-minute video at $29; anything that feels like a 6-hour curriculum breaks the "easy" promise that made the offer attractive in the first place.

---

### 6.1 Lesson content — what gets taught `[IN PROGRESS]`

#### Lesson 1: Why Your Content Isn't Getting Views `[LOCKED]`

**Core concept:** The room-size reframe. Your content isn't failing because of your hook, editing, or posting time. It's failing because the topic only appeals to a room too small to matter. The algorithm tests your video on a small audience first — if the topic only matters to your followers, it stops pushing.

**The aha moment:** "Wait — my hooks weren't the problem. My editing wasn't the problem. The idea was the problem. I kept picking topics that only my followers cared about, then blaming my execution when it didn't spread."

**Proof asset used:** TAM-bubbles Reel test (same hook/structure, different topics → 14K / 3K / 2K views). Concrete evidence that topic > execution.

**Video structure:**
1. Here's why your content isn't getting views (room size concept)
2. Here's proof (TAM test results)
3. Here's what this course does instead (skip the 100-post grind)
4. Here's how the inputs work (fill it out, 3 tries, don't half-ass it)
5. Walk through the 4 fields

**Fields filled:** niche, core_problem, what_you_do, what_you_teach

**Teaching vs. form:** The room-size concept must be explained in the video. The 4 profile fields are straightforward — HelpDrawer provides guidance, no special instruction needed in video beyond quick walkthrough with examples.

---

#### Lesson 2: What They Actually Want `[LOCKED]`

**Core concept:** Desire laddering. Your audience has desires, but the surface-level desire is a small room. When you keep asking "why do they want that?" you dig down to the emotional core — which is always more universal. The last rung of the ladder is where your reach lives.

**The aha moment:** "I've been making content about the *thing they want* when I should be making content about *why they want it*. The topic I've been stuck on is at the surface — of course only my followers care. The emotional core is where strangers connect."

**Key teaching points:**
1. Each rung must answer WHY, not what happens next. "Get recruited → Play college ball" is wrong (goal sequence). "Get recruited → Keep playing the sport I love" is right (emotional why).
2. The last rung is always more universal than the first. "Get recruited" = only HS athletes care. "Not have the dream die" = everyone understands that fear.
3. The three dimensions (urgency, staying power, scope) help you pick which desires are worth building content around.

**Video structure:**
1. Who is your person? Not a demographic — a specific person with a situation.
2. What do they want? List 3 desires. Surface level is fine for now.
3. But why? Introduce the ladder. Keep asking "so they can what?"
4. The punchline: the last rung is always the bigger room.
5. Score it: urgency, staying power, scope.
6. Walk through the form with examples.

**Fields filled:** audience_description, desire_1-3 (each with 4 ladder rungs + 3 dimensions)

**Teaching vs. form:** The laddering concept MUST be explained in video — without it, the form feels like busywork. The dimensions are per-desire (inside each ladder card), with plain-language labels and HelpDrawer examples. The ladder UI progressively reveals rungs and uses visual indent arrows to show the WHY chain. Final rung (emotional core) is highlighted green.

**HelpDrawer examples (consistent across course):**
- Football recruiting coach: "Get recruited → Keep playing the sport I love → Know the early mornings meant something → Not have the dream die"
- Meal prep mom: "Have dinners planned → Stop dreading 5pm every day → Have one less thing draining me → Have energy to actually enjoy my evening"
- Lightroom photographer: "Make photos look professional → Not be embarrassed to share them → Feel like I'm actually improving → Feel like a photographer, not just someone with an expensive camera"

**Why these examples work:** Each ladder shows WHY chains (not goal sequences), and the last rung hits a specific, visceral emotional core — not vague platitudes like "feel like a good mom" or "be proud."

---

#### Lesson 3: Getting In Their Head `[LOCKED]`

**Core concept:** Your audience thinks at three depths. Most creators only speak to the surface — what they'd openly say — which feels like validation but doesn't stop the scroll.

| Layer | UI label | What it is | Content it creates |
|-------|----------|------------|-------------------|
| **What they say** | "What they say" | What they openly say | Validation — they feel seen, but it's the weakest hook because you're telling them what they already know |
| **What they hide** | "What they hide" | The embarrassing truth they'd never admit | **Callout hooks** — the "he's in my head" moment. This stops the scroll |
| **What they don't know** | "What they don't know" | The insight they're missing | Teaching content — positions you as the expert who sees what they can't |

**The aha moment:** "My content keeps saying what they already know. That's why it feels flat — it's all surface-level. The hidden layer is where they stop scrolling. The blind spots are where they start trusting me. I left the two strongest layers on the table."

**Key teaching points:**
1. "What they say" makes them feel seen, but it's the safest, weakest content. Everyone's making it.
2. "What they hide" is where hooks live — you say the thing they've never admitted out loud. That's the "how did you know?" moment.
3. "What they don't know" positions you as the expert. You see something about their situation they can't see yet. This builds authority.
4. Most creators default to the surface because it feels safe. The breakthrough is going to the deeper layers.

**Video structure:**
1. Why validation content feels safe but doesn't break out
2. The three layers with examples
3. Why "what they hide" is where the hooks live
4. Why "what they don't know" builds authority
5. Walk through the form — 3 entries per layer

**Fields filled:** will_tell_1-3, wont_tell_1-3, cant_tell_1-3

**Teaching vs. form:** The three-layer concept MUST be explained in video — without it, the form feels like random prompts. HelpDrawer provides quick reminders with consistent examples.

**HelpDrawer examples (consistent across course):**

**"What they say" examples:**
- Football recruiting coach: "I just need to get seen by coaches" / "The competition is crazy these days" / "My highlight tape is solid"
- Meal prep mom: "I don't have time to cook every night" / "My kids are picky eaters" / "Takeout is so expensive"
- Lightroom photographer: "Presets never look the same on my photos" / "I've watched so many tutorials" / "My edits look too edited"

**"What they hide" examples:**
- Football recruiting coach: "I'm terrified the whole thing was a waste of time" / "I don't actually know if I'm good enough" / "I'm scared to hear I peaked in high school"
- Meal prep mom: "I feel like a failure feeding them chicken nuggets again" / "I'm too tired to care by 6pm" / "My mom did this without complaining and I can't"
- Lightroom photographer: "I'm embarrassed to show my edited photos" / "I think I might just not have the eye for this" / "I feel like a fraud calling myself a photographer"

**"What they don't know" examples:**
- Football recruiting coach: "Coaches aren't evaluating your tape — they're evaluating whether you're coachable" / "The recruiting process tests character, not just talent" / "Your online presence matters more than your highlight reel"
- Meal prep mom: "The problem isn't recipes, it's decision fatigue at 5pm" / "You don't need a meal plan — you need decisions removed" / "Batch cooking once won't solve this — you need recurring decisions eliminated"
- Lightroom photographer: "You're editing based on what looks 'right' instead of telling a story" / "Presets are starting points, not finishes — you need to read the histogram" / "You're over-editing because you don't trust the original shot"

---

#### Lesson 4: Reaching People Who Don't Know You `[LOCKED]`

**Core concept:** Awareness levels. Your audience isn't one group — it's a spectrum from "never heard of you" to "ready to buy." Most creators only make content for the bottom of the spectrum: insider content that references their methods, their products, their previous videos. That content lands with followers but dies with strangers. The algorithm can't push it because strangers don't get it. Stranger reach lives at the top of the awareness ladder.

**The aha moment:** "I've been making content for people who already follow me — no wonder it doesn't reach anyone new. The algorithm can't push my video past my followers when the video is *about* my followers. Strangers need content that meets them where they are."

**Key teaching points:**
1. **Four levels that matter for content** (skip "Most Aware" — they just need a link, no content required):
   - **Unaware:** They don't even know they have a problem yet. They're searching for identity and general improvement.
   - **Problem Aware:** They feel the pain but don't know solutions exist. They're describing symptoms.
   - **Solution Aware:** They know solutions exist but don't know yours. They're comparing options.
   - **Product Aware:** They know about you but haven't bought in. This is insider content — smallest reach.

2. **Why creators default to the bottom:** You naturally talk about what you know. You reference your method, your approach, your previous videos. That feels like good content but it's invisible to strangers.

3. **Where strangers live:** Problem Aware and Unaware. These people are searching. They have questions. They just don't know you exist yet. Content that answers their questions at this level gets found.

4. **The Google test:** "What would they type into Google at each level?" Makes the abstract concrete. If you can imagine the search query, you can make the content.

**Video structure:**
1. Why your content only reaches your followers (you're making insider content)
2. The 4 awareness levels explained — who is this person, what do they know?
3. Why the top two levels are where strangers live
4. The Google test: what would they search at each level?
5. Walk through the form with examples

**Fields filled:** unaware_questions, problem_aware_questions, solution_aware_questions, product_aware_questions

**Teaching vs. form:** The awareness ladder MUST be explained in video — without it, the form is just four random text boxes. The "Google test" framing makes the exercise concrete. HelpDrawer provides examples for each level using the consistent 3 personas.

**HelpDrawer examples (consistent across course):**

**Unaware** (widest reach — identification content, "you are this person"):
- Football recruiting coach: "How do I make my kid stand out?" / "Is travel ball worth it?" / "Should my son specialize in one sport?"
- Meal prep mom: "Why am I so tired by 5pm?" / "How do other moms have energy at night?" / "Is it normal to dread dinner time?"
- Lightroom photographer: "Why don't my photos look like what I saw?" / "How do photographers get those colors?" / "Why does my camera make everything look flat?"
- *Note: They're not searching for solutions. They're searching for identity and understanding.*

**Problem Aware** (high reach — they feel the problem, don't know solutions):
- Football recruiting coach: "How does college recruiting actually work?" / "When should my kid start getting recruited?" / "Why aren't coaches reaching out?"
- Meal prep mom: "How do I stop eating out every night?" / "What can I make that's fast and my kids will eat?" / "How do I stick to a meal plan?"
- Lightroom photographer: "How do I make my edits look less edited?" / "Why do presets look different on my photos?" / "How do I get consistent edits?"
- *Note: They're describing symptoms and pain points. No brand names, no specific solutions.*

**Solution Aware** (moderate reach — comparing options):
- Football recruiting coach: "What recruiting services are worth it?" / "Should I hire a recruiting consultant?" / "What makes a good highlight video?"
- Meal prep mom: "What's the best meal planning app?" / "Which meal delivery service is best for families?" / "Is batch cooking worth it?"
- Lightroom photographer: "What Lightroom presets do pros use?" / "Is Lightroom or Photoshop better for editing?" / "Best YouTube channels for photo editing?"
- *Note: They know the category exists. They're shopping. Still reachable but more competitive.*

**Product Aware** (narrowest reach — insider content):
- Football recruiting coach: "Does [your name]'s system work?" / "What's different about [your method]?" / "Is [your course] worth it?"
- Meal prep mom: "Has anyone tried [your meal plan]?" / "What's in [your recipe pack]?" / "Does [your method] work for picky eaters?"
- Lightroom photographer: "Are [your presets] worth the price?" / "What's different about [your editing style]?" / "Does [your course] cover portraits?"
- *Note: This content only lands with people who already know you exist. Lowest reach, but necessary for conversion.*

**Why these examples work:** Each level shows progressively more specific knowledge. Unaware = no problem language. Problem Aware = symptoms, not solutions. Solution Aware = category shopping. Product Aware = brand-specific. The progression makes the concept click.

---

#### Lesson 5: Setting Yourself Apart `[LOCKED]`

**Core concept:** Market saturation. Even a "proven" topic can flop if you execute it the way everyone else already has. Your audience has seen the same takes, the same hooks, the same formats — and they've tuned out. The generator needs to know what's already been done to death so it can avoid producing ideas your audience will scroll past.

**The aha moment:** "That topic worked for someone else because they got there first. By the time I made it, everyone had already heard it. It's not that my idea was bad — I just showed up with a stage 1 take to a stage 3 audience."

**Key teaching points:**
1. **Why "proven" topics flop:** A topic that worked 6 months ago has now been copied 50 times. Your audience has heard the take, seen the format, and scrolled past it. You're not competing with the original — you're competing with everyone who copied it.

2. **The three saturation inputs:**
   - **Dead topics:** What subjects have been posted to death? The obvious takes everyone makes.
   - **Dead formats:** What hooks or structures make people scroll? "Day in my life," "unpopular opinion:...", etc.
   - **Competitor angles:** What messages has your audience heard 100 times? The positioning everyone uses.

3. **The 5 market stages** (what to do at each):
   - **Stage 1 (Fresh):** Nobody's said this yet. Just say it clearly.
   - **Stage 2 (Early):** A few have said it. Go bolder — say what they were afraid to.
   - **Stage 3 (Crowded):** Everyone's made the claim. Show HOW it works, not just what.
   - **Stage 4 (Very crowded):** Everyone's explained it. Go where they didn't — the part they oversimplified.
   - **Stage 5 (Burned out):** They've tuned out tips. Show what life looks like on the other side.

4. **Why the prescription matters:** Selecting your market stage forces you to be honest about competition. The prescription tells you what kind of execution you need. The generator uses this to avoid producing stage 1 ideas for a stage 3 audience.

**Video structure:**
1. Why "proven" topics still flop (you arrived late with early execution)
2. The three saturation inputs — what to list
3. The 5 market stages explained
4. What the prescription means for your content
5. Walk through the form with examples

**Fields filled:** saturated_topics, saturated_formats, competitor_angles, sophistication_stage

**Teaching vs. form:** The 5 stages MUST be explained in video — otherwise the selector feels arbitrary. The prescription display gives immediate value: they select a stage, they see what to do about it. HelpDrawer provides examples for the three text fields.

**HelpDrawer examples (consistent across course):**

**Dead topics** (what's been posted to death):
- Football recruiting coach: "You need to email coaches" / "GPA matters for recruiting" / "Start your recruiting journey early"
- Meal prep mom: "Meal prep saves time" / "Cook once, eat all week" / "Here's what I meal prepped this Sunday"
- Lightroom photographer: "Before and after edits" / "My editing workflow" / "How I edit my photos in Lightroom"
- *Note: These aren't bad topics — they're just exhausted. Everyone has made this content.*

**Dead formats** (hooks and structures that make people scroll):
- Football recruiting coach: "Day in the life of a recruit" / "Things coaches won't tell you" / "Unpopular recruiting opinion"
- Meal prep mom: "What I eat in a day" / "Grocery haul" / "Realistic meal prep for busy moms"
- Lightroom photographer: "POV: you're editing photos" / "Presets I can't live without" / "Watch me edit this photo"
- *Note: The format itself has been copied so many times that people scroll past before they even read.*

**Competitor angles** (messages your audience has heard 100 times):
- Football recruiting coach: "Coaches want to see hustle" / "Be proactive, reach out first" / "Your highlight tape is your resume"
- Meal prep mom: "You just need to plan ahead" / "Healthy eating doesn't have to be hard" / "15-minute meals the whole family will love"
- Lightroom photographer: "Editing is where the magic happens" / "Presets are just a starting point" / "Shoot in RAW for more flexibility"
- *Note: These might be true, but your audience has heard them so many times they've stopped listening.*

**Why these examples work:** Each shows content that isn't *wrong* — it's just saturated. The creator's instinct is often to make "proven" content, but proven content has a shelf life. These examples help them recognize what to avoid.

---

## 7. Proof assets

- Ryan grew his wife's YouTube channel from zero to 56K+ subscribers, plus full brand build across channels.
- **Live experiment validating the thesis:** the TAM-bubbles Reel test — same intro and outro, different niche examples in the body. Distribution varied wildly by *which niche example was used*, holding hook and structure constant (14.1K / 3.2K / 2.2K views). Close to a controlled demonstration that the topic, not the hook, drove reach. Strong candidate for the sales page and for lesson 1. Second round in progress.

Honest confound to note: some versions were flagged as duplicates by trial reels and suppressed to 0 views, so the test isn't clean. The three that got normal distribution are the usable data.

---

## 8. Reference: the model offer

`viralmastermind.samcart.com/products/speed-to-post-ig`

The structural template this offer is built against. What makes it work:

1. Number in the name — tangible, finite, sounds doable
2. Promise is an outcome, not a topic
3. Subhead kills objections up front ("no planning, no batching, no burnout")
4. Names the real enemy — reframes the problem as friction, not ideas
5. "System," not "course" — a tool you own, not homework
6. Micro-format + low price — buy it, use it, post today
7. Explicit "for you / not for you" — repels wrong buyers so right ones lean in

**The key structural lesson:** it makes a *mindset shift* sellable by wrapping it in a *concrete promise*. The stopwatch is the packaging; the philosophy rides in behind it. That's exactly the move being run here — the tangible thing is 100 ideas, the actual teaching is idea selection.

---

## 9. Open questions

| # | Question | Blocks | Status |
|---|---|---|---|
| 1 | Hook taxonomy — lock the 3 mechanisms | Prompt A, output schema | Open |
| 2 | ~~Input form schema — exact fields, wording, order~~ | ~~Lessons, Prompt A~~ | **Answered** — see §3.1 |
| 3 | Prompt A — the 100-idea generator | Everything | **Unblocked** — lesson content complete, see §6.1 |
| 4 | Prompt B — hidden per-idea expansion prompt | Copy button | Open |
| 5 | Are the 1–5 scores shown to the student? | UI | Open |
| 6 | What happens if the model can't produce 100 good ideas? | Prompt A, UX | Open |
| 7 | Worked example — use Maggie's market or build a neutral one? | Lessons | Open |
| 8 | ~~Lesson count and length~~ | ~~Production~~ | **Answered** — 6 lessons, see §6 |
| 9 | ~~Does the generator re-run freely, or is it capped?~~ | ~~Cost, positioning~~ | **Answered** — 3 generations, see §3.1.3 |
| 10 | Sales page copy — **deliberately parked** until the above are real | Launch | Open |
| 11 | ~~What exactly gets taught in each lesson?~~ | ~~Video scripts, Prompt A~~ | **Answered** — L1-L5 complete, see §6.1 |

**Next step:** Build Prompt A. All lesson content and field definitions are locked.

---

## 10. Decision log

| Date | Decision | Reason |
|---|---|---|
| 2026-07 | Name: **The Flop-Proof Content System** | "System" > "framework" (framework sounds like homework). "Content" > "videos" (broader). "Flop" is the word that resonates and it's honest to the barely-seen reality in a way "viral" isn't |
| 2026-07 | Target the **views** desire, not followers or sales | Biggest room — most of the market is on that rung. The thesis picks the offer |
| 2026-07 | Sell **generation**, not repair | Sometimes an idea should just be trashed; "fix your idea" was the wrong mechanic |
| 2026-07 | Deliverable is **100 ideas**, not a skill | Tangibility comes from walking out holding something |
| 2026-07 | Expansion offloaded to the **user's LLM** | Protects margin on a $29 product |
| 2026-07 | **All fields required** — no skipping | Garbage in = garbage out. Lazy inputs cause bad ideas, bad reviews, refunds. Expectation set in intro video |
| 2026-07 | **3 generations per purchase** | Protects API costs. Creates pressure to review inputs before running. Edge cases handled via support |
| 2026-07 | **Short-form video assumed** | Audience filtered via sales page. Format variations within short-form can be added later with data |
| 2026-07 | **CSV export** | Let students download all 100 ideas. Standard deliverable format |
| 2026-07 | **UI before Prompt A** | Can't build the prompt without sign-off on inputs. Wireframes are the next step |
| 2026-07-23 | **UI built** | Input forms for all 5 lessons + generator UI with tooltips, generation counter, CSV export. Code in `/src/components/flop-proof/` |
| 2026-07-23 | **Lesson names locked** | Human-readable titles that communicate outcome, not jargon. See §6 |
| 2026-07-23 | **Added `core_problem` field to L1** | "What is the #1 problem you help people solve?" — anchors content to specific pain point |
| 2026-07-23 | **Per-desire dimensions** | Moved urgency/repeats/scope into each DesireLadder card instead of global. Removes ambiguity about which desire is being scored |
| 2026-07-23 | **Renamed dimension labels to plain language** | "Staying power" → "How often does this come up?" / "Scope" → "This desire is..." with options "Very specific / Somewhat common / Nearly universal". No jargon for non-marketers |
| 2026-07-23 | **Visual indent arrows in ladders** | Progressive indentation with arrow SVG showing the WHY chain depth. Last rung highlighted green as the emotional core |
| 2026-07-23 | **URL-based lesson navigation** | Each lesson gets a unique URL (`/courses/.../learn/:lessonId`). Persists on refresh |
| 2026-07-23 | **L4 content locked** | Awareness levels — "Google test" framing makes abstract concept concrete. HelpDrawer shows progressively specific knowledge at each level |
| 2026-07-23 | **L5 content locked** | Market saturation — "stage vs execution" reframe explains why proven topics flop. Prescription display teaches what to do at each stage |

### Rejected — don't revisit

| Rejected | Why |
|---|---|
| "The Idea Test" / "The Reach Filter" | A test is a *format*, not a desire. Nobody wants to evaluate their ideas — it sounds like more work, and the output is negative ("your idea is bad") |
| "Stuck at 300 Views," "Break 1K," "The View Ceiling" | Names a specific number; Ryan doesn't want the offer pinned to one |
| Anything selling "viral" | Wrong promise, wrong bar, attracts the wrong buyer |
| "Flop-Proof Your Videos" | "Content" is broader and covers more of what they post |
| "The Flop-Proof Framework" | "Framework" reads as abstract/homework — the exact trap this positioning climbed out of |
| Leading with the idea-over-hook thesis directly | It's a way of seeing, not a desire. It's the mechanism, not the headline |

---

## 11. Source materials

### 11.1 Worksheets (templates)

Location: `/assets/worksheets/`

| File | Source Chapter | What it captures |
|------|----------------|------------------|
| Desire Worksheet - Desire Worksheet (1).csv | Ch 1 | Desire laddering + will/won't/can't tell (filled for Maggie's market) |
| Desire Worksheet - Examples.csv | Ch 1 | Generic examples (make money, lose weight) |
| Desire Worksheet - Dimensions.csv | Ch 1 | Definitions: Urgency, Staying Power, Scope |
| Ch 2 Exercise - Awareness Level Questions Worksheet - Assignment.csv | Ch 2 | Blank template for awareness questions |
| Ch 2 Exercise - Awareness Level Questions Worksheet - Examples.csv | Ch 2 | Air purifier example |
| Shareable States of Awareness - Chart.pdf | Ch 2 | 5 awareness levels with message approaches |
| Ch 4 Exercise - Headline Worksheet.pdf | Ch 4 | 38 headline pattern variations template |
| Ch 8 Exercise - Identification Worksheet.md | Ch 8 | Character roles + achievement roles + product personality |

### 11.2 Lesson transcripts

Location: `/assets/transcripts/`

| File | Explains | Maps to worksheet |
|------|----------|-------------------|
| ch1-desire-worksheet.vtt | Desire laddering ("I want X so I can Y"), will/won't/can't tell layers, urgency/staying power/scope dimensions | Desire Worksheet |
| ch1-product-performance-worksheet.vtt | Features → benefits → benefit of benefit → dominant emotion → matching desire | Desire Worksheet (product side) |
| ch2-awareness-level-questions.vtt | Questions prospects ask at each awareness level, how to write for each stage | Awareness Level Questions Worksheet |
| ch3-market-sophistication.vtt | Competitive research, identifying saturation stage, prescription per stage | Market Sophistication Worksheet |
| ch4-headline-patterns.vtt | 38 headline variation patterns, practice through repetition, 5 headlines per pattern | Headline Worksheet |
| ch8-identification.vtt | Character roles (who they want to be) + achievement roles (status they want), product personality | Identification Worksheet |
