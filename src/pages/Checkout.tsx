import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { supabase, Course } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'https://your-api.workers.dev'

export default function Checkout() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to sign up if not logged in
    if (isLoaded && !user) {
      navigate(`/sign-up?redirect=/checkout/${slug}`)
      return
    }

    async function fetchCourse() {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error || !data) {
        setError('Course not found')
        setLoading(false)
        return
      }

      // Check if already purchased
      if (user) {
        const { data: purchaseData } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', data.id)
          .limit(1)

        if (purchaseData && purchaseData.length > 0) {
          // Already purchased, redirect to course
          navigate(`/courses/${slug}/learn`)
          return
        }
      }

      setCourse(data)
      setLoading(false)
    }

    if (isLoaded && user) {
      fetchCourse()
    }
  }, [slug, user, isLoaded, navigate])

  const handleCheckout = async () => {
    if (!course || !user) return

    setProcessingPayment(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: course.id,
          course_slug: course.slug,
          user_id: user.id,
          user_email: user.primaryEmailAddress?.emailAddress,
          price_cents: course.price_cents,
          course_title: course.title,
          origin_url: window.location.origin,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create checkout session')
        setProcessingPayment(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Something went wrong. Please try again.')
      setProcessingPayment(false)
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  if (loading || !isLoaded) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  if (error && !course) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </main>
    )
  }

  if (!course) {
    return null
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      <div className="max-w-lg mx-auto px-8 py-16 md:py-24">
        <h1 className="font-soehne text-3xl text-white text-center mb-8">
          Complete Your Purchase
        </h1>

        <div className="bg-brand-card rounded-xl p-8">
          {/* Course Summary */}
          <div className="flex items-start gap-4 mb-8 pb-8 border-b border-gray-800">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            )}
            <div>
              <h2 className="text-white font-medium mb-1">{course.title}</h2>
              <p className="text-gray-400 text-sm">Instant access</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-gray-400">Total</span>
            <span className="text-2xl font-soehne text-white">
              {formatPrice(course.price_cents)}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={processingPayment}
            className="w-full bg-brand-orange text-white font-medium text-lg py-4 rounded-[19px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {processingPayment ? 'Redirecting to payment...' : 'Pay Now'}
          </button>

          <p className="text-gray-500 text-xs text-center mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </main>
  )
}
