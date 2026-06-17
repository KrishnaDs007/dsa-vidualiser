import type { SearchStep } from '@/engine/types'

export function* binarySearchOnAnswer(
  input: number[],
  daysTarget: number
): Generator<SearchStep> {
  const weights = input.map((value) => Math.max(1, Math.abs(value)))
  const days = Math.max(1, Math.floor(daysTarget))
  const low = Math.max(...weights)
  const high = weights.reduce((sum, value) => sum + value, 0)
  const answers = range(low, high)
  const eliminated = new Set<number>()
  let left = 0
  let right = answers.length - 1
  let bestIndex = right

  yield frame(answers, days, [], range(0, answers.length - 1), [], null, 1, `Search the minimum capacity that ships packages within ${days} day(s).`)

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const capacity = answers[mid]
    const requiredDays = countDays(weights, capacity)

    yield frame(answers, days, [mid], range(left, right), [...eliminated], bestIndex, 5, `Try capacity ${capacity}; it needs ${requiredDays} day(s).`)

    if (requiredDays <= days) {
      bestIndex = mid
      for (let index = mid + 1; index <= right; index++) eliminated.add(index)
      right = mid - 1
      yield frame(answers, days, [mid], range(left, right), [...eliminated], bestIndex, 7, 'Capacity works, so search smaller answers.')
    } else {
      for (let index = left; index <= mid; index++) eliminated.add(index)
      left = mid + 1
      yield frame(answers, days, [], range(left, right), [...eliminated], bestIndex, 9, 'Capacity is too small, so search larger answers.')
    }
  }

  yield frame(answers, days, [], [], [...eliminated], bestIndex, 12, `Minimum working capacity is ${answers[bestIndex]}.`)
}

function countDays(weights: number[], capacity: number) {
  let days = 1
  let load = 0

  for (const weight of weights) {
    if (load + weight > capacity) {
      days++
      load = 0
    }
    load += weight
  }

  return days
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
