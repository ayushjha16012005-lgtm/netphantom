import { useState } from 'react'
import { LEVELS, MAX_SCORE } from './data/levels.js'
import HUD from './components/HUD.jsx'
import MainMenu from './components/MainMenu.jsx'
import MissionComplete from './components/MissionComplete.jsx'
import GameOver from './components/GameOver.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import ScorePopups from './components/ScorePopups.jsx'

import StackGate from './dsa/01-stack/StackGate.jsx'
import QueueCorridor from './dsa/02-queue/QueueCorridor.jsx'
import ServerMaze from './dsa/03-linkedlist/ServerMaze.jsx'
import ThreatArchive from './dsa/04-bst/ThreatArchive.jsx'
import NetworkGrid from './dsa/05-graph/NetworkGrid.jsx'
import CredentialVault from './dsa/06-hashmap/CredentialVault.jsx'
import ScannerRoom from './dsa/07-sorting/ScannerRoom.jsx'
import MainframeCore from './dsa/08-recursion/MainframeCore.jsx'
import ExtractionProtocol from './dsa/09-heap/ExtractionProtocol.jsx'
import EscapeCountdown from './dsa/10-dp/EscapeCountdown.jsx'
import DebriefQuiz from './dsa/11-quiz/DebriefQuiz.jsx'

const GAME_COMPONENTS = {
  stack: StackGate,
  queue: QueueCorridor,
  linkedlist: ServerMaze,
  bst: ThreatArchive,
  graph: NetworkGrid,
  hashmap: CredentialVault,
  sorting: ScannerRoom,
  recursion: MainframeCore,
  heap: ExtractionProtocol,
  dp: EscapeCountdown,
  quiz: DebriefQuiz
}

const MAX_LIVES = 3

export default function App() {
  const [screen, setScreen] = useState('menu') // 'menu' | 'level' | 'complete' | 'gameover'
  const [activeLevel, setActiveLevel] = useState(null)
  const [cleared, setCleared] = useState([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [popups, setPopups] = useState([])

  const unlockedId = cleared.length > 0 ? Math.max(...cleared) + 1 : 1

  function spawnPopup(text, negative = false) {
    const id = Math.random().toString(36).slice(2)
    const x = window.innerWidth / 2 + (Math.random() * 120 - 60)
    const y = window.innerHeight / 2 + (Math.random() * 60 - 30)
    setPopups((p) => [...p, { id, text, negative, x, y }])
    setTimeout(() => setPopups((p) => p.filter((pop) => pop.id !== id)), 1100)
  }

  function selectLevel(level) {
    setActiveLevel(level)
    setScreen('level')
  }

  function completeLevel(level) {
    setCleared((prev) => (prev.includes(level.id) ? prev : [...prev, level.id]))
    setScore((prev) => prev + level.points)
    spawnPopup(level.points)
    if (level.id === LEVELS.length) {
      setScreen('complete')
    } else {
      setScreen('menu')
    }
  }

  function handleMistake() {
    spawnPopup('1 life', true)
    setLives((prev) => {
      const next = prev - 1
      if (next <= 0) {
        setTimeout(() => setScreen('gameover'), 300)
      }
      return Math.max(0, next)
    })
  }

  function resetAll() {
    setCleared([])
    setScore(0)
    setLives(MAX_LIVES)
    setActiveLevel(null)
    setPopups([])
    setScreen('menu')
  }

  const ActiveGame = activeLevel ? GAME_COMPONENTS[activeLevel.key] : null

  return (
    <div className="app-shell">
      <ParticleBackground />
      <ScorePopups popups={popups} />
      <div className="container">
        <HUD
          score={score}
          cleared={cleared.length}
          total={LEVELS.length}
          lives={lives}
          maxLives={MAX_LIVES}
          showHome={screen === 'level'}
          onHome={() => setScreen('menu')}
        />

        {screen === 'menu' && (
          <MainMenu cleared={cleared} unlockedId={unlockedId} onSelect={selectLevel} />
        )}

        {screen === 'level' && ActiveGame && (
          <ActiveGame
            key={activeLevel.id}
            level={activeLevel}
            onComplete={() => completeLevel(activeLevel)}
            onMistake={handleMistake}
          />
        )}

        {screen === 'complete' && (
          <MissionComplete score={score} maxScore={MAX_SCORE} onReplay={resetAll} />
        )}

        {screen === 'gameover' && (
          <GameOver score={score} onRestart={resetAll} />
        )}
      </div>
    </div>
  )
}
