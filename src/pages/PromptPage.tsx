import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

export default function PromptPage() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchPrompt() {
      try {
        const response = await fetch(`/assets/prompts/${slug}.md`)
        if (!response.ok) {
          setError(true)
          return
        }
        const text = await response.text()
        setContent(text)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPrompt()
  }, [slug])

  const handleCopy = async () => {
    if (!content) return

    // Copy everything after the first --- (the actual prompt, not the intro)
    const parts = content.split('---')
    const promptContent = parts.length > 1 ? parts.slice(1).join('---').trim() : content

    await navigator.clipboard.writeText(promptContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Extract title and intro from markdown
  const parseContent = (md: string) => {
    const lines = md.split('\n')
    let title = ''
    let intro = ''
    let bodyStartIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('# ') && !title) {
        title = line.replace('# ', '')
        continue
      }
      if (line.startsWith('*') && line.endsWith('*') && !intro) {
        intro = line.replace(/^\*|\*$/g, '')
        continue
      }
      if (line === '---') {
        bodyStartIndex = i + 1
        break
      }
    }

    const body = lines.slice(bodyStartIndex).join('\n')
    return { title, intro, body }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-8 py-16 md:py-24">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-brand-card rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-brand-card rounded w-96 mx-auto"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !content) {
    return (
      <main className="max-w-4xl mx-auto px-8 py-16 md:py-24 text-center">
        <h1 className="font-soehne text-3xl text-white mb-4">Prompt Not Found</h1>
        <p className="text-gray-400 mb-8">
          This prompt doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-orange text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </main>
    )
  }

  const { title, intro, body } = parseContent(content)

  return (
    <main className="max-w-4xl mx-auto px-8 py-16 md:py-24">
      {/* Header */}
      <section className="text-center mb-8">
        <h1 className="font-soehne text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        {intro && (
          <p className="text-gray-400 text-lg">
            {intro}
          </p>
        )}
      </section>

      {/* Copy Button - Top */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-brand-orange text-white hover:opacity-90'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Prompt
            </>
          )}
        </button>
      </div>

      {/* Prompt Content - Fixed height with scroll */}
      <section className="relative mb-12">
        <div className="bg-brand-card rounded-2xl p-6 md:p-8 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          <div className="prose prose-invert max-w-none
          prose-headings:font-soehne
          prose-h1:text-3xl prose-h1:font-bold prose-h1:text-white prose-h1:mt-8 prose-h1:mb-4 prose-h1:border-b prose-h1:border-gray-700 prose-h1:pb-3
          prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-white prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-xl prose-h3:font-medium prose-h3:text-gray-100 prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-gray-200 prose-p:leading-relaxed prose-p:text-base
          prose-strong:text-white prose-strong:font-semibold
          prose-em:text-gray-300 prose-em:italic
          prose-ul:text-gray-200 prose-ol:text-gray-200
          prose-li:marker:text-brand-orange prose-li:my-1
          prose-blockquote:border-l-4 prose-blockquote:border-brand-orange prose-blockquote:text-gray-300 prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:my-4 prose-blockquote:not-italic
          prose-hr:border-gray-700 prose-hr:my-6
          prose-table:text-gray-200
          prose-th:text-white prose-th:font-semibold prose-th:border-gray-700 prose-th:py-2 prose-th:px-4 prose-th:bg-gray-800/50
          prose-td:border-gray-700 prose-td:py-2 prose-td:px-4
        ">
          <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </div>
        {/* Bottom fade to indicate scrollable content */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-card to-transparent rounded-b-2xl pointer-events-none"></div>
      </section>

      {/* Upsell CTA */}
      <section className="bg-brand-card rounded-2xl p-8 text-center border border-gray-800">
        <h2 className="font-soehne text-2xl font-semibold text-white mb-3">
          Want me to review your content personally?
        </h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          I'll watch your reels, react in real-time, and tell you exactly what to fix.
        </p>
        <Link
          to="/profile-audit"
          className="inline-block bg-brand-orange text-white font-semibold text-lg px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Get a Personal Audit — $97
        </Link>
      </section>
    </main>
  )
}
