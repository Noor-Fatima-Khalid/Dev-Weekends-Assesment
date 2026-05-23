import { useState, useEffect, useRef } from 'react'
import styles from './Settings.module.css'

export default function Settings({ settings, onSave, onClose }) {
  const [vals, setVals] = useState(settings)
  const dialogRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = (key, value) => {
    const num = Math.max(1, Math.min(99, Number(value)))
    setVals(prev => ({ ...prev, [key]: num }))
  }

  const handleSave = () => {
    onSave(vals)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Timer settings">
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.fields}>
          <Field label="Focus duration" unit="min" value={vals.focusMins} onChange={v => set('focusMins', v)} />
          <Field label="Short break" unit="min" value={vals.shortBreakMins} onChange={v => set('shortBreakMins', v)} />
          <Field label="Long break" unit="min" value={vals.longBreakMins} onChange={v => set('longBreakMins', v)} />
          <Field label="Rounds before long break" unit="" value={vals.rounds} onChange={v => set('rounds', v)} min={1} max={12} />
        </div>

        <button className={styles.save} onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  )
}

function Field({ label, unit, value, onChange, min = 1, max = 99 }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputRow}>
        <button className={styles.stepper} onClick={() => onChange(value - 1)} aria-label={`Decrease ${label}`}>−</button>
        <input
          className={styles.input}
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={e => onChange(e.target.value)}
          aria-label={label}
        />
        <button className={styles.stepper} onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}>+</button>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
    </div>
  )
}
