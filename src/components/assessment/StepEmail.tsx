import { FormEvent, useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onNext: () => void
}

export default function StepEmail({ value, onChange, onNext }: Props) {
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!value.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <img
        src="/assets/growth_audit_main.png"
        alt="Growth Audit Preview"
        className="w-full max-w-sm mx-auto mb-8 rounded-xl"
      />

      <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
        Get Your Free Growth Audit
      </h1>
      <p className="text-gray-400 mb-8">
        See exactly what's holding your content back
      </p>

      <div className="mb-4">
        <input
          type="email"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setError('')
          }}
          placeholder="you@example.com"
          className="w-full px-6 py-4 rounded-xl bg-brand-card text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          autoFocus
        />
        <p className="text-gray-500 text-sm mt-2">We'll send your full report here</p>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        className="w-full bg-brand-orange text-white font-medium text-lg py-4 rounded-xl hover:opacity-90 transition-opacity"
      >
        Continue →
      </button>
    </form>
  )
}
