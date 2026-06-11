import { binarySearch } from '@/engine/search/binarySearch'
import { linearSearch } from '@/engine/search/linearSearch'

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
}`
}
