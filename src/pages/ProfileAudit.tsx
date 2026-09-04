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
          I'll review your content and tell you exactly what to fix.
        </p>
      </section>

      {/* Simple Description */}
      <section className="mb-12">
        <div className="bg-brand-card rounded-2xl p-6 md:p-8">
          <p className="text-gray-300 text-lg leading-relaxed">
            Send me your profile. I'll watch your content, review your bio, and record a personalized video
            breaking down what's working, what's not, and what I'd do differently.
          </p>
          <p className="text-gray-400 mt-4">
            You can implement my suggestions and send me a few more posts for follow-up feedback if you want.
          </p>
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
