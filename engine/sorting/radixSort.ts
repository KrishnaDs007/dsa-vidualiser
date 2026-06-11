import type { SortStep } from '@/engine/types'

export function* radixSort(input: number[]): Generator<SortStep> {
  const arr = [...input]

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    codeLine: 1
  }

  const negatives = arr.filter((value) => value < 0).map((value) => Math.abs(value))
  const nonNegatives = arr.filter((value) => value >= 0)

  const sortedNegatives = yield* sortNonNegativeDigits(negatives, arr, 4)
  const sortedNonNegatives = yield* sortNonNegativeDigits(nonNegatives, arr, 6)
  const sorted = [
    ...sortedNegatives.reverse().map((value) => -value),
    ...sortedNonNegatives
  ]

  for (let index = 0; index < sorted.length; index++) {
    arr[index] = sorted[index]

    yield {
      array: [...arr],
      comparing: [],
      swapped: [index],
      sorted: Array.from({ length: index + 1 }, (_, sortedIndex) => sortedIndex),
      codeLine: 9
    }
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, index) => index),
    codeLine: 10
  }
}

function* sortNonNegativeDigits(
  values: number[],
  visibleArray: number[],
  codeLine: number
): Generator<SortStep, number[]> {
  let working = [...values]
  const max = Math.max(0, ...working)

  for (let exponent = 1; Math.floor(max / exponent) > 0; exponent *= 10) {
    const buckets = Array.from({ length: 10 }, () => [] as number[])

    for (const value of working) {
      buckets[Math.floor(value / exponent) % 10].push(value)
    }

    working = buckets.flat()

    yield {
      array: [...visibleArray],
      comparing: [],
      swapped: [],
      sorted: [],
      codeLine
    }
  }

  return working
}
