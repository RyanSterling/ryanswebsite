interface Props {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS = [
  { value: 'under_100', label: 'Under 100' },
  { value: '100_500', label: '100-500' },
  { value: '500_1000', label: '500-1,000' },
  { value: '1000_5000', label: '1,000-5,000' },
  { value: '5000_10000', label: '5,000-10,000' },
  { value: 'over_10000', label: '10,000+' },
]

export default function StepViews({ value, onChange, onNext, onBack }: Props) {
  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setTimeout(onNext, 200)
  }

  return (
    <div className="text-center">
      <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
        What's your average view count per reel?
      </h1>
      <p className="text-gray-400 mb-8">
        Don't count your most viral reel — we want your typical views
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
