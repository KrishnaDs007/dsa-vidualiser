import type { SortStep } from '@/engine/types'

export function* quickSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const sorted = new Set<number>()

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    codeLine: 1
  }

  if (arr.length > 1) {
    yield* sortRange(arr, 0, arr.length - 1, sorted)
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, index) => index),
    codeLine: 12
  }
}

function* sortRange(
  arr: number[],
  low: number,
  high: number,
  sorted: Set<number>
): Generator<SortStep> {
  if (low > high) return

  if (low === high) {
    sorted.add(low)
    yield {
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sorted],
      codeLine: 3
    }
    return
  }

  const pivotIndex = yield* partition(arr, low, high, sorted)
  sorted.add(pivotIndex)

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [...sorted],
    pivot: pivotIndex,
    codeLine: 6
  }

  yield* sortRange(arr, low, pivotIndex - 1, sorted)
  yield* sortRange(arr, pivotIndex + 1, high, sorted)
}

function* partition(
  arr: number[],
  low: number,
  high: number,
  sorted: Set<number>
): Generator<SortStep, number> {
  const pivotValue = arr[high]
  let storeIndex = low

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [...sorted],
    pivot: high,
    codeLine: 5
  }

  for (let index = low; index < high; index++) {
    yield {
      array: [...arr],
      comparing: [index, high],
      swapped: [],
      sorted: [...sorted],
      pivot: high,
      codeLine: 7
    }

    if (arr[index] < pivotValue) {
      ;[arr[index], arr[storeIndex]] = [arr[storeIndex], arr[index]]

      yield {
        array: [...arr],
        comparing: [],
        swapped: [index, storeIndex],
        sorted: [...sorted],
        pivot: high,
        codeLine: 9
      }

      storeIndex++
    }
  }

  ;[arr[storeIndex], arr[high]] = [arr[high], arr[storeIndex]]

  yield {
    array: [...arr],
    comparing: [],
    swapped: [storeIndex, high],
    sorted: [...sorted],
    pivot: storeIndex,
    codeLine: 11
  }

  return storeIndex
}
