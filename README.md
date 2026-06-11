# DSA Visualizer

Interactive, local-first data structures and algorithms visualizer with
generator-driven animation frames, synced code walkthroughs, and a growing
custom code visualization workspace.

## Current features

- Sorting visualizer with Bubble, Insertion, Selection, Merge, Quick, Heap,
  Shell, Counting, and Radix Sort.
- Search visualizer with Linear Search and Binary Search.
- Tree visualizer with BST Insert, BST Search, and Inorder Traversal.
- Graph visualizer with BFS, DFS, and Dijkstra on a weighted directed graph.
- Dynamic Programming visualizer with Fibonacci, Climbing Stairs, and Coin
  Change state tables.
- Step controls, speed control, custom array input, animated bars, and synced
  pseudocode highlighting.
- Local profile/dashboard flow with a temporary cap of 10 saved custom code
  visualizers.
- DSA roadmap catalog grouped by sorting, searching, hashing, stacks/queues,
  linked lists, trees, graphs, dynamic programming, arrays/strings,
  backtracking, and greedy methods.
- Custom code complexity estimator with language selection for JavaScript /
  Node.js, TypeScript, Python, Java, C++, C, and C# snippets.

## Step-by-step roadmap

1. Sorting foundation: complete for the current algorithm set.
2. Search foundation: Linear Search and Binary Search are complete; bounds,
   rotated arrays, and binary search on answer are next.
3. Trees foundation: BST insert/search and inorder traversal are complete;
   preorder, postorder, level-order, LCA, and trie workflows are next.
4. Graphs foundation: BFS, DFS, and Dijkstra are complete; topological sort,
   union find, and MST are next.
5. Dynamic Programming foundation: Fibonacci, Climbing Stairs, and Coin Change
   are complete; 0/1 Knapsack, LCS, and LIS are next.
6. Custom code visualization: language selector, persisted source code,
   step-by-step tracing, and per-step time/space complexity updates.
7. Backend sync: deferred until the local-first profile and visualizer flows are
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
