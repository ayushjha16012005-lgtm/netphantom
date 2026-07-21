export default function ScorePopups({ popups }) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {popups.map((p) => (
        <div
          key={p.id}
          className={`score-popup ${p.negative ? 'negative' : ''}`}
          style={{ left: p.x, top: p.y }}
        >
          {p.negative ? '' : '+'}{p.text}
        </div>
      ))}
    </div>
  )
}
