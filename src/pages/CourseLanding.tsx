import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'
import { supabase, Course, LessonPreview } from '../lib/supabase'

export default function CourseLanding() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<LessonPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourse() {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (courseError || !courseData) {
        console.error('Error fetching course:', courseError)
        setLoading(false)
        return
      }

      setCourse(courseData)

      // Fetch lessons for curriculum preview
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id, title, duration_seconds, order_index')
        .eq('course_id', courseData.id)
        .order('order_index')

      setLessons(lessonData || [])
      setLoading(false)
    }

    fetchCourse()
  }, [slug])

  const handleStartCourse = () => {
    if (!isSignedIn) {
      // Redirect to sign up, then to course
      navigate(`/sign-up?redirect=/courses/${slug}/learn`)
      return
    }
    navigate(`/courses/${slug}/learn`)
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white">Course not found</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-8 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-soehne text-4xl md:text-5xl text-white mb-4">
            {course.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {course.description}
          </p>
        </div>

        {/* Thumbnail */}
        {course.thumbnail_url && (
          <div className="mb-12">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full rounded-xl"
            />
          </div>
        )}

        {/* CTA */}
        <div className="bg-brand-card rounded-xl p-8 mb-12 text-center">
          <div className="text-2xl font-soehne text-white mb-4">
            Free Course
          </div>
          <button
            onClick={handleStartCourse}
            className="w-full max-w-md bg-brand-orange text-white font-medium text-lg py-4 rounded-[19px] hover:opacity-90 transition-opacity"
          >
            Start Free Course
          </button>
        </div>

        {/* Curriculum */}
        {lessons.length > 0 && (
          <div>
            <h2 className="font-soehne text-2xl text-white mb-6">
              What's Inside
            </h2>
            <div className="bg-brand-card rounded-xl divide-y divide-gray-800">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm w-6">
                      {index + 1}
                    </span>
                    <span className="text-white">{lesson.title}</span>
                  </div>
                  {lesson.duration_seconds && (
                    <span className="text-gray-500 text-sm">
                      {formatDuration(lesson.duration_seconds)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
