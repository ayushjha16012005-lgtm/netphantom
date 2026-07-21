/*
  DSA CONCEPT: STACK (LIFO)
  The scrambled password is pushed onto a stack. The player pops one
  character at a time — because a stack is Last In, First Out, popping
  every character produces the string in REVERSE order, revealing the
  real password. This is the classic "reverse a string with a stack"
  pattern, made interactive: the player IS the pop() operation.
*/
import { useState } from 'react'

const SCRAMBLED = '0791tr0FyeK' // reverse of "KeyF0rt1970"
const TAGS = '({[<AUTH>]})'

function isBalanced(tags) {
  const pairs = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  const trace = []
  for (const c of tags) {
    if ('([{'.includes(c)) {
      stack.push(c)
      trace.push({ c, action: `push('${c}')`, stack: [...stack] })
    } else if (')]}'.includes(c)) {
      const top = stack[stack.length - 1]
      if (top !== pairs[c]) {
        trace.push({ c, action: `'${c}' does not match top -> INTRUSION`, stack: [...stack] })
        return { ok: false, trace }
      }
      stack.pop()
      trace.push({ c, action: `'${c}' matches -> pop()`, stack: [...stack] })
    }
  }
  return { ok: stack.length === 0, trace }
}

export default function StackGate({ onComplete }) {
  const [stack, setStack] = useState(SCRAMBLED.split(''))
  const [revealed, setRevealed] = useState('')
  const [stage, setStage] = useState('pop') // pop -> validate -> done
  const [validation, setValidation] = useState(null)

  function pop() {
    if (stack.length === 0) return
    const next = [...stack]
    const c = next.pop()
    setStack(next)
    setRevealed((r) => r + c)
    if (next.length === 0) setStage('validate')
  }

  function validate() {
    const result = isBalanced(TAGS)
    setValidation(result)
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 1 · Stack</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Outer Gate</h2>
      <p className="mission-brief">
        Intel intercepted a scrambled admin password: every character was pushed onto a
        stack. Click <strong>Pop</strong> to pull characters off one at a time — since a
        stack is Last-In-First-Out, popping the whole thing reveals the password in reverse
        order.
      </p>

      {stage === 'pop' && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Stack (top is rightmost):</p>
          <div className="grid-row" style={{ marginBottom: 16 }}>
            {stack.map((c, i) => (
              <div key={i} className="badge-slot" style={{
                borderColor: i === stack.length - 1 ? 'var(--cyan)' : 'var(--border)',
                color: i === stack.length - 1 ? 'var(--cyan)' : 'var(--text)'
              }}>{c}</div>
            ))}
            {stack.length === 0 && <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>empty</span>}
          </div>
          <button className="btn" onClick={pop} disabled={stack.length === 0}>Pop top of stack</button>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-dim)' }}>Revealed so far:</p>
          <p className="console-line ok" style={{ fontSize: 16, letterSpacing: 1 }}>{revealed || '—'}</p>
        </>
      )}

      {stage === 'validate' && (
        <>
          <p className="console-line ok">Password decrypted: "{revealed}"</p>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 14 }}>
            One more check: the gateway wraps its auth token in nested cipher-tags. A stack
            validates the nesting is balanced before letting you through.
          </p>
          <p className="console-line" style={{ fontFamily: 'var(--font-mono)', fontSize: 15 }}>{TAGS}</p>
          <button className="btn" onClick={validate}>Validate tag nesting with a stack</button>
          {validation && (
            <div style={{ marginTop: 12 }}>
              {validation.trace.map((t, i) => (
                <p key={i} className="console-line dim">{t.action} &nbsp; stack: [{t.stack.join(' ')}]</p>
              ))}
              {validation.ok ? (
                <>
                  <p className="console-line ok">All tags balanced. Gate integrity confirmed.</p>
                  <button className="btn btn-magenta" style={{ marginTop: 10 }} onClick={onComplete}>
                    Breach the outer gate →
                  </button>
                </>
              ) : (
                <p className="console-line bad">Mismatch detected — intrusion alarm triggered.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
