import type { SearchStep } from '@/engine/types'

export function* lowerUpperBoundSearch(
  input: number[],
  target: number
): Generator<SearchStep> {
  const array = [...input].sort((a, b) => a - b)
  let left = 0
  let right = array.length
  let answer = array.length
  const eliminated = new Set<number>()

  yield frame(array, target, [], range(0, array.length - 1), [], null, 1, 'Sort the values and search the first index that can hold the target.')

  while (left < right) {
    const mid = Math.floor((left + right) / 2)

    yield frame(array, target, [mid], range(left, right - 1), [...eliminated], answer === array.length ? null : answer, 4, `Check middle index ${mid}.`)

    if (array[mid] >= target) {
      answer = mid
      for (let index = mid + 1; index < right; index++) eliminated.add(index)
      right = mid
      yield frame(array, target, [mid], range(left, right - 1), [...eliminated], answer, 6, `Value ${array[mid]} can be the lower bound, so keep the left half.`)
    } else {
      for (let index = left; index <= mid; index++) eliminated.add(index)
      left = mid + 1
      yield frame(array, target, [], range(left, right - 1), [...eliminated], answer === array.length ? null : answer, 8, `Value ${array[mid]} is too small, so move right.`)
    }
  }

  const upperBound = firstGreaterThan(array, target)
  const note =
    answer === array.length
      ? `Lower bound is at insertion index ${answer}; upper bound is ${upperBound}.`
      : `Lower bound is index ${answer}; upper bound is ${upperBound}.`

  yield frame(array, target, [], [], [...eliminated], answer === array.length ? null : answer, 11, note)
}

function firstGreaterThan(array: number[], target: number) {
  let left = 0
  let right = array.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (array[mid] > target) right = mid
    else left = mid + 1
  }
  return left
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
