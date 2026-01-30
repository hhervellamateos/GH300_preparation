export type QuestionOption = {
  letter: 'A' | 'B' | 'C' | 'D' | 'E'
  text: string
}

export type Question = {
  number: number
  domain: string
  text: string
  options: QuestionOption[]
  correctAnswers: string[]
  explanation: string
  isMultiSelect: boolean
}

export type Test = {
  id: 1 | 2
  title: string
  questions: Question[]
  domains: string[]
  passingScore: number
  timeLimit: number
}

export type ExamMode = 'exam' | 'practice' | 'review'

export type ExamState = {
  testId: 1 | 2
  mode: ExamMode
  currentQuestion: number
  answers: Record<number, string[]>
  markedForReview: Set<number>
  startTime: Date
  endTime?: Date
  timeRemaining: number
  isPaused: boolean
}

export type DomainScore = {
  correct: number
  total: number
  percentage: number
}

export type ExamAttempt = {
  id: string
  testId: 1 | 2
  mode: ExamMode
  startedAt: Date
  completedAt: Date
  duration: number
  score: number
  totalQuestions: number
  passed: boolean
  answers: Record<number, string[]>
  domainScores: Record<string, DomainScore>
}

export type UserSettings = {
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large'
  soundEnabled: boolean
  timerAlerts: {
    90: boolean
    60: boolean
    30: boolean
    10: boolean
    5: boolean
  }
}
