import { useState, useEffect, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const N8N_WEBHOOK_URL = 'https://n8n.srv1369832.hstgr.cloud/webhook/ccf6e619-d233-4159-8ea2-9d12acdf505c'

export default function PromptOptIn() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
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
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          prompt_slug: slug,
          timestamp: new Date().toISOString(),
        }),
      })

      // Redirect to prompt page regardless of webhook response
      navigate(`/prompts/${slug}`)
    } catch {
      // Still redirect even if webhook fails - don't block the user
      navigate(`/prompts/${slug}`)
    }
  }

  return (
    <main className="max-w-xl mx-auto px-8 py-16 md:py-24">
      <section className="text-center mb-8">
        <h1 className="font-soehne text-3xl md:text-4xl font-bold text-white mb-4">
          {title ? `Get "${title}"` : 'Get Your Free Prompt'}
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
          {submitting ? 'Getting your prompt...' : 'Get the Prompt'}
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
