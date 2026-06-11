import type { SortStep } from '@/engine/types'

export function* shellSort(input: number[]): Generator<SortStep> {
  const arr = [...input]

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    codeLine: 1
  }

  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < arr.length; i++) {
      const current = arr[i]
      let j = i

      yield {
        array: [...arr],
        comparing: [j, j - gap],
        swapped: [],
        sorted: [],
        codeLine: 5
      }

      while (j >= gap && arr[j - gap] > current) {
        arr[j] = arr[j - gap]

        yield {
          array: [...arr],
          comparing: [j, j - gap],
          swapped: [j],
          sorted: [],
          codeLine: 7
        }

        j -= gap
      }

      arr[j] = current

      yield {
        array: [...arr],
        comparing: [],
        swapped: [j],
        sorted: gap === 1 ? Array.from({ length: i + 1 }, (_, index) => index) : [],
        codeLine: 9
      }
    }
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, index) => index),
    codeLine: 11
  }
}
