# NetPhantom — Breach the Grid

A dynamic, playable, deployable web game (React + Vite) built for the Employability Skill Development Lab, in the same spirit as my earlier project **CryptoKnight** — but a different game, a different theme, and a different name, ready for its own GitHub repo and Netlify deployment.

You are **Agent Phantom**, an ethical hacker infiltrating a corporation's network one security layer at a time. Every layer can only be beaten by actually *using* one specific data structure or algorithm — the player performs the real operation (push/pop, enqueue/dequeue, traverse, compare-left-or-right, etc.), not just watching an animation of it.

## Live concept → code mapping

| Level | Mission | DSA concept | Source folder |
|---|---|---|---|
| 1 | The Outer Gate | **Stack** (LIFO) | `src/dsa/01-stack/StackGate.jsx` |
| 2 | The Firewall Corridor | **Queue** (FIFO) | `src/dsa/02-queue/QueueCorridor.jsx` |
| 3 | The Server Maze | **Singly Linked List** | `src/dsa/03-linkedlist/ServerMaze.jsx` |
| 4 | The Threat Archive | **Binary Search Tree** | `src/dsa/04-bst/ThreatArchive.jsx` |
| 5 | The Network Grid | **Graph + BFS** | `src/dsa/05-graph/NetworkGrid.jsx` |
| 6 | The Credential Vault | **Hash Map** (real timed O(1) vs O(n) race) | `src/dsa/06-hashmap/CredentialVault.jsx` |
| 7 | The Scanner Room | **Sorting + Binary Search** | `src/dsa/07-sorting/ScannerRoom.jsx` |
| 8 | The Mainframe Core | **Recursion** (Caesar cipher + Tower of Hanoi) | `src/dsa/08-recursion/MainframeCore.jsx` |
| 9 (bonus) | The Extraction Protocol | **Min-Heap / Priority Queue** | `src/dsa/09-heap/ExtractionProtocol.jsx` |
| 10 (bonus) | The Escape Countdown | **Dynamic Programming** (coin-change) | `src/dsa/10-dp/EscapeCountdown.jsx` |
| 11 (finale) | The Final Debrief | **Quiz Game** (MCQs, live score, result screen) | `src/dsa/11-quiz/DebriefQuiz.jsx` |

Each of those files is self-contained, heavily commented at the top explaining **why** that data structure is the right tool for that mission, and can be opened on its own to walk your teacher through exactly one concept.

## Tech stack
- React 18 (functional components + hooks, no extra state library needed)
- Vite 5 (dev server + production build)
- Plain CSS (`src/App.css`) — a dark hacker-terminal theme (scanline overlay, neon cyan/magenta accents, JetBrains Mono / Space Grotesk)
- Zero backend — the whole game runs client-side, same as CryptoKnight

## Features carried over (and built on) from CryptoKnight
- **Particle-network canvas background** — a live connected-node field (`src/components/ParticleBackground.jsx`), same idea as CryptoKnight's, redrawn for NetPhantom's cyan palette
- **Animated glitch title** — the "NetPhantom" logo bursts into a red/cyan channel-split glitch every few seconds (`src/components/GlitchTitle.jsx`), not just a static text-shadow
- **Floating score popups** — a `+150` (or `-1 life`) burst animates up and fades at a random point on screen every time you clear a level or make a mistake (`src/components/ScorePopups.jsx`)
- **Animated rolling score counter** — the HUD score eases up to the new value instead of jumping (`src/components/HUD.jsx`)
- **Lives system** — 3 lives; a wrong call in Queue/BST/Graph/Hash-map/Sorting/Recursion/Heap/DP costs one; hit zero and you get a "system lockout" screen (`src/components/GameOver.jsx`)
- **Grade tiers on completion** — final score maps to Rookie Operative / Field Agent / Elite Infiltrator / Ghost-Tier Operative (`src/components/MissionComplete.jsx`)
- **Two brand-new bonus levels** beyond the original 8, pushing past CryptoKnight's 4-game roster into 10 total DSA-driven levels:
  - **Level 9 — The Extraction Protocol (Min-Heap / Priority Queue):** extract evacuees strictly by priority, performing the sift-down yourself
  - **Level 10 — The Escape Countdown (Dynamic Programming):** build a coin-change-style DP table cell by cell to disarm a countdown with the fewest charges
  - **Level 11 — The Final Debrief (Quiz Game):** a straight multiple-choice quiz covering every concept just breached, with live score calculation and a final result screen — this level exists to satisfy a standalone "quiz game" requirement on its own

## Run it locally
```bash
npm install
npm run dev
```
Then open the printed local URL (usually `http://localhost:5173`).

## Build for production
```bash
npm run build
npm run preview   # optional: preview the production build locally
```
This outputs a static site into `dist/`.

## Deploy to Netlify
This repo already includes `netlify.toml` with the build command and publish directory set up, so:

