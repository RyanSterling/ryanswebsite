import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { supabase, Course, Lesson, GeneratedIdea } from '../../lib/supabase'
import {
  FlopProofFormData,
  createEmptyFormData,
  isLesson1Complete,
  isLesson2Complete,
  isLesson3Complete,
  isLesson4Complete,
  isLesson5Complete,
  isAllComplete,
} from './types'
import Lesson1Form from './Lesson1Form'
import Lesson2Form from './Lesson2Form'
import Lesson3Form from './Lesson3Form'
import Lesson4Form from './Lesson4Form'
import Lesson5Form from './Lesson5Form'
import Lesson6Form from './Lesson6Form'
import GeneratorUI from './GeneratorUI'

const COURSE_SLUG = 'flop-proof-content-system'
const STORAGE_KEY = 'flop-proof-form-data'
const GENERATIONS_KEY = 'flop-proof-generations'
const MAX_GENERATIONS = 3

// Test data for development
// Profile: Woman with ostomy, pelvic cancer history, CKD - fitness creator with severe medical history
// Audience fork: Option A (women with permanent body alterations from cancer/organ removal) with B (ostomy community) as authority base
const TEST_DATA: FlopProofFormData = {
  lesson1: {
    niche: 'How women whose bodies were permanently altered by cancer treatment decide what their life still gets to include',
    core_problem: "They've been handed a body that no longer works the way it did—ostomy, organ removals, CKD—and every available model is either full grief or full triumph. Nobody shows the negotiation in between.",
    what_you_do: 'Help women with permanently altered bodies decide what to spend a limited body on',
    what_you_teach: "The physique is not the point, it's the receipt—authority comes from severity (ostomy, organ removals, incurable conditions), not from abs. Every piece of content is a decision about what a changed body still gets to include.",
  },
  lesson2: {
    audience_description: "Women who've had organs removed, live with an ostomy, are managing CKD, or are post-pelvic-cancer treatment. Not the broader 'chronic illness' crowd with manageable conditions—specifically women whose bodies were permanently restructured by medical intervention. They're past diagnosis, past acute treatment, and now living in the 'what now' phase nobody prepared them for.",
    desire_1: {
      desire_text: 'Reclaim normalcy and make decisions about my life that aren\'t defined by my condition',
      so_i_can_1: 'Stop letting my altered body be the first filter on every single choice',
      so_i_can_2: 'Have things to look forward to again instead of just managing what\'s left',
      so_i_can_3: 'Feel like myself again instead of being "the one who had cancer" in every room',
      urgency: 5, repeats: 5, who_cares: 'almost_everyone',
    },
    desire_2: {
      desire_text: 'Feel less alone and seen by someone who actually gets the severity',
      so_i_can_1: 'Stop performing strength for people who think I should just be grateful to be alive',
      so_i_can_2: 'Have one space where I don\'t have to explain what an ostomy is or why I\'m tired',
      so_i_can_3: 'See proof that someone with my level of medical reality is still building a life worth wanting',
      urgency: 5, repeats: 5, who_cares: 'almost_everyone',
    },
    desire_3: {
      desire_text: 'Have one physical thing that\'s mine again',
      so_i_can_1: 'Feel ownership over something in a body that\'s felt like it belongs to doctors for years',
      so_i_can_2: 'Have control over one input when so many outputs are out of my hands',
      so_i_can_3: 'Reconnect with my body as something I inhabit, not just something that failed me',
      urgency: 4, repeats: 4, who_cares: 'some_strangers_too',
    },
  },
  lesson3: {
    will_tell_1: "It's exhausting explaining my condition to people who think surviving means I'm fine now",
    will_tell_2: 'Some days I feel almost normal and some days the fatigue wins completely',
    will_tell_3: "I just want to feel like a person again, not a medical file",
    wont_tell_1: "I'm tired of being someone's inspiration—I didn't choose this and I don't want to be brave",
    wont_tell_2: "I don't know who I am if I stop performing strength. The strong version is the only one people can handle.",
    wont_tell_3: "Sometimes I resent my body for what it put me through and I don't know how to live in something I'm still angry at",
    cant_tell_1: "Small wins aren't consolation prizes—they're proof you're still here and still choosing, and that matters more than any PR or before/after",
    cant_tell_2: "The gap between what you can do and what you think you should be able to do is the actual injury—and it's fixable independently of your diagnosis",
    cant_tell_3: "Your altered body isn't a limitation to work around, it's the specific thing that makes your voice worth hearing in this space",
  },
  lesson4: {
    unaware_questions: 'Why do I still feel so unsettled even though treatment is over? Why does everyone expect me to be "back to normal" when nothing is normal? Is it okay to want more than just surviving?',
    problem_aware_questions: 'How do other people with ostomies or organ removals actually live day to day? Why is everything either grief porn or toxic positivity? Where are the people like me who are neither broken nor pretending to be fixed?',
    solution_aware_questions: 'Can I actually build strength with my specific limitations? How do I find community that gets severity without becoming a support group? What does honest content about permanent alteration look like?',
    product_aware_questions: 'Does she actually have an ostomy or is this another able-bodied fitness person with a "health journey"? Will this work for someone with my specific restrictions (CKD, pelvic floor issues, fatigue)? Is this community for people still building or just people who\'ve already figured it out?',
  },
  lesson5: {
    saturated_topics: 'Diagnosis-as-ongoing-journey (not diagnosis-as-credential), "Chronic illness warrior", "Healing is possible if you just...", "Spoonie life", general "listen to your body" content',
    saturated_formats: '"Day in my life with [condition]" without decisions, hospital vlogs, awareness month content, medication routines, symptom management tutorials',
    competitor_angles: 'Competitors in chronic-illness-general (stage 2): @chronicallycandid, @spoonielife, @thechroniccoach. Competitors in visible-stoma-fitness (stage 4): far fewer—@beyondthestoma is her own asset. The "triumph narrative" accounts: @cancerfitlife, @survivorstrong',
    sophistication_stage: 4,
  },
}

