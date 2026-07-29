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

      {/* Reframe: This is a tool, not a course */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <div className="text-center mb-12">
          <p className="text-brand-orange uppercase tracking-wider text-sm font-medium mb-4">
            This isn't a course
          </p>
          <h2 className="font-soehne text-3xl md:text-4xl text-white mb-6">
            It's a content strategy machine
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            You don't watch and hope. You input your unique data, and the system generates ideas that could only work for you.
          </p>
        </div>

        {/* The Process */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-brand-card rounded-xl p-6">
            <div className="text-brand-orange text-sm font-medium mb-2">Your Input</div>
            <h3 className="text-white text-xl font-soehne mb-3">5 Strategic Exercises</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">→</span>
                <span>Define your niche and core problem you solve</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">→</span>
                <span>Map your audience's desire ladder (what they really want)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">→</span>
                <span>Uncover what you'll say that competitors won't or can't</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">→</span>
                <span>Identify questions at every awareness stage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">→</span>
                <span>Analyze market saturation and find your gap</span>
              </li>
            </ul>
          </div>

          <div className="bg-brand-card rounded-xl p-6">
            <div className="text-green-400 text-sm font-medium mb-2">Your Output</div>
            <h3 className="text-white text-xl font-soehne mb-3">50 Personalized Ideas</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Ideas engineered from your unique positioning data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Each idea scored for urgency, staying power, and scope</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>4 hook variations per idea (teacher, contrarian, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Matched to your audience's awareness level</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>A custom prompt to generate more ideas forever</span>
              </li>
            </ul>
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
