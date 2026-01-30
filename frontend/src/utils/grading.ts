import type { Test, DomainScore } from '@/types'

// Re-export for convenience
export type { DomainScore }

export type ExamResult = {
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
  domainScores: Record<string, DomainScore>
}

export function gradeExam(
  test: Test,
  answers: Record<number, string[]>
): ExamResult {
  let correctCount = 0
  const domainScores: Record<string, { correct: number; total: number }> = {}

  // Initialize domain scores
  test.domains.forEach((domain) => {
    domainScores[domain] = { correct: 0, total: 0 }
  })

  // Grade each question
  test.questions.forEach((question) => {
    const userAnswer = answers[question.number] || []
    const correctAnswer = question.correctAnswers

    // Check if answer is correct
    const isCorrect =
      userAnswer.length === correctAnswer.length &&
      userAnswer.every((ans) => correctAnswer.includes(ans))

    if (isCorrect) {
      correctCount++
      domainScores[question.domain].correct++
    }

    domainScores[question.domain].total++
  })

  // Calculate percentages
  const domainScoresWithPercentage: Record<string, DomainScore> = {}
  Object.entries(domainScores).forEach(([domain, scores]) => {
    domainScoresWithPercentage[domain] = {
      ...scores,
      percentage:
        scores.total > 0
          ? Math.round((scores.correct / scores.total) * 100)
          : 0,
    }
  })

  const percentage = Math.round((correctCount / test.questions.length) * 100)
  const passed = correctCount >= test.passingScore

  return {
    score: correctCount,
    totalQuestions: test.questions.length,
    percentage,
    passed,
    domainScores: domainScoresWithPercentage,
  }
}

export function isAnswerCorrect(
  correctAnswers: string[],
  userAnswers: string[]
): boolean {
  return (
    userAnswers.length === correctAnswers.length &&
    userAnswers.every((ans) => correctAnswers.includes(ans))
  )
}
