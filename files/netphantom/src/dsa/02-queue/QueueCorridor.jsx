/*
  DSA CONCEPT: QUEUE (FIFO)
  Packets arrived in this exact order and MUST be inspected in that
  same order — real firewalls can't reorder traffic. The player can
  only ever act on the FRONT of the queue: dequeue() then classify.
  This enforces First-In-First-Out at the UI level, not just in text.
*/
import { useState } from 'react'

const INITIAL = [
  { id: 1, source: '10.0.0.5', payload: 'GET /login', malicious: false },
  { id: 2, source: '192.168.1.9', payload: 'DROP TABLE users;--', malicious: true },
  { id: 3, source: '10.0.0.7', payload: 'GET /dashboard', malicious: false },
  { id: 4, source: '66.66.66.66', payload: 'malware_payload.exe', malicious: true },
  { id: 5, source: '10.0.0.5', payload: 'POST /logout', malicious: false }
]

export default function QueueCorridor({ onComplete, onMistake }) {
  const [queue, setQueue] = useState(INITIAL)
  const [log, setLog] = useState([])
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)

  const front = queue[0]
  const done = queue.length === 0

  function classify(choiceIsBlock) {
    if (!front) return
    const wasRight = choiceIsBlock === front.malicious
    if (wasRight) setCorrect((c) => c + 1)
    else { setWrong((w) => w + 1); onMistake && onMistake() }

    setLog((l) => [
      ...l,
      {
        text: `dequeue "${front.payload}" from ${front.source} — you chose ${choiceIsBlock ? 'BLOCK' : 'ALLOW'}`,
        ok: wasRight
      }
    ])
    setQueue((q) => q.slice(1))
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 2 · Queue</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Firewall Corridor</h2>
      <p className="mission-brief">
        Packets are queued in arrival order. You can only inspect the packet at the FRONT
        of the queue — a queue is First-In-First-Out, so you can't skip ahead to a newer one.
        Decide: allow or block?
      </p>

      <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Queue (front on the left):</p>
      <div className="grid-row" style={{ marginBottom: 16 }}>
        {queue.map((p, i) => (
          <div key={p.id} className="panel-raised" style={{
            padding: '8px 12px',
            borderColor: i === 0 ? 'var(--cyan)' : 'var(--border)',
            opacity: i === 0 ? 1 : 0.55,
            fontSize: 12
          }}>
            <div style={{ color: 'var(--text-dim)' }}>{p.source}</div>
            <div>{p.payload}</div>
          </div>
        ))}
        {done && <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>queue empty</span>}
      </div>

      {!done && (
        <div className="grid-row">
          <button className="btn" onClick={() => classify(false)}>Allow (dequeue front)</button>
          <button className="btn btn-magenta" onClick={() => classify(true)}>Block (dequeue front)</button>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {log.map((l, i) => (
          <p key={i} className={`console-line ${l.ok ? 'ok' : 'bad'}`}>{l.text}</p>
        ))}
      </div>

      {done && (
        <div style={{ marginTop: 10 }}>
          <p className="console-line ok">Corridor cleared. Correct calls: {correct} / {INITIAL.length} ({wrong} missed).</p>
          <button className="btn btn-magenta" onClick={onComplete}>Advance to the server maze →</button>
        </div>
      )}
    </div>
  )
}
