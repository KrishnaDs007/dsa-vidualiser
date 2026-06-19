import {
  activitySelectionGreedy,
  gasStationGreedy,
  huffmanCodingGreedy,
  jumpGameGreedy,
  mergeIntervalsGreedy
} from '@/engine/greedy/greedyPatterns'

export const GREEDY_ALGORITHMS = {
  activitySelection: {
    id: 'activitySelection',
    label: 'Activity Selection',
    complexity: 'O(n log n) time / O(1) space',
    run: activitySelectionGreedy
  },
  mergeIntervals: {
    id: 'mergeIntervals',
    label: 'Merge Intervals',
    complexity: 'O(n log n) time / O(n) space',
    run: mergeIntervalsGreedy
  },
  jumpGame: {
    id: 'jumpGame',
    label: 'Jump Game',
    complexity: 'O(n) time / O(1) space',
    run: jumpGameGreedy
  },
  gasStation: {
    id: 'gasStation',
    label: 'Gas Station',
    complexity: 'O(n) time / O(1) space',
    run: gasStationGreedy
  },
  huffman: {
    id: 'huffman',
    label: 'Huffman Coding',
    complexity: 'O(n log n) time / O(n) space',
    run: huffmanCodingGreedy
  }
} as const

export type GreedyAlgorithmId = keyof typeof GREEDY_ALGORITHMS

export function isGreedyAlgorithmId(value?: string): value is GreedyAlgorithmId {
  return Boolean(value && value in GREEDY_ALGORITHMS)
}

export const GREEDY_PSEUDOCODE: Record<GreedyAlgorithmId, string> = {
  activitySelection: `function activitySelection(activities: Activity[]) {
  activities.sort((a, b) => a.end - b.end)
  const selected = []
  let lastEnd = -Infinity
  for (const activity of activities) {
    if (activity.start >= lastEnd) {
      selected.push(activity)
      lastEnd = activity.end
    }
  }
  return selected
}`,
  mergeIntervals: `function mergeIntervals(intervals: Interval[]) {
  intervals.sort((a, b) => a.start - b.start)
  const merged = []
  for (const interval of intervals) {
    const last = merged.at(-1)
    if (!last || interval.start > last.end) merged.push(interval)
    else last.end = Math.max(last.end, interval.end)
  }
  return merged
}`,
  jumpGame: `function canJump(values: number[]) {
  let farthest = 0
  for (let index = 0; index < values.length; index++) {
    if (index > farthest) return false
    farthest = Math.max(farthest, index + values[index])
    if (farthest >= values.length - 1) return true
  }
  return true
}`,
  gasStation: `function gasStation(gas: number[], cost: number[]) {
  let start = 0
  let tank = 0
  let total = 0
  for (let index = 0; index < gas.length; index++) {
    const delta = gas[index] - cost[index]
    tank += delta
    total += delta
    if (tank < 0) {
      start = index + 1
      tank = 0
    }
  }
  return total >= 0 ? start : -1
}`,
  huffman: `function huffman(frequencies: Node[]) {
  const queue = minHeap(frequencies)
  while (queue.size > 1) {
    const first = queue.pop()
    const second = queue.pop()
    queue.push(merge(first, second))
  }
  return queue.pop()
}`
}
