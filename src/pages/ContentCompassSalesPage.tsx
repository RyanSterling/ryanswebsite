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
    <main className="min-h-screen bg-white">
      {/* Lockup */}
      <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <h2 className="font-soehne font-bold text-xl sm:text-3xl md:text-5xl text-gray-900 whitespace-nowrap relative z-10">
              The Content Compass
            </h2>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>by</span>
            <img
              src="/ryan-avatar.png"
              alt="Ryan Sterling"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-900 font-medium">Ryan Sterling</span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-8 pb-12">
        <div className="text-center mb-10">
          <img
            src="/assets/content compass hero image.png"
            alt="The Content Compass"
            className="w-full max-w-2xl mx-auto mb-8 rounded-xl"
          />
          <h1 className="font-soehne font-bold text-3xl md:text-5xl text-gray-900 mb-6 leading-tight">
            Your AI-Powered Junior Content Strategist Inside Notion
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Voice dictate your content ideas to AI. It documents them, finds better angles for wider reach, and organizes everything for scripting — all inside a Notion template that works for you.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="mb-4">
            <span className="text-gray-400 line-through text-lg">$97</span>
            <span className="text-gray-900 font-soehne text-3xl ml-3">$47</span>
            <span className="text-brand-orange ml-2 text-sm font-medium">Launch Price</span>
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
        <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100">
          <h2 className="font-soehne font-bold text-2xl text-gray-900 mb-6">
            Stop losing your best content ideas.
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            You have ideas all day. In the shower. On walks. While you're trying to sleep. But by the time you sit down to create, they're gone — or you can't remember what made them good.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            What if you could brain dump every half-formed thought to an AI that actually understands your content style, then have it documented and waiting for you when you're ready to script?
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            That's exactly what this Notion template does.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-soehne font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          How it works
        </h2>
        <p className="text-gray-600 mb-8">
          Four simple steps to never lose a content idea again.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0 font-medium">
              1
            </div>
            <div>
              <p className="text-gray-900 font-medium">Connect Notion to your AI</p>
              <p className="text-gray-600 text-sm">One-time setup. Link your Notion workspace to your AI assistant so everything syncs automatically.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0 font-medium">
              2
            </div>
            <div>
              <p className="text-gray-900 font-medium">Load your AI with the included prompts</p>
              <p className="text-gray-600 text-sm">Copy-paste ready. No prompt engineering required — just use the ones that come with the template.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0 font-medium">
              3
            </div>
            <div>
              <p className="text-gray-900 font-medium">Teach your AI who you create for</p>
              <p className="text-gray-600 text-sm">Complete your audience profile so the AI understands your niche, your voice, and exactly who you're trying to reach.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0 font-medium">
              4
            </div>
            <div>
              <p className="text-gray-900 font-medium">Voice your ideas, get better angles back</p>
              <p className="text-gray-600 text-sm">Speak your raw thoughts. Your AI documents them, finds angles that reach more people, and saves everything to Notion — ready for you to script.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-soehne font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          What's included
        </h2>
        <p className="text-gray-600 mb-8">
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
              <p className="text-gray-900 font-medium">Notion Template</p>
              <p className="text-gray-500 text-sm">Duplicate and use immediately. No setup required.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-medium">AI Brain Dump Integration</p>
              <p className="text-gray-500 text-sm">Voice or text your ideas to AI that knows your style.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Auto-Documentation</p>
              <p className="text-gray-500 text-sm">Ideas are organized and documented for you automatically.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-medium">Video Walkthroughs</p>
              <p className="text-gray-500 text-sm">Step-by-step videos showing you exactly how to use the system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-12 pb-24 text-center">
        <div className="mb-4">
          <span className="text-gray-400 line-through text-lg">$97</span>
          <span className="text-gray-900 font-soehne text-3xl ml-3">$47</span>
          <span className="text-brand-orange ml-2 text-sm font-medium">Launch Price</span>
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
