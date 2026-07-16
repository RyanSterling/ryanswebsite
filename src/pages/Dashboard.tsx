import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/react'
import { supabase, Course } from '../lib/supabase'

interface PurchasedCourse extends Course {
  purchased_at: string
}

export default function Dashboard() {
  const { user } = useUser()
  const [courses, setCourses] = useState<PurchasedCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPurchasedCourses() {
      if (!user) return

      // Get purchases for this user
      const { data: purchases, error: purchaseError } = await supabase
        .from('purchases')
        .select('course_id, created_at')
        .eq('user_id', user.id)

      if (purchaseError) {
        console.error('Error fetching purchases:', purchaseError)
        setLoading(false)
        return
      }

      if (!purchases || purchases.length === 0) {
        setLoading(false)
        return
      }

      // Get course details for each purchase
      const courseIds = purchases.map((p) => p.course_id)
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds)

      if (coursesError) {
        console.error('Error fetching courses:', coursesError)
        setLoading(false)
        return
      }

      // Combine course data with purchase date
      const purchasedCourses = (coursesData || []).map((course) => {
        const purchase = purchases.find((p) => p.course_id === course.id)
        return {
          ...course,
          purchased_at: purchase?.created_at || '',
        }
      })

      setCourses(purchasedCourses)
      setLoading(false)
    }

    fetchPurchasedCourses()
  }, [user])

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white">Loading your courses...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      <div className="max-w-6xl mx-auto px-8 py-16 md:py-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-soehne text-3xl md:text-4xl text-white mb-2">
              My Courses
            </h1>
            <p className="text-gray-400">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
            </p>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          />
        </div>

        {courses.length === 0 ? (
          <div className="bg-brand-card rounded-xl p-12 text-center">
            <p className="text-gray-400 mb-6">
              You haven't purchased any courses yet.
            </p>
            <Link
              to="/courses"
              className="inline-block bg-brand-orange text-white font-medium px-8 py-3 rounded-[19px] hover:opacity-90 transition-opacity"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.slug}/learn`}
                className="bg-brand-card rounded-xl overflow-hidden hover:ring-2 hover:ring-brand-orange transition-all group"
              >
                {course.thumbnail_url ? (
                  <div className="relative">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Continue</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500 text-4xl">📚</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-soehne text-xl text-white mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Purchased{' '}
                    {new Date(course.purchased_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
