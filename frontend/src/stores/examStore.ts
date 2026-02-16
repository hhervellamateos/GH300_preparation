import { create } from 'zustand'
import type { ExamState, ExamMode, Question, Test, ExamAttempt } from '@/types'
import {
  generateId,
  saveToLocalStorage,
  loadFromLocalStorage,
} from '@/lib/utils'
import { gradeExam } from '@/utils/grading'

interface ExamStore {
  // State
  currentExam: ExamState | null
  tests: Test[]

  // Actions
  loadTests: () => Promise<void>
  startExam: (testId: 1 | 2, mode: ExamMode) => void
  selectAnswer: (questionNumber: number, option: string) => void
  deselectAnswer: (questionNumber: number, option: string) => void
  toggleAnswer: (questionNumber: number, option: string) => void
  markForReview: (questionNumber: number) => void
  unmarkForReview: (questionNumber: number) => void
  goToQuestion: (questionNumber: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  submitExam: () => ExamAttempt | null
  pauseExam: () => void
  resumeExam: () => void
  updateTimer: (seconds: number) => void
  getCurrentQuestion: () => Question | null
  getTest: (testId: 1 | 2) => Test | null
  saveProgress: () => void
  loadProgress: () => void
  clearExam: () => void
  cancelExam: () => void
}

export const useExamStore = create<ExamStore>((set, get) => ({
  currentExam: null,
  tests: [],

  loadTests: async () => {
    try {
      const [test1Response, test2Response] = await Promise.all([
        import('@/data/test1.json'),
        import('@/data/test2.json'),
      ])

      set({
        tests: [test1Response.default as Test, test2Response.default as Test],
      })
    } catch (error) {
      console.error('Error loading tests:', error)
    }
  },

  startExam: (testId, mode) => {
    const test = get().tests.find((t) => t.id === testId)
    if (!test) return

    const newExam: ExamState = {
      testId,
      mode,
      currentQuestion: 1,
      answers: {},
      markedForReview: new Set(),
      startTime: new Date(),
      timeRemaining: mode === 'exam' ? test.timeLimit * 60 : 0,
      isPaused: false,
    }

    set({ currentExam: newExam })
    get().saveProgress()
  },

  selectAnswer: (questionNumber, option) => {
    const { currentExam } = get()
    if (!currentExam) return

    const test = get().getTest(currentExam.testId)
    const question = test?.questions.find((q) => q.number === questionNumber)
    if (!question) return

    const currentAnswers = currentExam.answers[questionNumber] || []

    if (question.isMultiSelect) {
      // For multi-select, add to array if not already there
      if (!currentAnswers.includes(option)) {
        set({
          currentExam: {
            ...currentExam,
            answers: {
              ...currentExam.answers,
              [questionNumber]: [...currentAnswers, option],
            },
          },
        })
      }
    } else {
      // For single-select, replace the array
      set({
        currentExam: {
          ...currentExam,
          answers: {
            ...currentExam.answers,
            [questionNumber]: [option],
          },
        },
      })
    }

    get().saveProgress()
  },

  deselectAnswer: (questionNumber, option) => {
    const { currentExam } = get()
    if (!currentExam) return

    const currentAnswers = currentExam.answers[questionNumber] || []
    const newAnswers = currentAnswers.filter((a) => a !== option)

    set({
      currentExam: {
        ...currentExam,
        answers: {
          ...currentExam.answers,
          [questionNumber]: newAnswers,
        },
      },
    })

    get().saveProgress()
  },

  toggleAnswer: (questionNumber, option) => {
    const { currentExam } = get()
    if (!currentExam) return

    const currentAnswers = currentExam.answers[questionNumber] || []

    if (currentAnswers.includes(option)) {
      get().deselectAnswer(questionNumber, option)
    } else {
      get().selectAnswer(questionNumber, option)
    }
  },

  markForReview: (questionNumber) => {
    const { currentExam } = get()
    if (!currentExam) return

    const newMarked = new Set(currentExam.markedForReview)
    newMarked.add(questionNumber)

    set({
      currentExam: {
        ...currentExam,
        markedForReview: newMarked,
      },
    })

    get().saveProgress()
  },

  unmarkForReview: (questionNumber) => {
    const { currentExam } = get()
    if (!currentExam) return

    const newMarked = new Set(currentExam.markedForReview)
    newMarked.delete(questionNumber)

    set({
      currentExam: {
        ...currentExam,
        markedForReview: newMarked,
      },
    })

    get().saveProgress()
  },

  goToQuestion: (questionNumber) => {
    const { currentExam } = get()
    if (!currentExam) return

    const test = get().getTest(currentExam.testId)
    if (!test || questionNumber < 1 || questionNumber > test.questions.length)
      return

    set({
      currentExam: {
        ...currentExam,
        currentQuestion: questionNumber,
      },
    })

    get().saveProgress()
  },

  nextQuestion: () => {
    const { currentExam } = get()
    if (!currentExam) return

    const test = get().getTest(currentExam.testId)
    if (!test) return

    if (currentExam.currentQuestion < test.questions.length) {
      get().goToQuestion(currentExam.currentQuestion + 1)
    }
  },

  previousQuestion: () => {
    const { currentExam } = get()
    if (!currentExam) return

    if (currentExam.currentQuestion > 1) {
      get().goToQuestion(currentExam.currentQuestion - 1)
    }
  },

  submitExam: () => {
    const { currentExam } = get()
    if (!currentExam) return null

    const test = get().getTest(currentExam.testId)
    if (!test) return null

    const endTime = new Date()
    const duration = Math.floor(
      (endTime.getTime() - currentExam.startTime.getTime()) / 1000 / 60
    )

    const examResult = gradeExam(test, currentExam.answers)

    const attempt: ExamAttempt = {
      id: generateId(),
      testId: currentExam.testId,
      mode: currentExam.mode,
      startedAt: currentExam.startTime,
      completedAt: endTime,
      duration,
      score: examResult.score,
      totalQuestions: test.questions.length,
      passed: examResult.passed,
      answers: currentExam.answers,
      domainScores: examResult.domainScores,
    }

    get().clearExam()
    return attempt
  },

  pauseExam: () => {
    const { currentExam } = get()
    if (!currentExam || currentExam.mode === 'exam') return

    set({
      currentExam: {
        ...currentExam,
        isPaused: true,
      },
    })

    get().saveProgress()
  },

  resumeExam: () => {
    const { currentExam } = get()
    if (!currentExam) return

    set({
      currentExam: {
        ...currentExam,
        isPaused: false,
      },
    })

    get().saveProgress()
  },

  updateTimer: (seconds) => {
    const { currentExam } = get()
    if (!currentExam) return

    set({
      currentExam: {
        ...currentExam,
        timeRemaining: seconds,
      },
    })
  },

  getCurrentQuestion: () => {
    const { currentExam } = get()
    if (!currentExam) return null

    const test = get().getTest(currentExam.testId)
    if (!test) return null

    return (
      test.questions.find((q) => q.number === currentExam.currentQuestion) ||
      null
    )
  },

  getTest: (testId) => {
    const { tests } = get()
    const test = tests.find((t) => t.id === testId)
    if (!test) return null

    // Filter out disabled questions
    return {
      ...test,
      questions: test.questions.filter((q) => !q.disabled),
    }
  },

  saveProgress: () => {
    const { currentExam } = get()
    if (!currentExam) return

    // Convert Set to Array for storage
    const examToSave = {
      ...currentExam,
      markedForReview: Array.from(currentExam.markedForReview),
    }

    saveToLocalStorage('gh300_current_exam', examToSave)
  },

  loadProgress: () => {
    const saved = loadFromLocalStorage<
      ExamState & { markedForReview: number[] }
    >('gh300_current_exam')

    if (saved) {
      // Convert Array back to Set
      const exam: ExamState = {
        ...saved,
        startTime: new Date(saved.startTime),
        markedForReview: new Set(saved.markedForReview),
      }

      set({ currentExam: exam })
    }
  },

  clearExam: () => {
    set({ currentExam: null })
    saveToLocalStorage('gh300_current_exam', null)
  },

  cancelExam: () => {
    set({ currentExam: null })
    saveToLocalStorage('gh300_current_exam', null)
  },
}))