export default function FlopProofViewer() {
  const navigate = useNavigate()
  const { lessonId } = useParams<{ lessonId?: string }>()
  const { user, isLoaded } = useUser()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState<FlopProofFormData>(createEmptyFormData())
  const [generationsRemaining, setGenerationsRemaining] = useState(MAX_GENERATIONS)
  const [savedIdeas, setSavedIdeas] = useState<GeneratedIdea[]>([])

  const apiUrl = import.meta.env.DEV
    ? 'http://localhost:8787'
    : 'https://ryan-website-api.rsterling20.workers.dev'

  // Load saved form data
  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`${STORAGE_KEY}-${user.id}`)
      if (savedData) {
        try {
          setFormData(JSON.parse(savedData))
        } catch (e) {
          console.error('Error parsing saved form data:', e)
        }
      }
      const savedGenerations = localStorage.getItem(`${GENERATIONS_KEY}-${user.id}`)
      if (savedGenerations) {
        setGenerationsRemaining(parseInt(savedGenerations, 10))
      }
    }
  }, [user])

  // Save form data on change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, JSON.stringify(formData))
    }
  }, [formData, user])

  // Save generations on change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`${GENERATIONS_KEY}-${user.id}`, generationsRemaining.toString())
    }
  }, [generationsRemaining, user])

  useEffect(() => {
    async function fetchCourseAndCheckAccess() {
      if (!isLoaded) return
      if (!user) {
        navigate(`/courses/${COURSE_SLUG}`)
        return
      }

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', COURSE_SLUG)
        .single()

      if (courseError || !courseData) {
        console.error('Error fetching course:', courseError)
        setLoading(false)
        return
      }

      setCourse(courseData)

      const { data: purchaseData } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .limit(1)

      if (!purchaseData || purchaseData.length === 0) {
        navigate(`/courses/${COURSE_SLUG}`)
        return
      }

      setHasAccess(true)

      // Load saved generation ideas
      try {
        const genResponse = await fetch(
          `${apiUrl}/generations/${courseData.id}?userId=${user.id}`
        )
        if (genResponse.ok) {
          const { generations } = await genResponse.json()
          if (generations && generations.length > 0) {
            // Load most recent generation
            setSavedIdeas(generations[0].ideas)
            console.log(`Loaded ${generations[0].ideas.length} saved ideas`)
          }
        }
      } catch (err) {
        console.error('Error loading saved ideas:', err)
      }

      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('order_index')

      const lessonsArray = lessonData || []
      setLessons(lessonsArray)

      // Redirect to first lesson if no lessonId in URL
      if (lessonsArray.length > 0 && !lessonId) {
        navigate(`/courses/${COURSE_SLUG}/learn/${lessonsArray[0].id}`, { replace: true })
      }

      setLoading(false)
    }

    fetchCourseAndCheckAccess()
  }, [user, isLoaded, navigate])

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const getLessonCompletionStatus = (index: number): boolean => {
    switch (index) {
      case 0:
        return isLesson1Complete(formData.lesson1)
      case 1:
        return isLesson2Complete(formData.lesson2)
      case 2:
        return isLesson3Complete(formData.lesson3)
      case 3:
        return isLesson4Complete(formData.lesson4)
      case 4:
        return isLesson5Complete(formData.lesson5)
      default:
        return false
    }
  }

  // Derive current lesson from URL
  const currentLesson = lessonId ? lessons.find(l => l.id === lessonId) : null
  const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId)
  const isGeneratorLesson = currentLessonIndex === 6 // 7th lesson (0-indexed)
  const allComplete = isAllComplete(formData)

  const goToLesson = (lesson: Lesson) => {
    navigate(`/courses/${COURSE_SLUG}/learn/${lesson.id}`)
  }

  const handleUseGeneration = () => {
    if (generationsRemaining > 0) {
      setGenerationsRemaining(generationsRemaining - 1)
    }
  }

  const handleLoadTestData = () => {
    setFormData(TEST_DATA)
  }

  if (loading || !isLoaded) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  if (!course || !hasAccess) {
    return null
  }

  const renderLessonForm = () => {
    if (isGeneratorLesson) {
      return (
        <GeneratorUI
          formData={formData}
          generationsRemaining={generationsRemaining}
          onUseGeneration={handleUseGeneration}
          allComplete={allComplete}
          onLoadTestData={handleLoadTestData}
          userId={user?.id}
          courseId={course?.id}
          savedIdeas={savedIdeas}
        />
      )
    }

    switch (currentLessonIndex) {
      case 0:
        return (
          <Lesson1Form
            data={formData.lesson1}
            onChange={(data) => setFormData({ ...formData, lesson1: data })}
          />
        )
      case 1:
        return (
          <Lesson2Form
            data={formData.lesson2}
            onChange={(data) => setFormData({ ...formData, lesson2: data })}
            formData={formData}
          />
        )
      case 2:
        return (
          <Lesson3Form
            data={formData.lesson3}
            onChange={(data) => setFormData({ ...formData, lesson3: data })}
            formData={formData}
          />
        )
      case 3:
        return (
          <Lesson4Form
            data={formData.lesson4}
            onChange={(data) => setFormData({ ...formData, lesson4: data })}
            formData={formData}
          />
        )
      case 4:
        return (
          <Lesson5Form
            data={formData.lesson5}
            onChange={(data) => setFormData({ ...formData, lesson5: data })}
            formData={formData}
          />
        )
      case 5:
        return (
          <Lesson6Form formData={formData} />
        )
      default:
        return null
    }
  }

  // Calculate overall progress
  const completedLessons = [
    isLesson1Complete(formData.lesson1),
    isLesson2Complete(formData.lesson2),
    isLesson3Complete(formData.lesson3),
    isLesson4Complete(formData.lesson4),
    isLesson5Complete(formData.lesson5),
  ].filter(Boolean).length
  const overallProgress = Math.round((completedLessons / 5) * 100)

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-brand-card border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-gray-400 hover:text-white text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-white bg-gray-800 px-3 py-2 rounded-lg text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Lessons
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Lesson List */}
        <div
          className={`
            fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-brand-card border-r border-gray-800
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:min-h-screen overflow-y-auto
          `}
        >
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-4 hidden lg:flex"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h2 className="font-soehne text-lg text-white">{course.title}</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Form Progress</span>
              <span className="text-white font-medium">{overallProgress}%</span>
            </div>
            <div className="w-full h-2 bg-brand-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-orange transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Generation Counter */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Generations</span>
              <div className="flex items-center gap-1">
                {[...Array(MAX_GENERATIONS)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < generationsRemaining ? 'bg-brand-orange' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              {generationsRemaining} of {MAX_GENERATIONS} remaining
            </p>
          </div>

          <nav className="divide-y divide-gray-800">
            {lessons.map((lesson, index) => {
              const isComplete = index < 5 ? getLessonCompletionStatus(index) : false
              const isBrainstorm = index === 5
              const isGenerator = index === 6

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    goToLesson(lesson)
                    setSidebarOpen(false)
                  }}
                  className={`w-full text-left px-6 py-4 flex items-start gap-4 hover:bg-gray-800/50 transition-colors ${
                    currentLesson?.id === lesson.id ? 'bg-gray-800' : ''
                  }`}
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {isGenerator ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        allComplete ? 'bg-brand-orange' : 'bg-gray-700'
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    ) : isBrainstorm ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        allComplete ? 'bg-purple-500' : 'bg-gray-700'
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    ) : isComplete ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">{index + 1}</span>
                      </div>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm ${
                        currentLesson?.id === lesson.id
                          ? 'text-white'
                          : 'text-gray-300'
                      }`}
                    >
                      {lesson.title}
                    </div>
                    {lesson.duration_seconds && (
                      <div className="text-gray-500 text-xs mt-1">
                        {formatDuration(lesson.duration_seconds)}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="font-soehne text-2xl md:text-3xl text-white mb-6">
                {currentLesson.title}
              </h1>

              {/* Video Embed */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8">
                {currentLesson.video_url.includes('vimeo.com') ? (
                  <iframe
                    src={currentLesson.video_url.replace(
                      'vimeo.com/',
                      'player.vimeo.com/video/'
                    )}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : currentLesson.video_url.includes('youtube.com') ||
                  currentLesson.video_url.includes('youtu.be') ? (
                  <iframe
                    src={currentLesson.video_url
                      .replace('watch?v=', 'embed/')
                      .replace('youtu.be/', 'youtube.com/embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={currentLesson.video_url}
                    controls
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Lesson Form */}
              <div className="mb-8">{renderLessonForm()}</div>

              {/* Next Lesson Button */}
              {currentLessonIndex < lessons.length - 1 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => goToLesson(lessons[currentLessonIndex + 1])}
                    className="bg-brand-orange text-white font-medium px-8 py-3 rounded-[19px] hover:opacity-90 transition-opacity"
                  >
                    Next Lesson
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">
              Select a lesson to get started.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
