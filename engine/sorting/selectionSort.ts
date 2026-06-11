import type { SortStep } from '@/engine/types'

export function* selectionSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const sorted: number[] = []

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    codeLine: 1
  }

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i

    for (let j = i + 1; j < arr.length; j++) {
      yield {
        array: [...arr],
        comparing: [minIndex, j],
        swapped: [],
        sorted: [...sorted],
        codeLine: 5
      }

      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }

    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]

      yield {
        array: [...arr],
        comparing: [],
        swapped: [i, minIndex],
        sorted: [...sorted],
        codeLine: 9
      }
    }

    sorted.push(i)

    yield {
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sorted],
      codeLine: 10
    }
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, index) => index),
    codeLine: 12
  }
}
