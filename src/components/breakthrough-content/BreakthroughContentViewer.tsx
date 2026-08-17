import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { supabase, Course, Lesson } from '../../lib/supabase'
import {
  BreakthroughFormData,
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

const COURSE_SLUG = 'breakthrough-content-strategy'
const STORAGE_KEY = 'breakthrough-form-data'

export default function BreakthroughContentViewer() {
  const navigate = useNavigate()
  const { lessonId } = useParams<{ lessonId?: string }>()
  const { user, isLoaded } = useUser()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState<BreakthroughFormData>(createEmptyFormData())

  // Load saved form data from localStorage
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
    }
  }, [user])

  // Send email to ConvertKit via n8n webhook (once per user)
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const webhookKey = `convertkit-sent-${COURSE_SLUG}-${user.id}`
      if (!localStorage.getItem(webhookKey)) {
        fetch('https://n8n.srv1369832.hstgr.cloud/webhook/b6203534-82d2-45f4-bcd2-8d6da195d09b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
          body: JSON.stringify({
            email: user.primaryEmailAddress.emailAddress,
            firstName: user.firstName || '',
            course: COURSE_SLUG,
            source: 'course-viewer',
          }),
        }).catch(console.error)
        localStorage.setItem(webhookKey, 'true')
      }
    }
  }, [user])

  // Save form data on change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, JSON.stringify(formData))
    }
  }, [formData, user])

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

      // Free course - all authenticated users have access
      setHasAccess(true)

      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('order_index')

      // Filter out the old "Generate Ideas" lesson (index 7) - no longer needed
      const lessonsArray = (lessonData || []).filter((_, index) => index !== 7)
      setLessons(lessonsArray)

      // Redirect to first lesson if no lessonId in URL
      if (lessonsArray.length > 0 && !lessonId) {
        navigate(`/courses/${COURSE_SLUG}/learn/${lessonsArray[0].id}`, { replace: true })
      }

      setLoading(false)
    }

    fetchCourseAndCheckAccess()
  }, [user, isLoaded, navigate])

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
  const allComplete = isAllComplete(formData)

  const goToLesson = (lesson: Lesson) => {
    navigate(`/courses/${COURSE_SLUG}/learn/${lesson.id}`)
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
    switch (currentLessonIndex) {
      case 0:
        // Start Here - just video, no form
        return null
      case 1:
        return (
          <Lesson1Form
            data={formData.lesson1}
            onChange={(data) => setFormData({ ...formData, lesson1: data })}
          />
        )
      case 2:
        return (
          <Lesson2Form
            data={formData.lesson2}
            onChange={(data) => setFormData({ ...formData, lesson2: data })}
            formData={formData}
          />
        )
      case 3:
        return (
          <Lesson3Form
            data={formData.lesson3}
            onChange={(data) => setFormData({ ...formData, lesson3: data })}
            formData={formData}
          />
        )
      case 4:
        return (
          <Lesson4Form
            data={formData.lesson4}
            onChange={(data) => setFormData({ ...formData, lesson4: data })}
            formData={formData}
          />
        )
      case 5:
        return (
          <Lesson5Form
            data={formData.lesson5}
            onChange={(data) => setFormData({ ...formData, lesson5: data })}
            formData={formData}
          />
        )
      case 6:
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
        {/* Sidebar - Lesson List (Fixed on desktop) */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-brand-card border-r border-gray-800
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
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

          <nav className="divide-y divide-gray-800">
            {lessons.map((lesson, index) => {
              // Index 0 is "Start Here" (no form), indices 1-5 have forms, index 6 is brainstorm
              const isComplete = (index > 0 && index < 6) ? getLessonCompletionStatus(index - 1) : false
              const isBrainstorm = index === 6

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
                    {isBrainstorm ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        allComplete ? 'bg-brand-orange' : 'bg-gray-700'
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
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content - offset for fixed sidebar on desktop */}
        <div className="flex-1 p-4 md:p-8 lg:ml-80">
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
