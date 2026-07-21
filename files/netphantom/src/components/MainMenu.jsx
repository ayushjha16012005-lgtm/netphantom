import { LEVELS } from '../data/levels.js'

export default function MainMenu({ cleared, unlockedId, onSelect }) {
  const progress = Math.round((cleared.length / LEVELS.length) * 100)

  return (
    <div>
      <p className="mission-brief">
        You are Agent Phantom, an ethical hacker hired to stress-test a corporation's
        network before real attackers find its weaknesses. {LEVELS.length} security layers
        stand between you and the mainframe — the last two are bonus layers unlocked only
        after the core eight, and a final multiple-choice debrief quiz caps the mission.
        Each layer only falls to one specific data structure or
        algorithm, and every intrusion mistake costs a life — clear them all to breach the grid.
      </p>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="level-grid">
        {LEVELS.map((lvl) => {
          const isCleared = cleared.includes(lvl.id)
          const isLocked = lvl.id > unlockedId
          return (
            <button
              key={lvl.id}
              className={`level-card ${isLocked ? 'locked' : ''} ${isCleared ? 'cleared' : ''}`}
              onClick={() => !isLocked && onSelect(lvl)}
              disabled={isLocked}
            >
              <span className="num">{String(lvl.id).padStart(2, '0')}</span>
              <span className={`tag ${isCleared ? 'tag-green' : 'tag-cyan'}`} style={{ float: 'right' }}>
                {isCleared ? 'cleared' : isLocked ? 'locked' : lvl.concept}
              </span>
              <h3>{lvl.title}</h3>
              <p className="concept">{lvl.concept}</p>
              <p className="blurb">{lvl.blurb}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
