// Flop-Proof Content System - Form Data Types

// Lesson 1: Creator Profile
export interface CreatorProfile {
  niche: string
  core_problem: string
  what_you_do: string
  what_you_teach: string
}

// Lesson 2: Desire Ladder Structure
export interface DesireLadder {
  desire_text: string
  so_i_can_1: string
  so_i_can_2: string
  so_i_can_3: string
}

export interface AudienceData {
  audience_description: string
  desire_1: DesireLadder
  desire_2: DesireLadder
  desire_3: DesireLadder
  urgency_read: number // 1-5
  staying_power_read: number // 1-5
  scope_estimate: 'niche_specialists' | 'followers_plus_strangers' | 'most_people'
}

// Lesson 3: Tell Layers
export interface TellLayers {
  will_tell_1: string
  will_tell_2: string
  will_tell_3: string
  wont_tell_1: string
  wont_tell_2: string
  wont_tell_3: string
  cant_tell_1: string
  cant_tell_2: string
  cant_tell_3: string
}

// Lesson 4: Awareness Questions
export interface AwarenessQuestions {
  unaware_questions: string
  problem_aware_questions: string
  solution_aware_questions: string
  product_aware_questions: string
}

// Lesson 5: Saturation Read
export interface SaturationRead {
  saturated_topics: string
  saturated_formats: string
  competitor_angles: string
  sophistication_stage: 1 | 2 | 3 | 4 | 5
}

// Complete Form Data
export interface FlopProofFormData {
  lesson1: CreatorProfile
  lesson2: AudienceData
  lesson3: TellLayers
  lesson4: AwarenessQuestions
  lesson5: SaturationRead
}

// Initial empty state factory
export function createEmptyFormData(): FlopProofFormData {
  const emptyLadder: DesireLadder = {
    desire_text: '',
    so_i_can_1: '',
    so_i_can_2: '',
    so_i_can_3: '',
  }

  return {
    lesson1: {
      niche: '',
      core_problem: '',
      what_you_do: '',
      what_you_teach: '',
    },
    lesson2: {
      audience_description: '',
      desire_1: { ...emptyLadder },
      desire_2: { ...emptyLadder },
      desire_3: { ...emptyLadder },
      urgency_read: 3,
      staying_power_read: 3,
      scope_estimate: 'followers_plus_strangers',
    },
    lesson3: {
      will_tell_1: '',
      will_tell_2: '',
      will_tell_3: '',
      wont_tell_1: '',
      wont_tell_2: '',
      wont_tell_3: '',
      cant_tell_1: '',
      cant_tell_2: '',
      cant_tell_3: '',
    },
    lesson4: {
      unaware_questions: '',
      problem_aware_questions: '',
      solution_aware_questions: '',
      product_aware_questions: '',
    },
    lesson5: {
      saturated_topics: '',
      saturated_formats: '',
      competitor_angles: '',
      sophistication_stage: 3,
    },
  }
}

// Validation helpers
export function isLesson1Complete(data: CreatorProfile): boolean {
  return !!(data.niche.trim() && data.core_problem.trim() && data.what_you_do.trim() && data.what_you_teach.trim())
}

export function isDesireLadderComplete(ladder: DesireLadder): boolean {
  return !!(
    ladder.desire_text.trim() &&
    ladder.so_i_can_1.trim() &&
    ladder.so_i_can_2.trim() &&
    ladder.so_i_can_3.trim()
  )
}

export function isLesson2Complete(data: AudienceData): boolean {
  return !!(
    data.audience_description.trim() &&
    isDesireLadderComplete(data.desire_1) &&
    isDesireLadderComplete(data.desire_2) &&
    isDesireLadderComplete(data.desire_3)
  )
}

export function isLesson3Complete(data: TellLayers): boolean {
  return !!(
    data.will_tell_1.trim() &&
    data.will_tell_2.trim() &&
    data.will_tell_3.trim() &&
    data.wont_tell_1.trim() &&
    data.wont_tell_2.trim() &&
    data.wont_tell_3.trim() &&
    data.cant_tell_1.trim() &&
    data.cant_tell_2.trim() &&
    data.cant_tell_3.trim()
  )
}

export function isLesson4Complete(data: AwarenessQuestions): boolean {
  return !!(
    data.unaware_questions.trim() &&
    data.problem_aware_questions.trim() &&
    data.solution_aware_questions.trim() &&
    data.product_aware_questions.trim()
  )
}

export function isLesson5Complete(data: SaturationRead): boolean {
  return !!(
    data.saturated_topics.trim() &&
    data.saturated_formats.trim() &&
    data.competitor_angles.trim()
  )
}

export function isAllComplete(data: FlopProofFormData): boolean {
  return (
    isLesson1Complete(data.lesson1) &&
    isLesson2Complete(data.lesson2) &&
    isLesson3Complete(data.lesson3) &&
    isLesson4Complete(data.lesson4) &&
    isLesson5Complete(data.lesson5)
  )
}

// Sophistication stage prescriptions
export const SOPHISTICATION_PRESCRIPTIONS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Just say it plainly. You\'re first — clarity wins.',
  2: 'Say it bigger. Go further than they did.',
  3: 'Need a new mechanism. Shift from what to how it actually works.',
  4: 'Extend the mechanism. Make it explain more than theirs does.',
  5: 'Stop arguing the point. Use identity — "this is who we are."',
}

// Scope options for select
export const SCOPE_OPTIONS = [
  { value: 'niche_specialists', label: 'Niche specialists only' },
  { value: 'followers_plus_strangers', label: 'My followers + some strangers' },
  { value: 'most_people', label: 'Most people who scroll past' },
] as const
