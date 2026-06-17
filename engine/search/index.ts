import { binarySearchOnAnswer } from '@/engine/search/answerSearch'
import { binarySearch } from '@/engine/search/binarySearch'
import { lowerUpperBoundSearch } from '@/engine/search/boundsSearch'
import { linearSearch } from '@/engine/search/linearSearch'
import { rotatedArraySearch } from '@/engine/search/rotatedSearch'

export const SEARCH_ALGORITHMS = {
  linear: {
    id: 'linear',
    label: 'Linear Search',
    complexity: 'O(n)',
    requiresSortedInput: false,
    run: linearSearch
  },
  binary: {
    id: 'binary',
    label: 'Binary Search',
    complexity: 'O(log n)',
    requiresSortedInput: true,
    run: binarySearch
  },
  bounds: {
    id: 'bounds',
    label: 'Lower / Upper Bound',
    complexity: 'O(log n)',
    requiresSortedInput: true,
    run: lowerUpperBoundSearch
  },
  rotated: {
    id: 'rotated',
    label: 'Search in Rotated Array',
    complexity: 'O(log n)',
    requiresSortedInput: true,
    run: rotatedArraySearch
  },
  answer: {
    id: 'answer',
    label: 'Binary Search on Answer',
    complexity: 'O(n log S)',
    requiresSortedInput: false,
    run: binarySearchOnAnswer
  }
} as const

export type SearchAlgorithmId = keyof typeof SEARCH_ALGORITHMS

export function isSearchAlgorithmId(value?: string): value is SearchAlgorithmId {
  return Boolean(value && value in SEARCH_ALGORITHMS)
}

export const SEARCH_PSEUDOCODE: Record<SearchAlgorithmId, string> = {
  linear: `function linearSearch(array: number[], target: number) {
  for (let index = 0; index < array.length; index++) {
    if (array[index] === target) {
      return index
    }
  }
  return -1
}`,
  binary: `function binarySearch(array: number[], target: number) {
  let left = 0
  let right = array.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (array[mid] === target) return mid
    if (array[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return -1
}`,
  bounds: `function lowerBound(array: number[], target: number) {
  let left = 0
  let right = array.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (array[mid] >= target) {
      right = mid
    } else {
      left = mid + 1
    }
  }
  return left
}`,
  rotated: `function searchRotated(array: number[], target: number) {
  let left = 0
  let right = array.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (array[mid] === target) return mid
    if (array[left] <= array[mid]) {
      if (array[left] <= target && target < array[mid]) {
        right = mid - 1
      } else {
        left = mid + 1
      }
    } else if (array[mid] < target && target <= array[right]) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return -1
}`,
  answer: `function minCapacity(weights: number[], days: number) {
  let left = Math.max(...weights)
  let right = weights.reduce((sum, value) => sum + value, 0)
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (canShip(weights, days, mid)) {
      right = mid
    } else {
      left = mid + 1
    }
  }
  return left
}`
}
