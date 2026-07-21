/*
  DSA CONCEPT: HASH MAP (average O(1) lookup)
  This isn't a simulated number — the component builds a real 100,000
  entry vault in memory and times an actual Map.get() lookup against
  an actual linear array scan for the same key, using performance.now().
  A hash map computes a bucket index directly from the key, so lookup
  time stays roughly flat regardless of vault size; linear scan doesn't.
*/
import { useState } from 'react'

const VAULT_SIZE = 100000

export default function CredentialVault({ onComplete, onMistake }) {
  const [prediction, setPrediction] = useState(null)
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)

  function runRace() {
    setRunning(true)
    setTimeout(() => {
      const map = new Map()
      const list = []
      for (let i = 0; i < VAULT_SIZE; i++) {
        const hash = 'H' + i
        map.set(hash, 'agent_' + i)
        list.push([hash, 'agent_' + i])
      }
      const target = 'H' + (VAULT_SIZE - 1)

      const t0 = performance.now()
      let found = null
      let steps = 0
      for (const [k, v] of list) {
        steps++
        if (k === target) { found = v; break }
      }
      const t1 = performance.now()

      const t2 = performance.now()
      const hashFound = map.get(target)
      const t3 = performance.now()

      setResult({
        linearMs: (t1 - t0).toFixed(3),
        linearSteps: steps,
        hashMs: (t3 - t2).toFixed(3),
        found,
        hashFound
      })
      if (prediction !== 'hash') onMistake && onMistake()
      setRunning(false)
    }, 250)
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 6 · Hash map</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Credential Vault</h2>
      <p className="mission-brief">
        The vault holds {VAULT_SIZE.toLocaleString()} credential hashes. One tool scans them
        one by one. Yours uses a hash map, which jumps straight to the right bucket. Predict
        the winner, then run the real race — the timings are measured live in your browser.
      </p>

      {!result && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Your prediction:</p>
          <div className="grid-row" style={{ marginBottom: 14 }}>
            <button
              className={prediction === 'hash' ? 'btn' : 'btn btn-ghost'}
              onClick={() => setPrediction('hash')}
            >
              Hash map wins
            </button>
            <button
              className={prediction === 'linear' ? 'btn' : 'btn btn-ghost'}
              onClick={() => setPrediction('linear')}
            >
              Linear scan wins
            </button>
          </div>
          <button className="btn btn-magenta" onClick={runRace} disabled={!prediction || running}>
            {running ? 'Racing...' : 'Run the race'}
          </button>
        </>
      )}

      {result && (
        <div style={{ marginTop: 6 }}>
          <p className="console-line">Linear scan: found "{result.found}" after {result.linearSteps.toLocaleString()} comparisons in {result.linearMs} ms</p>
          <p className="console-line ok">Hash map: found "{result.hashFound}" in ~1 comparison in {result.hashMs} ms</p>
          <p className="console-line dim">
            {prediction === 'hash' ? 'Your prediction was correct.' : 'Hash map won — the linear scan had to check almost the whole vault.'}
          </p>
          <button className="btn btn-magenta" style={{ marginTop: 10 }} onClick={onComplete}>
            Proceed to the scanner room →
          </button>
        </div>
      )}
    </div>
  )
}
