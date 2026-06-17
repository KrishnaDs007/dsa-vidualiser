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
- Linked List visualizer with Reverse Linked List pointer rewiring.
- Arrays and Strings visualizer with Two Pointers pair-sum, Sliding Window
  max-sum, and Prefix Sum range-query tracing.
- Tree visualizer with BST Insert, BST Search, and Inorder Traversal.
- Graph visualizer with BFS, DFS, and Dijkstra on a weighted directed graph.
- Dynamic Programming visualizer with Fibonacci, Climbing Stairs, and Coin
  Change state tables.
- Step controls, speed control, custom array input, animated bars, and synced
  pseudocode highlighting.
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
5. Linked Lists foundation: Reverse Linked List is complete; Middle of Linked
   List, Detect Cycle, Merge Two Sorted Lists, and Remove Nth Node From End are
   next.
6. Arrays and Strings foundation: Two Pointers, Sliding Window, and Prefix Sum
   are complete; Kadane Algorithm and Matrix Traversal are next.
7. Trees foundation: BST insert/search and inorder traversal are complete;
   preorder, postorder, level-order, LCA, and trie workflows are next.
8. Graphs foundation: BFS, DFS, and Dijkstra are complete; topological sort,
   union find, and MST are next.
9. Dynamic Programming foundation: Fibonacci, Climbing Stairs, and Coin Change
   are complete; 0/1 Knapsack, LCS, and LIS are next.
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

## Quality checks

```bash
npm run type-check
npm run test
npm run build
```
