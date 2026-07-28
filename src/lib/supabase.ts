import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our tables
export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  price_cents: number
  stripe_price_id: string | null
  thumbnail_url: string | null
  published: boolean
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  video_url: string
  order_index: number
  duration_seconds: number | null
  created_at: string
}

// Partial lesson for curriculum preview (only fetches subset of fields)
export interface LessonPreview {
  id: string
  title: string
  duration_seconds: number | null
  order_index: number
}

export interface Purchase {
  id: string
  user_id: string
  course_id: string
  stripe_payment_id: string | null
  created_at: string
}

export interface GeneratedIdea {
  id: number
  idea: string
  room_rationale: string
  awareness_level: string
  urgency: number
  staying_power: number
  scope: number
  resolution_preview: string
  hook_experimenter: string
  hook_teacher: string
  hook_investigator: string
  hook_contrarian: string
}

export interface Generation {
  id: string
  user_id: string
  course_id: string
  ideas: GeneratedIdea[]
  created_at: string
}
