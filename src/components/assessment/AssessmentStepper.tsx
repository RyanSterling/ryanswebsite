import { AssessmentStep, AssessmentData } from '../../pages/Assessment'
import StepEmail from './StepEmail'
import StepContentType from './StepContentType'
import StepHandle from './StepHandle'
import StepProblem from './StepProblem'
import StepFrequency from './StepFrequency'
import StepLength from './StepLength'
import StepViews from './StepViews'
import StepOutliers from './StepOutliers'
import StepSelfDiagnosis from './StepSelfDiagnosis'

interface Props {
  step: AssessmentStep
  setStep: (step: AssessmentStep) => void
  data: AssessmentData
  setData: (data: AssessmentData) => void
  onSubmit: () => void
  error: string | null
}

const STEPS: AssessmentStep[] = [
  'email',
  'contentType',
  'handle',
  'problem',
  'frequency',
  'length',
  'views',
  'outliers',
  'selfDiagnosis',
]

export default function AssessmentStepper({ step, setStep, data, setData, onSubmit, error }: Props) {
  const currentIndex = STEPS.indexOf(step)
  const progress = ((currentIndex + 1) / STEPS.length) * 100

  const goNext = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex])
    } else {
      onSubmit()
    }
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1])
    }
  }

  const updateField = <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => {
    setData({ ...data, [field]: value })
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-brand-card">
        <div
          className="h-full bg-brand-orange transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Counter */}
      <div className="text-center pt-8 pb-4">
        <p className="text-gray-500 text-sm">
          Step {currentIndex + 1} of {STEPS.length}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 pb-16">
        <div className="w-full max-w-xl">
          {step === 'email' && (
            <StepEmail value={data.email} onChange={(v) => updateField('email', v)} onNext={goNext} />
          )}
          {step === 'contentType' && (
            <StepContentType
              onYes={goNext}
              onNo={() => setStep('notSuited')}
              onBack={goBack}
            />
          )}
          {step === 'handle' && (
            <StepHandle
              value={data.handle}
              onChange={(v) => updateField('handle', v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'problem' && (
            <StepProblem
              value={data.problemTheySolve}
              onChange={(v) => updateField('problemTheySolve', v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'frequency' && (
            <StepFrequency
              value={data.postingFrequency}
              onChange={(v) => updateField('postingFrequency', v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'length' && (
            <StepLength
              value={data.avgReelLength}
              onChange={(v) => updateField('avgReelLength', v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'views' && (
            <StepViews
              value={data.avgViews}
              onChange={(v) => updateField('avgViews', v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'outliers' && (
            <StepOutliers
              value={data.outliersLast90Days}
              onChange={(v) => updateField('outliersLast90Days', v)}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 'selfDiagnosis' && (
            <StepSelfDiagnosis
              value={data.selfDiagnosis}
              onChange={(v) => updateField('selfDiagnosis', v)}
              onNext={goNext}
              onBack={goBack}
              error={error}
            />
          )}
        </div>
      </div>
    </main>
  )
}
