import { Link } from 'react-router-dom'
import styles from './Landing.module.css'

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'The Pomodoro Technique',
    desc: 'Work in focused 25-minute sprints, then rest. Repeat. Decades of research back this rhythm for sustained deep work.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Yours to configure',
    desc: 'Adjust focus and break durations to match how you actually work. Four rounds before a long break — or two. You decide.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M3 3v18h18" /><path d="M18 9l-5 5-3-3-5 5" />
      </svg>
    ),
    title: 'Daily history',
    desc: 'Every completed session is logged with its time. See your focus total at a glance — resets fresh each morning.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: 'Audible cues',
    desc: 'A gentle bell tone marks the end of every session. No need to watch the screen — just work, and listen.',
  },
]

export default function Landing() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Pomo
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.headline}>
            <span className={styles.word1}>Work in rhythm.</span><br />
            <em className={styles.word2}>Rest on purpose.</em>
          </h1>
          <p className={styles.sub}>
            Pomo is a minimal Pomodoro timer that keeps you in a productive cadence — focused sprints, scheduled breaks, and a clear picture of what you accomplished today.
          </p>
          <Link to="/timer" className={styles.cta}>
            Start focusing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <p className={styles.hint}>No account. No install. Just open and work.</p>
        </section>

        <div className={styles.ringPreview} aria-hidden="true">
          <RingIllustration />
        </div>

        <section className={styles.features}>
          {features.map((f) => (
            <div key={f.title} className={styles.feature}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <div className={styles.bottomCta}>
          <Link to="/timer" className={styles.cta}>
            Open the timer
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>Built with the Pomodoro Technique by Francesco Cirillo</span>
      </footer>
    </div>
  )
}

function RingIllustration() {
  const size = 200
  const stroke = 7
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * 0.38

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--purple-50)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="var(--purple-600)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ animation: 'ringPulse 3s ease-in-out infinite' }}
      />
      <text x={size / 2} y={size / 2 - 12} textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontFamily="var(--font-body)" letterSpacing="1.5" textTransform="uppercase">FOCUS</text>
      <text x={size / 2} y={size / 2 + 20} textAnchor="middle" fontSize="38" fill="var(--text-primary)" fontFamily="var(--font-mono)" fontWeight="400" letterSpacing="-1">18:32</text>
      <style>{`
        @keyframes ringPulse {
          0%, 100% { stroke-dashoffset: ${offset}; }
          50% { stroke-dashoffset: ${offset + 40}; }
        }
      `}</style>
    </svg>
  )
}
