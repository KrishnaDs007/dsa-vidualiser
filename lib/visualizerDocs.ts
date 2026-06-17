export interface VisualizerDoc {
  id: string
  category: string
  title: string
  route: string
  summary: string
  complexity: string
  patterns: string[]
  steps: string[]
}

export const VISUALIZER_DOCS: VisualizerDoc[] = [
  doc('sorting-bubble', 'Sorting', 'Bubble Sort', '/sorting?algo=bubble', 'Repeatedly compares adjacent values and swaps inverted pairs until the largest unsettled value bubbles to the end.', 'O(n^2) time / O(1) space', ['Adjacent comparison', 'Swapping'], ['Scan neighboring pairs.', 'Swap when the left value is larger.', 'Shrink the unsorted suffix after each pass.']),
  doc('sorting-insertion', 'Sorting', 'Insertion Sort', '/sorting?algo=insertion', 'Builds a sorted prefix by shifting larger values right and inserting the current value into its correct place.', 'O(n^2) time / O(1) space', ['Sorted prefix', 'Shifting'], ['Pick the next unsorted value.', 'Shift larger prefix values right.', 'Insert the value into the gap.']),
  doc('sorting-selection', 'Sorting', 'Selection Sort', '/sorting?algo=selection', 'Selects the minimum value from the unsorted suffix and places it at the next sorted position.', 'O(n^2) time / O(1) space', ['Minimum selection'], ['Track the smallest value.', 'Scan the remaining suffix.', 'Swap the minimum into place.']),
  doc('sorting-merge', 'Sorting', 'Merge Sort', '/sorting?algo=merge', 'Splits the array into halves, sorts each half recursively, and merges sorted runs back together.', 'O(n log n) time / O(n) space', ['Divide and conquer', 'Merging'], ['Split into halves.', 'Sort each half.', 'Merge the smaller front values first.']),
  doc('sorting-quick', 'Sorting', 'Quick Sort', '/sorting?algo=quick', 'Partitions values around a pivot so smaller values move left and larger values move right.', 'Average O(n log n), worst O(n^2) time / O(log n) space', ['Partitioning', 'Recursion'], ['Choose a pivot.', 'Partition around it.', 'Sort the left and right partitions.']),
  doc('sorting-heap', 'Sorting', 'Heap Sort', '/sorting?algo=heap', 'Turns the array into a max heap, repeatedly extracts the maximum, and restores heap order.', 'O(n log n) time / O(1) space', ['Heap', 'Selection'], ['Build a max heap.', 'Swap root with the end.', 'Heapify the reduced heap.']),
  doc('sorting-shell', 'Sorting', 'Shell Sort', '/sorting?algo=shell', 'Runs insertion-style passes over shrinking gaps so distant disorder is reduced early.', 'Depends on gap sequence / O(1) space', ['Gap insertion'], ['Pick a gap.', 'Insertion-sort by that gap.', 'Shrink the gap until it reaches one.']),
  doc('sorting-counting', 'Sorting', 'Counting Sort', '/sorting?algo=counting', 'Counts occurrences of each value and rebuilds the array from frequencies.', 'O(n + k) time / O(k) space', ['Frequency table'], ['Count each value.', 'Walk the frequency table.', 'Write values back in order.']),
  doc('sorting-radix', 'Sorting', 'Radix Sort', '/sorting?algo=radix', 'Sorts integers digit by digit using stable buckets from least significant to most significant digit.', 'O(d(n + b)) time / O(n + b) space', ['Digit buckets'], ['Bucket by current digit.', 'Collect buckets in order.', 'Move to the next digit.']),
  doc('searching-linear', 'Searching', 'Linear Search', '/search?algo=linear', 'Checks values from left to right until the target is found or the array ends.', 'O(n) time / O(1) space', ['Single scan'], ['Inspect one index.', 'Compare it with target.', 'Stop on match or continue.']),
  doc('searching-binary', 'Searching', 'Binary Search', '/search?algo=binary', 'Keeps halving a sorted search range by comparing the middle value with the target.', 'O(log n) time / O(1) space', ['Halving', 'Sorted array'], ['Check the middle.', 'Discard the impossible half.', 'Repeat until found or empty.']),
  doc('searching-bounds', 'Searching', 'Lower / Upper Bound', '/search?algo=bounds', 'Finds the first position where the target can be inserted while maintaining sorted order, then reports the first greater position.', 'O(log n) time / O(1) space', ['Boundary search'], ['Check the middle.', 'Keep possible lower-bound answers.', 'Move left or right until the boundary is fixed.']),
  doc('searching-rotated', 'Searching', 'Search in Rotated Array', '/search?algo=rotated', 'Uses binary search logic on a rotated sorted array by identifying which half is sorted at every step.', 'O(log n) time / O(1) space', ['Modified binary search'], ['Check the middle.', 'Detect the sorted half.', 'Discard the half where the target cannot fit.']),
  doc('searching-answer', 'Searching', 'Binary Search on Answer', '/search?algo=answer', 'Searches a numeric answer range and uses a feasibility check to find the smallest working value.', 'O(n log S) time / O(S) visual answer-space view', ['Predicate monotonicity'], ['Try a candidate answer.', 'Run the feasibility check.', 'Keep smaller working answers or larger failing answers.']),
  doc('hashing-insert', 'Hashing', 'Hash Insert', '/hashing?algo=insert', 'Hashes each key into a bucket and appends it using separate chaining.', 'Average O(1) time / O(n) space', ['Modulo hashing', 'Chaining'], ['Compute the bucket.', 'Check the chain.', 'Insert the entry.']),
  doc('hashing-search', 'Hashing', 'Hash Search', '/hashing?algo=search', 'Hashes the target to the expected bucket, then scans that chain for the key.', 'Average O(1), worst O(n) time / O(n) space', ['Bucket lookup', 'Chain scan'], ['Hash the target.', 'Open one bucket.', 'Scan entries in that chain.']),
  doc('stacks-push', 'Stacks And Queues', 'Stack Push', '/stacks?algo=push', 'Places each new item at the top of a last-in first-out stack.', 'O(1) time / O(n) space', ['LIFO', 'Top pointer'], ['Read value.', 'Create stack item.', 'Move top to the new item.']),
  doc('stacks-pop', 'Stacks And Queues', 'Stack Pop', '/stacks?algo=pop', 'Removes the current top item so the next item becomes visible.', 'O(1) time / O(n) space', ['LIFO'], ['Read the top.', 'Remove it.', 'Expose the next top.']),
  doc('stacks-peek', 'Stacks And Queues', 'Stack Peek', '/stacks?algo=peek', 'Reads the top item without changing the stack.', 'O(1) time / O(n) space', ['LIFO'], ['Point at top.', 'Return its value.', 'Keep stack unchanged.']),
  doc('queues-enqueue', 'Stacks And Queues', 'Queue Enqueue', '/queues?algo=enqueue', 'Adds values at the rear of a first-in first-out queue.', 'O(1) time / O(n) space', ['FIFO', 'Rear pointer'], ['Read value.', 'Attach at rear.', 'Advance rear.']),
  doc('queues-dequeue', 'Stacks And Queues', 'Queue Dequeue', '/queues?algo=dequeue', 'Removes values from the front in arrival order.', 'O(1) time / O(n) space', ['FIFO', 'Front pointer'], ['Read front.', 'Remove it.', 'Advance front.']),
  doc('queues-peek', 'Stacks And Queues', 'Queue Peek', '/queues?algo=peek', 'Reads the front value without removing it.', 'O(1) time / O(n) space', ['FIFO'], ['Point at front.', 'Return its value.', 'Keep queue unchanged.']),
  doc('linked-lists-reverse', 'Linked Lists', 'Reverse Linked List', '/linked-lists?algo=reverse', 'Rewires node next pointers so the list points in the opposite direction.', 'O(n) time / O(1) space', ['Pointer rewiring'], ['Save next.', 'Point current to previous.', 'Advance previous and current.']),
  doc('trees-insert', 'Trees', 'BST Insert', '/trees?algo=insert', 'Places values in a binary search tree by moving left for smaller values and right for larger values.', 'Average O(log n), worst O(n) time / O(n) space', ['Binary search tree'], ['Compare with node.', 'Move left or right.', 'Attach at an empty child.']),
  doc('trees-search', 'Trees', 'BST Search', '/trees?algo=search', 'Follows BST ordering rules to find a target without scanning every node.', 'Average O(log n), worst O(n) time / O(1) space', ['Binary search tree'], ['Compare target.', 'Choose one child.', 'Stop on match or empty branch.']),
  doc('trees-inorder', 'Trees', 'Inorder Traversal', '/trees?algo=inorder', 'Visits left subtree, node, then right subtree so BST values appear sorted.', 'O(n) time / O(h) space', ['DFS'], ['Traverse left.', 'Visit node.', 'Traverse right.']),
  doc('graphs-bfs', 'Graphs', 'BFS', '/graphs?algo=bfs', 'Explores graph nodes by distance layers using a queue.', 'O(V + E) time / O(V) space', ['Queue', 'Visited set'], ['Start with a queue.', 'Visit one layer.', 'Add unseen neighbors.']),
  doc('graphs-dfs', 'Graphs', 'DFS', '/graphs?algo=dfs', 'Explores deeply along each branch before backtracking.', 'O(V + E) time / O(V) space', ['Recursion', 'Stack'], ['Visit node.', 'Go to an unseen neighbor.', 'Backtrack when blocked.']),
  doc('graphs-dijkstra', 'Graphs', 'Dijkstra', '/graphs?algo=dijkstra', 'Finds shortest paths from one source in a weighted graph with non-negative edges.', 'O((V + E) log V) time / O(V) space', ['Priority queue'], ['Set source distance.', 'Pick the nearest unsettled node.', 'Relax outgoing edges.']),
  doc('dynamic-programming-fibonacci', 'Dynamic Programming', 'Fibonacci', '/dynamic-programming?algo=fibonacci', 'Stores smaller Fibonacci values so each state is solved once.', 'O(n) time / O(n) space', ['Memoization', 'Tabulation'], ['Seed base cases.', 'Combine previous states.', 'Return requested state.']),
  doc('dynamic-programming-climbing', 'Dynamic Programming', 'Climbing Stairs', '/dynamic-programming?algo=climbing', 'Counts ways to reach each step from the two previous steps.', 'O(n) time / O(n) space', ['1D DP'], ['Seed step counts.', 'Add previous two states.', 'Read final step.']),
  doc('dynamic-programming-coinChange', 'Dynamic Programming', 'Coin Change', '/dynamic-programming?algo=coinChange', 'Builds minimum coin counts for each amount by trying every coin.', 'O(amount * coins) time / O(amount) space', ['Unbounded knapsack'], ['Initialize amount states.', 'Try each coin.', 'Keep the smaller count.']),
  doc('arrays-strings-twoPointers', 'Arrays And Strings', 'Two Pointers Pair Sum', '/arrays-strings?algo=twoPointers', 'Moves opposite pointers over a sorted array to find a pair matching the target sum.', 'O(n) time / O(1) space', ['Opposite ends'], ['Compare pair sum.', 'Move left if too small.', 'Move right if too large.']),
  doc('arrays-strings-slidingWindow', 'Arrays And Strings', 'Sliding Window Max Sum', '/arrays-strings?algo=slidingWindow', 'Maintains a fixed-size window sum by adding the entering value and removing the leaving value.', 'O(n) time / O(1) space', ['Window expansion'], ['Add entering value.', 'Update best sum.', 'Remove leaving value.']),
  doc('arrays-strings-prefixSum', 'Arrays And Strings', 'Prefix Sum Range Query', '/arrays-strings?algo=prefixSum', 'Precomputes running totals so range sums can be answered by subtracting two prefix values.', 'O(n) build + O(1) query / O(n) space', ['Range query'], ['Build prefix totals.', 'Select left and right.', 'Subtract prefix[left] from prefix[right + 1].'])
]

export function filterVisualizerDocs(query: string, docs = VISUALIZER_DOCS) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  if (terms.length === 0) return docs

  return docs.filter((item) => {
    const haystack = [
      item.title,
      item.category,
      item.summary,
      item.complexity,
      ...item.patterns,
      ...item.steps
    ]
      .join(' ')
      .toLowerCase()

    return terms.every((term) => haystack.includes(term))
  })
}

function doc(
  id: string,
  category: string,
  title: string,
  route: string,
  summary: string,
  complexity: string,
  patterns: string[],
  steps: string[]
): VisualizerDoc {
  return { id, category, title, route, summary, complexity, patterns, steps }
}
