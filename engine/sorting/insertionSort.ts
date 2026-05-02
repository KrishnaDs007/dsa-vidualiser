import type { SortStep } from '@/engine/types'

export function* insertionSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const sorted = arr.length > 0 ? [0] : []

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [...sorted],
    codeLine: 1
  }

  for (let i = 1; i < arr.length; i++) {
    let j = i

    yield {
      array: [...arr],
      comparing: [j - 1, j],
      swapped: [],
      sorted: Array.from({ length: i }, (_, index) => index),
      codeLine: 3
    }

    while (j > 0 && arr[j - 1] > arr[j]) {
      ;[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]

      yield {
        array: [...arr],
        comparing: [j - 1, j],
        swapped: [j - 1, j],
        sorted: [],
        codeLine: 5
      }

      j--
    }
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, index) => index),
    codeLine: 7
  }
}
