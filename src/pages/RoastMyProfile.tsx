import { useState, FormEvent } from 'react'

const API_URL = import.meta.env.DEV
  ? 'http://localhost:8787'
  : 'https://ryan-website-api.rsterling20.workers.dev'

export default function RoastMyProfile() {
  const [email, setEmail] = useState('')
  const [handle, setHandle] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!consent) return

    setSubmitting(true)
    setError(false)

    try {
      const response = await fetch(`${API_URL}/roast-submission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          handle: handle.replace('@', ''),
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

  if (submitted) {
    return (
      <main className="max-w-xl mx-auto px-8 py-16 md:py-24">
        <section className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-orange/10 border border-brand-orange/20">
              <svg className="w-10 h-10 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="font-soehne text-3xl md:text-4xl font-bold text-white mb-4">
            You're In the Queue
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            I got your submission for <span className="text-white font-medium">@{handle.replace('@', '')}</span>
          </p>
          <div className="bg-brand-card rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-medium">What happens next?</span><br />
              If I pick your profile to roast, I'll post the reel and tag you. Keep an eye on your DMs and my page.
            </p>
          </div>

          <a
            href="/"
            className="inline-block mt-8 text-gray-500 hover:text-gray-400 transition-colors"
          >
            &larr; Back to Home
          </a>
        </section>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto px-8 py-16 md:py-24">
      <section className="text-center mb-8">
        <div className="mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden">
            <img src="/assets/portrait.png" alt="Ryan Sterling" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="font-soehne text-3xl md:text-4xl font-bold headline-gradient mb-4">
          Roast My Profile
        </h1>
        <p className="text-gray-400 text-lg">
          Submit your Instagram for a chance to get brutally honest feedback in a public reel.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-4 rounded-xl bg-brand-card border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>

        <div>
          <label htmlFor="handle" className="block text-sm text-gray-400 mb-2">
            Instagram Handle
          </label>
          <input
            type="text"
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@yourhandle"
            required
            className="w-full px-4 py-4 rounded-xl bg-brand-card border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>

        <div className="bg-brand-card rounded-xl p-4 border border-gray-700">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800 text-brand-orange focus:ring-brand-orange focus:ring-offset-0"
            />
            <span className="text-sm text-gray-300">
              I understand my profile will be reviewed publicly in an Instagram Reel. I'm okay with honest, direct feedback being shared with Ryan's audience.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting || !consent}
          className="w-full bg-brand-orange text-white font-semibold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit My Profile'}
        </button>

        {error && (
          <p className="text-red-400 text-center text-sm">
            Something went wrong. Please try again.
          </p>
        )}
      </form>

      <p className="text-gray-500 text-sm text-center mt-6">
        Submitting doesn't guarantee you'll be featured. I pick profiles that will make for helpful, educational content.
      </p>

      <section className="text-center mt-8">
        <a href="/" className="text-gray-500 hover:text-gray-400 transition-colors">
          &larr; Back to Home
        </a>
      </section>
    </main>
  )
}
