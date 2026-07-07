interface Props {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS = [
  { value: '0', label: "0 — I haven't had one yet" },
  { value: '1_2', label: '1-2' },
  { value: '3_5', label: '3-5' },
  { value: '6_plus', label: '6+' },
]

export default function StepOutliers({ value, onChange, onNext, onBack }: Props) {
  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setTimeout(onNext, 200)
  }

  return (
    <div className="text-center">
      <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
        How many "outlier" reels have you had in the last 90 days?
      </h1>
      <p className="text-gray-400 mb-8">
        An outlier = a reel that got 3-10x your normal views
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
