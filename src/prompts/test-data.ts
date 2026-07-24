// Test data for the Flop-Proof Content System
// Use this to test Prompt A without filling out forms manually

import { FlopProofFormData } from '../components/flop-proof/types'

/**
 * Football recruiting coach example
 * High-ticket coaching for parents of high school athletes
 */
export const footballRecruitingCoach: FlopProofFormData = {
  lesson1: {
    niche: 'College football recruiting',
    core_problem: 'Parents don\'t know how the recruiting process works and their kids are getting overlooked',
    what_you_do: 'Help high school athletes get recruited to play college football',
    what_you_teach: 'The recruiting timeline, how to build relationships with coaches, what coaches actually look for beyond highlight tapes',
  },
  lesson2: {
    audience_description: 'Parents of high school football players (mostly dads, ages 40-55) who believe their son has college potential but feel lost navigating the recruiting process. They\'ve been to showcases, made highlight videos, but haven\'t heard from coaches. They\'re frustrated, anxious about their son\'s future, and secretly worried they\'re running out of time.',
    desire_1: {
      desire_text: 'Get my son recruited to play college football',
      so_i_can_1: 'See him keep playing the sport he loves past high school',
      so_i_can_2: 'Know the years of early mornings and travel ball meant something',
      so_i_can_3: 'Not watch his dream die because we didn\'t know how the game works',
      urgency: 5,
      repeats: 4,
      who_cares: 'some_strangers_too',
    },
    desire_2: {
      desire_text: 'Understand what coaches actually want',
      so_i_can_1: 'Stop guessing and wasting time on the wrong things',
      so_i_can_2: 'Give my son the best chance instead of random shots in the dark',
      so_i_can_3: 'Feel like a good dad who did everything he could',
      urgency: 4,
      repeats: 5,
      who_cares: 'almost_everyone',
    },
    desire_3: {
      desire_text: 'Know if my son is actually good enough',
      so_i_can_1: 'Stop lying to myself or underselling him',
      so_i_can_2: 'Set realistic expectations instead of chasing false hope',
      so_i_can_3: 'Have an honest conversation about his future without crushing him',
      urgency: 5,
      repeats: 3,
      who_cares: 'almost_everyone',
    },
  },
  lesson3: {
    will_tell_1: 'My son just needs to get seen by more coaches',
    will_tell_2: 'The recruiting process is confusing and nobody explains it clearly',
    will_tell_3: 'We\'ve done showcases and camps but nothing is happening',
    wont_tell_1: 'I\'m terrified we\'ve already missed the window and it\'s too late',
    wont_tell_2: 'I don\'t actually know if my son is good enough and I\'m scared to find out',
    wont_tell_3: 'I feel like a failure as a dad for not figuring this out earlier',
    cant_tell_1: 'Coaches aren\'t evaluating your son\'s tape — they\'re evaluating whether he\'s coachable and fits their culture',
    cant_tell_2: 'The recruiting process is a relationship game, not a talent showcase',
    cant_tell_3: 'Most parents are doing the exact opposite of what works — broadcasting instead of building relationships',
  },
  lesson4: {
    unaware_questions: 'How do I help my kid stand out in sports? Is it worth pushing my son in athletics? What makes some kids get opportunities and others don\'t?',
    problem_aware_questions: 'How does college recruiting actually work? Why aren\'t coaches reaching out to my son? When is it too late to start the recruiting process?',
    solution_aware_questions: 'Are recruiting services worth it? What should be in a highlight video? Should we hire a recruiting consultant?',
    product_aware_questions: 'Does this recruiting system actually work? What results have other families gotten? Is this worth the investment?',
  },
  lesson5: {
    saturated_topics: '"Email coaches early and often", "GPA matters for recruiting", "Make a highlight video", "Go to camps and showcases"',
    saturated_formats: '"Day in the life of a recruit", "Things coaches won\'t tell you", "Watch us visit this campus", "Recruiting update vlog"',
    competitor_angles: '"Coaches want to see hustle and heart", "Be proactive and reach out first", "Your highlight tape is your resume"',
    sophistication_stage: 3,
  },
}

/**
 * Meal prep mom example
 * Content creator helping busy moms with weeknight dinners
 */
