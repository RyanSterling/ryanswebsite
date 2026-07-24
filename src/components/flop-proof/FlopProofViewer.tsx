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
import GeneratorUI from './GeneratorUI'

const COURSE_SLUG = 'flop-proof-content-system'
const STORAGE_KEY = 'flop-proof-form-data'
const GENERATIONS_KEY = 'flop-proof-generations'
const MAX_GENERATIONS = 3

// Test data for development
const TEST_DATA: FlopProofFormData = {
  lesson1: {
    niche: 'College football recruiting',
    core_problem: "Parents don't know how the recruiting process works and their kids are getting overlooked",
    what_you_do: 'Help high school athletes get recruited to play college football',
    what_you_teach: "The recruiting timeline, how to build relationships with coaches, what coaches actually look for beyond highlight tapes",
  },
  lesson2: {
    audience_description: "Parents of high school football players (mostly dads, ages 40-55) who believe their son has college potential but feel lost navigating the recruiting process. They've been to showcases, made highlight videos, but haven't heard from coaches.",
    desire_1: {
      desire_text: 'Get my son recruited to play college football',
      so_i_can_1: 'See him keep playing the sport he loves past high school',
      so_i_can_2: 'Know the years of early mornings and travel ball meant something',
      so_i_can_3: "Not watch his dream die because we didn't know how the game works",
      urgency: 5, repeats: 4, who_cares: 'some_strangers_too',
    },
    desire_2: {
      desire_text: 'Understand what coaches actually want',
      so_i_can_1: 'Stop guessing and wasting time on the wrong things',
      so_i_can_2: 'Give my son the best chance instead of random shots in the dark',
      so_i_can_3: 'Feel like a good dad who did everything he could',
      urgency: 4, repeats: 5, who_cares: 'almost_everyone',
    },
    desire_3: {
      desire_text: 'Know if my son is actually good enough',
      so_i_can_1: 'Stop lying to myself or underselling him',
      so_i_can_2: 'Set realistic expectations instead of chasing false hope',
      so_i_can_3: 'Have an honest conversation about his future without crushing him',
      urgency: 5, repeats: 3, who_cares: 'almost_everyone',
    },
  },
  lesson3: {
    will_tell_1: 'My son just needs to get seen by more coaches',
    will_tell_2: 'The recruiting process is confusing and nobody explains it clearly',
    will_tell_3: "We've done showcases and camps but nothing is happening",
    wont_tell_1: "I'm terrified we've already missed the window and it's too late",
    wont_tell_2: "I don't actually know if my son is good enough and I'm scared to find out",
    wont_tell_3: 'I feel like a failure as a dad for not figuring this out earlier',
    cant_tell_1: "Coaches aren't evaluating your son's tape — they're evaluating whether he's coachable",
    cant_tell_2: 'The recruiting process is a relationship game, not a talent showcase',
    cant_tell_3: 'Most parents are doing the exact opposite of what works',
  },
  lesson4: {
    unaware_questions: 'How do I help my kid stand out in sports? Is it worth pushing my son in athletics?',
    problem_aware_questions: "How does college recruiting actually work? Why aren't coaches reaching out to my son?",
    solution_aware_questions: 'Are recruiting services worth it? What should be in a highlight video?',
    product_aware_questions: 'Does this recruiting system actually work? What results have other families gotten?',
  },
  lesson5: {
    saturated_topics: '"Email coaches early", "GPA matters", "Make a highlight video", "Go to camps"',
    saturated_formats: '"Day in the life of a recruit", "Things coaches won\'t tell you"',
    competitor_angles: '"Coaches want hustle", "Be proactive", "Your highlight tape is your resume"',
    sophistication_stage: 3,
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
  const isGeneratorLesson = currentLessonIndex === 5 // 6th lesson (0-indexed)
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
          />
        )
      case 2:
        return (
          <Lesson3Form
            data={formData.lesson3}
            onChange={(data) => setFormData({ ...formData, lesson3: data })}
          />
        )
      case 3:
        return (
          <Lesson4Form
            data={formData.lesson4}
            onChange={(data) => setFormData({ ...formData, lesson4: data })}
          />
        )
      case 4:
        return (
          <Lesson5Form
            data={formData.lesson5}
            onChange={(data) => setFormData({ ...formData, lesson5: data })}
          />
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
              const isGenerator = index === 5

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
