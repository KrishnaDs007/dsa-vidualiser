import type { SortStep } from '@/engine/types'

export function* bubbleSort(input: number[]): Generator<SortStep> {
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
    for (let j = 0; j < arr.length - i - 1; j++) {
      yield {
        array: [...arr],
        comparing: [j, j + 1],
        swapped: [],
        sorted: [...sorted],
        codeLine: 4
      }

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]

        yield {
          array: [...arr],
          comparing: [],
          swapped: [j, j + 1],
          sorted: [...sorted],
          codeLine: 6
        }
      }
    }

    sorted.push(arr.length - 1 - i)
    yield {
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sorted],
      codeLine: 8
    }
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, index) => index),
    codeLine: 9
  }
}
