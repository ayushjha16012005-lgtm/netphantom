/*
  DSA CONCEPT: BINARY SEARCH TREE
  Left subtree < node < right subtree. The player performs the actual
  search: at each node, compare the target to the current ID and pick
  the correct branch. Every wrong pick is caught immediately, exactly
  like a real BST search would never explore a subtree it can prove
  doesn't contain the key.
*/
import { useState } from 'react'

const TREE = {
  id: 5023, name: 'Trojan.GenericKD',
  left: {
    id: 2011, name: 'Worm.Conficker',
    left: null,
    right: { id: 3399, name: 'Spyware.KeyloggerX', left: null, right: null }
  },
  right: {
    id: 7890, name: 'Ransomware.LockBit-lite',
    left: { id: 6600, name: 'Rootkit.ZeroAccess', left: null, right: null },
    right: null
  }
}

const TARGET = 3399

export default function ThreatArchive({ onComplete, onMistake }) {
  const [node, setNode] = useState(TREE)
  const [log, setLog] = useState([])
  const [comparisons, setComparisons] = useState(0)
  const found = node.id === TARGET

  function go(direction) {
    const correctDirection = TARGET < node.id ? 'left' : 'right'
    setComparisons((c) => c + 1)
    if (direction !== correctDirection && node.id !== TARGET) {
      setLog((l) => [...l, { text: `${TARGET} vs ${node.id} (${node.name}) — wrong branch, try ${correctDirection}`, ok: false }])
      onMistake && onMistake()
      return
    }
    const child = node[direction]
    if (!child) {
      setLog((l) => [...l, { text: `${TARGET} vs ${node.id} — that subtree is empty, dead end`, ok: false }])
      onMistake && onMistake()
      return
    }
    setLog((l) => [...l, { text: `${TARGET} vs ${node.id} (${node.name}) — go ${direction}`, ok: true }])
    setNode(child)
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 4 · Binary search tree</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Threat Archive</h2>
      <p className="mission-brief">
        Find signature ID <strong>{TARGET}</strong> in the sorted threat database. At each
        record, compare the target ID to the current one and choose the correct branch —
        left for smaller, right for larger.
      </p>

      <div className="panel-raised" style={{ padding: 16, marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Current record</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: found ? 'var(--green)' : 'var(--cyan)' }}>
          [{node.id}] {node.name}
        </p>
      </div>

      {!found && (
        <div className="grid-row">
          <button className="btn btn-ghost" onClick={() => go('left')}>Go left ({TARGET} &lt; {node.id}?)</button>
          <button className="btn btn-ghost" onClick={() => go('right')}>Go right ({TARGET} &gt; {node.id}?)</button>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {log.map((l, i) => <p key={i} className={`console-line ${l.ok ? 'ok' : 'bad'}`}>{l.text}</p>)}
      </div>

      {found && (
        <div style={{ marginTop: 10 }}>
          <p className="console-line ok">Signature {TARGET} found in {comparisons} comparisons — nowhere near scanning every record.</p>
          <button className="btn btn-magenta" onClick={onComplete}>Proceed to the network grid →</button>
        </div>
      )}
    </div>
  )
}
