/*
  DSA CONCEPT: MIN-HEAP / PRIORITY QUEUE
  Unlike Level 2's plain queue (strict arrival order), a min-heap
  always extracts the element with the SMALLEST priority value first,
  regardless of when it arrived. Extracting the root breaks the heap
  property, so the last element is moved to the root and "sifted
  down" — swapped with its smaller child, repeatedly, until the
  property is restored. The player performs that sift-down themselves.
*/
import { useState } from 'react'

// A valid min-heap array (parent <= both children) of evacuating agents.
// Lower priority number = evacuate sooner.
const INITIAL_HEAP = [
  { label: 'Agent Vale', priority: 1 },
  { label: 'Agent Kade', priority: 3 },
  { label: 'Agent Ito', priority: 5 },
  { label: 'Agent Roux', priority: 12 },
  { label: 'Agent Sana', priority: 9 },
  { label: 'Agent Bello', priority: 7 },
  { label: 'Agent Zeph', priority: 10 }
]

export default function ExtractionProtocol({ onComplete, onMistake }) {
  const [heap, setHeap] = useState(INITIAL_HEAP)
  const [extracted, setExtracted] = useState([])
  const [phase, setPhase] = useState('idle') // idle | siftdown
  const [cursor, setCursor] = useState(0)
  const [log, setLog] = useState([])

  const done = heap.length === 0 && phase === 'idle'

  function extractMin() {
    if (heap.length === 0) return
    const removed = heap[0]
    const last = heap[heap.length - 1]
    const rest = heap.slice(0, -1)
    setExtracted((e) => [...e, removed])
    setLog((l) => [...l, { text: `extract-min() -> ${removed.label} (priority ${removed.priority})`, ok: true }])

    if (rest.length === 0) {
      setHeap([])
      return
    }
    const newHeap = [...rest]
    newHeap[0] = last
    setHeap(newHeap)
    setCursor(0)
    setPhase(newHeap.length > 1 ? 'siftdown' : 'idle')
  }

  function childIndices(i) {
    return [2 * i + 1, 2 * i + 2].filter((idx) => idx < heap.length)
  }

  function correctAction() {
    const kids = childIndices(cursor)
    if (kids.length === 0) return { type: 'stop' }
    const smallerKid = kids.reduce((a, b) => (heap[a].priority <= heap[b].priority ? a : b))
    if (heap[cursor].priority <= heap[smallerKid].priority) return { type: 'stop' }
    return { type: 'swap', index: smallerKid }
  }

  function chooseSwap(childIdx) {
    const correct = correctAction()
    if (correct.type !== 'swap' || correct.index !== childIdx) {
      setLog((l) => [...l, { text: 'Wrong move — heap property not violated there.', ok: false }])
      onMistake && onMistake()
      return
    }
    const newHeap = [...heap]
    ;[newHeap[cursor], newHeap[childIdx]] = [newHeap[childIdx], newHeap[cursor]]
    setHeap(newHeap)
    setLog((l) => [...l, { text: `swap index ${cursor} with index ${childIdx} (sift-down continues)`, ok: true }])
    setCursor(childIdx)
  }

  function chooseStop() {
    const correct = correctAction()
    if (correct.type !== 'stop') {
      setLog((l) => [...l, { text: 'Not balanced yet — a child is still smaller than its parent.', ok: false }])
      onMistake && onMistake()
      return
    }
    setLog((l) => [...l, { text: 'Heap property restored.', ok: true }])
    setPhase('idle')
  }

  const kids = phase === 'siftdown' ? childIndices(cursor) : []

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 9 · Min-heap / priority queue (bonus)</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Extraction Protocol</h2>
      <p className="mission-brief">
        Agents must evacuate in priority order — lowest number first — regardless of when
        they called in. Extract the minimum, then sift the replacement down until the heap
        property holds again.
      </p>

      <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Current heap (array form, index 0 = root):</p>
      <div className="grid-row" style={{ marginBottom: 16 }}>
        {heap.map((n, i) => (
          <div key={n.label} className="tag" style={{
            borderColor: i === cursor && phase === 'siftdown' ? 'var(--magenta)' : 'var(--border)',
            color: i === cursor && phase === 'siftdown' ? 'var(--magenta)' : 'var(--text)'
          }}>
            [{i}] {n.label} ({n.priority})
          </div>
        ))}
        {heap.length === 0 && <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>heap empty</span>}
      </div>

      {phase === 'idle' && heap.length > 0 && (
        <button className="btn" onClick={extractMin}>Extract minimum (root)</button>
      )}

      {phase === 'siftdown' && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Restoring heap property at index {cursor} ({heap[cursor].label}, priority {heap[cursor].priority}):
          </p>
          <div className="grid-row">
            {kids.map((k) => (
              <button key={k} className="btn btn-ghost" onClick={() => chooseSwap(k)}>
                Swap with index {k} ({heap[k].label}, {heap[k].priority})
              </button>
            ))}
            <button className="btn btn-ghost" onClick={chooseStop}>Already balanced — stop</button>
          </div>
        </>
      )}

      <div style={{ marginTop: 16 }}>
        {log.slice(-6).map((l, i) => <p key={i} className={`console-line ${l.ok ? 'ok' : 'bad'}`}>{l.text}</p>)}
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 12 }}>Extraction order so far:</p>
      <div className="grid-row">
        {extracted.map((e, i) => <div key={i} className="tag tag-green">{i + 1}. {e.label} ({e.priority})</div>)}
      </div>

      {done && (
        <div style={{ marginTop: 12 }}>
          <p className="console-line ok">All agents extracted in strict priority order — a plain queue could never have guaranteed that.</p>
          <button className="btn btn-magenta" onClick={onComplete}>Proceed to the final layer →</button>
        </div>
      )}
    </div>
  )
}
