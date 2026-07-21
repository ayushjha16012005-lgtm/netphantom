export const LEVELS = [
  {
    id: 1,
    key: 'stack',
    title: 'The Outer Gate',
    concept: 'Stack (LIFO)',
    folder: '01-stack',
    blurb: 'Pop an intercepted password off a stack to reverse it and reveal the real credential.',
    points: 100
  },
  {
    id: 2,
    key: 'queue',
    title: 'The Firewall Corridor',
    concept: 'Queue (FIFO)',
    folder: '02-queue',
    blurb: 'Process live network packets strictly in arrival order — allow the safe, block the malicious.',
    points: 100
  },
  {
    id: 3,
    key: 'linkedlist',
    title: 'The Server Maze',
    concept: 'Singly Linked List',
    folder: '03-linkedlist',
    blurb: 'Traverse a chain of relay servers, patching the route by inserting and deleting nodes.',
    points: 100
  },
  {
    id: 4,
    key: 'bst',
    title: 'The Threat Archive',
    concept: 'Binary Search Tree',
    folder: '04-bst',
    blurb: 'Navigate a sorted threat database, choosing left or right to reach a target signature fast.',
    points: 100
  },
  {
    id: 5,
    key: 'graph',
    title: 'The Network Grid',
    concept: 'Graph + BFS',
    folder: '05-graph',
    blurb: 'Chart the shortest path through the network graph to the target server — avoid the honeypot.',
    points: 100
  },
  {
    id: 6,
    key: 'hashmap',
    title: 'The Credential Vault',
    concept: 'Hash Map',
    folder: '06-hashmap',
    blurb: 'Race a hash-table lookup against a linear scan across a 50,000-entry credential vault.',
    points: 100
  },
  {
    id: 7,
    key: 'sorting',
    title: 'The Scanner Room',
    concept: 'QuickSort + Binary Search',
    folder: '07-sorting',
    blurb: 'Sort flagged vulnerabilities by severity, then binary-search the sorted list for one exact score.',
    points: 100
  },
  {
    id: 8,
    key: 'recursion',
    title: 'The Mainframe Core',
    concept: 'Recursion',
    folder: '08-recursion',
    blurb: 'Recursively decode the master key, then break the final security seal — a live Tower of Hanoi.',
    points: 100
  },
  {
    id: 9,
    key: 'heap',
    title: 'The Extraction Protocol',
    concept: 'Priority Queue / Min-Heap',
    folder: '09-heap',
    blurb: 'Bonus layer: extract evacuating agents in priority order using a min-heap, not a plain queue.',
    points: 150
  },
  {
    id: 10,
    key: 'dp',
    title: 'The Escape Countdown',
    concept: 'Dynamic Programming',
    folder: '10-dp',
    blurb: 'Bonus layer: disarm a countdown using the fewest charges possible — classic coin-change DP.',
    points: 150
  },
  {
    id: 11,
    key: 'quiz',
    title: 'The Final Debrief',
    concept: 'Quiz Game',
    folder: '11-quiz',
    blurb: 'Final layer: an interactive multiple-choice debrief on everything you just breached — scored live, with a final result screen.',
    points: 150
  }
]

export const MAX_SCORE = LEVELS.reduce((sum, l) => sum + l.points, 0)
