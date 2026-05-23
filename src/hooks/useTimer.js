import { useState, useEffect, useRef, useCallback } from 'react'

export const MODES = {
  FOCUS: 'focus',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break',
}

const DEFAULT_SETTINGS = {
  focusMins: 25,
  shortBreakMins: 5,
  longBreakMins: 15,
  rounds: 4,
}

function getTodayKey() {
  const d = new Date()
  return `pomo_history_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`
}

function loadHistory() {
  try {
    const key = getTodayKey()
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(sessions) {
  try {
    localStorage.setItem(getTodayKey(), JSON.stringify(sessions))
  } catch {}
}

function loadSettings() {
  try {
    const raw = localStorage.getItem('pomo_settings')
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(s) {
  try {
    localStorage.setItem('pomo_settings', JSON.stringify(s))
  } catch {}
}

export function useTimer(onCycleEnd) {
  const [settings, setSettings] = useState(loadSettings)
  const [mode, setMode] = useState(MODES.FOCUS)
  const [secondsLeft, setSecondsLeft] = useState(settings.focusMins * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [history, setHistory] = useState(loadHistory)
  const intervalRef = useRef(null)
  const modeRef = useRef(mode)
  const settingsRef = useRef(settings)

  modeRef.current = mode
  settingsRef.current = settings

  const getDuration = useCallback((m, s) => {
    if (m === MODES.FOCUS) return s.focusMins * 60
    if (m === MODES.SHORT_BREAK) return s.shortBreakMins * 60
    return s.longBreakMins * 60
  }, [])

  const completeSession = useCallback(() => {
    const currentMode = modeRef.current
    const currentSettings = settingsRef.current

    if (currentMode === MODES.FOCUS) {
      const session = {
        id: Date.now(),
        duration: currentSettings.focusMins * 60,
        completedAt: new Date().toISOString(),
      }
      setHistory(prev => {
        const updated = [...prev, session]
        saveHistory(updated)
        return updated
      })
    }

    onCycleEnd?.(currentMode)

    setCurrentRound(prev => {
      const nextRound = currentMode === MODES.FOCUS ? prev + 1 : prev
      const isFocus = currentMode === MODES.FOCUS
      let nextMode

      if (isFocus) {
        nextMode = nextRound > currentSettings.rounds
          ? MODES.LONG_BREAK
          : MODES.SHORT_BREAK
      } else {
        nextMode = MODES.FOCUS
      }

      const finalRound = nextRound > currentSettings.rounds ? 1 : nextRound
      setMode(nextMode)
      setSecondsLeft(getDuration(nextMode, currentSettings))
      return finalRound
    })

    setIsRunning(false)
  }, [getDuration, onCycleEnd])

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          completeSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning, completeSession])

  const switchMode = useCallback((newMode) => {
    clearInterval(intervalRef.current)
    setMode(newMode)
    setIsRunning(false)
    setSecondsLeft(getDuration(newMode, settings))
  }, [getDuration, settings])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setSecondsLeft(getDuration(mode, settings))
  }, [getDuration, mode, settings])

  const skip = useCallback(() => {
    clearInterval(intervalRef.current)
    completeSession()
  }, [completeSession])

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings)
    saveSettings(newSettings)
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setSecondsLeft(getDuration(mode, newSettings))
  }, [getDuration, mode])

  const totalSeconds = getDuration(mode, settings)
  const progress = 1 - secondsLeft / totalSeconds

  return {
    mode,
    secondsLeft,
    isRunning,
    currentRound,
    history,
    settings,
    progress,
    totalSeconds,
    setIsRunning,
    switchMode,
    reset,
    skip,
    updateSettings,
  }
}
