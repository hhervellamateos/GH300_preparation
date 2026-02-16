import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExamStore } from '@/stores/examStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import type { Test } from '@/types'

export default function ManageTests() {
  const navigate = useNavigate()
  const tests = useExamStore((state) => state.tests)
  const [showForm, setShowForm] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)

  const handleCreateNew = () => {
    setEditingTest(null)
    setShowForm(true)
  }

  const handleEdit = (test: Test) => {
    setEditingTest(test)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Manage Tests</h1>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Test
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-6">
        {!showForm ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{test.title}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(test)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Questions:</strong> {test.questions.length}
                    </p>
                    <p>
                      <strong>Domains:</strong> {test.domains.length}
                    </p>
                    <p>
                      <strong>Time Limit:</strong> {test.timeLimit} minutes
                    </p>
                    <p>
                      <strong>Passing Score:</strong> {test.passingScore}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <TestForm
            test={editingTest}
            onCancel={() => setShowForm(false)}
            onSave={() => {
              setShowForm(false)
              setEditingTest(null)
            }}
          />
        )}
      </main>
    </div>
  )
}

// Component for test form
function TestForm({
  test,
  onCancel,
  onSave,
}: {
  test: Test | null
  onCancel: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState<Partial<Test>>(
    test || {
      title: '',
      questions: [],
      domains: [],
      passingScore: 70,
      timeLimit: 90,
    }
  )

  const [currentQuestion, setCurrentQuestion] = useState({
    number: 1,
    domain: '',
    text: '',
    options: [
      { letter: 'A' as const, text: '' },
      { letter: 'B' as const, text: '' },
      { letter: 'C' as const, text: '' },
      { letter: 'D' as const, text: '' },
      { letter: 'E' as const, text: '' },
    ],
    correctAnswers: [] as string[],
    explanation: '',
    isMultiSelect: false,
    documentationLink: '',
  })

  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)

  const handleAddOrUpdateQuestion = () => {
    if (
      !currentQuestion.domain ||
      !currentQuestion.text ||
      currentQuestion.correctAnswers.length === 0
    ) {
      alert('Please fill in all required fields')
      return
    }

    const questionData = {
      ...currentQuestion,
      options: currentQuestion.options.filter((opt) => opt.text.trim() !== ''),
    }

    if (editingQuestionIndex !== null) {
      // Update existing question
      const newQuestions = formData.questions?.map((q, i) =>
        i === editingQuestionIndex ? questionData : q
      )
      setFormData({
        ...formData,
        questions: newQuestions,
      })
      setEditingQuestionIndex(null)
    } else {
      // Add new question
      const newQuestion = {
        ...questionData,
        number: (formData.questions?.length || 0) + 1,
      }
      setFormData({
        ...formData,
        questions: [...(formData.questions || []), newQuestion],
      })
    }

    // Reset form
    resetQuestionForm()
  }

  const resetQuestionForm = () => {
    setCurrentQuestion({
      number: (formData.questions?.length || 0) + 1,
      domain: formData.questions?.[0]?.domain || '',
      text: '',
      options: [
        { letter: 'A' as const, text: '' },
        { letter: 'B' as const, text: '' },
        { letter: 'C' as const, text: '' },
        { letter: 'D' as const, text: '' },
        { letter: 'E' as const, text: '' },
      ],
      correctAnswers: [],
      explanation: '',
      isMultiSelect: false,
      documentationLink: '',
    })
    setEditingQuestionIndex(null)
  }

  const handleEditQuestion = (idx: number) => {
    const question = formData.questions?.[idx]
    if (!question) return

    // Ensure all 5 options are present
    const allOptions = [
      { letter: 'A' as const, text: '' },
      { letter: 'B' as const, text: '' },
      { letter: 'C' as const, text: '' },
      { letter: 'D' as const, text: '' },
      { letter: 'E' as const, text: '' },
    ]

    question.options.forEach((opt) => {
      const index = allOptions.findIndex((o) => o.letter === opt.letter)
      if (index !== -1) {
        allOptions[index] = opt
      }
    })

    setCurrentQuestion({
      number: question.number,
      domain: question.domain,
      text: question.text,
      options: allOptions,
      correctAnswers: question.correctAnswers,
      explanation: question.explanation,
      isMultiSelect: question.isMultiSelect,
      documentationLink: question.documentationLink || '',
    })
    setEditingQuestionIndex(idx)

    // Scroll to form
    setTimeout(() => {
      document.getElementById('question-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSaveTest = () => {
    if (
      !formData.title ||
      !formData.questions ||
      formData.questions.length === 0
    ) {
      alert('Please add at least one question and set a title')
      return
    }

    // Update domains based on questions
    const domains = Array.from(new Set(formData.questions.map((q) => q.domain)))
    const finalTest = { ...formData, domains } as Test

    console.log('Saving test:', finalTest)
    // Here you would implement the actual save logic
    onSave()
  }

  return (
    <div className="space-y-6">
      {/* Test Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>{test ? 'Edit Test' : 'Create New Test'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Test Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border p-2 dark:bg-gray-800"
              placeholder="GH-300 Practice Test 1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeLimit: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border p-2 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passingScore: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border p-2 dark:bg-gray-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      {formData.questions && formData.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({formData.questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded border p-3 ${
                    q.disabled ? 'bg-gray-100 opacity-50 dark:bg-gray-800' : ''
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {q.number}. {q.text.substring(0, 100)}
                      {q.text.length > 100 ? '...' : ''}
                      {q.disabled && ' (Disabled)'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {q.domain} • {q.correctAnswers.join(', ')} correct
                      {q.documentationLink && ' • Has documentation link'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuestion(idx)}
                      title="Edit question"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newQuestions = formData.questions?.map(
                          (question, i) =>
                            i === idx
                              ? { ...question, disabled: !question.disabled }
                              : question
                        )
                        setFormData({ ...formData, questions: newQuestions })
                      }}
                      title={
                        q.disabled ? 'Enable question' : 'Disable question'
                      }
                    >
                      {q.disabled ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newQuestions = formData.questions?.filter(
                          (_, i) => i !== idx
                        )
                        setFormData({ ...formData, questions: newQuestions })
                      }}
                      title="Delete question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Question Form */}
      <Card id="question-form">
        <CardHeader>
          <CardTitle>
            {editingQuestionIndex !== null ? 'Edit Question' : 'Add Question'}
            {editingQuestionIndex !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetQuestionForm}
                className="ml-2"
              >
                Cancel Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Domain <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentQuestion.domain}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  domain: e.target.value,
                })
              }
              className="w-full rounded-lg border p-2 dark:bg-gray-800"
              placeholder="e.g., Plan and design"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Question Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={currentQuestion.text}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, text: e.target.value })
              }
              className="w-full rounded-lg border p-2 dark:bg-gray-800"
              rows={3}
              placeholder="Enter the question text..."
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={currentQuestion.isMultiSelect}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    isMultiSelect: e.target.checked,
                  })
                }
              />
              Multi-select question
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Options</label>
            <div className="space-y-2">
              {currentQuestion.options.map((opt, idx) => (
                <div key={opt.letter} className="flex items-center gap-2">
                  <input
                    type={currentQuestion.isMultiSelect ? 'checkbox' : 'radio'}
                    name="correct-answer"
                    checked={currentQuestion.correctAnswers.includes(
                      opt.letter
                    )}
                    onChange={(e) => {
                      if (currentQuestion.isMultiSelect) {
                        setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswers: e.target.checked
                            ? [...currentQuestion.correctAnswers, opt.letter]
                            : currentQuestion.correctAnswers.filter(
                                (a) => a !== opt.letter
                              ),
                        })
                      } else {
                        setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswers: [opt.letter],
                        })
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <span className="font-medium">{opt.letter}.</span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options]
                      newOptions[idx] = { ...opt, text: e.target.value }
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: newOptions,
                      })
                    }}
                    className="flex-1 rounded-lg border p-2 dark:bg-gray-800"
                    placeholder={`Option ${opt.letter}`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Check the box/radio to mark correct answer(s)
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Explanation
            </label>
            <textarea
              value={currentQuestion.explanation}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  explanation: e.target.value,
                })
              }
              className="w-full rounded-lg border p-2 dark:bg-gray-800"
              rows={3}
              placeholder="Explanation for the correct answer..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Documentation Link (optional)
            </label>
            <input
              type="url"
              value={currentQuestion.documentationLink}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  documentationLink: e.target.value,
                })
              }
              className="w-full rounded-lg border p-2 dark:bg-gray-800"
              placeholder="https://docs.github.com/..."
            />
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Link to official documentation for this topic
            </p>
          </div>

          <Button onClick={handleAddOrUpdateQuestion} className="w-full">
            {editingQuestionIndex !== null ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Update Question
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Question to Test
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSaveTest} className="flex-1">
          Save Test
        </Button>
      </div>
    </div>
  )
}
