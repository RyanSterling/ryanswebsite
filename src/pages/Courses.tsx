import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Course } from '../lib/supabase'

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching courses:', error)
      } else {
        setCourses(data || [])
      }
      setLoading(false)
    }

    fetchCourses()
  }, [])

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white">Loading courses...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      <div className="max-w-6xl mx-auto px-8 py-16 md:py-24">
        <h1 className="font-soehne text-4xl md:text-5xl text-white text-center mb-4">
          Courses
        </h1>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Learn the strategies and tactics I use to help businesses grow with content.
        </p>

        {courses.length === 0 ? (
          <div className="text-center text-gray-400">
            No courses available yet. Check back soon!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.slug}`}
                className="bg-brand-card rounded-xl overflow-hidden hover:ring-2 hover:ring-brand-orange transition-all"
              >
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500 text-4xl">📚</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-soehne text-xl text-white mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="text-brand-orange font-medium">
                    {formatPrice(course.price_cents)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
