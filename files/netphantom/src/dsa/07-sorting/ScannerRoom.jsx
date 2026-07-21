/*
  DSA CONCEPT: SORTING (selection-by-severity, same idea QuickSort's
  partition step relies on: repeatedly pick the correct next element)
  followed by BINARY SEARCH, which only works because the data is now
  sorted — the player narrows a search range in half each guess,
  exactly like the mid-point comparisons in a real binary search.
*/
import { useState } from 'react'

const VULNS = [
  { name: 'Outdated TLS cert', severity: 41 },
  { name: 'SQL injection endpoint', severity: 92 },
  { name: 'Default admin password', severity: 78 },
  { name: 'Unpatched kernel exploit', severity: 97 },
  { name: 'Open debug port', severity: 55 },
  { name: 'Weak session tokens', severity: 63 },
  { name: 'Exposed .env file', severity: 88 }
]

const TARGET = 88

export default function ScannerRoom({ onComplete, onMistake }) {
  const [remaining, setRemaining] = useState(VULNS)
  const [sorted, setSorted] = useState([])
  const [error, setError] = useState(null)
  const [stage, setStage] = useState('sort') // sort -> search -> done
  const [lo, setLo] = useState(0)
  const [hi, setHi] = useState(VULNS.length - 1)
  const [guesses, setGuesses] = useState([])
  const [foundIdx, setFoundIdx] = useState(null)

  function pick(v) {
    const maxRemaining = Math.max(...remaining.map((r) => r.severity))
    if (v.severity !== maxRemaining) {
      setError(`${v.name} (${v.severity}) isn't the highest remaining severity — try again.`)
      onMistake && onMistake()
      return
    }
    setError(null)
    setSorted((s) => [...s, v])
    const next = remaining.filter((r) => r !== v)
    setRemaining(next)
    if (next.length === 0) setStage('search')
  }

  function guessMid() {
    const mid = Math.floor((lo + hi) / 2)
    const val = sorted[mid].severity
    if (val === TARGET) {
      setGuesses((g) => [...g, { mid, val, result: 'match' }])
      setFoundIdx(mid)
      setStage('done')
    } else if (val < TARGET) {
      setGuesses((g) => [...g, { mid, val, result: 'go lower index (higher severity)' }])
      setHi(mid - 1)
    } else {
      setGuesses((g) => [...g, { mid, val, result: 'go higher index (lower severity)' }])
      setLo(mid + 1)
    }
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 7 · Sorting + binary search</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Scanner Room</h2>

      {stage === 'sort' && (
        <>
          <p className="mission-brief">
            Triage these vulnerabilities from most to least severe. Click the one with the
            highest remaining severity each time.
          </p>
          <div className="grid-row" style={{ marginBottom: 12 }}>
            {remaining.map((v) => (
              <button key={v.name} className="btn btn-ghost" onClick={() => pick(v)}>
                {v.name} — {v.severity}
              </button>
            ))}
          </div>
          {error && <p className="console-line bad">{error}</p>}
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Sorted so far:</p>
          <div className="grid-row">
            {sorted.map((v) => <div key={v.name} className="tag tag-green">{v.severity}</div>)}
          </div>
        </>
      )}

      {stage !== 'sort' && (
        <>
          <p className="mission-brief">
            Sorted descending: [{sorted.map((v) => v.severity).join(', ')}]. Now find severity
            <strong> {TARGET}</strong> with binary search — each guess should cut the remaining
            range in half.
          </p>
          <div className="grid-row" style={{ marginBottom: 12 }}>
            {sorted.map((v, i) => (
              <div key={v.name} className="tag" style={{
                borderColor: foundIdx === i ? 'var(--green)' : (i >= lo && i <= hi) ? 'var(--cyan)' : 'var(--border)',
                color: foundIdx === i ? 'var(--green)' : (i >= lo && i <= hi) ? 'var(--cyan)' : 'var(--text-dim)'
              }}>
                {v.severity}
              </div>
            ))}
          </div>
          {stage === 'search' && <button className="btn" onClick={guessMid}>Check midpoint of remaining range</button>}
          <div style={{ marginTop: 12 }}>
            {guesses.map((g, i) => (
              <p key={i} className={`console-line ${g.result === 'match' ? 'ok' : 'dim'}`}>
                checked index {g.mid} (severity {g.val}) — {g.result === 'match' ? 'MATCH' : g.result}
              </p>
            ))}
          </div>
        </>
      )}

      {stage === 'done' && (
        <div style={{ marginTop: 10 }}>
          <p className="console-line ok">Found severity {TARGET} in {guesses.length} comparisons.</p>
          <button className="btn btn-magenta" onClick={onComplete}>Proceed to the mainframe core →</button>
        </div>
      )}
    </div>
  )
}
