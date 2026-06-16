export interface DsaTopic {
  name: string
  status: 'ready' | 'planned'
  patterns: string[]
}

export interface DsaCategory {
  id: string
  title: string
  description: string
  topics: DsaTopic[]
}

export const SUPPORTED_LANGUAGES = [
  'JavaScript / Node.js',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C',
  'C#'
] as const

export const DSA_CATALOG: DsaCategory[] = [
  {
    id: 'sorting',
    title: 'Sorting',
    description:
      'Ordering techniques with comparisons, swaps, partitions, and merge steps.',
    topics: [
      { name: 'Bubble Sort', status: 'ready', patterns: ['Swapping', 'Nested loops'] },
      { name: 'Insertion Sort', status: 'ready', patterns: ['Sorted prefix', 'Shifting'] },
      { name: 'Selection Sort', status: 'ready', patterns: ['Minimum selection'] },
      { name: 'Merge Sort', status: 'ready', patterns: ['Divide and conquer', 'Merging'] },
      { name: 'Quick Sort', status: 'ready', patterns: ['Partitioning', 'Recursion'] },
      { name: 'Heap Sort', status: 'ready', patterns: ['Heap', 'Selection'] },
      { name: 'Shell Sort', status: 'ready', patterns: ['Gap insertion'] },
      { name: 'Counting Sort', status: 'ready', patterns: ['Frequency table'] },
      { name: 'Radix Sort', status: 'ready', patterns: ['Digit buckets'] }
    ]
  },
  {
    id: 'searching',
    title: 'Searching',
    description:
      'Finding values and boundaries across arrays, answer spaces, and rotated ranges.',
    topics: [
      { name: 'Linear Search', status: 'ready', patterns: ['Single scan'] },
      { name: 'Binary Search', status: 'ready', patterns: ['Halving', 'Sorted array'] },
      { name: 'Lower / Upper Bound', status: 'planned', patterns: ['Boundary search'] },
      { name: 'Search in Rotated Array', status: 'planned', patterns: ['Modified binary search'] },
      { name: 'Binary Search on Answer', status: 'planned', patterns: ['Predicate monotonicity'] }
    ]
  },
  {
    id: 'hashing',
    title: 'Hashing',
    description:
      'Constant-time lookup patterns using maps, sets, counters, and prefix signatures.',
    topics: [
      { name: 'Hash Insert', status: 'ready', patterns: ['Modulo hashing', 'Chaining'] },
      { name: 'Hash Search', status: 'ready', patterns: ['Bucket lookup', 'Chain scan'] },
      { name: 'Two Sum', status: 'planned', patterns: ['Hash map lookup'] },
      { name: 'Frequency Counter', status: 'planned', patterns: ['Counting'] },
      { name: 'Group Anagrams', status: 'planned', patterns: ['Canonical keys'] },
      { name: 'Longest Consecutive Sequence', status: 'planned', patterns: ['Hash set expansion'] },
      { name: 'Subarray Sum Equals K', status: 'planned', patterns: ['Prefix sum', 'Hash map'] }
    ]
  },
  {
    id: 'stacks-queues',
    title: 'Stacks And Queues',
    description:
      'LIFO/FIFO structures for monotonic scans, parsing, windows, and scheduling.',
    topics: [
      { name: 'Stack Push / Pop / Peek', status: 'ready', patterns: ['LIFO', 'Top pointer'] },
      { name: 'Queue Enqueue / Dequeue / Peek', status: 'ready', patterns: ['FIFO', 'Front and rear'] },
      { name: 'Valid Parentheses', status: 'planned', patterns: ['Stack parsing'] },
      { name: 'Next Greater Element', status: 'planned', patterns: ['Monotonic stack'] },
      { name: 'Daily Temperatures', status: 'planned', patterns: ['Monotonic stack'] },
      { name: 'Sliding Window Maximum', status: 'planned', patterns: ['Deque'] },
      { name: 'Queue Using Stacks', status: 'planned', patterns: ['Amortized operations'] }
    ]
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    description:
      'Pointer movement, reversal, cycle detection, and merge-style list workflows.',
    topics: [
      { name: 'Reverse Linked List', status: 'ready', patterns: ['Pointer rewiring'] },
      { name: 'Middle of Linked List', status: 'planned', patterns: ['Fast and slow pointers'] },
      { name: 'Detect Cycle', status: 'planned', patterns: ['Floyd cycle detection'] },
      { name: 'Merge Two Sorted Lists', status: 'planned', patterns: ['Two pointers'] },
      { name: 'Remove Nth Node From End', status: 'planned', patterns: ['Two pointers'] }
    ]
  },
  {
    id: 'trees',
    title: 'Trees',
    description:
      'Hierarchical traversals, search trees, recursion, and level-order state.',
    topics: [
      { name: 'BST Insert / Search', status: 'ready', patterns: ['Binary search tree'] },
      { name: 'Inorder Traversal', status: 'ready', patterns: ['DFS'] },
      { name: 'Preorder Traversal', status: 'planned', patterns: ['DFS'] },
      { name: 'Postorder Traversal', status: 'planned', patterns: ['DFS'] },
      { name: 'Level Order Traversal', status: 'planned', patterns: ['BFS', 'Queue'] },
      { name: 'Lowest Common Ancestor', status: 'planned', patterns: ['Tree recursion'] },
      { name: 'Trie Insert / Search', status: 'planned', patterns: ['Prefix tree'] }
    ]
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description:
      'Node and edge exploration with visited sets, shortest paths, and ordering.',
    topics: [
      { name: 'BFS', status: 'ready', patterns: ['Queue', 'Visited set'] },
      { name: 'DFS', status: 'ready', patterns: ['Recursion', 'Stack'] },
      { name: 'Dijkstra', status: 'ready', patterns: ['Priority queue'] },
      { name: 'Topological Sort', status: 'planned', patterns: ['DAG ordering'] },
      { name: 'Union Find', status: 'planned', patterns: ['Disjoint set'] },
      { name: 'Minimum Spanning Tree', status: 'planned', patterns: ['Kruskal', 'Prim'] }
    ]
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description:
      'State transitions, memoization, tabulation grids, and optimized recurrence views.',
    topics: [
      { name: 'Fibonacci', status: 'ready', patterns: ['Memoization', 'Tabulation'] },
      { name: 'Climbing Stairs', status: 'ready', patterns: ['1D DP'] },
      { name: 'Coin Change', status: 'ready', patterns: ['Unbounded knapsack'] },
      { name: '0/1 Knapsack', status: 'planned', patterns: ['2D DP'] },
      { name: 'Longest Common Subsequence', status: 'planned', patterns: ['2D DP'] },
      { name: 'Longest Increasing Subsequence', status: 'planned', patterns: ['DP with binary search'] }
    ]
  },
  {
    id: 'arrays-strings',
    title: 'Arrays And Strings',
    description:
      'Core interview patterns around windows, prefixes, pointers, and in-place edits.',
    topics: [
      { name: 'Two Pointers', status: 'planned', patterns: ['Opposite ends', 'Same direction'] },
      { name: 'Sliding Window', status: 'planned', patterns: ['Window expansion'] },
      { name: 'Prefix Sum', status: 'planned', patterns: ['Range query'] },
      { name: 'Kadane Algorithm', status: 'planned', patterns: ['Running optimum'] },
      { name: 'Matrix Traversal', status: 'planned', patterns: ['Grid movement'] }
    ]
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    description:
      'Decision trees with choose, explore, unchoose steps and pruning signals.',
    topics: [
      { name: 'Subsets', status: 'planned', patterns: ['Decision tree'] },
      { name: 'Permutations', status: 'planned', patterns: ['Used set'] },
      { name: 'Combinations', status: 'planned', patterns: ['Start index'] },
      { name: 'N-Queens', status: 'planned', patterns: ['Constraint pruning'] },
      { name: 'Sudoku Solver', status: 'planned', patterns: ['Constraint search'] }
    ]
  },
  {
    id: 'greedy',
    title: 'Greedy',
    description:
      'Local-choice strategies with sorted inputs, intervals, and exchange arguments.',
    topics: [
      { name: 'Activity Selection', status: 'planned', patterns: ['Interval sorting'] },
      { name: 'Merge Intervals', status: 'planned', patterns: ['Interval scan'] },
      { name: 'Jump Game', status: 'planned', patterns: ['Reachability'] },
      { name: 'Gas Station', status: 'planned', patterns: ['Running balance'] },
      { name: 'Huffman Coding', status: 'planned', patterns: ['Priority queue'] }
    ]
  }
]
