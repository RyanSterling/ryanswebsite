import { FormEvent, useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepProblem({ value, onChange, onNext, onBack }: Props) {
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!value.trim()) {
      setError('Please describe the problem you solve')
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
        What problem do you solve for your audience?
      </h1>
      <p className="text-gray-400 mb-8">
        This is the foundation of your marketing. Be specific.
      </p>

      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setError('')
        }}
        placeholder="e.g., I help busy moms meal prep healthy dinners in under 30 minutes"
        rows={4}
        className="w-full px-6 py-4 rounded-xl bg-brand-card text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none mb-4"
        autoFocus
      />

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-brand-card text-white font-medium text-lg py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-brand-orange text-white font-medium text-lg py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Continue →
        </button>
      </div>
    </form>
  )
}
