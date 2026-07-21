function gradeFor(score, maxScore) {
  const pct = score / maxScore
  if (pct >= 0.85) return { label: 'Ghost-Tier Operative', tag: 'tag-green', icon: '🏆' }
  if (pct >= 0.65) return { label: 'Elite Infiltrator', tag: 'tag-cyan', icon: '🛡' }
  if (pct >= 0.4) return { label: 'Field Agent', tag: 'tag-amber', icon: '⚠️' }
  return { label: 'Rookie Operative', tag: 'tag-red', icon: '🔴' }
}

export default function MissionComplete({ score, maxScore, onReplay }) {
  const grade = gradeFor(score, maxScore)

  return (
    <div className="panel" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <p className="tag tag-green" style={{ marginBottom: 14 }}>Mission success</p>
      <h2 className="glitch-title" style={{ fontSize: '28px' }}>The grid is breached</h2>
      <p className="subtitle" style={{ maxWidth: 460, margin: '10px auto 0' }}>
        Final score: <strong style={{ color: 'var(--cyan)' }}>{score}</strong> / {maxScore}
      </p>
      <p className={`tag ${grade.tag}`} style={{ marginTop: 16, fontSize: 14, padding: '8px 16px' }}>
        {grade.icon} {grade.label}
      </p>
      <button className="btn btn-magenta" style={{ marginTop: 24 }} onClick={onReplay}>
        Run mission again
      </button>
    </div>
  )
}
