import styles from './History.module.css'

function formatTime(isoString) {
  const d = new Date(isoString)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (s === 0) return `${m}:00`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function History({ sessions }) {
  const totalMins = Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.heading}>Today's sessions</span>
        {sessions.length > 0 && (
          <span className={styles.summary}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} · {totalMins} min
          </span>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <span>No sessions yet — start focusing!</span>
        </div>
      ) : (
        <ul className={styles.list} role="list" aria-label="Completed focus sessions">
          {sessions.map((s, i) => (
            <li key={s.id} className={styles.item}>
              <span className={styles.check} aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span className={styles.label}>
                Focus · {formatDuration(s.duration)}
              </span>
              <span className={styles.time}>{formatTime(s.completedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
