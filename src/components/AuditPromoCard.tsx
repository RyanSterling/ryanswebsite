import { Link } from 'react-router-dom'

export default function AuditPromoCard() {
  return (
    <div className="bg-brand-card rounded-2xl p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Profile photo */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img src="/assets/portrait.png" alt="Ryan Sterling" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-white font-semibold text-xl mb-2 text-center md:text-left">
            Want Feedback On Every Post You Make?
          </h2>
          <p className="text-gray-400 mb-4 text-center md:text-left">
            Send me your content on WhatsApp after you post. I'll send you a voice note breaking down what's working, what's not, and how to improve your next post.
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Link
              to="/coaching"
              className="inline-block bg-brand-orange text-white font-medium text-lg px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-center"
            >
              Apply for 1:1 Coaching
            </Link>
            <span className="text-2xl font-bold text-white text-center md:text-left">$500/mo</span>
          </div>
        </div>
      </div>
    </div>
  )
}
