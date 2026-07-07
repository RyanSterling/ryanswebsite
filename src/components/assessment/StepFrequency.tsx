interface Props {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS = [
  { value: 'less_than_1', label: 'Less than 1x/week' },
  { value: '1_2', label: '1-2x/week' },
  { value: '3_4', label: '3-4x/week' },
  { value: '5_7', label: '5-7x/week' },
  { value: 'more_than_daily', label: 'More than 1x/day' },
]

export default function StepFrequency({ value, onChange, onNext, onBack }: Props) {
  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    // Auto-advance after selection
    setTimeout(onNext, 200)
  }

  return (
    <div className="text-center">
      <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
        How often do you post reels?
      </h1>
      <p className="text-gray-400 mb-8">
        Be honest about your current posting frequency
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
