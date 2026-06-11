import type { SortStep } from '@/engine/types'

export function* countingSort(input: number[]): Generator<SortStep> {
  const arr = [...input]

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    codeLine: 1
  }

  if (arr.length <= 1) {
    yield {
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: arr.map((_, index) => index),
      codeLine: 11
    }
    return
  }

  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const counts = Array.from({ length: max - min + 1 }, () => 0)

  for (let index = 0; index < arr.length; index++) {
    counts[arr[index] - min]++

    yield {
      array: [...arr],
      comparing: [index],
      swapped: [],
      sorted: [],
      codeLine: 5
    }
  }

  let writeIndex = 0

  for (let countIndex = 0; countIndex < counts.length; countIndex++) {
    while (counts[countIndex] > 0) {
      arr[writeIndex] = countIndex + min
      counts[countIndex]--

      yield {
        array: [...arr],
        comparing: [],
        swapped: [writeIndex],
        sorted: Array.from({ length: writeIndex + 1 }, (_, index) => index),
        codeLine: 9
      }

      writeIndex++
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