export const mealPrepMom: FlopProofFormData = {
  lesson1: {
    niche: 'Meal planning for busy moms',
    core_problem: 'Moms are exhausted by 5pm and dread figuring out dinner every single night',
    what_you_do: 'Help moms eliminate dinner decision fatigue so they have energy left for their families',
    what_you_teach: 'The decision-removal approach to meal planning — it\'s not about recipes, it\'s about removing the daily drain of choosing',
  },
  lesson2: {
    audience_description: 'Moms with kids under 12, working part or full-time, who feel like failures every time they hit the drive-thru or serve cereal for dinner. They\'ve tried meal planning before but it never stuck. By 5pm they\'re running on empty and dinner feels like one more thing stealing their energy.',
    desire_1: {
      desire_text: 'Have dinner figured out without thinking about it every day',
      so_i_can_1: 'Stop dreading 5pm every single day',
      so_i_can_2: 'Have mental energy left after the day',
      so_i_can_3: 'Actually enjoy my evening instead of surviving it',
      urgency: 5,
      repeats: 5,
      who_cares: 'almost_everyone',
    },
    desire_2: {
      desire_text: 'Feed my family real food without spending hours cooking',
      so_i_can_1: 'Stop feeling guilty about takeout and frozen meals',
      so_i_can_2: 'Feel like I\'m taking care of them the way I want to',
      so_i_can_3: 'Feel like a good mom, not a stressed-out mess',
      urgency: 4,
      repeats: 5,
      who_cares: 'almost_everyone',
    },
    desire_3: {
      desire_text: 'Get my picky eaters to eat without a battle',
      so_i_can_1: 'Stop making three different dinners',
      so_i_can_2: 'Have dinner actually feel peaceful',
      so_i_can_3: 'Stop feeling like a short-order cook and actually sit down with my family',
      urgency: 4,
      repeats: 5,
      who_cares: 'some_strangers_too',
    },
  },
  lesson3: {
    will_tell_1: 'I just don\'t have time to cook elaborate meals',
    will_tell_2: 'My kids are so picky, meal planning doesn\'t work for us',
    will_tell_3: 'I\'ve tried meal prepping before but I can\'t stick with it',
    wont_tell_1: 'I feel like a failure when I feed them chicken nuggets again',
    wont_tell_2: 'My mom did this without complaining and I can\'t even handle one week',
    wont_tell_3: 'I\'m too exhausted to care about nutrition by 6pm',
    cant_tell_1: 'The problem isn\'t recipes or time — it\'s decision fatigue at 5pm when your willpower is already spent',
    cant_tell_2: 'Meal prep fails because you\'re still making decisions every day — you need decisions removed entirely',
    cant_tell_3: 'You don\'t need better recipes, you need a system that requires zero thinking',
  },
  lesson4: {
    unaware_questions: 'Why am I so tired by 5pm? Why do I dread evenings? How do other moms seem to have it together?',
    problem_aware_questions: 'How do I stop eating out so much? What can I make that\'s fast AND my kids will eat? Why can\'t I stick to a meal plan?',
    solution_aware_questions: 'What\'s the best meal planning app? Is meal delivery worth it for families? Should I try batch cooking?',
    product_aware_questions: 'Does this meal planning system work for picky eaters? What\'s actually in the program? How is this different from other meal plans?',
  },
  lesson5: {
    saturated_topics: '"Meal prep saves time", "Cook once eat all week", "Here\'s what I meal prepped this Sunday", "Healthy eating doesn\'t have to be hard"',
    saturated_formats: '"What I eat in a day", "Grocery haul", "Realistic meal prep for busy moms", "Easy weeknight dinner ideas"',
    competitor_angles: '"You just need to plan ahead", "15-minute meals the whole family will love", "Simple swaps for healthier eating"',
    sophistication_stage: 4,
  },
}

/**
 * Lightroom photographer example
 * Teaching editing to hobbyist photographers
 */
