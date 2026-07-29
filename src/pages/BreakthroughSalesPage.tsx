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
