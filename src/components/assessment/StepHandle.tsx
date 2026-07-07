import { FormEvent, useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepHandle({ value, onChange, onNext, onBack }: Props) {
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const cleanHandle = value.replace('@', '').trim()
    if (!cleanHandle) {
      setError('Please enter your Instagram handle')
      return
    }
    onChange(cleanHandle)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
        What's your Instagram handle?
      </h1>
      <p className="text-gray-400 mb-8">
        We'll audit your profile, bio, and last 3 reels
      </p>

      <div className="relative mb-4">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-lg">@</span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value.replace('@', ''))
            setError('')
          }}
          placeholder="yourusername"
          className="w-full pl-12 pr-6 py-4 rounded-xl bg-brand-card text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          autoFocus
        />
      </div>

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
