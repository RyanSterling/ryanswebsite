import { FormEvent, useState } from 'react'

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      })
      window.location.href = '/thank-you'
    } catch (error) {
      console.error('Form submission error:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-8 py-24 md:py-32">
      <div className="flex flex-col items-center gap-8">
        {/* Portrait */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-brand-orange">
          <img
            src="/assets/portrait.png"
            alt="Ryan Sterling"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Headline Section */}
        <div className="text-center">
          <h1 className="font-soehne text-4xl md:text-6xl lg:text-7xl leading-none md:leading-tight tracking-tight headline-gradient headline-gradient-mobile">
            Helping Businesses
            <br />
            Make More Money
            <br />
            With Content Creation
          </h1>
        </div>
      </div>

      {/* Contact Form */}
      <section id="contact" className="mt-16 md:mt-20 max-w-2xl mx-auto">
        <h2 className="font-soehne text-3xl md:text-4xl text-white text-center mb-12">
          Let's Work Together
        </h2>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don't fill this out: <input name="bot-field" />
            </label>
          </p>

          {/* Name */}
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
              className="w-full px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-white text-sm mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-white text-sm mb-2">
              What industry are you in? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              required
              placeholder="e.g. Real Estate, Fitness, E-commerce"
              className="w-full px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* What do you need help with */}
          <div>
            <label htmlFor="help" className="block text-white text-sm mb-2">
              What do you need help with? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="help"
              name="help"
              required
              rows={4}
              placeholder="Tell me about your content goals and challenges..."
              className="w-full px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          {/* Social Media Links */}
          <div className="pt-4">
            <p className="text-white text-sm mb-4">Your social media links</p>

            <div className="space-y-4">
              {/* TikTok */}
              <div className="flex items-center gap-3">
                <div className="w-10 flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </div>
                <input
                  type="url"
                  name="tiktok"
                  placeholder="https://tiktok.com/@yourusername"
                  className="flex-1 px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3">
                <div className="w-10 flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <input
                  type="url"
                  name="instagram"
                  placeholder="https://instagram.com/yourusername"
                  className="flex-1 px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* YouTube */}
              <div className="flex items-center gap-3">
                <div className="w-10 flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <input
                  type="url"
                  name="youtube"
                  placeholder="https://youtube.com/@yourchannel"
                  className="flex-1 px-4 py-3 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-orange text-white font-medium text-lg py-4 rounded-[19px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
