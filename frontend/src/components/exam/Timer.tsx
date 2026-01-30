import { useEffect, useState } from 'react'
import { useExamStore } from '@/stores/examStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatTime } from '@/lib/utils'
import { Clock } from 'lucide-react'

export default function Timer() {
  const currentExam = useExamStore((state) => state.currentExam)
  const updateTimer = useExamStore((state) => state.updateTimer)
  const submitExam = useExamStore((state) => state.submitExam)
  const settings = useSettingsStore((state) => state.settings)

  const [alertShown, setAlertShown] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!currentExam || currentExam.isPaused || currentExam.mode !== 'exam') {
      return
    }

    const interval = setInterval(() => {
      const newTime = currentExam.timeRemaining - 1

      if (newTime <= 0) {
        // Auto-submit when time runs out
        submitExam()
        return
      }

      updateTimer(newTime)

      // Show alerts
      const minutes = Math.floor(newTime / 60)
      const alertMinutes = [90, 60, 30, 10, 5] as const

      alertMinutes.forEach((min) => {
        if (minutes === min && !alertShown[min] && settings.timerAlerts[min]) {
          setAlertShown((prev) => ({ ...prev, [min]: true }))
          if (settings.soundEnabled) {
            // Play alert sound
            const audio = new Audio('/alert.mp3')
            audio.play().catch(() => {})
          }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentExam, updateTimer, submitExam, settings, alertShown])

  if (!currentExam || currentExam.mode !== 'exam') {
    return null
  }

  const minutes = Math.floor(currentExam.timeRemaining / 60)
  const isWarning = minutes <= 10 && minutes > 5
  const isCritical = minutes <= 5

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
        isCritical
          ? 'timer-critical bg-danger-100 dark:bg-danger-900/20'
          : isWarning
            ? 'timer-warning bg-warning-100 dark:bg-warning-900/20'
            : 'bg-gray-100 dark:bg-gray-700'
      }`}
    >
      <Clock className="h-5 w-5" />
      <div className="text-right">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Time Remaining
        </p>
        <p className="font-mono text-xl font-bold">
          {formatTime(currentExam.timeRemaining)}
        </p>
      </div>
    </div>
  )
}
