import { useExamStore } from '@/stores/examStore'
import { CheckCircle, Circle, Flag } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function Sidebar() {
  const currentExam = useExamStore((state) => state.currentExam)
  const getTest = useExamStore((state) => state.getTest)
  const goToQuestion = useExamStore((state) => state.goToQuestion)

  if (!currentExam) return null

  const test = getTest(currentExam.testId)
  if (!test) return null

  const answeredCount = Object.keys(currentExam.answers).filter(
    (key) => currentExam.answers[Number(key)]?.length > 0
  ).length

  const progressPercentage = Math.round(
    (answeredCount / test.questions.length) * 100
  )

  // Group questions by domain
  const questionsByDomain = test.questions.reduce(
    (acc, q) => {
      if (!acc[q.domain]) acc[q.domain] = []
      acc[q.domain].push(q)
      return acc
    },
    {} as Record<string, typeof test.questions>
  )

  const getQuestionStatus = (questionNumber: number) => {
    const isAnswered = currentExam.answers[questionNumber]?.length > 0
    const isMarked = currentExam.markedForReview.has(questionNumber)
    const isCurrent = currentExam.currentQuestion === questionNumber

    return { isAnswered, isMarked, isCurrent }
  }

  return (
    <aside className="flex h-screen w-80 flex-col border-r bg-white dark:bg-gray-800">
      {/* Progress Overview */}
      <div className="flex-shrink-0 border-b p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold">Overall Progress</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {answeredCount}/{test.questions.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {progressPercentage}% Complete
        </p>
      </div>

      {/* Scrollable content */}
      <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-900 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 flex-1 overflow-y-auto p-6 pb-8">
        {/* Legend */}
        <div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success-600" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-warning-600" />
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-gray-400" />
            <span>Unanswered</span>
          </div>
        </div>

        {/* Question Grid by Domain */}
        <div className="space-y-6">
          {Object.entries(questionsByDomain).map(([domain, questions]) => {
            const domainAnswered = questions.filter(
              (q) => currentExam.answers[q.number]?.length > 0
            ).length

            return (
              <div key={domain}>
                <div className="mb-3">
                  <p className="text-sm font-semibold">{domain}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {domainAnswered}/{questions.length} answered
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q) => {
                    const { isAnswered, isMarked, isCurrent } =
                      getQuestionStatus(q.number)

                    return (
                      <button
                        key={q.number}
                        onClick={() => goToQuestion(q.number)}
                        className={`relative aspect-square rounded-lg border-2 text-sm font-semibold transition-all hover:scale-105 ${
                          isCurrent
                            ? 'border-primary bg-primary text-white'
                            : isAnswered
                              ? 'border-success-600 bg-success-50 text-success-700 dark:bg-success-900/20'
                              : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                        }`}
                      >
                        {q.number}
                        {isMarked && (
                          <Flag className="absolute right-0.5 top-0.5 h-3 w-3 text-warning-600" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
