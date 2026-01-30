import { useParams, useNavigate } from 'react-router-dom'
import { useHistoryStore } from '@/stores/historyStore'
import { useExamStore } from '@/stores/examStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  XCircle,
  Home,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState } from 'react'

export default function ResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()

  const getAttempt = useHistoryStore((state) => state.getAttempt)
  const getTest = useExamStore((state) => state.getTest)

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const attempt = attemptId ? getAttempt(attemptId) : null
  const test = attempt ? getTest(attempt.testId) : null

  if (!attempt || !test) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Results not found</h2>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Exam Results</h1>
              <p className="text-gray-600 dark:text-gray-400">{test.title}</p>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Overall Score</CardTitle>
              {attempt.passed ? (
                <Badge variant="success" className="text-lg">
                  ✓ PASSED
                </Badge>
              ) : (
                <Badge variant="danger" className="text-lg">
                  ✗ FAILED
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <p className="text-6xl font-bold text-primary">
                  {attempt.score}
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  out of {attempt.totalQuestions}
                </p>
              </div>

              <div className="text-center">
                <p className="text-6xl font-bold">{percentage}%</p>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Passing: 72%
                </p>
              </div>

              <div className="text-center">
                <p className="text-6xl font-bold">{attempt.duration}</p>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Domain Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(attempt.domainScores).map(([domain, scores]) => (
                <div key={domain}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{domain}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {scores.correct}/{scores.total} ({scores.percentage}%)
                    </span>
                  </div>
                  <Progress value={scores.percentage} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question by Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {test.questions.map((question) => {
                const userAnswer = attempt.answers[question.number] || []
                const isCorrect =
                  userAnswer.length === question.correctAnswers.length &&
                  userAnswer.every((ans) =>
                    question.correctAnswers.includes(ans)
                  )
                const isExpanded = expandedQuestion === question.number

                return (
                  <div
                    key={question.number}
                    className={`rounded-lg border p-4 ${
                      isCorrect
                        ? 'border-success-200 bg-success-50 dark:bg-success-900/10'
                        : 'border-danger-200 bg-danger-50 dark:bg-danger-900/10'
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedQuestion(isExpanded ? null : question.number)
                      }
                      className="flex w-full items-start justify-between text-left"
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="mt-1 h-5 w-5 text-success-600" />
                        ) : (
                          <XCircle className="mt-1 h-5 w-5 text-danger-600" />
                        )}
                        <div>
                          <p className="font-semibold">
                            Question {question.number}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {question.domain}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        <p className="text-sm">{question.text}</p>

                        <div className="space-y-2">
                          <p className="font-semibold">Your Answer:</p>
                          <p
                            className={
                              isCorrect ? 'text-success-700' : 'text-danger-700'
                            }
                          >
                            {userAnswer.length > 0
                              ? userAnswer.join(', ')
                              : 'Not answered'}
                          </p>
                        </div>

                        {!isCorrect && (
                          <div className="space-y-2">
                            <p className="font-semibold">Correct Answer:</p>
                            <p className="text-success-700">
                              {question.correctAnswers.join(', ')}
                            </p>
                          </div>
                        )}

                        <div className="rounded bg-white p-4 dark:bg-gray-800">
                          <p className="mb-2 font-semibold">Explanation:</p>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            {question.explanation}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
