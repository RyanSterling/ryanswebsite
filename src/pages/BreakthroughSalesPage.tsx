import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'

export default function BreakthroughSalesPage() {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const handleGetAccess = () => {
    if (!isSignedIn) {
      navigate('/sign-up?redirect=/courses/breakthrough-content-strategy/learn')
      return
    }
    navigate('/courses/breakthrough-content-strategy/learn')
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Lockup */}
      <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <h2 className="font-soehne font-light text-3xl md:text-5xl text-white whitespace-nowrap relative z-10">
              Breakthrough<span className="inline-block w-3 md:w-4"></span>Content Strategy
            </h2>
            <img
              src="/bolt.svg"
              alt=""
              className="absolute w-16 h-16 md:w-24 md:h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            />
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
          <h1 className="font-soehne font-light text-3xl md:text-5xl text-white mb-6 leading-tight">
            Get More Views, Grow Your Followers, And Finally Know What Content To Make
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Going viral is luck. Getting consistent views is a skill. Learn how to pick topics that perform without hoping the algorithm randomly favors you.
          </p>
        </div>

        {/* VSL Video */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8">
          <iframe
            src="https://player.vimeo.com/video/1218773874?badge=0&autopause=0&autoplay=1&muted=1&texttrack=en&player_id=0&app_id=58479"
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
          />
        </div>

        {/* CTA after VSL */}
        <div className="text-center">
          <button
            onClick={handleGetAccess}
            className="bg-brand-orange text-white font-medium text-lg py-4 px-12 rounded-[19px] hover:opacity-90 transition-opacity"
          >
            Take the FREE course
          </button>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-brand-card rounded-2xl p-8 md:p-10">
          <h2 className="font-soehne font-light text-2xl text-white mb-6">
            Most creators are picking topics wrong.
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            You post something you think is good. It gets 200 views. You post something random and it gets 2,000. What gives?
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            The difference is topic selection. Some topics have a ceiling. They only appeal to people already in your niche. Others have reach. They pull in new followers because the topic itself is interesting to a wider audience.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            This course teaches you how to tell the difference before you hit record.
          </p>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-soehne font-light text-2xl md:text-3xl text-white mb-2">
          5 exercises. One custom AI prompt.
        </h2>
        <p className="text-gray-400 mb-8">
          Walk away with a prompt you can paste into ChatGPT or Claude to generate unlimited content ideas fitted to your audience.
        </p>

        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-brand-orange text-sm">1</span>
            </div>
            <p className="text-gray-300">
              Define your niche positioning. What makes you different from everyone else talking about this?
            </p>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-brand-orange text-sm">2</span>
            </div>
            <p className="text-gray-300">
              Map your audience's real desires. Not what you think they want, what they actually search for.
            </p>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-brand-orange text-sm">3</span>
            </div>
            <p className="text-gray-300">
              Uncover the stuff they think but won't say. The content that makes people feel "finally, someone gets it."
            </p>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-brand-orange text-sm">4</span>
            </div>
            <p className="text-gray-300">
              Identify where your audience is on the awareness ladder. Are they problem-aware or solution-shopping?
            </p>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-brand-orange text-sm">5</span>
            </div>
            <p className="text-gray-300">
              Find what's been done to death in your niche so you can avoid it.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-12 pb-24 text-center">
        <p className="text-gray-400 mb-4">Free course. About an hour of focused work.</p>
        <button
          onClick={handleGetAccess}
          className="bg-brand-orange text-white font-medium text-lg py-4 px-12 rounded-[19px] hover:opacity-90 transition-opacity"
        >
          Take the FREE course
        </button>
      </section>
    </main>
  )
}
