import { useExamStore } from '@/stores/examStore'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'

export default function QuestionView() {
  const currentExam = useExamStore((state) => state.currentExam)
  const getCurrentQuestion = useExamStore((state) => state.getCurrentQuestion)
  const toggleAnswer = useExamStore((state) => state.toggleAnswer)
  const markForReview = useExamStore((state) => state.markForReview)
  const unmarkForReview = useExamStore((state) => state.unmarkForReview)
  const nextQuestion = useExamStore((state) => state.nextQuestion)
  const previousQuestion = useExamStore((state) => state.previousQuestion)
  const getTest = useExamStore((state) => state.getTest)

  const question = getCurrentQuestion()
  const test = currentExam ? getTest(currentExam.testId) : null

  if (!currentExam || !question || !test) {
    return null
  }

  const userAnswers = currentExam.answers[question.number] || []
  const isMarked = currentExam.markedForReview.has(question.number)
  const isLastQuestion = currentExam.currentQuestion === test.questions.length

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Question Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-2xl font-bold">
              Question {question.number} of {test.questions.length}
            </h2>
            {question.isMultiSelect && (
              <Badge variant="warning">Select Multiple</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Domain: {question.domain}
          </p>
        </div>

        <Button
          variant={isMarked ? 'default' : 'outline'}
          onClick={() =>
            isMarked
              ? unmarkForReview(question.number)
              : markForReview(question.number)
          }
          className="gap-2"
        >
          <Flag className="h-4 w-4" />
          {isMarked ? 'Unmark' : 'Mark for Review'}
        </Button>
      </div>

      {/* Question Text */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <p className="whitespace-pre-wrap text-lg leading-relaxed">
          {question.text}
        </p>
      </div>

      {/* Options */}
      <div className="mb-8 space-y-3">
        {question.options.map((option) => {
          const isSelected = userAnswers.includes(option.letter)

          return (
            <button
              key={option.letter}
              onClick={() => toggleAnswer(question.number, option.letter)}
              className={`flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                {question.isMultiSelect ? (
                  <Checkbox checked={isSelected} />
                ) : (
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-gray-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="h-full w-full rounded-full bg-white" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <span className="font-semibold text-primary">
                  {option.letter}.
                </span>{' '}
                <span className="text-gray-900 dark:text-gray-100">
                  {option.text}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentExam.currentQuestion === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentExam.currentQuestion} of {test.questions.length}
        </div>

        <Button
          onClick={nextQuestion}
          disabled={isLastQuestion}
          className="gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
