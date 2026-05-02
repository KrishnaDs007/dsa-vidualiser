import { bubbleSort } from '@/engine/sorting/bubbleSort'
import { insertionSort } from '@/engine/sorting/insertionSort'

export const SORT_ALGORITHMS = {
  bubble: {
    id: 'bubble',
    label: 'Bubble Sort',
    complexity: 'O(n^2)',
    run: bubbleSort
  },
  insertion: {
    id: 'insertion',
    label: 'Insertion Sort',
    complexity: 'O(n^2)',
    run: insertionSort
  }
} as const

export type AlgorithmId = keyof typeof SORT_ALGORITHMS

export function isAlgorithmId(value?: string): value is AlgorithmId {
  return Boolean(value && value in SORT_ALGORITHMS)
}

export const PSEUDOCODE: Record<AlgorithmId, string> = {
  bubble: `function bubbleSort(input: number[]) {
  const arr = [...input]

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1])
      }
    }
    markLastUnsortedItemComplete()
  }
  return arr
}`,
  insertion: `function insertionSort(input: number[]) {
  const arr = [...input]
  for (let i = 1; i < arr.length; i++) {
    let j = i
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr[j - 1], arr[j])
      j--
    }
  }
  return arr
}`
}
