import { Link } from 'react-router-dom'

export default function AuditPromoCard() {
  return (
    <div className="bg-brand-card rounded-2xl p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-white font-semibold text-xl mb-2">
            Want Me To Personally Review Your Content?
          </h2>
          <p className="text-gray-400 mb-4">
            I'll watch your reels, react in real-time, and tell you exactly what to fix to get more views, followers, and sales.
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-brand-orange mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              Find out exactly why your reels aren't getting the views they deserve
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              Get hook rewrites and content ideas specific to YOUR niche
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              Know exactly what to change to turn followers into paying customers
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="text-center md:text-right">
            <span className="text-3xl font-bold text-white">$97</span>
          </div>
          <Link
            to="/profile-audit"
            className="inline-block bg-brand-orange text-white font-medium text-lg px-6 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Get My Personal Review
          </Link>
        </div>
      </div>
    </div>
  )
}
