export default function GameOver({ score, onRestart }) {
  return (
    <div className="panel" style={{ textAlign: 'center', padding: '40px 24px', borderColor: 'var(--red)' }}>
      <p className="tag tag-red" style={{ marginBottom: 14 }}>System lockout</p>
      <h2 className="glitch-title" style={{ fontSize: '28px' }}>Your cover is blown</h2>
      <p className="subtitle" style={{ maxWidth: 460, margin: '10px auto 0' }}>
        Too many intrusion alerts triggered — the network locked you out. Final score: <strong style={{ color: 'var(--cyan)' }}>{score}</strong>.
      </p>
      <button className="btn btn-magenta" style={{ marginTop: 24 }} onClick={onRestart}>
        Restart the mission
      </button>
    </div>
  )
}
