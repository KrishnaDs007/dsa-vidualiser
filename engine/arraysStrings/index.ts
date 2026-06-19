import { kadaneMaxSubarray } from '@/engine/arraysStrings/kadane'
import { matrixTraversal } from '@/engine/arraysStrings/matrixTraversal'
import { prefixRangeSum } from '@/engine/arraysStrings/prefixSum'
import { slidingWindowMaxSum } from '@/engine/arraysStrings/slidingWindow'
import { twoPointerTwoSum } from '@/engine/arraysStrings/twoPointers'

export const ARRAY_STRING_ALGORITHMS = {
  twoPointers: {
    id: 'twoPointers',
    label: 'Two Pointers Pair Sum',
    complexity: 'O(n) time / O(1) space',
    run: twoPointerTwoSum
  },
  slidingWindow: {
    id: 'slidingWindow',
    label: 'Sliding Window Max Sum',
    complexity: 'O(n) time / O(1) space',
    run: slidingWindowMaxSum
  },
  prefixSum: {
    id: 'prefixSum',
    label: 'Prefix Sum Range Query',
    complexity: 'O(n) build + O(1) query / O(n) space',
    run: prefixRangeSum
  },
  kadane: {
    id: 'kadane',
    label: 'Kadane Algorithm',
    complexity: 'O(n) time / O(1) space',
    run: kadaneMaxSubarray
  },
  matrixTraversal: {
    id: 'matrixTraversal',
    label: 'Matrix Traversal',
    complexity: 'O(rows * cols) time / O(1) space',
    run: matrixTraversal
  }
} as const

export type ArrayStringAlgorithmId = keyof typeof ARRAY_STRING_ALGORITHMS

export function isArrayStringAlgorithmId(
  value?: string
): value is ArrayStringAlgorithmId {
  return Boolean(value && value in ARRAY_STRING_ALGORITHMS)
}

export const ARRAY_STRING_PSEUDOCODE: Record<ArrayStringAlgorithmId, string> = {
  twoPointers: `function twoPointerPairSum(values: number[], target: number) {
  const array = [...values].sort((a, b) => a - b)
  let left = 0
  let right = array.length - 1
  while (left < right) {
    const sum = array[left] + array[right]
    if (sum === target) return [left, right]
    if (sum < target) {
      left++
    } else {
      right--
    }
  }
  return null
}`,
  slidingWindow: `function maxWindowSum(values: number[], size: number) {
  let sum = 0
  let best = -Infinity
  for (let index = 0; index < values.length; index++) {
    sum += values[index]
    if (index >= size - 1) {
      best = Math.max(best, sum)
      sum -= values[index - size + 1]
    }
  }
  return best
}`,
  prefixSum: `function rangeSum(values: number[], left: number, right: number) {
  const prefix = Array(values.length + 1).fill(0)
  for (let index = 0; index < values.length; index++) {
    prefix[index + 1] = prefix[index] + values[index]
  }
  return prefix[right + 1] - prefix[left]
}`,
  kadane: `function maxSubarray(values: number[]) {
  let current = values[0]
  let best = values[0]
  for (let index = 1; index < values.length; index++) {
    current = Math.max(values[index], current + values[index])
    best = Math.max(best, current)
  }
  return best
}`,
  matrixTraversal: `function rowWiseTraversal(matrix: number[][]) {
  let total = 0
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      total += matrix[row][col]
    }
  }
  return total
}`
}
