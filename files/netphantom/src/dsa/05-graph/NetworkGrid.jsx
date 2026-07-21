/*
  DSA CONCEPT: GRAPH + BREADTH-FIRST SEARCH
  The network is a graph: nodes can connect to more than one other
  node (unlike a linked list's single "next"). The player explores it
  by hand, and at the end we compute the true BFS shortest path so
  they can compare their route to the optimal one.
*/
import { useState } from 'react'

const GRAPH = {
  Entry: ['A', 'B'],
  A: ['Entry', 'Core'],
  B: ['Entry', 'Honeypot', 'C'],
  C: ['B', 'Core'],
  Core: ['A', 'C', 'Target'],
  Honeypot: ['B', 'Target'],
  Target: ['Core', 'Honeypot']
}

function bfsShortest(start, target, avoid) {
  const queue = [[start]]
  const visited = new Set([start])
  while (queue.length) {
    const path = queue.shift()
    const last = path[path.length - 1]
    if (last === target) return path
    for (const n of GRAPH[last]) {
      if (n === avoid || visited.has(n)) continue
      visited.add(n)
      queue.push([...path, n])
    }
  }
  return null
}

export default function NetworkGrid({ onComplete, onMistake }) {
  const [path, setPath] = useState(['Entry'])
  const [alerts, setAlerts] = useState(0)
  const current = path[path.length - 1]
  const reached = current === 'Target'

  function move(node) {
    if (node === 'Honeypot') {
      setAlerts((a) => a + 1)
      setPath(['Entry'])
      onMistake && onMistake()
      return
    }
    setPath((p) => [...p, node])
  }

  const optimal = bfsShortest('Entry', 'Target', 'Honeypot')

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 5 · Graph + BFS</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Network Grid</h2>
      <p className="mission-brief">
        This isn't a straight line — it's a graph, every node can connect to several others.
        Click through the network to reach <strong>Target</strong>. One node is a honeypot —
        step into it and the trail resets.
      </p>

      <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Your path so far:</p>
      <div className="grid-row" style={{ marginBottom: 16 }}>
        {path.map((n, i) => (
          <div key={i} className="tag tag-cyan">{n}</div>
        ))}
      </div>

      {!reached && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>From <strong>{current}</strong>, move to:</p>
          <div className="grid-row">
            {GRAPH[current].map((n) => (
              <button
                key={n}
                className={n === 'Honeypot' ? 'btn btn-magenta' : 'btn btn-ghost'}
                onClick={() => move(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}

      {alerts > 0 && !reached && (
        <p className="console-line bad" style={{ marginTop: 12 }}>
          Honeypot triggered {alerts} time{alerts > 1 ? 's' : ''} — trail reset to Entry.
        </p>
      )}

      {reached && (
        <div style={{ marginTop: 14 }}>
          <p className="console-line ok">Target reached in {path.length - 1} hops.</p>
          <p className="console-line dim">BFS says the true shortest safe path is {optimal.length - 1} hops: {optimal.join(' → ')}</p>
          <button className="btn btn-magenta" style={{ marginTop: 8 }} onClick={onComplete}>
            Proceed to the credential vault →
          </button>
        </div>
      )}
    </div>
  )
}
