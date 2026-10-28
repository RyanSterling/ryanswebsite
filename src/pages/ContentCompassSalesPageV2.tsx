// EXPERIMENTAL VERSION - testing new layouts and animations
// Original: ContentCompassSalesPage.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'https://your-api.workers.dev'

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-4 hover:text-brand-orange transition-colors"
      >
        <span className="font-soehne font-semibold text-lg text-gray-900 pr-8">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400 flex-shrink-0"
        >
          ▼
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="pb-4 pt-2 text-gray-600 leading-relaxed whitespace-pre-line">
          {answer}
        </div>
      </motion.div>
    </div>
  )
}

export default function ContentCompassSalesPageV2() {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step1Svg, setStep1Svg] = useState<string>('')
  const [step2Svg, setStep2Svg] = useState<string>('')
  const [step3Svg, setStep3Svg] = useState<string>('')
  const [typedText, setTypedText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [notionSaving, setNotionSaving] = useState<boolean>(false)
  const [notionSaved, setNotionSaved] = useState<boolean>(false)
  const [savingCounter, setSavingCounter] = useState<number>(1)
  const [notionLogoSvg, setNotionLogoSvg] = useState<string>('')
  const [checkmarkSvg, setCheckmarkSvg] = useState<string>('')
  const [chevronSvg, setChevronSvg] = useState<string>('')

  // Load SVGs for inline animation
  useEffect(() => {
    // Load step 1 voice dictation SVG
    fetch('/assets/content-compass-steps/step-1/voice dictation.svg')
      .then(res => res.text())
      .then(svg => setStep1Svg(svg))
      .catch(err => console.error('Failed to load step 1 SVG:', err))

    // Load step 2 ChatGPT SVG
    fetch('/assets/content-compass-steps/step-2/ChatGPT5 - Rich Layout.svg')
      .then(res => res.text())
      .then(svg => setStep2Svg(svg))
      .catch(err => console.error('Failed to load step 2 SVG:', err))

    // Load step 3 SVG
    fetch('/assets/content-compass-steps/step-3/step 3.svg')
      .then(res => res.text())
      .then(svg => setStep3Svg(svg))
      .catch(err => console.error('Failed to load step 3 SVG:', err))

    // Load Notion notification icons
    fetch('/assets/content-compass-steps/step-3/Notion-logo.svg')
      .then(res => res.text())
      .then(svg => setNotionLogoSvg(svg))
      .catch(err => console.error('Failed to load Notion logo SVG:', err))

    fetch('/assets/content-compass-steps/step-3/green-checkmark.svg')
      .then(res => res.text())
      .then(svg => setCheckmarkSvg(svg))
      .catch(err => console.error('Failed to load checkmark SVG:', err))

    fetch('/assets/content-compass-steps/step-3/chevron-right.svg')
      .then(res => res.text())
      .then(svg => setChevronSvg(svg))
      .catch(err => console.error('Failed to load chevron SVG:', err))
  }, [])

  // Typing animation effect
  useEffect(() => {
    if (!isTyping) return

    const fullText = "Your idea is too narrow, one of these angles might get your idea more views. Let me know then ill save it to your Notion."
    let currentIndex = 0

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 20) // 20ms per character for faster typing

    return () => clearInterval(typingInterval)
  }, [isTyping])

  // Notion saving animation effect
  useEffect(() => {
    if (!notionSaving) return

    setSavingCounter(1)
    let currentCount = 1

    const counterInterval = setInterval(() => {
      currentCount++
      if (currentCount <= 4) {
        setSavingCounter(currentCount)
      } else {
        clearInterval(counterInterval)
        // Transition to saved state after 4 seconds
        setNotionSaving(false)
        setNotionSaved(true)
      }
    }, 1000) // 1 second intervals

    return () => clearInterval(counterInterval)
  }, [notionSaving])

  // Handle pending checkout after sign-in
  useEffect(() => {
    if (isSignedIn && user) {
      const pendingCheckout = sessionStorage.getItem('pendingCheckout')
      if (pendingCheckout === 'content-compass') {
        sessionStorage.removeItem('pendingCheckout')
        handleGetAccess()
      }
    }
  }, [isSignedIn, user])

  const handleGetAccess = async () => {
    if (!isSignedIn) {
      // Store that we want to checkout after sign-in
      sessionStorage.setItem('pendingCheckout', 'content-compass')
      navigate('/sign-in')
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-200" style={{ backgroundColor: 'rgba(235, 235, 241, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <img
              src="/assets/Front-facing Content Compass icon.png"
              alt="Content Compass"
              className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
            />
            <span className="font-soehne font-semibold text-base md:text-lg text-gray-900 whitespace-nowrap">
              The Content Compass
            </span>
          </div>

          {/* Buy Button */}
          <button
            onClick={handleGetAccess}
            disabled={isProcessing}
            className="bg-brand-orange text-white font-medium text-sm py-2.5 px-4 md:px-6 rounded-[19px] hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap flex-shrink-0"
          >
            Get Access
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <img
            src="/assets/content-compass-heroV2.png"
            alt="The Content Compass"
            className="w-full max-w-2xl mx-auto mb-8 rounded-xl"
          />

          <h1 className="font-soehne font-bold text-3xl md:text-5xl text-gray-900 mb-6 leading-tight">
            A few small tweaks can 10x your views.
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Your content ideas are good—they're just not framed for what your audience actually cares about. The solve is easier than you think. Voice memo your thoughts, get AI to reframe them in ways that get views, and organize everything in Notion.
          </p>

          {/* CTA */}
          <div className="mb-4">
            <span className="text-gray-400 line-through text-lg">$79</span>
            <span className="text-gray-900 font-soehne text-3xl ml-3">$37</span>
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
            {/* Voice Dictation Visual */}
            <div className="mb-8 relative">
              <motion.div
                className="w-full max-w-sm mx-auto mb-6 step1-svg-container"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                onViewportEnter={() => {
                  const container = document.querySelector('.step1-svg-container');
                  if (container) container.classList.add('animate');
                }}
                dangerouslySetInnerHTML={{ __html: step1Svg }}
              />

              {/* Timer text overlay */}
              <div className="timer-text">0:45</div>

              <style>{`
                .step1-svg-container svg {
                  width: 100%;
                  height: auto;
                }

                /* Play/Pause button animations */
                .step1-svg-container #play-button {
                  opacity: 1;
                }

                .step1-svg-container.animate #play-button {
                  animation: fadeOut 0.5s ease-in-out 1s forwards;
                }

                .step1-svg-container #pause-button {
                  opacity: 0;
                }

                .step1-svg-container.animate #pause-button {
                  animation: fadeIn 0.5s ease-in-out 1s forwards;
                }

                /* Hide the SVG text */
                .step1-svg-container svg text,
                .step1-svg-container svg path[fill="#191919"] {
                  opacity: 0;
                }

                /* Waveform animations - sequential blue fill (left to right) - slower */
                .step1-svg-container.animate #wave-12 { animation: fillBlue 0.2s ease-in-out 1.5s forwards; }
                .step1-svg-container.animate #wave-13 { animation: fillBlue 0.2s ease-in-out 1.7s forwards; }
                .step1-svg-container.animate #wave-4 { animation: fillBlue 0.2s ease-in-out 1.9s forwards; }
                .step1-svg-container.animate #wave-7 { animation: fillBlue 0.2s ease-in-out 2.1s forwards; }
                .step1-svg-container.animate #wave-17 { animation: fillBlue 0.2s ease-in-out 2.3s forwards; }
                .step1-svg-container.animate #wave-10 { animation: fillBlue 0.2s ease-in-out 2.5s forwards; }
                .step1-svg-container.animate #wave-14 { animation: fillBlue 0.2s ease-in-out 2.7s forwards; }
                .step1-svg-container.animate #wave-5 { animation: fillBlue 0.2s ease-in-out 2.9s forwards; }
                .step1-svg-container.animate #wave-8 { animation: fillBlue 0.2s ease-in-out 3.1s forwards; }
                .step1-svg-container.animate #wave-15 { animation: fillBlue 0.2s ease-in-out 3.3s forwards; }
                .step1-svg-container.animate #wave-9 { animation: fillBlue 0.2s ease-in-out 3.5s forwards; }

                /* Timer text animation */
                .timer-text {
                  position: absolute;
                  top: 50%;
                  right: 10%;
                  transform: translateY(-50%);
                  font-family: system-ui, -apple-system, sans-serif;
                  font-size: 14px;
                  font-weight: 500;
                  color: #191919;
                  opacity: 0;
                }

                .step1-svg-container.animate .timer-text {
                  animation: fadeInTimer 0.5s ease-in-out 1s forwards;
                }

                @keyframes fadeOut {
                  to { opacity: 0; }
                }

                @keyframes fadeIn {
                  to { opacity: 1; }
                }

                @keyframes fadeInTimer {
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

            <p className="text-gray-400 uppercase tracking-wide text-sm mb-4">Step 1</p>

            <h3 className="font-soehne font-bold text-[32px] text-gray-900 mb-6">
              Voice Dictate Your Raw Content Idea Into AI
            </h3>

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
            {/* ChatGPT Interface */}
            <div className="mb-8 relative">
              <motion.div
                className="w-full max-w-sm mx-auto step2-svg-container relative"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                onViewportEnter={() => {
                  setTimeout(() => setIsTyping(true), 800) // Start typing after SVG animates in
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: step2Svg }} />

                {/* Typing text overlay */}
                <div className="typing-text-overlay">
                  <p className="typing-text">
                    {typedText}
                    {isTyping && typedText.length < 110 && <span className="typing-cursor">|</span>}
                  </p>
                </div>
              </motion.div>

              <style>{`
                .step2-svg-container svg {
                  width: 100%;
                  height: auto;
                  display: block;
                }

                .typing-text-overlay {
                  position: absolute;
                  top: 46%;
                  left: 7%;
                  right: 7%;
                  pointer-events: none;
                }

                .typing-text {
                  font-family: system-ui, -apple-system, sans-serif;
                  font-size: 15px;
                  line-height: 1.4;
                  color: #0D0D0D;
                  margin: 0;
                  text-align: left;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }

                .typing-cursor {
                  animation: blink 1s infinite;
                }

                @keyframes blink {
                  0%, 50% { opacity: 1; }
                  51%, 100% { opacity: 0; }
                }
              `}</style>
            </div>

            <p className="text-gray-400 uppercase tracking-wide text-sm mb-4">Step 2</p>

            <h3 className="font-soehne font-bold text-[32px] text-gray-900 mb-6">
              AI Suggests Angles For Wider Reach
            </h3>

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
            {/* Notion Board */}
            <div className="mb-6">
              <motion.div
                className="w-full max-w-lg mx-auto step3-svg-container"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                dangerouslySetInnerHTML={{ __html: step3Svg }}
              />

              {/* Notion Saving Notification - fixed height, left-aligned, width doesn't affect parent */}
              <div className="mt-6 h-[44px] flex justify-center">
                <motion.div
                  className="w-full max-w-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  onViewportEnter={() => {
                    setTimeout(() => setNotionSaving(true), 800)
                  }}
                >
                  {notionSaving && (
                    <div className="notion-notification saving">
                      <div className="notion-icon-fixed" dangerouslySetInnerHTML={{ __html: notionLogoSvg }} />
                      <span className="notion-text gradient-text">
                        Using Notion: Saving "Why copying viral..."
                      </span>
                      <span className="counter">{savingCounter}s</span>
                      <div className="chevron-icon" dangerouslySetInnerHTML={{ __html: chevronSvg }} />
                    </div>
                  )}
                  {notionSaved && (
                    <div className="notion-notification saved">
                      <div className="notion-icon-fixed" dangerouslySetInnerHTML={{ __html: notionLogoSvg }} />
                      <span className="notion-text">Idea saved to Notion</span>
                      <div className="checkmark-icon" dangerouslySetInnerHTML={{ __html: checkmarkSvg }} />
                    </div>
                  )}
                </motion.div>
              </div>
              <style>{`
                .step3-svg-container svg {
                  width: 100%;
                  height: auto;
                }

                /* Notion Notification Styles */
                .notion-notification {
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                  background: transparent;
                  padding: 10px 14px;
                  border-radius: 12px;
                }

                .notion-icon-fixed {
                  width: 20px;
                  flex-shrink: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                .notion-icon-fixed svg {
                  width: 20px;
                  height: 20px;
                }

                .chevron-icon svg {
                  width: 12px;
                  height: 12px;
                  flex-shrink: 0;
                  opacity: 0.5;
                }

                .checkmark-icon svg {
                  width: 20px;
                  height: 20px;
                  flex-shrink: 0;
                }

                .notion-text {
                  font-family: system-ui, -apple-system, sans-serif;
                  font-size: 14px;
                  color: #0D0D0D;
                  white-space: nowrap;
                  flex-shrink: 1;
                  min-width: 0;
                }

                .counter {
                  font-family: system-ui, -apple-system, sans-serif;
                  font-size: 14px;
                  color: #8F8F8F;
                  flex-shrink: 0;
                }

                .gradient-text {
                  background: linear-gradient(90deg,
                    #C3C2C2 0%,
                    #585755 25%,
                    #C3C2C2 50%,
                    #585755 75%,
                    #C3C2C2 100%
                  );
                  background-size: 200% 100%;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  animation: gradientShift 3s linear infinite;
                }

                @keyframes gradientShift {
                  0% {
                    background-position: 0% 50%;
                  }
                  100% {
                    background-position: 200% 50%;
                  }
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

            <p className="text-gray-400 uppercase tracking-wide text-sm mb-4">Step 3</p>

            <h3 className="font-soehne font-bold text-[32px] text-gray-900 mb-6">
              Everything Saves To Notion Automatically
            </h3>

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
          <h2 className="font-soehne font-bold text-[32px] text-gray-900 mb-8 text-center">
            What's Included
          </h2>

          <div className="space-y-6">
            {[
              {
                icon: 'Notion-logo.svg',
                title: 'Notion Template',
                desc: 'A complete Notion workspace with a content planner board, idea capture system, and organized library to track everything from initial concept to published content.'
              },
              {
                icon: 'audience-profile.svg',
                title: 'Audience Profile',
                desc: 'An in-depth audience profile framework that captures what your viewers care about, their pain points, and content preferences, giving AI the context it needs to suggest angles that actually resonate and get more views.'
              },
              {
                icon: 'setup-guide.svg',
                title: 'How To Setup Guide',
                desc: 'Four step-by-step video walkthroughs showing you exactly how to connect your Notion workspace, set up your AI assistant, and complete your audience profile.'
              },
              {
                icon: 'ai-prompts.svg',
                title: 'AI Prompts',
                desc: 'Pre-built AI prompts engineered to help you complete your audience profile, set project context, and give your AI assistant the instructions it needs to deliver relevant suggestions every time you brain dump an idea.'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex gap-4 items-start"
              >
                <div className="w-[30px] h-[30px] flex items-center justify-center flex-shrink-0">
                  <img
                    src={`/assets/whats included/${item.icon}`}
                    alt={item.title}
                    className="w-[30px] h-[30px]"
                  />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-xl mb-2">{item.title}</p>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </div>
      </section>

      {/* Setup Videos Section */}
      <section className="flex items-center justify-center py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-soehne font-bold text-[32px] text-gray-900 mb-4 text-center">
              Get Set Up In Minutes
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Four short video walkthroughs show you exactly how to connect everything and start capturing ideas right away.
            </p>

            {/* Video preview image */}
            <img
              src="/assets/videos.png"
              alt="Setup video lessons"
              className="w-full rounded-xl mb-12"
            />

            {/* Lesson breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { number: '01', title: 'Claude/ChatGPT Setup' },
                { number: '02', title: 'Muse/GrokBot Setup' },
                { number: '03', title: 'Audience Profile' },
                { number: '04', title: 'Creating a Content Idea' }
              ].map((lesson) => (
                <div key={lesson.number} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="font-soehne font-bold text-2xl text-brand-orange">{lesson.number}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{lesson.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="flex items-center justify-center py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-soehne font-bold text-[32px] text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "How is this different from just using AI on my own?",
                  a: "AI alone doesn't know your audience or help you organize ideas. The Content Compass gives you a framework: the Audience Profile tells AI who you're talking to, and Notion keeps everything organized so good ideas don't get lost in chat history."
                },
                {
                  q: "Do I need paid AI accounts?",
                  a: "It depends on which setup you choose. The videos show you four different options:\n\nClaude or ChatGPT (with Notion connector): Requires a paid account ($20/month for ChatGPT Plus or Claude Pro).\n\nMuse: Has a free tier that's generous. I've used it extensively without hitting limits, but heavy usage may eventually require paid.\n\nGrokBot: Has a free tier but will hit limits faster if you're creating a lot of ideas.\n\nYou can start with Muse on the free tier and upgrade later if needed. The setup videos walk through all options so you can pick what works for your budget."
                },
                {
                  q: "Do I need a paid Notion account?",
                  a: "No. The free Notion plan works perfectly for The Content Compass. You get unlimited pages and blocks, which is more than enough to organize your content ideas. Paid plans are mainly for teams and advanced features you won't need here."
                },
                {
                  q: "Do I need any technical skills?",
                  a: "No. If you can record a voice memo and copy/paste text, you're good. The setup videos walk you through every click."
                },
                {
                  q: "What if I'm just starting out and don't have an audience yet?",
                  a: "Even better. You'll build the right habits from day one—understanding your target audience and framing content for them—instead of guessing and hoping something lands."
                },
                {
                  q: "What format is this in?",
                  a: "You get a Notion template (copy it to your account), four setup videos, and email support. Everything is digital and accessible immediately after purchase."
                },
                {
                  q: "Can I use this on mobile?",
                  a: "Yes. The voice memo part works on any phone. Notion has a mobile app, and all the AI tools (Claude, ChatGPT, Muse, GrokBot) work on mobile browsers."
                },
                {
                  q: "How long does setup take?",
                  a: "About 15 minutes. Four short video walkthroughs show you exactly what to click. Most people are capturing ideas the same day."
                },
                {
                  q: "Is this a subscription?",
                  a: "No. One-time payment, lifetime access. No recurring charges."
                },
                {
                  q: "Do I get updates?",
                  a: "Yes. Any improvements or new features are included free."
                },
                {
                  q: "What's your refund policy?",
                  a: "No refunds. Once you access the Notion template and videos, I can't rescind the digital product."
                }
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
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
            <span className="text-gray-400 line-through text-lg">$79</span>
            <span className="text-gray-900 font-soehne text-3xl ml-3">$37</span>
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
