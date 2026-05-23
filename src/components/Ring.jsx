import styles from './Ring.module.css'

const SIZE = 240
const STROKE = 8
const R = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

export default function Ring({ progress, secondsLeft, mode, currentRound, totalRounds }) {
  const offset = CIRCUMFERENCE * (1 - progress)

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const secs = (secondsLeft % 60).toString().padStart(2, '0')

  const modeLabel = mode === 'focus'
    ? 'Focus'
    : mode === 'short_break'
    ? 'Short break'
    : 'Long break'

  const trackColor = mode === 'focus' ? 'var(--purple-50)' : 'var(--teal-50)'
  const fillColor = mode === 'focus' ? 'var(--purple-600)' : 'var(--teal-400)'

  return (
    <div className={styles.wrap}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`${modeLabel} timer: ${mins}:${secs}`}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={trackColor}
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={fillColor}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          className={styles.progressArc}
        />
        <text
          x={SIZE / 2}
          y={SIZE / 2 - 26}
          textAnchor="middle"
          className={styles.modeText}
          fill="var(--text-muted)"
        >
          {modeLabel}
        </text>
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 22}
          textAnchor="middle"
          className={styles.timeText}
          fill="var(--text-primary)"
        >
          {mins}:{secs}
        </text>
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 46}
          textAnchor="middle"
          className={styles.roundText}
          fill="var(--text-muted)"
        >
          round {currentRound} of {totalRounds}
        </text>
      </svg>
    </div>
  )
}
