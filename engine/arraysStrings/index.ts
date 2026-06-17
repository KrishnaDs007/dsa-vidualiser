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
}`
}
