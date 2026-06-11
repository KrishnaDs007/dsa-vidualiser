# DSA Visualizer

Interactive, local-first data structures and algorithms visualizer with
generator-driven animation frames, synced code walkthroughs, and a growing
custom code visualization workspace.

## Current features

- Sorting visualizer with Bubble, Insertion, Selection, Merge, Quick, Heap,
  Shell, Counting, and Radix Sort.
- Step controls, speed control, custom array input, animated bars, and synced
  pseudocode highlighting.
- Local profile/dashboard flow with a temporary cap of 10 saved custom code
  visualizers.
- DSA roadmap catalog grouped by sorting, searching, hashing, stacks/queues,
  linked lists, trees, graphs, dynamic programming, arrays/strings,
  backtracking, and greedy methods.
- Initial custom code complexity estimator for JavaScript-style snippets.

## Step-by-step roadmap

1. Sorting foundation: complete for the current algorithm set.
2. Search: linear search, binary search, bounds, rotated arrays, and binary
   search on answer.
3. Trees: BST insert/search and traversal snapshots.
4. Graphs: BFS, DFS, Dijkstra, topological sort, union find, and MST.
5. Custom code visualization: language selector, persisted source code,
   step-by-step tracing, and per-step time/space complexity updates.
6. Backend sync: deferred until the local-first profile and visualizer flows are
   stable.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run type-check
npm run test
npm run build
```
