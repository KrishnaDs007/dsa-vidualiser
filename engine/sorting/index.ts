import { bubbleSort } from '@/engine/sorting/bubbleSort'
import { countingSort } from '@/engine/sorting/countingSort'
import { heapSort } from '@/engine/sorting/heapSort'
import { insertionSort } from '@/engine/sorting/insertionSort'
import { mergeSort } from '@/engine/sorting/mergeSort'
import { quickSort } from '@/engine/sorting/quickSort'
import { radixSort } from '@/engine/sorting/radixSort'
import { selectionSort } from '@/engine/sorting/selectionSort'
import { shellSort } from '@/engine/sorting/shellSort'

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
  },
  selection: {
    id: 'selection',
    label: 'Selection Sort',
    complexity: 'O(n^2)',
    run: selectionSort
  },
  merge: {
    id: 'merge',
    label: 'Merge Sort',
    complexity: 'O(n log n)',
    run: mergeSort
  },
  quick: {
    id: 'quick',
    label: 'Quick Sort',
    complexity: 'O(n log n) avg',
    run: quickSort
  },
  heap: {
    id: 'heap',
    label: 'Heap Sort',
    complexity: 'O(n log n)',
    run: heapSort
  },
  shell: {
    id: 'shell',
    label: 'Shell Sort',
    complexity: 'O(n log n) avg',
    run: shellSort
  },
  counting: {
    id: 'counting',
    label: 'Counting Sort',
    complexity: 'O(n + k)',
    run: countingSort
  },
  radix: {
    id: 'radix',
    label: 'Radix Sort',
    complexity: 'O(d(n + k))',
    run: radixSort
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
}`,
  selection: `function selectionSort(input: number[]) {
  const arr = [...input]
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) minIndex = j
    }
    if (minIndex !== i) {
      swap(arr[i], arr[minIndex])
    }
  }
  return arr
}`,
  merge: `function mergeSort(input: number[]) {
  const arr = [...input]
  function divide(left: number, right: number) {
    const mid = Math.floor((left + right) / 2)
    divide(left, mid)
    divide(mid + 1, right)
    const merged = []
    while (leftSide.length && rightSide.length) {
      takeSmallerValue()
    }
    writeMergedValuesBack()
  }
  return arr
}`,
  quick: `function quickSort(input: number[]) {
  const arr = [...input]
  function sortRange(low: number, high: number) {
    if (low >= high) return
    const pivot = arr[high]
    let storeIndex = low
    for (let i = low; i < high; i++) {
      if (arr[i] < pivot) {
        swap(arr[i], arr[storeIndex])
      }
    }
    movePivotIntoPlace()
  }
  return arr
}`,
  heap: `function heapSort(input: number[]) {
  const arr = [...input]
  buildMaxHeap(arr)
  for (let end = arr.length - 1; end > 0; end--) {
    swap(arr[0], arr[end])
    markEndSorted()
    heapify(arr, end, 0)
  }
  return arr
}`,
  shell: `function shellSort(input: number[]) {
  const arr = [...input]
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < arr.length; i++) {
      const current = arr[i]
      while (j >= gap && arr[j - gap] > current) {
        shiftValueByGap()
      }
      insertCurrentValue()
    }
  }
  return arr
}`,
  counting: `function countingSort(input: number[]) {
  const arr = [...input]
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const counts = createCountArray(min, max)
  for (const value of arr) {
    counts[value - min]++
  }
  writeValuesBackInCountOrder()
  return arr
}`,
  radix: `function radixSort(input: number[]) {
  const arr = [...input]
  splitNegativeAndNonNegativeValues()
  for (let exponent = 1; hasMoreDigits(exponent); exponent *= 10) {
    placeValuesIntoDigitBuckets()
    flattenBuckets()
  }
  mergeNegativeAndNonNegativeResults()
  return arr
}`
}
