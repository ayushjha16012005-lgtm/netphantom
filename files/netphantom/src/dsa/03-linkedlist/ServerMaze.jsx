/*
  DSA CONCEPT: SINGLY LINKED LIST
  Each server only "knows" the next one — there's no random access,
  you must move node.next -> node.next -> ... to advance. Insertion
  and deletion are shown as pure pointer relinking: no shifting an
  array, just splicing a node in or out of the chain.
*/
import { useState } from 'react'

function buildInitial() {
  return [
    { id: 'a', name: 'Edge-Relay', compromised: false },
    { id: 'b', name: 'Auth-Relay', compromised: false },
    { id: 'c', name: 'Compromised-Relay', compromised: true },
    { id: 'd', name: 'Core-Relay', compromised: false },
    { id: 'e', name: 'Mainframe', compromised: false }
  ]
}

export default function ServerMaze({ onComplete }) {
  const [chain, setChain] = useState(buildInitial())
  const [cursor, setCursor] = useState(0)
  const [patched, setPatched] = useState(false)
  const [log, setLog] = useState([])

  const current = chain[cursor]
  const atMainframe = current?.name === 'Mainframe'

  function deleteCompromised() {
    const idx = chain.findIndex((n) => n.compromised)
    if (idx === -1) return
    const next = chain.filter((n) => !n.compromised)
    setChain(next)
    setLog((l) => [...l, { text: `deleted "${chain[idx].name}" — relinked chain around it`, ok: true }])
    setPatched(true)
  }

  function insertBypass() {
    const idx = chain.findIndex((n) => n.name === 'Auth-Relay')
    if (idx === -1) return
    const next = [...chain]
    next.splice(idx + 1, 0, { id: 'x', name: 'Bypass-Relay', compromised: false })
    setChain(next)
    setLog((l) => [...l, { text: 'inserted "Bypass-Relay" right after Auth-Relay', ok: true }])
  }

  function step() {
    if (cursor < chain.length - 1) {
      setCursor((c) => c + 1)
      setLog((l) => [...l, { text: `current.next -> "${chain[cursor + 1].name}"`, ok: true }])
    }
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 3 · Linked list</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Server Maze</h2>
      <p className="mission-brief">
        This network is a chain of relay servers — each node only points to the next one.
        Patch out the compromised relay, then traverse node by node until you reach the
        Mainframe.
      </p>

      <div className="grid-row" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        {chain.map((n, i) => (
          <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="panel-raised" style={{
              padding: '8px 12px',
              fontSize: 12,
              borderColor: i === cursor ? 'var(--cyan)' : n.compromised ? 'var(--red)' : 'var(--border)',
              color: n.compromised ? 'var(--red)' : 'var(--text)'
            }}>
              {n.name}
            </div>
            {i < chain.length - 1 && <span style={{ color: 'var(--text-dim)' }}>→</span>}
          </div>
        ))}
      </div>

      {!patched && (
        <p className="console-line bad" style={{ marginBottom: 10 }}>
          A compromised relay sits in the chain — it must be removed before you traverse further.
        </p>
      )}

      <div className="grid-row">
        {!patched && <button className="btn btn-magenta" onClick={deleteCompromised}>Delete compromised node</button>}
        {patched && <button className="btn btn-ghost" onClick={insertBypass}>Insert bypass node (optional)</button>}
        <button className="btn" onClick={step} disabled={!patched || atMainframe}>
          current = current.next
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {log.map((l, i) => <p key={i} className="console-line ok">{l.text}</p>)}
      </div>

      {atMainframe && (
        <div style={{ marginTop: 10 }}>
          <p className="console-line ok">Mainframe relay reached — maze solved.</p>
          <button className="btn btn-magenta" onClick={onComplete}>Continue to the threat archive →</button>
        </div>
      )}
    </div>
  )
}
