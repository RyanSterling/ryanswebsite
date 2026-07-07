interface Props {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS = [
  { value: 'under_15', label: 'Under 15 seconds' },
  { value: '15_30', label: '15-30 seconds' },
  { value: '30_60', label: '30-60 seconds' },
  { value: '1_2_min', label: '1-2 minutes' },
  { value: 'over_2_min', label: 'Over 2 minutes' },
]

export default function StepLength({ value, onChange, onNext, onBack }: Props) {
  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setTimeout(onNext, 200)
  }

  return (
    <div className="text-center">
      <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
        On average, how long are your reels?
      </h1>
      <p className="text-gray-400 mb-8">
        Think about your typical reel length
      </p>

      <div className="space-y-3 mb-8">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full px-6 py-4 rounded-xl text-left text-lg transition-all ${
              value === option.value
                ? 'bg-brand-orange text-white'
                : 'bg-brand-card text-white hover:bg-opacity-80'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="text-gray-400 hover:text-white transition-colors"
      >
        ← Back
      </button>
    </div>
  )
}
