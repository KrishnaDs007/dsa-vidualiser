# DSA Visualizer

Interactive, local-first data structures and algorithms visualizer with
generator-driven animation frames, synced code walkthroughs, and a growing
custom code visualization workspace.

## Current features

- Sorting visualizer with Bubble, Insertion, Selection, Merge, Quick, Heap,
  Shell, Counting, and Radix Sort.
- Search visualizer with Linear Search, Binary Search, Lower / Upper Bound,
  Search in Rotated Array, and Binary Search on Answer.
- Hashing visualizer with Hash Insert, Hash Search, Two Sum, Frequency Counter,
  Group Anagrams, Longest Consecutive Sequence, and Subarray Sum Equals K.
- Stack visualizer with Push, Pop, Peek, Valid Parentheses, Next Greater
  Element, and Daily Temperatures.
- Queue visualizer with Enqueue, Dequeue, Peek, Sliding Window Maximum, and
  Queue Using Stacks.
- Linked List visualizer with Reverse, Middle, Cycle Detection, Merge Two
  Sorted Lists, and Remove Nth Node From End.
- Arrays and Strings visualizer with Two Pointers pair-sum, Sliding Window
  max-sum, Prefix Sum range-query, Kadane, and Matrix Traversal tracing.
- Tree visualizer with BST Insert/Search, DFS traversals, Level Order, Lowest
  Common Ancestor, and Trie Insert/Search.
- Graph visualizer with BFS, DFS, Dijkstra, Topological Sort, Union Find, and
  Minimum Spanning Tree.
- Dynamic Programming visualizer with Fibonacci, Climbing Stairs, Coin Change,
  0/1 Knapsack, LCS, and LIS state tables.
- Step controls, speed control, custom array input, animated bars, and synced
  pseudocode highlighting.
- Responsive layout for mobile, tablet, laptop, desktop, and wide 4K monitors.
- Visualizer code panels include a language dropdown for TypeScript,
  JavaScript, Python, Java, C++, C, and C# starter samples.
- Searchable documentation covers every ready visualizer with patterns,
  complexity, step summaries, and direct links back into the live views.
- Local profile/dashboard flow with a temporary cap of 10 saved custom code
  visualizers, including JSON import/export for local backups.
- DSA roadmap catalog grouped by sorting, searching, hashing, stacks/queues,
  linked lists, trees, graphs, dynamic programming, arrays/strings,
  backtracking, and greedy methods.
- Custom code complexity estimator with language selection for JavaScript /
  Node.js, TypeScript, Python, Java, C++, C, and C# snippets.

## Step-by-step roadmap

1. Sorting foundation: complete for the current algorithm set.
2. Search foundation: complete for the current algorithm set.
3. Hashing foundation: complete for the current algorithm set.
4. Stacks and queues foundation: complete for the current algorithm set.
5. Linked Lists foundation: complete for the current algorithm set.
6. Arrays and Strings foundation: complete for the current algorithm set.
7. Trees foundation: complete for the current algorithm set.
8. Graphs foundation: complete for the current algorithm set.
9. Dynamic Programming foundation: complete for the current algorithm set.
10. Custom code visualization: language selector, persisted source code,
   step-by-step tracing, and per-step time/space complexity updates.
11. Backend sync: deferred until the local-first profile and visualizer flows are
   stable.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

If styles or static assets look stale during development, restart with:

```bash
npm run dev:clean
```

## Quality checks

```bash
npm run type-check
npm run test
npm run build
```
