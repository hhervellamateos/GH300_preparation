import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useExamStore } from '@/stores/examStore'
import { useHistoryStore } from '@/stores/historyStore'
import QuestionView from '@/components/exam/QuestionView'
import Sidebar from '@/components/exam/Sidebar'
import Timer from '@/components/exam/Timer'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Home, X } from 'lucide-react'

export default function ExamPage() {
  const { testId, mode } = useParams<{ testId: string; mode: string }>()
  const navigate = useNavigate()

  const currentExam = useExamStore((state) => state.currentExam)
  const getTest = useExamStore((state) => state.getTest)
  const submitExam = useExamStore((state) => state.submitExam)
  const cancelExam = useExamStore((state) => state.cancelExam)
  const addAttempt = useHistoryStore((state) => state.addAttempt)

  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const test = testId ? getTest(Number(testId) as 1 | 2) : null

  useEffect(() => {
    // If no current exam, redirect to dashboard
    if (!currentExam) {
      navigate('/')
    }
  }, [currentExam, navigate])

  const handleSubmit = () => {
    const result = submitExam()
    if (result) {
      addAttempt(result)
      navigate(`/results/${result.id}`)
    }
  }

  const handleExitExam = () => {
    cancelExam()
    navigate('/')
  }

  const getAnsweredCount = () => {
    if (!currentExam || !test) return 0
    return Object.keys(currentExam.answers).filter(
      (key) => currentExam.answers[Number(key)]?.length > 0
    ).length
  }

  const getUnansweredQuestions = () => {
    if (!currentExam || !test) return []
    return test.questions
      .filter(
        (q) =>
          !currentExam.answers[q.number] ||
          currentExam.answers[q.number].length === 0
      )
      .map((q) => q.number)
  }

  if (!currentExam || !test) {
    return null
  }

  const answeredCount = getAnsweredCount()
  const unansweredQuestions = getUnansweredQuestions()
  const allAnswered = unansweredQuestions.length === 0

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExitDialog(true)}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Exit
          </Button>
          <div>
            <h1 className="text-xl font-bold">{test.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {currentExam.mode === 'exam' && <Timer />}

          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
            <p className="text-lg font-bold">
              {answeredCount}/{test.questions.length}
            </p>
          </div>

          <Button onClick={() => setShowSubmitDialog(true)} variant="default">
            Review & Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <QuestionView />
        </main>
      </div>

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold">Review Your Answers</h2>

            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <CheckCircle className="h-8 w-8 text-success-600" />
                <div>
                  <p className="font-semibold">Answered Questions</p>
                  <p className="text-2xl font-bold">
                    {answeredCount}/{test.questions.length}
                  </p>
                </div>
              </div>

              {!allAnswered && (
                <div className="flex items-center gap-3 rounded-lg bg-warning-50 p-4 dark:bg-warning-900/20">
                  <AlertCircle className="h-8 w-8 text-warning-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-warning-800 dark:text-warning-200">
                      Unanswered Questions
                    </p>
                    <p className="text-sm text-warning-700 dark:text-warning-300">
                      Questions: {unansweredQuestions.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-lg border p-4">
                <p className="mb-2 font-semibold">Marked for Review</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentExam.markedForReview.size > 0
                    ? `${currentExam.markedForReview.size} questions`
                    : 'None'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSubmitDialog(false)}
              >
                Continue Exam
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleSubmit}
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-warning-600" />
                <h2 className="text-xl font-bold">Exit Exam?</h2>
              </div>
              <button
                onClick={() => setShowExitDialog(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to exit? All your progress will be lost and
              this attempt will not be saved.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowExitDialog(false)}
              >
                Continue Exam
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleExitExam}
              >
                Exit & Lose Progress
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
