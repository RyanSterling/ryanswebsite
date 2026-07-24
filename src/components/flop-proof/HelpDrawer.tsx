import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Example {
  label: string
  value: string
  note?: string
}

interface Props {
  children: React.ReactNode
  explanation: string
  examples: Example[]
}

export default function HelpDrawer({ children, explanation, examples }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure we only render portal on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-card border-l border-gray-800 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <h4 className="font-soehne text-white text-lg">How to fill this out</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Explanation */}
            <p className="text-gray-300 leading-relaxed font-normal text-base">
              {explanation}
            </p>

            {/* Examples */}
            <div className="space-y-4">
              <h5 className="text-white text-sm font-medium uppercase tracking-wide">Examples</h5>
              <div className="space-y-3">
                {examples.map((example, i) => (
                  <div key={i} className="bg-brand-dark rounded-xl p-4">
                    <div className="text-gray-500 text-xs uppercase tracking-wide mb-1 font-normal">
                      {example.label}
                    </div>
                    <div className="text-white font-normal text-base whitespace-pre-line">
                      {example.value}
                    </div>
                    {example.note && (
                      <div className="text-gray-500 text-sm mt-2 italic font-normal">
                        {example.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <span className="relative inline-flex items-center">
        {children}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ml-1.5 w-4 h-4 rounded-full bg-gray-700 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors"
          aria-label="More info"
        >
          ?
        </button>
      </span>

      {mounted && createPortal(drawer, document.body)}
    </>
  )
}
