/*
  DSA CONCEPT: RECURSION
  Part A decodes a Caesar cipher one character at a time — each click
  is one recursive call: decode this character, then hand off "the
  rest of the string" to the next call. The base case is reaching the
  end of the string.
  Part B is a fully playable Tower of Hanoi: move all 3 disks from peg
  A to peg C. The classic recursive solution is "move n-1 disks out of
  the way, move disk n, move the n-1 disks back onto it" — the base
  case is 0 disks to move. The player can solve it any legal way; we
  just enforce the rules and compare their move count to the minimum.
*/
import { useState } from 'react'

const CIPHER = 'QhwSkdqwrp-7' // Caesar shift 3 of "NetPhantom-7"
const SHIFT = 3

function decodeChar(c, shift) {
  if (/[A-Z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65)
  if (/[a-z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 97 - shift + 26) % 26) + 97)
  return c
}

const MIN_MOVES = 7 // 2^3 - 1

export default function MainframeCore({ onComplete, onMistake }) {
  const [index, setIndex] = useState(0)
  const [decoded, setDecoded] = useState('')
  const [phase, setPhase] = useState('cipher') // cipher -> hanoi -> done

  const [pegs, setPegs] = useState({ A: [3, 2, 1], B: [], C: [] })
  const [selected, setSelected] = useState(null)
  const [moves, setMoves] = useState(0)
  const [hanoiLog, setHanoiLog] = useState([])

  function decodeNext() {
    if (index >= CIPHER.length) return
    const c = decodeChar(CIPHER[index], SHIFT)
    setDecoded((d) => d + c)
    const nextIndex = index + 1
    setIndex(nextIndex)
    if (nextIndex >= CIPHER.length) setTimeout(() => setPhase('hanoi'), 400)
  }

  function clickPeg(pegName) {
    if (selected === null) {
      if (pegs[pegName].length === 0) return
      setSelected(pegName)
      return
    }
    if (selected === pegName) {
      setSelected(null)
      return
    }
    const fromStack = pegs[selected]
    const toStack = pegs[pegName]
    const disk = fromStack[fromStack.length - 1]
    const topOfTarget = toStack[toStack.length - 1]

    if (topOfTarget !== undefined && topOfTarget < disk) {
      setHanoiLog((l) => [...l, { text: `Illegal: disk ${disk} can't sit on smaller disk ${topOfTarget}`, ok: false }])
      setSelected(null)
      onMistake && onMistake()
      return
    }

    const newFrom = fromStack.slice(0, -1)
    const newTo = [...toStack, disk]
    setPegs({ ...pegs, [selected]: newFrom, [pegName]: newTo })
    setHanoiLog((l) => [...l, { text: `move disk ${disk}: peg ${selected} → peg ${pegName}`, ok: true }])
    setMoves((m) => m + 1)
    setSelected(null)

    if (pegName === 'C' && newTo.length === 3) {
      setTimeout(() => setPhase('done'), 300)
    }
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 8 · Recursion</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Mainframe Core</h2>

      {phase === 'cipher' && (
        <>
          <p className="mission-brief">
            The master key was encrypted with a recursive Caesar cipher. Click <strong>Decode next
            character</strong> to make one recursive call at a time — decode this character, then
            recurse on the rest of the string.
          </p>
          <p className="console-line dim">Encrypted: "{CIPHER}"</p>
          <p className="console-line ok" style={{ fontSize: 16 }}>Decoded: "{decoded}"<span className="flicker">{index < CIPHER.length ? '_' : ''}</span></p>
          <button className="btn" onClick={decodeNext} disabled={index >= CIPHER.length}>
            Decode next character (recursive call {index + 1})
          </button>
        </>
      )}

      {phase !== 'cipher' && (
        <>
          <p className="console-line ok" style={{ marginBottom: 14 }}>Master key recovered: "{decoded}"</p>
          <p className="mission-brief">
            Final lock: a 3-disk security seal. Move every disk from peg A to peg C. You can
            only move one disk at a time, and never place a larger disk on a smaller one — the
            same rule the recursive Tower of Hanoi solution respects.
          </p>

          <div className="grid-row" style={{ justifyContent: 'space-around', marginBottom: 16 }}>
            {['A', 'B', 'C'].map((peg) => (
              <div key={peg} style={{ textAlign: 'center' }}>
                <button
                  className={selected === peg ? 'btn' : 'btn btn-ghost'}
                  onClick={() => clickPeg(peg)}
                  style={{ width: 110, height: 130, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 4, paddingBottom: 8 }}
                >
                  {pegs[peg].map((disk) => (
                    <div key={disk} style={{
                      width: 24 + disk * 18,
                      height: 14,
                      borderRadius: 4,
                      background: 'var(--cyan)',
                      color: 'var(--bg)',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>{disk}</div>
                  ))}
                </button>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Peg {peg}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Moves: {moves} (minimum possible: {MIN_MOVES})</p>
          <div style={{ marginTop: 8, maxHeight: 140, overflowY: 'auto' }}>
            {hanoiLog.map((l, i) => <p key={i} className={`console-line ${l.ok ? 'ok' : 'bad'}`}>{l.text}</p>)}
          </div>
        </>
      )}

      {phase === 'done' && (
        <div style={{ marginTop: 10 }}>
          <p className="console-line ok">
            Seal broken in {moves} moves {moves === MIN_MOVES ? '— optimal!' : `(optimal is ${MIN_MOVES})`}.
          </p>
          <p className="console-line ok" style={{ fontWeight: 700 }}>MAINFRAME BREACHED. MISSION SUCCESS.</p>
          <button className="btn btn-magenta" onClick={onComplete}>Finish mission →</button>
        </div>
      )}
    </div>
  )
}
