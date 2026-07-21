import { useEffect, useState } from 'react'

export default function GlitchTitle({ text, size = 40 }) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    let timeout
    function scheduleGlitch() {
      const delay = 2200 + Math.random() * 2800
      timeout = setTimeout(() => {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 220)
        scheduleGlitch()
      }, delay)
    }
    scheduleGlitch()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <span className={`glitch-title ${glitching ? 'glitching' : ''}`} data-text={text} style={{ fontSize: size }}>
      {text}
    </span>
  )
}
