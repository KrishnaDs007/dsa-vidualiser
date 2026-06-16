# DSA Visualizer

Interactive, local-first data structures and algorithms visualizer with
generator-driven animation frames, synced code walkthroughs, and a growing
custom code visualization workspace.

## Current features

- Sorting visualizer with Bubble, Insertion, Selection, Merge, Quick, Heap,
  Shell, Counting, and Radix Sort.
- Search visualizer with Linear Search and Binary Search.
- Hashing visualizer with Hash Insert and Hash Search using separate chaining.
- Stack visualizer with Push, Pop, and Peek operations.
- Queue visualizer with Enqueue, Dequeue, and Peek operations.
- Linked List visualizer with Reverse Linked List pointer rewiring.
- Tree visualizer with BST Insert, BST Search, and Inorder Traversal.
- Graph visualizer with BFS, DFS, and Dijkstra on a weighted directed graph.
- Dynamic Programming visualizer with Fibonacci, Climbing Stairs, and Coin
  Change state tables.
- Step controls, speed control, custom array input, animated bars, and synced
  pseudocode highlighting.
- Local profile/dashboard flow with a temporary cap of 10 saved custom code
  visualizers, including JSON import/export for local backups.
- DSA roadmap catalog grouped by sorting, searching, hashing, stacks/queues,
  linked lists, trees, graphs, dynamic programming, arrays/strings,
  backtracking, and greedy methods.
- Custom code complexity estimator with language selection for JavaScript /
  Node.js, TypeScript, Python, Java, C++, C, and C# snippets.

## Step-by-step roadmap

1. Sorting foundation: complete for the current algorithm set.
2. Search foundation: Linear Search and Binary Search are complete; bounds,
   rotated arrays, and binary search on answer are next.
3. Hashing foundation: Hash Insert and Hash Search are complete; Two Sum,
   Frequency Counter, Group Anagrams, Longest Consecutive Sequence, and
   Subarray Sum Equals K are next.
4. Stacks and queues foundation: Stack Push/Pop/Peek and Queue
   Enqueue/Dequeue/Peek are complete; Valid Parentheses, Next Greater Element,
   Daily Temperatures, Sliding Window Maximum, and Queue Using Stacks are next.
5. Linked Lists foundation: Reverse Linked List is complete; Middle of Linked
   List, Detect Cycle, Merge Two Sorted Lists, and Remove Nth Node From End are
   next.
6. Trees foundation: BST insert/search and inorder traversal are complete;
   preorder, postorder, level-order, LCA, and trie workflows are next.
7. Graphs foundation: BFS, DFS, and Dijkstra are complete; topological sort,
   union find, and MST are next.
8. Dynamic Programming foundation: Fibonacci, Climbing Stairs, and Coin Change
   are complete; 0/1 Knapsack, LCS, and LIS are next.
9. Custom code visualization: language selector, persisted source code,
   step-by-step tracing, and per-step time/space complexity updates.
10. Backend sync: deferred until the local-first profile and visualizer flows are
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
