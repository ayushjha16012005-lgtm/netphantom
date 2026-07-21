/*
  GAME TYPE: QUIZ GAME
  Lab requirement: "An interactive game that presents multiple-choice
  questions, calculates scores, and displays the final result."

  This is the mission debrief — a straight multiple-choice quiz on the
  cybersecurity/DSA concepts from every layer just breached. Score is
  calculated live as the player answers, and a final result screen
  summarises correct vs. incorrect answers with a percentage and a
  pass/fail-style verdict, exactly matching the quiz-game spec.
*/
import { useState } from 'react'

const QUESTIONS = [
  {
    q: 'Which data structure did you use to reverse the intercepted password at the Outer Gate?',
    options: ['Queue', 'Stack', 'Linked list', 'Hash map'],
    answer: 1
  },
  {
    q: 'Why must network packets be processed strictly in arrival order?',
    options: [
      'Because a stack demands it',
      'Because queues are First-In-First-Out, matching real packet order',
      'Because it looks better on screen',
      'Because BSTs require sorted input'
    ],
    answer: 1
  },
  {
    q: 'In the Server Maze, inserting or deleting a relay server only required...',
    options: [
      'Rebuilding the entire chain',
      'Shifting every other server over by one',
      'Relinking a couple of pointers',
      'Re-hashing every node'
    ],
    answer: 2
  },
  {
    q: 'A Binary Search Tree keeps a left subtree...',
    options: [
      'Always empty',
      'Greater than the node',
      'Smaller than the node',
      'Unsorted relative to the node'
    ],
    answer: 2
  },
  {
    q: 'Why was BFS the right algorithm to cross the Network Grid?',
    options: [
      'It avoids honeypots automatically with no logic needed',
      'It guarantees the shortest path in an unweighted graph',
      'It only works on trees',
      'It sorts the graph nodes first'
    ],
    answer: 1
  },
  {
    q: 'What gives a hash map its near-instant average lookup time?',
    options: [
      'It sorts every entry first',
      'It stores data in a linked chain',
      'A hash function maps the key directly to a bucket index',
      'It uses recursion internally'
    ],
    answer: 2
  },
  {
    q: 'Binary search on the sorted vulnerability list only works because...',
    options: [
      'The list was sorted first',
      'The list was small',
      'QuickSort is recursive',
      'Severity scores are always unique'
    ],
    answer: 0
  },
  {
    q: 'Every correct recursive function needs a...',
    options: [
      'Global variable',
      'Base case to stop it from recursing forever',
      'Loop instead of a function call',
      'Sorted input array'
    ],
    answer: 1
  },
  {
    q: 'A min-heap always extracts...',
    options: [
      'The most recently inserted element',
      'A random element',
      'The element with the smallest priority value',
      'The element at the end of the array'
    ],
    answer: 2
  },
  {
    q: 'The Escape Countdown level solved a coin-change problem using...',
    options: [
      'A single greedy guess with no verification',
      'Dynamic programming — building up the answer from smaller subamounts',
      'A stack of countdown digits',
      'A hash map of timers'
    ],
    answer: 1
  }
]

export default function DebriefQuiz({ onComplete, onMistake }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [log, setLog] = useState([])
  const [finished, setFinished] = useState(false)

  const question = QUESTIONS[index]
  const total = QUESTIONS.length
  const percent = Math.round((correctCount / total) * 100)

  function choose(i) {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    const isCorrect = i === question.answer
    if (isCorrect) {
      setCorrectCount((c) => c + 1)
    } else {
      onMistake?.()
    }
    setLog((l) => [...l, { q: question.q, isCorrect }])
  }

  function next() {
    if (index + 1 < total) {
      setIndex((i) => i + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  function verdict() {
    if (percent === 100) return { label: '🏆 Perfect debrief — full clearance', color: 'var(--green)' }
    if (percent >= 80) return { label: '🛡 Cleared for field duty', color: 'var(--green)' }
    if (percent >= 50) return { label: '⚠ Passable, but brush up before the next op', color: 'var(--amber)' }
    return { label: '🔴 Debrief failed — review the mission logs', color: 'var(--red)' }
  }

  if (finished) {
    const v = verdict()
    return (
      <div className="panel">
        <p className="tag tag-cyan">Level 11 · Quiz game</p>
        <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Final Debrief — Result</h2>
        <div className="panel-raised" style={{ padding: 20, textAlign: 'center', margin: '14px 0' }}>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Final score</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--cyan)' }}>{correctCount} / {total}</p>
          <p style={{ fontSize: 14, color: 'var(--text-dim)' }}>{percent}% correct</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: v.color, marginTop: 10 }}>{v.label}</p>
        </div>
        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 12 }}>
          {log.map((l, i) => (
            <p key={i} className={`console-line ${l.isCorrect ? 'ok' : 'bad'}`}>
              Q{i + 1}: {l.isCorrect ? 'Correct' : 'Incorrect'} — {l.q}
            </p>
          ))}
        </div>
        <button className="btn btn-magenta" onClick={onComplete}>Complete the mission →</button>
      </div>
    )
  }

  return (
    <div className="panel">
      <p className="tag tag-cyan">Level 11 · Quiz game</p>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 4px' }}>The Final Debrief</h2>
      <p className="mission-brief">
        Before you're cleared, answer a multiple-choice debrief on every layer you just
        breached. Your score is calculated live, question by question, with a full result
        screen at the end.
      </p>

      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 6 }}>
        Question {index + 1} of {total} &nbsp;·&nbsp; Score so far: {correctCount}/{index + (answered ? 1 : 0)}
      </p>
      <div className="progress-track" style={{ marginBottom: 16 }}>
        <div className="progress-fill" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>{question.q}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {question.options.map((opt, i) => {
          let cls = 'btn btn-ghost'
          if (answered) {
            if (i === question.answer) cls = 'btn'
            else if (i === selected) cls = 'btn btn-magenta'
          }
          return (
            <button key={i} className={cls} style={{ textAlign: 'left' }} onClick={() => choose(i)} disabled={answered}>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <>
          <p className={`console-line ${selected === question.answer ? 'ok' : 'bad'}`}>
            {selected === question.answer ? 'Correct.' : `Incorrect — the right answer was "${question.options[question.answer]}".`}
          </p>
          <button className="btn" onClick={next} style={{ marginTop: 8 }}>
            {index + 1 < total ? 'Next question' : 'See final result'}
          </button>
        </>
      )}
    </div>
  )
}
