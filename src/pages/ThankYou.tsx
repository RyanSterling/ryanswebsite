import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function ThankYou() {
  useEffect(() => {
    // Load thank you tracking script
    const script = document.createElement('script')
    script.src = 'https://d15dfsr886zcp9.cloudfront.net/thankYou_script.js'
    script.defer = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <main className="max-w-4xl mx-auto px-8 py-16 md:py-24 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-green-500">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-soehne text-4xl md:text-5xl text-white mb-4">Thank You!</h1>
        <p className="text-gray-400 text-lg">Your message has been received. I'll get back to you soon.</p>
      </div>

      <Link to="/" className="inline-block text-brand-orange hover:underline">
        ← Back to Home
      </Link>
    </main>
  )
}
