import { useEffect, useRef, useState } from 'react'
import GlitchTitle from './GlitchTitle.jsx'

function useAnimatedNumber(target) {
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)

  useEffect(() => {
    const from = fromRef.current
    const to = target
    if (from === to) return
    const duration = 500
    const start = performance.now()

    function frame(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // expo-ish ease-out
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) requestAnimationFrame(frame)
      else fromRef.current = to
    }
    requestAnimationFrame(frame)
  }, [target])

  return display
}

export default function HUD({ score, cleared, total, lives, maxLives, onHome, showHome }) {
  const animatedScore = useAnimatedNumber(score)

  return (
    <div className="hud">
      <div>
        <GlitchTitle text="NetPhantom" size={22} />
        <p className="subtitle" style={{ marginTop: 2 }}>Breach the Grid</p>
      </div>
      <div className="grid-row" style={{ alignItems: 'center' }}>
        {showHome && (
          <button className="btn btn-ghost" onClick={onHome}>Mission map</button>
        )}
        <div className="hud-stat">
          <div className="label">Lives</div>
          <div className="value" style={{ color: 'var(--red)', letterSpacing: 2 }}>
            {Array.from({ length: maxLives }, (_, i) => (i < lives ? '●' : '○')).join(' ')}
          </div>
        </div>
        <div className="hud-stat">
          <div className="label">Score</div>
          <div className="value">{animatedScore}</div>
        </div>
        <div className="hud-stat">
          <div className="label">Layers cleared</div>
          <div className="value">{cleared}/{total}</div>
        </div>
      </div>
    </div>
  )
}
