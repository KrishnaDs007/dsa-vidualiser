import type { SearchStep } from '@/engine/types'

export function* binarySearch(
  input: number[],
  target: number
): Generator<SearchStep> {
  const array = [...input].sort((a, b) => a - b)
  const eliminated = new Set<number>()
  let left = 0
  let right = array.length - 1

  yield {
    array,
    target,
    checking: [],
    activeRange: range(left, right),
    eliminated: [],
    foundIndex: null,
    codeLine: 1,
    note: 'Sort the values and search the full range.'
  }

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    yield {
      array,
      target,
      checking: [mid],
      activeRange: range(left, right),
      eliminated: [...eliminated],
      foundIndex: null,
      codeLine: 5,
      note: `Check middle index ${mid}.`
    }

    if (array[mid] === target) {
      yield {
        array,
        target,
        checking: [mid],
        activeRange: [],
        eliminated: [...eliminated],
        foundIndex: mid,
        codeLine: 6,
        note: `Target found at sorted index ${mid}.`
      }
      return
    }

    if (array[mid] < target) {
      for (let index = left; index <= mid; index++) eliminated.add(index)
      left = mid + 1

      yield {
        array,
        target,
        checking: [],
        activeRange: range(left, right),
        eliminated: [...eliminated],
        foundIndex: null,
        codeLine: 8,
        note: 'Target is larger, so discard the left half.'
      }
    } else {
      for (let index = mid; index <= right; index++) eliminated.add(index)
      right = mid - 1

      yield {
        array,
        target,
        checking: [],
        activeRange: range(left, right),
        eliminated: [...eliminated],
        foundIndex: null,
        codeLine: 10,
        note: 'Target is smaller, so discard the right half.'
      }
    }
  }

  yield {
    array,
    target,
    checking: [],
    activeRange: [],
    eliminated: array.map((_, index) => index),
    foundIndex: null,
    codeLine: 12,
    note: 'Target was not found in the sorted array.'
  }
}

function range(left: number, right: number) {
  if (right < left) return []
  return Array.from({ length: right - left + 1 }, (_, index) => left + index)
}
