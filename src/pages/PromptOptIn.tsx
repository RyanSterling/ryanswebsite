import { useState, useEffect, FormEvent } from 'react'
import { useParams } from 'react-router-dom'

const N8N_WEBHOOK_URL = 'https://n8n.srv1369832.hstgr.cloud/webhook/ccf6e619-d233-4159-8ea2-9d12acdf505c'

export default function PromptOptIn() {
  const { slug } = useParams<{ slug: string }>()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(() => {
    async function fetchTitle() {
      try {
        const response = await fetch(`/assets/prompts/${slug}.md`)
        if (response.ok) {
          const text = await response.text()
          const lines = text.split('\n')
          for (const line of lines) {
            if (line.startsWith('# ')) {
              setTitle(line.replace('# ', ''))
              break
            }
          }
        }
      } catch {
        // Fallback to slug if fetch fails
      }
    }
    fetchTitle()
  }, [slug])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          prompt_slug: slug,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        setError(true)
        setSubmitting(false)
      }
    } catch {
      setError(true)
      setSubmitting(false)
    }
  }

  // Success state - check your email
  if (submitted) {
    return (
      <main className="max-w-xl mx-auto px-8 py-16 md:py-24">
        <section className="text-center">
          {/* Email icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-orange/10 border border-brand-orange/20">
              <svg className="w-10 h-10 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="font-soehne text-3xl md:text-4xl font-bold text-white mb-4">
            Check Your Email
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            I just sent <span className="text-white font-medium">{title || 'your prompt'}</span> to:
          </p>
          <p className="text-brand-orange font-semibold text-xl mb-8">
            {email}
          </p>
          <div className="bg-brand-card rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-medium">Didn't get it?</span> Check your spam folder or promotions tab. The email comes from me, Ryan Sterling.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto px-8 py-16 md:py-24">
      <section className="text-center mb-8">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wide mb-2">Free Prompt</p>
        <h1 className="font-soehne text-3xl md:text-4xl font-bold text-white mb-4">
          {title || 'Get Your Free Prompt'}
        </h1>
        <p className="text-gray-400 text-lg">
          Enter your email and I'll send it right over.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-4 rounded-xl bg-brand-card border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-colors"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-orange text-white font-semibold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Get the Prompt'}
        </button>
        {error && (
          <p className="text-red-400 text-center text-sm">
            Something went wrong. Please try again.
          </p>
        )}
      </form>

      <p className="text-gray-500 text-sm text-center mt-6">
        No spam. Unsubscribe anytime.
      </p>
    </main>
  )
}
