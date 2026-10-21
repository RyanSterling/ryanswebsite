import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'

export default function ContentCompassSalesPage() {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const handleGetAccess = () => {
    const checkoutUrl = '/checkout/content-compass'
    if (!isSignedIn) {
      localStorage.setItem('pendingRedirect', checkoutUrl)
      navigate(`/sign-up?redirect=${encodeURIComponent(checkoutUrl)}`)
      return
    }
    navigate(checkoutUrl)
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Lockup */}
      <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <h2 className="font-soehne font-bold text-xl sm:text-3xl md:text-5xl text-white whitespace-nowrap relative z-10">
              The Content Compass
            </h2>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>by</span>
            <img
              src="/ryan-avatar.png"
              alt="Ryan Sterling"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white font-medium">Ryan Sterling</span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-8 pb-12">
        <div className="text-center mb-10">
          <h1 className="font-soehne font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">
            Your AI-Powered Junior Content Strategist Inside Notion
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Brain dump your content ideas to AI, and let it document, organize, and prepare them for scripting — all inside a Notion template that works for you.
          </p>
        </div>

        {/* VSL Video Placeholder */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 flex items-center justify-center">
          <span className="text-gray-500">Video coming soon</span>
        </div>

        {/* CTA after VSL */}
        <div className="text-center">
          <div className="mb-4">
            <span className="text-gray-500 line-through text-lg">$97</span>
            <span className="text-white font-soehne text-3xl ml-3">$47</span>
            <span className="text-brand-orange ml-2 text-sm">Launch Price</span>
          </div>
          <button
            onClick={handleGetAccess}
            className="bg-brand-orange text-white font-medium text-lg py-4 px-12 rounded-[19px] hover:opacity-90 transition-opacity"
          >
            Get Access Now
          </button>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-brand-card rounded-2xl p-8 md:p-10">
          <h2 className="font-soehne font-bold text-2xl text-white mb-6">
            Stop losing your best content ideas.
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            You have ideas all day. In the shower. On walks. While you're trying to sleep. But by the time you sit down to create, they're gone — or you can't remember what made them good.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            What if you could brain dump every half-formed thought to an AI that actually understands your content style, then have it documented and waiting for you when you're ready to script?
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            That's exactly what this Notion template does.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-soehne font-bold text-2xl md:text-3xl text-white mb-2">
          What's included
        </h2>
        <p className="text-gray-400 mb-8">
          A complete system for capturing, developing, and organizing your content ideas.
        </p>

        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Notion Template</p>
              <p className="text-gray-400 text-sm">Duplicate and use immediately. No setup required.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">AI Brain Dump Integration</p>
              <p className="text-gray-400 text-sm">Voice or text your ideas to AI that knows your style.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Auto-Documentation</p>
              <p className="text-gray-400 text-sm">Ideas are organized and documented for you automatically.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Video Walkthroughs</p>
              <p className="text-gray-400 text-sm">Step-by-step videos showing you exactly how to use the system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-12 pb-24 text-center">
        <div className="mb-4">
          <span className="text-gray-500 line-through text-lg">$97</span>
          <span className="text-white font-soehne text-3xl ml-3">$47</span>
          <span className="text-brand-orange ml-2 text-sm">Launch Price</span>
        </div>
        <button
          onClick={handleGetAccess}
          className="bg-brand-orange text-white font-medium text-lg py-4 px-12 rounded-[19px] hover:opacity-90 transition-opacity"
        >
          Get Access Now
        </button>
        <p className="text-gray-500 text-sm mt-4">Instant access after purchase</p>
      </section>
    </main>
  )
}
