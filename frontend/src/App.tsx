import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useExamStore } from './stores/examStore'
import { useHistoryStore } from './stores/historyStore'
import { useSettingsStore } from './stores/settingsStore'
import Dashboard from './pages/Dashboard'
import ExamPage from './pages/ExamPage'
import ResultsPage from './pages/ResultsPage'
import Settings from './pages/Settings'
import ManageTests from './pages/ManageTests'

function App() {
  const loadTests = useExamStore((state) => state.loadTests)
  const loadHistory = useHistoryStore((state) => state.loadHistory)
  const loadSettings = useSettingsStore((state) => state.loadSettings)

  useEffect(() => {
    // Load all initial data
    loadTests()
    loadHistory()
    loadSettings()
  }, [loadTests, loadHistory, loadSettings])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/exam/:testId/:mode" element={<ExamPage />} />
        <Route path="/results/:attemptId" element={<ResultsPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/manage-tests" element={<ManageTests />} />
      </Routes>
    </Router>
  )
}

export default App
