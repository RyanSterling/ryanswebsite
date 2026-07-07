interface Props {
  onYes: () => void
  onNo: () => void
  onBack: () => void
}

export default function StepContentType({ onYes, onNo, onBack }: Props) {
  return (
    <div className="text-center">
      <h1 className="font-soehne text-3xl md:text-4xl text-white mb-4">
        Quick question
      </h1>
      <p className="text-gray-400 mb-8">
        We transcribe what you say to analyze your messaging and hooks.
      </p>

      <div className="space-y-3 mb-8">
        <button
          onClick={onYes}
          className="w-full bg-brand-orange text-white font-medium text-lg py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Yes, I speak in my reels
        </button>
        <button
          onClick={onNo}
          className="w-full bg-brand-card text-white font-medium text-lg py-4 rounded-xl hover:bg-gray-700 transition-colors"
        >
          No, I don't speak in my content
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="text-gray-500 hover:text-white transition-colors"
      >
        Back
      </button>
    </div>
  )
}
