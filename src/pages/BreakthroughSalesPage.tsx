import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'

export default function BreakthroughSalesPage() {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const handleBuy = () => {
    if (!isSignedIn) {
      navigate('/sign-up?redirect=/checkout/breakthrough-content-strategy')
      return
    }
    navigate('/checkout/breakthrough-content-strategy')
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Hero: Headline + Subhead + VSL */}
      <section className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <div className="text-center mb-10">
          <h1 className="font-soehne text-3xl md:text-5xl text-white mb-6 leading-tight">
            Finally get views on your content, even if you've been posting for months with nothing to show for it.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            The algorithm shows your content to strangers when your topics have broad appeal. Most creators pick topics only their existing audience cares about—then wonder why growth is flat.
          </p>
        </div>

        {/* VSL Video */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <iframe
            src="https://player.vimeo.com/video/1214096214?badge=0&autopause=0&autoplay=1&muted=1&texttrack=en&player_id=0&app_id=58479"
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
          />
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="font-soehne text-3xl md:text-4xl text-white mb-6">
            Here's what you get
          </h2>
        </div>

        <div className="space-y-8 max-w-2xl mx-auto">
          {/* Item 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <span className="text-brand-orange font-medium">1</span>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-2">
                The real reason your content isn't getting views
              </h3>
              <p className="text-gray-400">
                It's not your hooks. It's not the algorithm. It's the topics you're choosing. You'll understand exactly why strangers scroll past your content—and what to do instead.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <span className="text-brand-orange font-medium">2</span>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-2">
                A clear picture of what your audience actually wants
              </h3>
              <p className="text-gray-400">
                Not what you think they want. Not what you want to talk about. What they're actively searching for right now—at every stage from curious to ready to buy.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <span className="text-brand-orange font-medium">3</span>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-2">
                50 content ideas built from your answers
              </h3>
              <p className="text-gray-400">
                Not generic prompts. Ideas generated from your niche, your audience, and your unique angle. Each one scored so you know which to post first.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <span className="text-brand-orange font-medium">4</span>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-2">
                A custom prompt to generate more ideas whenever you want
              </h3>
              <p className="text-gray-400">
                Take it to ChatGPT or Claude. Get fresh ideas that fit your positioning—forever. No more staring at a blank screen wondering what to post.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="font-soehne text-3xl md:text-4xl text-white mb-4">
            This isn't just information
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            You don't watch videos and hope for the best. You input your data, and the system builds a strategy that only works for you.
          </p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="relative">
          {/* Connection Line - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-0.5 bg-gradient-to-r from-brand-orange to-green-400" />

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* Input Side */}
            <div className="bg-brand-card rounded-2xl p-8 border border-gray-800 relative">
              <div className="absolute -top-3 left-6 bg-brand-orange text-white text-xs font-medium px-3 py-1 rounded-full">
                You input
              </div>
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">Your niche</div>
                    <div className="text-gray-500 text-sm">Who you help and what problem you solve</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">Your audience</div>
                    <div className="text-gray-500 text-sm">What they want, fear, and search for</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">Your edge</div>
                    <div className="text-gray-500 text-sm">What makes you different from everyone else</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow for mobile */}
            <div className="flex justify-center md:hidden">
              <div className="w-0.5 h-8 bg-gradient-to-b from-brand-orange to-green-400" />
            </div>

            {/* Output Side */}
            <div className="bg-brand-card rounded-2xl p-8 border border-gray-800 relative">
              <div className="absolute -top-3 left-6 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                You get
              </div>
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">50 content ideas</div>
                    <div className="text-gray-500 text-sm">Personalized to your positioning</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">4 hooks per idea</div>
                    <div className="text-gray-500 text-sm">Different angles to test what resonates</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">Custom prompt</div>
                    <div className="text-gray-500 text-sm">Generate unlimited ideas forever</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <div className="text-center mb-12">
          <h2 className="font-soehne text-3xl md:text-4xl text-white mb-4">
            What's inside
          </h2>
          <p className="text-gray-400 text-lg">
            7 lessons. Each one builds on the last.
          </p>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Lesson 1 */}
          <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-orange text-sm font-medium">1</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Start Here</h3>
                <p className="text-gray-500 text-sm">How to use this tool and what to expect</p>
              </div>
            </div>
          </div>

          {/* Lesson 2 */}
          <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-orange text-sm font-medium">2</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Define Your Niche</h3>
                <p className="text-gray-500 text-sm">Get clear on who you help and what problem you solve</p>
              </div>
            </div>
          </div>

          {/* Lesson 3 */}
          <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-orange text-sm font-medium">3</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Map Your Audience</h3>
                <p className="text-gray-500 text-sm">Understand what your audience actually wants—not what you assume</p>
              </div>
            </div>
          </div>

          {/* Lesson 4 */}
          <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-orange text-sm font-medium">4</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Uncover Your Edge</h3>
                <p className="text-gray-500 text-sm">Find what you can say that competitors won't or can't</p>
              </div>
            </div>
          </div>

          {/* Lesson 5 */}
          <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-orange text-sm font-medium">5</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Map Awareness Stages</h3>
                <p className="text-gray-500 text-sm">Know exactly what your audience is searching for at each stage</p>
              </div>
            </div>
          </div>

          {/* Lesson 6 */}
          <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-orange text-sm font-medium">6</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Find Your Gap</h3>
                <p className="text-gray-500 text-sm">Identify what's overdone in your niche so you can avoid it</p>
              </div>
            </div>
          </div>

          {/* Lesson 7 */}
          <div className="bg-brand-card rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-orange text-sm font-medium">7</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Generate Ideas</h3>
                <p className="text-gray-500 text-sm">Get 50 personalized content ideas based on everything you entered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price + CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <div className="text-center">
          <div className="inline-block bg-brand-card rounded-2xl p-8 md:p-12">
            <p className="text-gray-400 mb-2">One-time payment</p>
            <div className="text-5xl md:text-6xl font-soehne text-white mb-6">
              $27
            </div>
            <ul className="text-left text-gray-400 space-y-2 mb-8 max-w-sm mx-auto">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                5 strategic exercises
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                50 personalized content ideas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Custom prompt for unlimited future ideas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Lifetime access
              </li>
            </ul>
            <button
              onClick={handleBuy}
              className="w-full bg-brand-orange text-white font-medium text-lg py-4 px-8 rounded-[19px] hover:opacity-90 transition-opacity"
            >
              Get Instant Access
            </button>
          </div>
        </div>
      </section>

      {/* FAQ (optional - add as needed) */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="font-soehne text-2xl text-white text-center mb-10">
          Questions
        </h2>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-brand-card rounded-xl p-6">
            <h3 className="text-white font-medium mb-2">
              How long does this take to complete?
            </h3>
            <p className="text-gray-400">
              Most people finish in a single focused session—about 60-90 minutes. The exercises require real thinking about your niche and audience.
            </p>
          </div>
          <div className="bg-brand-card rounded-xl p-6">
            <h3 className="text-white font-medium mb-2">
              What if I don't have a niche yet?
            </h3>
            <p className="text-gray-400">
              This works best if you have at least a general direction. The exercises will sharpen your positioning, but they won't pick your topic for you.
            </p>
          </div>
          <div className="bg-brand-card rounded-xl p-6">
            <h3 className="text-white font-medium mb-2">
              Can I generate more than 50 ideas?
            </h3>
            <p className="text-gray-400">
              You get 3 generation runs included. Plus, you'll walk away with a custom prompt you can use with any AI to generate unlimited ideas using your positioning data.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800 text-center">
        <h2 className="font-soehne text-3xl text-white mb-4">
          Learn why your content isn't getting views—and fix it.
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Understand exactly why your content isn't reaching anyone, and walk away with a strategy that will.
        </p>
        <button
          onClick={handleBuy}
          className="bg-brand-orange text-white font-medium text-lg py-4 px-12 rounded-[19px] hover:opacity-90 transition-opacity"
        >
          Get Instant Access — $27
        </button>
      </section>
    </main>
  )
}
