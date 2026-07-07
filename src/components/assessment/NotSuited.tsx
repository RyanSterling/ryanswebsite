import { Link } from 'react-router-dom'

export default function NotSuited() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 md:px-8 py-12">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-card flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="font-soehne text-2xl md:text-3xl text-white mb-4">
          This audit isn't for you (yet)
        </h1>

        <p className="text-gray-400 mb-6 leading-relaxed">
          Our Growth Audit analyzes your spoken hooks to find what's holding your content back.
          Since you use text overlays with music, we can't transcribe and analyze your content effectively.
        </p>

        <p className="text-gray-400 mb-8 leading-relaxed">
          If you start creating content where you speak, come back and we'll audit your hooks.
        </p>

        <Link
          to="/"
          className="inline-block bg-brand-card text-white font-medium text-lg px-8 py-4 rounded-xl hover:bg-gray-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
