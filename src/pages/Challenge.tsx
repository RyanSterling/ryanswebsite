import { useEffect, useState, FormEvent } from 'react'

const N8N_WEBHOOK_URL = 'https://n8n.srv1369832.hstgr.cloud/webhook/instagram-stats'
const N8N_FORM_WEBHOOK = 'https://n8n.srv1369832.hstgr.cloud/webhook/challenge-signup'

interface FollowerData {
  current_followers: number
  seven_day_gain: number
  last_updated?: string
}

export default function Challenge() {
  const [countdown, setCountdown] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--' })
  const [followerData, setFollowerData] = useState<FollowerData | null>(null)
  const [isCached, setIsCached] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [email, setEmail] = useState('')

  // Countdown timer
  useEffect(() => {
    function updateCountdown() {
      const targetDate = new Date('2026-10-05T00:00:00')
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch follower data
  useEffect(() => {
    async function fetchFollowerData() {
      try {
        const response = await fetch(N8N_WEBHOOK_URL)
        const data = await response.json()
        data.last_updated = new Date().toISOString()
        localStorage.setItem('followerData', JSON.stringify(data))
        setFollowerData(data)
        setIsCached(false)
      } catch (error) {
        console.error('Failed to fetch follower data:', error)
        const cached = localStorage.getItem('followerData')
        if (cached) {
          setFollowerData(JSON.parse(cached))
          setIsCached(true)
        }
      }
    }

    fetchFollowerData()
    const interval = setInterval(fetchFollowerData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormState('submitting')

    try {
      const response = await fetch(N8N_FORM_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setFormState('success')
      } else {
        throw new Error('Failed')
      }
    } catch {
      setFormState('error')
    }
  }

  const currentFollowers = followerData?.current_followers || 0
  const sevenDayGain = followerData?.seven_day_gain || 0
  const remaining = 10000 - currentFollowers
  const progress = (currentFollowers / 10000) * 100

  return (
    <main className="max-w-4xl mx-auto px-8 py-16 md:py-24">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden">
            <img src="/assets/portrait.png" alt="Ryan Sterling" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="font-soehne text-4xl md:text-6xl lg:text-7xl leading-none md:leading-tight tracking-tight headline-gradient mb-4">
          The 10K Challenge
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          I turn 40 on October 5th and I'm going to hit 10,000 followers by then
        </p>
      </section>

      {/* Countdown Timer */}
      <section className="mb-12">
        <div className="flex justify-center gap-4 md:gap-6">
          {[
            { value: countdown.days, label: 'days' },
            { value: countdown.hours, label: 'hours' },
            { value: countdown.minutes, label: 'mins' },
            { value: countdown.seconds, label: 'secs' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="bg-brand-card rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
                <p className="text-3xl md:text-5xl font-extrabold text-white">{value}</p>
              </div>
              <p className="text-gray-500 text-sm mt-2">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">until October 5th, 2026</p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-brand-card rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Current Followers</p>
          <p className="text-4xl md:text-5xl font-extrabold text-white">
            {followerData ? currentFollowers.toLocaleString() : '---'}
          </p>
        </div>
        <div className="bg-brand-card rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Remaining</p>
          <p className="text-4xl md:text-5xl font-extrabold text-white">
            {followerData ? remaining.toLocaleString() : '---'}
          </p>
        </div>
        <div className="bg-brand-card rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">7-Day Gain</p>
          <p className="text-4xl md:text-5xl font-extrabold text-white">
            {followerData ? `+${sevenDayGain.toLocaleString()}` : '---'}
          </p>
        </div>
      </section>

      {/* Last Updated Notice */}
      {isCached && followerData?.last_updated && (
        <p className="text-center text-gray-600 text-sm mb-8">
          Last updated: {new Date(followerData.last_updated).toLocaleString()}
        </p>
      )}

      {/* Progress Bar */}
      <section className="mb-16">
        <div className="relative">
          <div className="h-4 bg-brand-card rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 bg-brand-orange"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>0</span>
            <span className="text-gray-400">{progress.toFixed(1)}%</span>
            <span>10,000</span>
          </div>
        </div>
      </section>

      {/* Email Signup Form */}
      <section className="max-w-md mx-auto mb-12">
        <h2 className="font-soehne text-2xl md:text-3xl text-white text-center mb-6">Want to Join Me?</h2>
        <p className="text-gray-400 text-center mb-6">
          It's free to join! Enter your email and if I get enough interest, I'll create a Discord community where we
          can all connect and support each other.
        </p>

        {formState !== 'success' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-4 rounded-lg bg-brand-card text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="w-full bg-brand-orange text-white font-medium text-lg py-4 rounded-[19px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {formState === 'submitting' ? 'Sending...' : "I'm Interested"}
            </button>

            {formState === 'error' && (
              <p className="text-red-400 text-center mt-4">Something went wrong. Try again?</p>
            )}
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-500">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-xl font-semibold mb-2">You're in!</p>
            <p className="text-gray-400">Thanks for your interest. I'll be in touch.</p>
          </div>
        )}
      </section>

      {/* Instagram CTA */}
      <section className="text-center">
        <a
          href="https://instagram.com/ryansterling"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white font-medium text-lg px-8 py-4 hover:opacity-90 transition-opacity border border-gray-700 rounded-full"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Follow @ryansterling
        </a>
      </section>
    </main>
  )
}
