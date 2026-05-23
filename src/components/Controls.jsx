import styles from './Controls.module.css'

export default function Controls({ isRunning, onPlayPause, onReset, onSkip, mode }) {
  const accentColor = mode === 'focus' ? 'var(--purple-800)' : 'var(--teal-600)'
  const accentBg = mode === 'focus' ? 'var(--purple-50)' : 'var(--teal-50)'

  return (
    <div className={styles.controls}>
      <button
        className={styles.secondary}
        onClick={onReset}
        aria-label="Reset timer"
        title="Reset"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>

      <button
        className={styles.primary}
        onClick={onPlayPause}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        style={{ background: accentColor }}
      >
        {isRunning ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="6,3 21,12 6,21"/>
          </svg>
        )}
      </button>

      <button
        className={styles.secondary}
        onClick={onSkip}
        aria-label="Skip to next session"
        title="Skip"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="5,4 15,12 5,20"/>
          <line x1="19" y1="5" x2="19" y2="19"/>
        </svg>
      </button>
    </div>
  )
}
