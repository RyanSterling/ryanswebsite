const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/dRmdRa5HS10QbIc9eW7Re07'

export default function ProfileAudit() {
  return (
    <main className="max-w-4xl mx-auto px-8 py-16 md:py-24">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden">
            <img src="/assets/portrait.png" alt="Ryan Sterling" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="font-soehne text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight headline-gradient mb-6">
          Personal Profile Audit
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          I'll personally review your content, tell you exactly what's killing your views, and show you how to fix it.
        </p>
      </section>

      {/* What You Get */}
      <section className="mb-16">
        <h2 className="font-soehne text-2xl md:text-3xl text-white text-center mb-8">What You'll Walk Away With</h2>
        <div className="space-y-4">
          <div className="bg-brand-card rounded-2xl p-6 flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h3 className="text-white font-semibold mb-1">Real-time reactions to your reels</h3>
              <p className="text-gray-400">I'll watch your content and tell you exactly what's working, what's not, and what I'd do differently</p>
            </div>
          </div>
          <div className="bg-brand-card rounded-2xl p-6 flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h3 className="text-white font-semibold mb-1">Hook rewrites you can use immediately</h3>
              <p className="text-gray-400">Specific hooks for YOUR niche that create curiosity and stop the scroll</p>
            </div>
          </div>
          <div className="bg-brand-card rounded-2xl p-6 flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h3 className="text-white font-semibold mb-1">Bio and profile feedback</h3>
              <p className="text-gray-400">Make sure visitors know exactly what you do and why they should follow — in under 5 seconds</p>
            </div>
          </div>
          <div className="bg-brand-card rounded-2xl p-6 flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h3 className="text-white font-semibold mb-1">Content strategy direction</h3>
              <p className="text-gray-400">What types of videos to make, what to double down on, and what to stop doing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="mb-16">
        <div className="bg-brand-card rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-lg mb-6">
            I've spent the last 5 years helping grow a personal brand to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div>
              <p className="text-4xl md:text-5xl font-extrabold text-white">60K+</p>
              <p className="text-gray-400 text-sm uppercase tracking-wide mt-2">YouTube Subscribers</p>
              <p className="text-gray-500 text-sm">in 8 months</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-extrabold text-white">100K+</p>
              <p className="text-gray-400 text-sm uppercase tracking-wide mt-2">Social Followers</p>
              <p className="text-gray-500 text-sm">across platforms</p>
            </div>
          </div>
          <p className="text-gray-300 mt-8 max-w-xl mx-auto">
            I know what makes content click — and I'll show you exactly what to fix in yours.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div className="mb-6">
          <span className="text-gray-500 line-through text-xl">$197</span>
          <span className="text-4xl md:text-5xl font-bold text-white ml-3">$97</span>
        </div>
        <a
          href={STRIPE_PAYMENT_LINK}
          className="inline-block bg-brand-orange text-white font-semibold text-lg px-10 py-4 rounded-[19px] hover:opacity-90 transition-opacity"
        >
          Get Your Personal Audit
        </a>
        <p className="text-gray-500 mt-4">Delivered within 48-72 hours</p>
      </section>
    </main>
  )
}
