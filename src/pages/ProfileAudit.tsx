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
          A 10-15 minute video breakdown of exactly what's holding back your growth — and how to fix it.
        </p>
      </section>

      {/* What You Get */}
      <section className="mb-16">
        <h2 className="font-soehne text-2xl md:text-3xl text-white text-center mb-8">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-card rounded-2xl p-6">
            <div className="w-12 h-12 bg-brand-orange/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Personalized Loom Video</h3>
            <p className="text-gray-400">
              I'll walk through your profile, bio, and recent content — pointing out what's working, what's not, and exactly what to change.
            </p>
          </div>
          <div className="bg-brand-card rounded-2xl p-6">
            <div className="w-12 h-12 bg-brand-orange/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Written PDF Breakdown</h3>
            <p className="text-gray-400">
              A reference doc with all my notes, suggested rewrites, and a prioritized action plan you can keep.
            </p>
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