1. Push this project to a new GitHub repo (e.g. `netphantom-breach-the-grid`).
2. In Netlify: **Add new site → Import an existing project → connect the repo.**
3. Netlify will auto-detect the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy — you'll get a live `*.netlify.app` URL, just like `cryptoknightaj.netlify.app`.

Or deploy instantly without Git, using Netlify Drop: run `npm run build` locally and drag the resulting `dist/` folder onto https://app.netlify.com/drop.

## Project structure
```
netphantom/
├── index.html
├── netlify.toml
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx                # game shell: routes between menu, levels, and the finale
│   ├── App.css                # theme
│   ├── data/levels.js          # single source of truth for level metadata
│   ├── components/
│   │   ├── HUD.jsx              # score + lives + progress header (animated counter)
│   │   ├── MainMenu.jsx         # mission map / level select grid
│   │   ├── MissionComplete.jsx  # finale screen with grade tier
│   │   ├── GameOver.jsx         # "system lockout" screen when lives hit 0
│   │   ├── GlitchTitle.jsx      # animated channel-split glitch logo
│   │   ├── ParticleBackground.jsx # canvas particle-network background
│   │   └── ScorePopups.jsx      # floating +points / -life burst popups
│   └── dsa/
│       ├── 01-stack/StackGate.jsx
│       ├── 02-queue/QueueCorridor.jsx
│       ├── 03-linkedlist/ServerMaze.jsx
│       ├── 04-bst/ThreatArchive.jsx
│       ├── 05-graph/NetworkGrid.jsx
│       ├── 06-hashmap/CredentialVault.jsx
│       ├── 07-sorting/ScannerRoom.jsx
│       ├── 08-recursion/MainframeCore.jsx
│       ├── 09-heap/ExtractionProtocol.jsx
│       ├── 10-dp/EscapeCountdown.jsx
│       └── 11-quiz/DebriefQuiz.jsx
```

## How it plays
- Levels unlock in order — you can't skip ahead in the mission map until the previous layer is cleared.
- Each level is a genuinely interactive puzzle built around its data structure, not a passive animation:
  - **Stack** — you click *Pop* yourself to reverse the password.
  - **Queue** — you can only act on the front of the line, enforced by the UI.
  - **Linked list** — you patch the chain (insert/delete) and step `current = current.next` by hand.
  - **BST** — you make the left/right comparison decisions; wrong branches are caught immediately.
  - **Graph** — you explore a real graph by clicking neighbors; stepping into the honeypot resets your trail, and the true BFS shortest path is revealed at the end for comparison.
  - **Hash map** — an actual 100,000-entry `Map` vs. array scan race is timed live in your browser with `performance.now()`.
  - **Sorting + binary search** — you manually triage by severity, then binary-search the sorted list, watching the candidate range shrink.
  - **Recursion** — you trigger one recursive call per click to decode the cipher, then solve a fully playable Tower of Hanoi.
  - **Min-heap / priority queue (bonus)** — you extract the minimum yourself and perform the sift-down swaps by hand until the heap property holds.
  - **Dynamic programming (bonus)** — you fill in the DP table one cell at a time, picking the charge that gives the true minimum for that amount.
- Score, lives, and cleared-level count are all tracked live in the HUD. A wrong call in any level past Stack/Linked-list costs a life; lose all 3 and it's a "system lockout" game-over screen with a full restart.

## Suggested lab/report fields
**Project Title:** NetPhantom — Breach the Grid

**Brief Description:** NetPhantom is a browser-based hacking-simulation game where the player, an ethical-hacker agent, clears eleven network security layers (eight core, two bonus, and a final multiple-choice debrief quiz). Each layer is a hands-on puzzle built around one core data structure or algorithm (stack, queue, linked list, BST, graph/BFS, hash map, sorting/binary search, recursion, min-heap, dynamic programming), so the player is directly performing the operation the concept describes — with a lives system, score popups, and a final grade tier for replay value. The closing quiz level separately satisfies a standalone "quiz game" requirement: multiple-choice questions, a live-calculated score, and a final result screen.

**Motivation:** DSA topics are often taught and tested in isolation. NetPhantom gives each structure a concrete, interactive purpose inside one connected story, making the concepts easier to explain, demonstrate, and retain.

**Target Users:** Engineering students learning DSA, lab evaluators, and anyone who wants a hands-on way to revisit core data structures.

**Existing Solutions / Alternatives:** Visualgo, HackerRank/LeetCode tracks, and generic DSA visualizer tools. Most present each structure in isolation with no unifying narrative and no requirement that the learner actually perform the operation.

**Novelty:** Every level requires the player to execute the real operation (pop, dequeue, traverse-and-relink, branch comparison, graph exploration, live-timed hash lookup, sort-then-binary-search, recursive calls) rather than watch it animated, and the whole thing ships as a single deployable web app with each concept isolated in its own source folder for direct code review.

---
*Built by Ayush Jha — B.Tech CSE (Cyber Security), NIET.*