export const lightroomPhotographer: FlopProofFormData = {
  lesson1: {
    niche: 'Photo editing with Lightroom',
    core_problem: 'Photographers\' edits look amateur and over-processed, and they don\'t know why',
    what_you_do: 'Teach photographers to edit with intention so their photos look professional, not filtered',
    what_you_teach: 'Color theory for editing, when NOT to edit, how to read a histogram, why presets fail on your photos',
  },
  lesson2: {
    audience_description: 'Hobbyist photographers with decent cameras who have been shooting for 1-3 years. They\'ve bought Lightroom, watched tutorials, maybe purchased presets, but their edits still look "off." They\'re frustrated because they can\'t figure out what\'s wrong. Photography is their creative outlet and they want to be proud of their work.',
    desire_1: {
      desire_text: 'Make my photos look professional, not over-edited',
      so_i_can_1: 'Actually share them without cringing',
      so_i_can_2: 'Feel proud of my work instead of embarrassed',
      so_i_can_3: 'Feel like a real photographer, not just someone with an expensive camera',
      urgency: 4,
      repeats: 5,
      who_cares: 'almost_everyone',
    },
    desire_2: {
      desire_text: 'Understand WHY my edits look amateur',
      so_i_can_1: 'Stop guessing and actually improve',
      so_i_can_2: 'Know what to fix instead of randomly moving sliders',
      so_i_can_3: 'Trust my own eye instead of constantly second-guessing myself',
      urgency: 4,
      repeats: 4,
      who_cares: 'some_strangers_too',
    },
    desire_3: {
      desire_text: 'Develop my own editing style',
      so_i_can_1: 'Stop copying other photographers',
      so_i_can_2: 'Have a consistent look across my portfolio',
      so_i_can_3: 'Feel like an artist with a voice, not a copycat',
      urgency: 3,
      repeats: 4,
      who_cares: 'some_strangers_too',
    },
  },
  lesson3: {
    will_tell_1: 'Presets never look the same on my photos as the examples',
    will_tell_2: 'I\'ve watched so many tutorials but nothing sticks',
    will_tell_3: 'My edits look too edited and I don\'t know how to fix it',
    wont_tell_1: 'I\'m embarrassed to show people my edited photos',
    wont_tell_2: 'I secretly think I just don\'t have "the eye" for this',
    wont_tell_3: 'I feel like a fraud calling myself a photographer when I can\'t even edit',
    cant_tell_1: 'You\'re over-editing because you don\'t trust the original shot',
    cant_tell_2: 'Presets fail because they\'re designed for specific lighting — you\'re applying them to the wrong conditions',
    cant_tell_3: 'The problem isn\'t technique, it\'s that you don\'t understand what you\'re trying to achieve before you start editing',
  },
  lesson4: {
    unaware_questions: 'Why don\'t my photos look like what I saw? How do other photographers get those colors? Why does my camera make everything look flat?',
    problem_aware_questions: 'How do I make my edits look less edited? Why do presets look different on my photos? How do I get consistent edits?',
    solution_aware_questions: 'What Lightroom presets do pros use? Lightroom vs Photoshop for editing? Best YouTube channels for learning photo editing?',
    product_aware_questions: 'Are these presets worth the price? Does this editing course cover portraits? What makes this different from free tutorials?',
  },
  lesson5: {
    saturated_topics: '"Before and after edits", "My editing workflow", "How I edit photos in Lightroom", "Best Lightroom settings"',
    saturated_formats: '"POV: you\'re editing photos", "Presets I can\'t live without", "Watch me edit this photo", "Satisfying editing transformation"',
    competitor_angles: '"Editing is where the magic happens", "Presets are just a starting point", "Shoot in RAW for more flexibility"',
    sophistication_stage: 4,
  },
}

/**
 * Console script to inject test data into localStorage
 * Run this in the browser console after logging in
 */
export function getConsoleInjectionScript(persona: 'football' | 'mealprep' | 'lightroom', userId: string): string {
  const data = persona === 'football' ? footballRecruitingCoach
    : persona === 'mealprep' ? mealPrepMom
    : lightroomPhotographer

  return `// Paste this in browser console to inject test data
// Make sure you're logged in first!

const testData = ${JSON.stringify(data, null, 2)};

localStorage.setItem('flop-proof-form-data-${userId}', JSON.stringify(testData));
console.log('Test data injected! Refresh the page to see it.');`
}
