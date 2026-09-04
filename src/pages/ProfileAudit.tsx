const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/00wcN61rC38Y6nSfDk7Re08'

export default function ProfileAudit() {
  return (
    <main className="max-w-2xl mx-auto px-8 py-16 md:py-24">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden">
            <img src="/assets/portrait.png" alt="Ryan Sterling" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="font-soehne text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight headline-gradient mb-6">
          Profile Audit
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
          I study your content, pinpoint what's working and what isn't, and walk you through it in a video you can actually learn from.
        </p>
      </section>

      {/* What's Included */}
      <section className="mb-12">
        <h2 className="text-white font-semibold text-xl mb-6">What's included</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-gray-300">A full review of your recent content — what's landing and what's falling flat</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-gray-300">Hook, pacing, and retention notes on your top and worst performing posts</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-gray-300">Bio and profile feedback — do people know what you do in under 5 seconds?</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-gray-300">A recorded video walkthrough of your page, yours to keep</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-brand-orange mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-gray-300">Follow-up feedback after you implement — send me a few new posts and I'll tell you if you're on track</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div className="mb-6">
          <span className="text-4xl md:text-5xl font-bold text-white">$297</span>
        </div>
        <a
          href={STRIPE_PAYMENT_LINK}
          className="inline-block bg-brand-orange text-white font-semibold text-lg px-10 py-4 rounded-[19px] hover:opacity-90 transition-opacity"
        >
          Get Your Audit
        </a>
        <p className="text-gray-500 mt-4 text-sm">Only taking 5 this month</p>
      </section>

      {/* Back Link */}
      <section className="text-center mt-16">
        <a href="/" className="text-gray-500 hover:text-gray-400 transition-colors">
          &larr; Back
        </a>
      </section>
    </main>
  )
}
