import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExamStore } from '@/stores/examStore'
import { useHistoryStore } from '@/stores/historyStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  PlayCircle,
  BookOpen,
  Settings as SettingsIcon,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ExamMode } from '@/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const tests = useExamStore((state) => state.tests)
  const getAttemptsByTest = useHistoryStore((state) => state.getAttemptsByTest)
  const getBestScore = useHistoryStore((state) => state.getBestScore)
  const getAverageScore = useHistoryStore((state) => state.getAverageScore)
  const getTotalAttempts = useHistoryStore((state) => state.getTotalAttempts)

  const [selectedTest, setSelectedTest] = useState<1 | 2 | null>(null)
  const [selectedMode, setSelectedMode] = useState<ExamMode>('exam')

  const startExam = useExamStore((state) => state.startExam)

  const handleStart = () => {
    if (!selectedTest) return
    startExam(selectedTest, selectedMode)
    navigate(`/exam/${selectedTest}/${selectedMode}`)
  }

  if (tests.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading tests...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              GH-300 Practice Tests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              GitHub Copilot Certification Preparation
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/settings')}
            className="gap-2"
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Test Cards */}
          {tests.map((test) => {
            const attempts = getAttemptsByTest(test.id)
            const bestScore = getBestScore(test.id)
            const avgScore = getAverageScore(test.id)
            const totalAttempts = getTotalAttempts(test.id)
            const lastAttempt = attempts[0]

            return (
              <Card
                key={test.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTest === test.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTest(test.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{test.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {test.questions.length} Questions • {test.timeLimit}{' '}
                        Minutes
                      </CardDescription>
                    </div>
                    {selectedTest === test.id && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Test Info */}
                  <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Passing Score
                      </p>
                      <p className="text-2xl font-bold">
                        {test.passingScore}/{test.questions.length}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        (72%)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Domains
                      </p>
                      <p className="text-2xl font-bold">
                        {test.domains.length}
                      </p>
                    </div>
                  </div>

                  {/* Statistics */}
                  {totalAttempts > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Your Statistics</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Best
                          </p>
                          <p className="text-lg font-bold text-success-600">
                            {bestScore}/{test.questions.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Average
                          </p>
                          <p className="text-lg font-bold">
                            {avgScore}/{test.questions.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Attempts
                          </p>
                          <p className="text-lg font-bold">{totalAttempts}</p>
                        </div>
                      </div>

                      {lastAttempt && (
                        <div className="mt-3 rounded border-l-4 border-primary bg-blue-50 p-3 dark:bg-blue-900/20">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                              Last attempt:{' '}
                              {formatDistanceToNow(lastAttempt.completedAt, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                              Score: {lastAttempt.score}/
                              {lastAttempt.totalQuestions}
                              {lastAttempt.passed && (
                                <Badge variant="success" className="ml-2">
                                  PASSED
                                </Badge>
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Mode Selection & Start */}
        {selectedTest && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Select Mode</CardTitle>
              <CardDescription>Choose how you want to practice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <button
                  onClick={() => setSelectedMode('exam')}
                  className={`rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                    selectedMode === 'exam'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <PlayCircle className="mb-2 h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Exam Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    100-minute timed test with realistic exam conditions
                  </p>
                </button>

                <button
                  onClick={() => setSelectedMode('practice')}
                  className={`rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                    selectedMode === 'practice'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <BookOpen className="mb-2 h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Practice Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Untimed practice with immediate feedback
                  </p>
                </button>

                <button
                  onClick={() => setSelectedMode('review')}
                  className={`rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                    selectedMode === 'review'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  disabled
                >
                  <BookOpen className="mb-2 h-8 w-8 text-gray-400" />
                  <h3 className="font-semibold text-gray-400">Review Mode</h3>
                  <p className="text-sm text-gray-400">
                    Coming soon: Review previously failed questions
                  </p>
                </button>
              </div>

              <div className="flex justify-end">
                <Button size="lg" onClick={handleStart} className="gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Start {selectedMode === 'exam' ? 'Exam' : 'Practice'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
