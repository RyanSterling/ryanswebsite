import { useState, FormEvent } from 'react'

const AUDIT_WEBHOOK_URL = import.meta.env.VITE_AUDIT_WEBHOOK_URL || ''

interface FormData {
  name: string
  email: string
  instagram_handle: string
  primary_focus: string
  goals: string
  specific_questions: string
}

export default function AuditThankYou() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    instagram_handle: '',
    primary_focus: '',
    goals: '',
    specific_questions: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormState('submitting')

    try {
      const response = await fetch(AUDIT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormState('success')
      } else {
        throw new Error('Failed')
      }
    } catch {
      setFormState('error')
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-8 py-16 md:py-24">
      {/* Success Header */}
      <section className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-green-500">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">Payment Confirmed!</h1>
        <p className="text-gray-400 text-lg">
          I'll have your personal audit ready within 48-72 hours.
        </p>
      </section>

      {/* Intake Form */}
      {formState !== 'success' ? (
        <section className="bg-brand-card rounded-2xl p-6 md:p-8">
          <h2 className="text-white font-semibold text-xl mb-2">One quick thing...</h2>
          <p className="text-gray-400 mb-6">
            Fill out this form so I can give you the best possible review.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm mb-2">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange border border-gray-800"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm mb-2">Email (for delivery) *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange border border-gray-800"
              />
            </div>

            <div>
              <label htmlFor="instagram_handle" className="block text-gray-300 text-sm mb-2">Instagram Handle *</label>
              <input
                type="text"
                id="instagram_handle"
                name="instagram_handle"
                value={formData.instagram_handle}
                onChange={handleChange}
                required
                placeholder="@yourusername"
                className="w-full px-4 py-3 rounded-lg bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange border border-gray-800"
              />
            </div>

            <div>
              <label htmlFor="primary_focus" className="block text-gray-300 text-sm mb-2">What do you want me to focus on? *</label>
              <select
                id="primary_focus"
                name="primary_focus"
                value={formData.primary_focus}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-brand-dark text-white focus:outline-none focus:ring-2 focus:ring-brand-orange border border-gray-800"
              >
                <option value="">Select an option</option>
                <option value="Bio & Profile">Bio & Profile</option>
                <option value="Hook Writing">Hook Writing</option>
                <option value="Content Strategy">Content Strategy</option>
                <option value="Engagement/Growth">Engagement/Growth</option>
                <option value="All of the above">All of the above</option>
              </select>
            </div>

            <div>
              <label htmlFor="goals" className="block text-gray-300 text-sm mb-2">What are you trying to achieve with your account? *</label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                required
                rows={3}
                placeholder="e.g., Grow to 10k followers, build an audience for my coaching business, etc."
                className="w-full px-4 py-3 rounded-lg bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange border border-gray-800 resize-none"
              />
            </div>

            <div>
              <label htmlFor="specific_questions" className="block text-gray-300 text-sm mb-2">Any specific questions you want me to address?</label>
              <textarea
                id="specific_questions"
                name="specific_questions"
                value={formData.specific_questions}
                onChange={handleChange}
                rows={3}
                placeholder="Optional - anything specific you're wondering about"
                className="w-full px-4 py-3 rounded-lg bg-brand-dark text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange border border-gray-800 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="w-full bg-brand-orange text-white font-medium text-lg py-4 rounded-[19px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {formState === 'submitting' ? 'Sending...' : 'Submit'}
            </button>

            {formState === 'error' && (
              <div className="text-center mt-4">
                <p className="text-red-400 mb-2">Something went wrong submitting the form.</p>
                <p className="text-gray-400 text-sm">
                  If you don't hear from me within 24 hours, email me at{' '}
                  <a href="mailto:ryan@ryansterlingconsulting.com" className="text-brand-orange hover:underline">
                    ryan@ryansterlingconsulting.com
                  </a>{' '}
                  with your Instagram handle.
                </p>
              </div>
            )}
          </form>
        </section>
      ) : (
        <section className="bg-brand-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-500">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">All set!</h2>
          <p className="text-gray-400">
            I've got everything I need. You'll receive your personal audit within 48-72 hours.
          </p>
        </section>
      )}
    </main>
  )
}
