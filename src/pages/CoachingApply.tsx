import { FormEvent, useState } from 'react'

export default function CoachingApply() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      instagram: formData.get('instagram'),
      message: formData.get('message'),
      source: 'coaching-application',
    }

    try {
      await fetch('https://n8n.srv1369832.hstgr.cloud/webhook/5d483501-fd31-44c6-b4b1-91a8674070ee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(data),
      })
      // With no-cors mode, we can't read the response but the request is sent
      window.location.href = '/thank-you'
    } catch (err) {
      console.error('Form submission error:', err)
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#111] flex flex-col items-center px-6 py-12 md:py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
            1:1 Content Coaching
          </h1>
          <p className="text-gray-400 text-lg">
            $500/month
          </p>

          {/* Scarcity indicator */}
          <div className="mt-6 inline-block">
            <div className="bg-brand-card border border-gray-800 rounded-xl px-5 py-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                {[1, 2, 3, 4, 5].map((spot) => (
                  <div
                    key={spot}
                    className={`w-3 h-3 rounded-full ${
                      spot <= 3 ? 'bg-gray-600' : 'bg-brand-orange'
                    }`}
                  />
                ))}
              </div>
              <p className="text-white text-sm font-medium">
                2 spots left at this price
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Price increases to $1,000/mo when filled
              </p>
            </div>
          </div>
        </div>

        {/* What you get */}
        <div className="bg-brand-card rounded-2xl p-6 mb-8 border border-gray-800">
          <h2 className="text-white font-semibold text-lg mb-4">How it works:</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-brand-orange mt-1">✓</span>
              <span>Every time you post, send me the link on WhatsApp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-orange mt-1">✓</span>
              <span>I send you a voice note breaking down what's working, what's not, and exactly how to make your next post better</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-orange mt-1">✓</span>
              <span>You stop guessing and start improving with every single post</span>
            </li>
          </ul>
          <p className="text-white mt-6 pt-4 border-t border-gray-700">
            Most creators spend months or years posting and hoping something hits. With a content strategist reviewing everything you post, you'll develop real skill instead of just gambling with the algorithm.
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white text-sm mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-800"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-white text-sm mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-800"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-white text-sm mb-2">
              Instagram Handle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              required
              placeholder="@yourusername"
              className="w-full px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-800"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-white text-sm mb-2">
              What are you struggling with? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Tell me about your content challenges and goals..."
              className="w-full px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-800 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-orange text-white font-semibold text-lg py-4 rounded-2xl hover:bg-brand-orange/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Apply Now'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          I'll review your application and reach out within 24 hours.
        </p>
      </div>
    </main>
  )
}
