import type { SortStep } from '@/engine/types'

export function* mergeSort(input: number[]): Generator<SortStep> {
  const arr = [...input]

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    codeLine: 1
  }

  if (arr.length > 1) {
    yield* divide(arr, 0, arr.length - 1)
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, index) => index),
    codeLine: 12
  }
}

function* divide(
  arr: number[],
  left: number,
  right: number
): Generator<SortStep> {
  if (left >= right) return

  const mid = Math.floor((left + right) / 2)

  yield {
    array: [...arr],
    comparing: [left, mid, right],
    swapped: [],
    sorted: [],
    codeLine: 4
  }

  yield* divide(arr, left, mid)
  yield* divide(arr, mid + 1, right)
  yield* merge(arr, left, mid, right)
}

function* merge(
  arr: number[],
  left: number,
  mid: number,
  right: number
): Generator<SortStep> {
  const merged: number[] = []
  let i = left
  let j = mid + 1

  while (i <= mid && j <= right) {
    yield {
      array: [...arr],
      comparing: [i, j],
      swapped: [],
      sorted: [],
      codeLine: 8
    }

    if (arr[i] <= arr[j]) {
      merged.push(arr[i])
      i++
    } else {
      merged.push(arr[j])
      j++
    }
  }

  while (i <= mid) {
    merged.push(arr[i])
    i++
  }

  while (j <= right) {
    merged.push(arr[j])
    j++
  }

  for (let offset = 0; offset < merged.length; offset++) {
    arr[left + offset] = merged[offset]

    yield {
      array: [...arr],
      comparing: [],
      swapped: [left + offset],
      sorted: Array.from(
        { length: right - left + 1 },
        (_, index) => left + index
      ),
      codeLine: 10
    }
  }
}
