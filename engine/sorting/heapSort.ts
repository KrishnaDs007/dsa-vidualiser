import type { SortStep } from '@/engine/types'

export function* heapSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const sorted: number[] = []

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    codeLine: 1
  }

  for (let index = Math.floor(arr.length / 2) - 1; index >= 0; index--) {
    yield* heapify(arr, arr.length, index, sorted, 4)
  }

  for (let end = arr.length - 1; end > 0; end--) {
    ;[arr[0], arr[end]] = [arr[end], arr[0]]
    sorted.push(end)

    yield {
      array: [...arr],
      comparing: [],
      swapped: [0, end],
      sorted: [...sorted],
      codeLine: 8
    }

    yield* heapify(arr, end, 0, sorted, 9)
  }

  yield {
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: arr.map((_, index) => index),
    codeLine: 10
  }
}

function* heapify(
  arr: number[],
  heapSize: number,
  root: number,
  sorted: number[],
  codeLine: number
): Generator<SortStep> {
  let largest = root
  const left = root * 2 + 1
  const right = root * 2 + 2

  const comparing = [root]
  if (left < heapSize) comparing.push(left)
  if (right < heapSize) comparing.push(right)

  yield {
    array: [...arr],
    comparing,
    swapped: [],
    sorted: [...sorted],
    codeLine
  }

  if (left < heapSize && arr[left] > arr[largest]) {
    largest = left
  }

  if (right < heapSize && arr[right] > arr[largest]) {
    largest = right
  }

  if (largest !== root) {
    ;[arr[root], arr[largest]] = [arr[largest], arr[root]]

    yield {
      array: [...arr],
      comparing: [],
      swapped: [root, largest],
      sorted: [...sorted],
      codeLine
    }

    yield* heapify(arr, heapSize, largest, sorted, codeLine)
  }
}
