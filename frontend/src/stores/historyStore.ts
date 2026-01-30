import { create } from 'zustand'
import type { ExamAttempt } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface HistoryStore {
  attempts: ExamAttempt[]

  addAttempt: (attempt: ExamAttempt) => void
  getAttemptsByTest: (testId: 1 | 2) => ExamAttempt[]
  getAttempt: (attemptId: string) => ExamAttempt | null
  getBestScore: (testId: 1 | 2) => number
  getAverageScore: (testId: 1 | 2) => number
  getTotalAttempts: (testId: 1 | 2) => number
  clearHistory: () => void
  loadHistory: () => void
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  attempts: [],

  addAttempt: (attempt) => {
    const newAttempts = [...get().attempts, attempt]
    set({ attempts: newAttempts })
    saveToLocalStorage('gh300_attempts', newAttempts)
  },

  getAttemptsByTest: (testId) => {
    return get()
      .attempts.filter((a) => a.testId === testId)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
  },

  getAttempt: (attemptId) => {
    return get().attempts.find((a) => a.id === attemptId) || null
  },

  getBestScore: (testId) => {
    const testAttempts = get().getAttemptsByTest(testId)
    if (testAttempts.length === 0) return 0
    return Math.max(...testAttempts.map((a) => a.score))
  },

  getAverageScore: (testId) => {
    const testAttempts = get().getAttemptsByTest(testId)
    if (testAttempts.length === 0) return 0
    const sum = testAttempts.reduce((acc, a) => acc + a.score, 0)
    return Math.round(sum / testAttempts.length)
  },

  getTotalAttempts: (testId) => {
    return get().getAttemptsByTest(testId).length
  },

  clearHistory: () => {
    set({ attempts: [] })
    saveToLocalStorage('gh300_attempts', [])
  },

  loadHistory: () => {
    const saved = loadFromLocalStorage<ExamAttempt[]>('gh300_attempts')
    if (saved) {
      // Convert date strings back to Date objects
      const attempts = saved.map((a) => ({
        ...a,
        startedAt: new Date(a.startedAt),
        completedAt: new Date(a.completedAt),
      }))
      set({ attempts })
    }
  },
}))
