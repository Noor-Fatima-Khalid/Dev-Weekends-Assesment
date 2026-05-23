import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTimer, MODES } from '../hooks/useTimer'
import { useSound } from '../hooks/useSound'
import Ring from '../components/Ring'
import Controls from '../components/Controls'
import Settings from '../components/Settings'
import History from '../components/History'
import styles from './Timer.module.css'

export default function Timer() {
  const { playBell } = useSound()
  const [showSettings, setShowSettings] = useState(false)
  const [flash, setFlash] = useState(false)

  const handleCycleEnd = useCallback((completedMode) => {
    playBell(completedMode === MODES.FOCUS ? 'focus' : 'break')
    setFlash(true)
    setTimeout(() => setFlash(false), 800)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        completedMode === MODES.FOCUS ? '🍅 Focus session done!' : '☕ Break over — back to work!',
        { body: completedMode === MODES.FOCUS ? 'Time for a well-earned break.' : 'Start your next focus session.' }
      )
    }
  }, [playBell])

  const timer = useTimer(handleCycleEnd)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const label = timer.mode === MODES.FOCUS ? 'Focus' : timer.mode === MODES.SHORT_BREAK ? 'Break' : 'Long break'
    const mins = Math.floor(timer.secondsLeft / 60).toString().padStart(2, '0')
    const secs = (timer.secondsLeft % 60).toString().padStart(2, '0')
    document.title = `${mins}:${secs} · ${label} — Pomo`
    return () => { document.title = 'Pomo' }
  }, [timer.secondsLeft, timer.mode])

  const isFocus = timer.mode === MODES.FOCUS

  const modeBg = isFocus
    ? 'linear-gradient(160deg, var(--purple-50) 0%, var(--bg) 45%)'
    : 'linear-gradient(160deg, var(--teal-50) 0%, var(--bg) 45%)'

  return (
    <div className={styles.page} style={{ background: modeBg }}>
      {flash && <div className={styles.flash} aria-hidden="true" />}

      <header className={styles.header}>
        <Link to="/" className={styles.logo} aria-label="Back to home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Pomo</span>
        </Link>
        <button
          className={styles.settingsBtn}
          onClick={() => setShowSettings(true)}
          aria-label="Open settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.modeTabs} role="tablist" aria-label="Timer mode">
          {[
            { key: MODES.FOCUS, label: 'Focus' },
            { key: MODES.SHORT_BREAK, label: 'Short break' },
            { key: MODES.LONG_BREAK, label: 'Long break' },
          ].map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={timer.mode === key}
              className={`${styles.tab} ${timer.mode === key ? styles.activeTab : ''}`}
              onClick={() => timer.switchMode(key)}
              data-mode={key}
            >
              {label}
            </button>
          ))}
        </div>

        <Ring
          progress={timer.progress}
          secondsLeft={timer.secondsLeft}
          mode={timer.mode}
          currentRound={timer.currentRound}
          totalRounds={timer.settings.rounds}
        />

        <Controls
          isRunning={timer.isRunning}
          onPlayPause={() => timer.setIsRunning(r => !r)}
          onReset={timer.reset}
          onSkip={timer.skip}
          mode={timer.mode}
        />

        <div className={styles.progressTrack} role="progressbar" aria-valuenow={Math.round(timer.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Session progress">
          <div
            className={styles.progressFill}
            style={{
              width: `${timer.progress * 100}%`,
              background: isFocus ? 'var(--purple-600)' : 'var(--teal-400)',
            }}
          />
        </div>

        <History sessions={timer.history} />
      </main>

      {showSettings && (
        <Settings
          settings={timer.settings}
          onSave={timer.updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
