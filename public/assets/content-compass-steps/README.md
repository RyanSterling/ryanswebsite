# Content Compass Steps - Asset Export Guide

Export your Figma assets as individual SVGs to animate them independently.

## Step 1 - Voice Dictate
`/step-1/`
- `audio-player.svg` - The audio waveform player UI
- `icon-mercury.svg` - Mercury AI icon
- `icon-notebook.svg` - Notebook LM icon
- `icon-perplexity.svg` - Perplexity icon
- `icon-chatgpt.svg` - ChatGPT icon

## Step 2 - AI Suggests Angles
`/step-2/`
- `chat-interface.svg` - The ChatGPT interface container
- `chat-message.svg` - The AI response text bubble
- (or break down further if chat elements need separate animations)

## Step 3 - Saves to Notion
`/step-3/`

**RECOMMENDED:** Export as ONE SVG with named nested elements:
- Root SVG: `notion-board-complete.svg`
- Nested groups with IDs: `#idea-column`, `#scripted-column`, `#filmed-column`, `#posted-column`, `#notion-logo`
- This allows individual animation of each column/element via CSS or Framer Motion

**Current (individual files):**
- `idea.svg` - "Idea" column with card
- `scripted.svg` - "Scripted" column
- `filmed.svg` - "Filmed" column
- `posted.svg` - "Posted" column
- `notion.svg` - The Notion logo badge

## Animation Strategy

Each SVG will be wrapped in Framer Motion components for independent animations:
- Stagger timing (elements appear in sequence)
- Fade + slide animations
- Scale/bounce for emphasis

Export at 2x resolution for retina displays, but keep file sizes reasonable by simplifying paths where possible.
