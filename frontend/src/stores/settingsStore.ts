import { create } from 'zustand'
import type { UserSettings } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

interface SettingsStore {
  settings: UserSettings

  setTheme: (theme: UserSettings['theme']) => void
  setFontSize: (fontSize: UserSettings['fontSize']) => void
  toggleSound: () => void
  toggleTimerAlert: (minutes: keyof UserSettings['timerAlerts']) => void
  loadSettings: () => void
  resetSettings: () => void
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  fontSize: 'medium',
  soundEnabled: true,
  timerAlerts: {
    90: true,
    60: true,
    30: true,
    10: true,
    5: true,
  },
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: defaultSettings,

  setTheme: (theme) => {
    const newSettings = { ...get().settings, theme }
    set({ settings: newSettings })
    saveToLocalStorage('gh300_settings', newSettings)

    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // Auto mode
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },

  setFontSize: (fontSize) => {
    const newSettings = { ...get().settings, fontSize }
    set({ settings: newSettings })
    saveToLocalStorage('gh300_settings', newSettings)

    // Apply font size to document
    const root = document.documentElement
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px'
        break
      case 'large':
        root.style.fontSize = '18px'
        break
      default:
        root.style.fontSize = '16px'
    }
  },

  toggleSound: () => {
    const newSettings = {
      ...get().settings,
      soundEnabled: !get().settings.soundEnabled,
    }
    set({ settings: newSettings })
    saveToLocalStorage('gh300_settings', newSettings)
  },

  toggleTimerAlert: (minutes) => {
    const newSettings = {
      ...get().settings,
      timerAlerts: {
        ...get().settings.timerAlerts,
        [minutes]: !get().settings.timerAlerts[minutes],
      },
    }
    set({ settings: newSettings })
    saveToLocalStorage('gh300_settings', newSettings)
  },

  loadSettings: () => {
    const saved = loadFromLocalStorage<UserSettings>('gh300_settings')
    if (saved) {
      set({ settings: saved })
      // Apply saved settings
      get().setTheme(saved.theme)
      get().setFontSize(saved.fontSize)
    } else {
      // Initialize with defaults
      get().setTheme(defaultSettings.theme)
    }
  },

  resetSettings: () => {
    set({ settings: defaultSettings })
    saveToLocalStorage('gh300_settings', defaultSettings)
    get().setTheme(defaultSettings.theme)
    get().setFontSize(defaultSettings.fontSize)
  },
}))
