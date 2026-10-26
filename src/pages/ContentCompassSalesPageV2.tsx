// EXPERIMENTAL VERSION - testing new layouts and animations
// Original: ContentCompassSalesPage.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'https://your-api.workers.dev'

export default function ContentCompassSalesPageV2() {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step1Svg, setStep1Svg] = useState<string>('')
  const [step3Svg, setStep3Svg] = useState<string>('')

  // Load SVGs for inline animation
  useEffect(() => {
    // Load step 1 voice dictation SVG
    fetch('/assets/content-compass-steps/step-1/voice dictation.svg')
      .then(res => res.text())
      .then(svg => setStep1Svg(svg))
      .catch(err => console.error('Failed to load step 1 SVG:', err))

    // Load step 3 SVG
    fetch('/assets/content-compass-steps/step-3/step 3.svg')
      .then(res => res.text())
      .then(svg => setStep3Svg(svg))
      .catch(err => console.error('Failed to load step 3 SVG:', err))
  }, [])

  const handleGetAccess = async () => {
    if (!isSignedIn) {
      const checkoutUrl = '/checkout/content-compass'
      localStorage.setItem('pendingRedirect', checkoutUrl)
      navigate(`/sign-up?redirect=${encodeURIComponent(checkoutUrl)}`)
      return
    }

    if (!user || isProcessing) return

    setIsProcessing(true)

    try {
      // Fetch course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', 'content-compass')
        .eq('published', true)
        .single()

      if (courseError || !course) {
        console.error('Course not found:', courseError)
        setIsProcessing(false)
        return
      }

      // Check if already purchased
      const { data: purchaseData } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .limit(1)

      if (purchaseData && purchaseData.length > 0) {
        // Already purchased, redirect to course
        navigate(`/courses/content-compass/learn`)
        return
      }

      // Create Stripe checkout session
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
          stripe_price_id: course.stripe_price_id,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout session:', data.error)
        setIsProcessing(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setIsProcessing(false)
    }
  }

  return (
    <main style={{ backgroundColor: '#EBEBF1' }}>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="mb-8">
            <h2 className="font-soehne font-bold text-2xl md:text-4xl text-gray-900 mb-4">
              The Content Compass
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <span>by</span>
              <img
                src="/ryan-avatar.png"
                alt="Ryan Sterling"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-900 font-medium">Ryan Sterling</span>
            </div>
          </div>

          <img
            src="/assets/content-compass-hero.png"
            alt="The Content Compass"
            className="w-full max-w-2xl mx-auto mb-8 rounded-xl"
          />

          <h1 className="font-soehne font-bold text-3xl md:text-5xl text-gray-900 mb-6 leading-tight">
            Your AI-Powered Junior Content Strategist Inside Notion
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Voice dictate your content ideas to AI. It documents them, finds better angles for wider reach, and organizes everything for scripting — all inside a Notion template that works for you.
          </p>

          {/* CTA */}
          <div className="mb-4">
            <span className="text-gray-400 line-through text-lg">$97</span>
            <span className="text-gray-900 font-soehne text-3xl ml-3">$27</span>
            <span className="text-brand-orange ml-2 text-sm font-medium">Launch Price</span>
          </div>
          <button
            onClick={handleGetAccess}
            disabled={isProcessing}
            className="bg-brand-orange text-white font-medium text-lg py-4 px-12 rounded-[19px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Get Access Now
          </button>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-16"
          >
            <p className="text-gray-400 text-sm mb-2">Scroll to see how it works</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-gray-400"
            >
              ↓
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Step 1 */}
      <section className="flex items-center justify-center px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <p className="text-gray-400 uppercase tracking-wide text-sm mb-4">Step 1</p>

            <h3 className="font-soehne font-bold text-2xl md:text-3xl text-gray-900 mb-6">
              Voice Dictate Your Raw Content Idea Into AI
            </h3>

            {/* Voice Dictation Visual */}
            <div className="mb-8 relative">
              <motion.div
                className="w-full max-w-sm mx-auto mb-6 step1-svg-container"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                dangerouslySetInnerHTML={{ __html: step1Svg }}
              />
              <style>{`
                .step1-svg-container svg {
                  width: 100%;
                  height: auto;
                }

                /* Play/Pause button animations */
                #play-button {
                  opacity: 1;
                  animation: fadeOut 0.3s ease-in-out 0.5s forwards;
                }

                #pause-button {
                  opacity: 0;
                  animation: fadeIn 0.3s ease-in-out 0.5s forwards;
                }

                /* Waveform animations - sequential blue fill (left to right) */
                #wave-12 { animation: fillBlue 0.1s ease-in-out 0.8s forwards; }
                #wave-13 { animation: fillBlue 0.1s ease-in-out 0.9s forwards; }
                #wave-4 { animation: fillBlue 0.1s ease-in-out 1.0s forwards; }
                #wave-7 { animation: fillBlue 0.1s ease-in-out 1.1s forwards; }
                #wave-17 { animation: fillBlue 0.1s ease-in-out 1.2s forwards; }
                #wave-10 { animation: fillBlue 0.1s ease-in-out 1.3s forwards; }
                #wave-14 { animation: fillBlue 0.1s ease-in-out 1.4s forwards; }
                #wave-5 { animation: fillBlue 0.1s ease-in-out 1.5s forwards; }
                #wave-8 { animation: fillBlue 0.1s ease-in-out 1.6s forwards; }
                #wave-15 { animation: fillBlue 0.1s ease-in-out 1.7s forwards; }
                #wave-9 { animation: fillBlue 0.1s ease-in-out 1.8s forwards; }

                @keyframes fadeOut {
                  to { opacity: 0; }
                }

                @keyframes fadeIn {
                  to { opacity: 1; }
                }

                @keyframes fillBlue {
                  to {
                    stroke: #006FEA;
                  }
                }
              `}</style>

              {/* AI Icons */}
              <div className="flex justify-center gap-3 flex-wrap">
                {[
                  { src: 'muse.svg', delay: 0.3 },
                  { src: 'claude.svg', delay: 0.4 },
                  { src: 'grokbot.svg', delay: 0.5 },
                  { src: 'chatGPT.svg', delay: 0.6 },
                ].map((icon, i) => (
                  <motion.img
                    key={i}
                    src={`/assets/content-compass-steps/step-1/${icon.src}`}
                    alt="AI assistant"
                    className="w-16 h-16"
                    initial={{ opacity: 0, scale: 0, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: icon.delay, duration: 0.5, type: "spring", stiffness: 200 }}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Document content ideas on the go with your voice so there is enough context to come back later and flesh them out.
            </p>
          </motion.div>
        </section>

      {/* Step 2 */}
      <section className="flex items-center justify-center px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <p className="text-gray-400 uppercase tracking-wide text-sm mb-4">Step 2</p>

            <h3 className="font-soehne font-bold text-2xl md:text-3xl text-gray-900 mb-6">
              AI Suggests Angles For Wider Reach
            </h3>

            {/* ChatGPT Interface */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            >
              <img
                src="/assets/content-compass-steps/step-2/ChatGPT5 - Rich Layout.svg"
                alt="AI suggesting angles"
                className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
              />
            </motion.div>

            <p className="text-gray-600 leading-relaxed">
              We give AI context about your audience and what they care about via the audience profile inside Notion, so it can suggest angles that will get more views.
            </p>
          </motion.div>
        </section>

      {/* Step 3 */}
      <section className="flex items-center justify-center px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <p className="text-gray-400 uppercase tracking-wide text-sm mb-4">Step 3</p>

            <h3 className="font-soehne font-bold text-2xl md:text-3xl text-gray-900 mb-6">
              Everything Saves To Notion Automatically
            </h3>

            {/* Notion Board */}
            <div className="mb-8 relative">
              <motion.div
                className="w-full max-w-lg mx-auto step3-svg-container"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                dangerouslySetInnerHTML={{ __html: step3Svg }}
              />
              <style>{`
                .step3-svg-container svg {
                  width: 100%;
                  height: auto;
                }

                #idea-column {
                  animation: slideInLeft 0.6s ease-out 0.4s both;
                }

                #scripted-column {
                  animation: slideInRight 0.6s ease-out 0.5s both;
                }

                #filmed-column {
                  animation: slideInLeft 0.6s ease-out 0.6s both;
                }

                #posted-column {
                  animation: slideInRight 0.6s ease-out 0.7s both;
                }

                #notion-logo {
                  animation: scaleIn 0.5s ease-out 0.9s both;
                }

                @keyframes slideInLeft {
                  from {
                    opacity: 0;
                    transform: translateX(-20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }

                @keyframes slideInRight {
                  from {
                    opacity: 0;
                    transform: translateX(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }

                @keyframes scaleIn {
                  from {
                    opacity: 0;
                    transform: scale(0.5);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}</style>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              Your idea with AI suggestions is saved to the content planner in the Notion Template provided, without you even opening Notion.
            </p>

            {/* Closing benefit */}
            <p className="text-sm text-gray-500 italic">
              Repeat anytime inspiration hits. Your Notion workspace becomes an endless library of ready-to-script ideas.
            </p>
          </motion.div>
        </section>

      {/* The Problem */}
      <section className="flex items-center justify-center py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100"
        >
          <h2 className="font-soehne font-bold text-2xl text-gray-900 mb-6">
            Stop losing your best content ideas.
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            You have ideas all day. In the shower. On walks. While you're trying to sleep. But by the time you sit down to create, they're gone — or you can't remember what made them good.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            What if you could brain dump every half-formed thought to an AI that actually understands your content style, then have it documented and waiting for you when you're ready to script?
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            That's exactly what this Notion template does.
          </p>
        </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="flex items-center justify-center py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-soehne font-bold text-2xl md:text-3xl text-gray-900 mb-2">
            What's included
          </h2>
          <p className="text-gray-600 mb-8">
            A complete system for capturing, developing, and organizing your content ideas.
          </p>

          <div className="space-y-4">
            {[
              { title: 'Notion Template', desc: 'Duplicate and use immediately. No setup required.' },
              { title: 'AI Brain Dump Integration', desc: 'Voice or text your ideas to AI that knows your style.' },
              { title: 'Auto-Documentation', desc: 'Ideas are organized and documented for you automatically.' },
              { title: 'Video Walkthroughs', desc: 'Step-by-step videos showing you exactly how to use the system.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex gap-4 items-start"
              >
                <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{item.title}</p>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="flex items-center justify-center py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 py-12 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <span className="text-gray-400 line-through text-lg">$97</span>
            <span className="text-gray-900 font-soehne text-3xl ml-3">$27</span>
            <span className="text-brand-orange ml-2 text-sm font-medium">Launch Price</span>
          </div>
          <button
            onClick={handleGetAccess}
            disabled={isProcessing}
            className="bg-brand-orange text-white font-medium text-lg py-4 px-12 rounded-[19px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Get Access Now
          </button>
          <p className="text-gray-500 text-sm mt-4">Instant access after purchase</p>
        </motion.div>
        </div>
      </section>
    </main>
  )
}
