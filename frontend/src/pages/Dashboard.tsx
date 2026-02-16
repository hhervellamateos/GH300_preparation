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
  FileEdit,
  TrendingUp,
  Award,
  Target,
  BarChart3,
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
  const attempts = useHistoryStore((state) => state.attempts)

  const [selectedTest, setSelectedTest] = useState<1 | 2 | null>(null)
  const [selectedMode, setSelectedMode] = useState<ExamMode>('exam')

  const startExam = useExamStore((state) => state.startExam)

  const handleStart = () => {
    if (!selectedTest) return
    startExam(selectedTest, selectedMode)
    navigate(`/exam/${selectedTest}/${selectedMode}`)
  }

  // Calculate global statistics
  const totalAttempts = attempts.length
  const passedAttempts = attempts.filter((a) => a.passed).length
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0
  const avgGlobalScore = totalAttempts > 0 
    ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.totalQuestions) * 100, 0) / totalAttempts)
    : 0

  if (tests.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading tests...</h2>
        </div>
      </div>
    )
  }

  const selectedTestData = selectedTest ? tests.find(t => t.id === selectedTest) : null

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
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/manage-tests')}
              className="gap-2"
            >
              <FileEdit className="h-4 w-4" />
              Manage Tests
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/settings')}
              className="gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Two Panel Layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* LEFT PANEL - Test Explorer */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Tests</CardTitle>
                <CardDescription>Select a test to begin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tests.map((test) => {
                  const totalAttempts = getTotalAttempts(test.id)
                  const bestScore = getBestScore(test.id)
                  const isSelected = selectedTest === test.id

                  return (
                    <button
                      key={test.id}
                      onClick={() => setSelectedTest(test.id)}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{test.title}</h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {test.questions.filter((q) => !q.disabled).length} questions
                          </p>
                          {totalAttempts > 0 && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Award className="h-3 w-3" />
                              <span>Best: {bestScore}/{test.questions.filter((q) => !q.disabled).length}</span>
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL - Dynamic Content */}
          <div className="space-y-6">
            {!selectedTest ? (
              /* Global Statistics View */
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Overview</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your overall performance across all tests
                  </p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                          <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total Attempts
                          </p>
                          <p className="text-2xl font-bold">{totalAttempts}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Passed
                          </p>
                          <p className="text-2xl font-bold">{passedAttempts}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                          <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Pass Rate
                          </p>
                          <p className="text-2xl font-bold">{passRate}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                          <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Avg Score
                          </p>
                          <p className="text-2xl font-bold">{avgGlobalScore}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Test-by-Test Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Test Performance</CardTitle>
                    <CardDescription>Detailed statistics for each test</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tests.map((test) => {
                      const testAttempts = getTotalAttempts(test.id)
                      const testBest = getBestScore(test.id)
                      const testAvg = getAverageScore(test.id)
                      const testAttemptsList = getAttemptsByTest(test.id)
                      const testPassed = testAttemptsList.filter((a) => a.passed).length
                      const testPassRate = testAttempts > 0 
                        ? Math.round((testPassed / testAttempts) * 100)
                        : 0

                      return (
                        <div
                          key={test.id}
                          className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <h4 className="font-semibold mb-3">{test.title}</h4>
                          {testAttempts > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Attempts
                                </p>
                                <p className="text-xl font-bold">{testAttempts}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Best Score
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                  {testBest}/{test.questions.filter((q) => !q.disabled).length}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Average
                                </p>
                                <p className="text-xl font-bold">
                                  {testAvg}/{test.questions.filter((q) => !q.disabled).length}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Pass Rate
                                </p>
                                <p className="text-xl font-bold">{testPassRate}%</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No attempts yet. Select this test to get started!
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Selected Test View */
              selectedTestData && (
                <div className="space-y-6">
                  {/* Test Details Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl">
                            {selectedTestData.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {selectedTestData.questions.filter((q) => !q.disabled).length}{' '}
                            Questions • {selectedTestData.timeLimit} Minutes
                          </CardDescription>
                        </div>
                        <Badge variant="default">Selected</Badge>
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
                            {selectedTestData.passingScore}/
                            {selectedTestData.questions.filter((q) => !q.disabled).length}
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
                            {selectedTestData.domains.length}
                          </p>
                        </div>
                      </div>

                      {/* Statistics */}
                      {getTotalAttempts(selectedTestData.id) > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold">Your Statistics</h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Best
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                {getBestScore(selectedTestData.id)}/
                                {selectedTestData.questions.filter((q) => !q.disabled).length}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Average
                              </p>
                              <p className="text-lg font-bold">
                                {getAverageScore(selectedTestData.id)}/
                                {selectedTestData.questions.filter((q) => !q.disabled).length}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Attempts
                              </p>
                              <p className="text-lg font-bold">
                                {getTotalAttempts(selectedTestData.id)}
                              </p>
                            </div>
                          </div>

                          {(() => {
                            const lastAttempt = getAttemptsByTest(selectedTestData.id)[0]
                            return lastAttempt ? (
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
                            ) : null
                          })()}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Mode Selection */}
                  <Card>
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
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
