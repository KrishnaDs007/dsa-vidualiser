import type { SearchStep } from '@/engine/types'

export function* rotatedArraySearch(
  input: number[],
  target: number
): Generator<SearchStep> {
  const sorted = [...input].sort((a, b) => a - b)
  const pivot = sorted.length > 2 ? Math.floor(sorted.length / 2) : 0
  const array = [...sorted.slice(pivot), ...sorted.slice(0, pivot)]
  const eliminated = new Set<number>()
  let left = 0
  let right = array.length - 1

  yield frame(array, target, [], range(left, right), [], null, 1, 'Use a rotated sorted copy and search the full range.')

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    yield frame(array, target, [mid], range(left, right), [...eliminated], null, 5, `Check middle index ${mid}.`)

    if (array[mid] === target) {
      yield frame(array, target, [mid], [], [...eliminated], mid, 6, `Target found at rotated index ${mid}.`)
      return
    }

    if (array[left] <= array[mid]) {
      yield frame(array, target, [left, mid], range(left, right), [...eliminated], null, 8, 'Left half is sorted.')

      if (array[left] <= target && target < array[mid]) {
        for (let index = mid; index <= right; index++) eliminated.add(index)
        right = mid - 1
        yield frame(array, target, [], range(left, right), [...eliminated], null, 10, 'Target fits in the sorted left half, so discard the right half.')
      } else {
        for (let index = left; index <= mid; index++) eliminated.add(index)
        left = mid + 1
        yield frame(array, target, [], range(left, right), [...eliminated], null, 12, 'Target is not in the sorted left half, so discard it.')
      }
    } else {
      yield frame(array, target, [mid, right], range(left, right), [...eliminated], null, 14, 'Right half is sorted.')

      if (array[mid] < target && target <= array[right]) {
        for (let index = left; index <= mid; index++) eliminated.add(index)
        left = mid + 1
        yield frame(array, target, [], range(left, right), [...eliminated], null, 16, 'Target fits in the sorted right half, so discard the left half.')
      } else {
        for (let index = mid; index <= right; index++) eliminated.add(index)
        right = mid - 1
        yield frame(array, target, [], range(left, right), [...eliminated], null, 18, 'Target is not in the sorted right half, so discard it.')
      }
    }
  }

  yield frame(array, target, [], [], array.map((_, index) => index), null, 21, 'Target was not found in the rotated array.')
}

function frame(
  array: number[],
  target: number,
  checking: number[],
  activeRange: number[],
  eliminated: number[],
  foundIndex: number | null,
  codeLine: number,
  note: string
): SearchStep {
  return {
    array,
    target,
    checking,
    activeRange,
    eliminated,
    foundIndex,
    codeLine,
    note
  }
}

function range(left: number, right: number) {
  if (right < left) return []
  return Array.from({ length: right - left + 1 }, (_, index) => left + index)
}
