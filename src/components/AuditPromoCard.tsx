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
            Want Me To Personally Review Your Content?
          </h2>
          <p className="text-gray-400 mb-4 text-center md:text-left">
            I'll watch your reels, react in real-time, and tell you exactly what to fix to get more views, followers, and sales.
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Link
              to="/profile-audit"
              className="inline-block bg-brand-orange text-white font-medium text-lg px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-center"
            >
              Get My Personal Review
            </Link>
            <span className="text-2xl font-bold text-white text-center md:text-left">$97</span>
          </div>
        </div>
      </div>
    </div>
  )
}
