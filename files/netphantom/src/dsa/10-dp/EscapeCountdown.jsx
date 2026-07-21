/*
  DSA CONCEPT: DYNAMIC PROGRAMMING (bottom-up, classic coin-change)
  To disarm the countdown at value N using the FEWEST charges from a
  fixed set of charge strengths, you can't just greedily grab the
  biggest charge — that can miss the true optimum. DP builds up the
  answer for every smaller countdown value first (dp[0], dp[1], ...)
  and reuses those already-solved subproblems: dp[amount] = 1 + the
  best dp[amount - charge] over every charge that fits. The player
  fills in that table themselves, one amount at a time.
*/
import { useState } from 'react'

const CHARGES = [1, 3, 4]
const TARGET = 6

function computeTrueDP(target, charges) {
  const dp = new Array(target + 1).fill(Infinity)
  dp[0] = 0
  for (let amt = 1; amt <= target; amt++) {
    for (const c of charges) {
      if (c <= amt && dp[amt - c] + 1 < dp[amt]) dp[amt] = dp[amt - c] + 1
    }
  }
  return dp
}

const TRUE_DP = computeTrueDP(TARGET, CHARGES)

export default function EscapeCountdown({ onComplete, onMistake }) {
  const [dp, setDp] = useState([0]) // dp[0] known: 0 charges needed for amount 0
  const [amount, setAmount] = useState(1)
  const [log, setLog] = useState([])
  const [usedCharge, setUsedCharge] = useState({}) // amount -> charge chosen

  const done = amount > TARGET

  function pickCharge(c) {
    if (c > amount) return
    const candidate = dp[amount - c] + 1
    const isOptimal = candidate === TRUE_DP[amount]
    if (!isOptimal) {
      setLog((l) => [...l, { text: `dp[${amount}] via charge ${c}: 1 + dp[${amount - c}] = ${candidate} — not the minimum, try another charge`, ok: false }])
      onMistake && onMistake()
      return
    }
    setLog((l) => [...l, { text: `dp[${amount}] = 1 + dp[${amount - c}] = ${candidate}  (using charge ${c})`, ok: true }])
    const newDp = [...dp, candidate]
    setDp(newDp)
    setUsedCharge((u) => ({ ...u, [amount]: c }))
    setAmount(amount + 1)
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 10 · Dynamic programming (bonus)</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Escape Countdown</h2>
      <p className="mission-brief">
        A countdown is set to <strong>{TARGET}</strong>. You have charges of strength {CHARGES.join(', ')}.
        Disarm it using the fewest charges possible. Build the table left to right — for each
        amount, dp[amount] = 1 + the best dp[amount − charge] over every charge that fits.
      </p>

      <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Table built so far:</p>
      <div className="grid-row" style={{ marginBottom: 16 }}>
        {dp.map((v, i) => (
          <div key={i} className="tag tag-green">dp[{i}]={v}{usedCharge[i] ? ` (charge ${usedCharge[i]})` : ''}</div>
        ))}
      </div>

      {!done && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Solving dp[{amount}] — pick the charge that gives the minimum result:
          </p>
          <div className="grid-row">
            {CHARGES.filter((c) => c <= amount).map((c) => (
              <button key={c} className="btn btn-ghost" onClick={() => pickCharge(c)}>
                Use charge {c}  (1 + dp[{amount - c}])
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 16, maxHeight: 160, overflowY: 'auto' }}>
        {log.map((l, i) => <p key={i} className={`console-line ${l.ok ? 'ok' : 'bad'}`}>{l.text}</p>)}
      </div>

      {done && (
        <div style={{ marginTop: 12 }}>
          <p className="console-line ok">
            Countdown disarmed with dp[{TARGET}] = {dp[TARGET]} charges — the true minimum, guaranteed by
            building every smaller subproblem first.
          </p>
          <p className="console-line ok" style={{ fontWeight: 700 }}>NETPHANTOM MISSION COMPLETE.</p>
          <button className="btn btn-magenta" onClick={onComplete}>Finish mission →</button>
        </div>
      )}
    </div>
  )
}
