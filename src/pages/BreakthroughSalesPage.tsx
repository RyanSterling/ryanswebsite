export default function BreakthroughSalesPage() {
  return (
    <main className="max-w-xl mx-auto px-8 py-16 md:py-24">
      <section className="text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-orange/10 border border-brand-orange/20">
            <svg className="w-10 h-10 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <h1 className="font-soehne text-3xl md:text-4xl font-bold text-white mb-4">
          This Course Is No Longer Available
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          The Content Fix has been retired. If you're looking for a complete system to consistently create content that performs, check out The Content Compass.
        </p>

        <div className="bg-brand-card rounded-xl p-8 border border-gray-800 mb-8">
          <h2 className="text-white text-xl font-semibold mb-3">The Content Compass</h2>
          <p className="text-gray-400 mb-6">
            A complete system for finding profitable content ideas that actually work for your audience. Includes advanced frameworks, AI integrations, and everything you need to never run out of high-performing content ideas.
          </p>
          <a
            href="/content-compass"
            className="inline-block w-full bg-brand-orange text-white font-semibold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            Learn More About The Content Compass
          </a>
        </div>

        <p className="text-gray-500 text-sm">
          Already have access to The Content Fix? Check your dashboard.
        </p>
      </section>
    </main>
  )
}
